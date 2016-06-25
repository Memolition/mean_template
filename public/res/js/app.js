var main_app = angular.module('main_app', ['ngRoute', 'ngCookies'])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.when('/home', {
            templateUrl: "views/home.pug",
            controller: 'home_controller',
            access: {restricted: true}
        });
        $routeProvider.when('/login', {
            templateUrl: 'views/login.pug',
            controller: 'login_controller',
            access: {restricted: false}
        });
        $routeProvider.when('/register', {
            templateUrl: 'views/register.pug',
            controller: 'register_controller',
            access: {restricted: false}
        });
        $routeProvider.when('/create_post', {
            templateUrl: 'views/create_post.pug',
            controller: 'blog_create_controller',
            access: {restricted: true}
        });
        $routeProvider.when('/logout', {
            controller: 'logout_controller',
            access: {restricted: false}
        });
        $routeProvider.otherwise({
            redirectTo: "home",
            controller: 'main_controller',
            access: {restricted: true}
        });
    });

main_app.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
          console.log(current);
        //if(AuthService.isLoggedIn())
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});

