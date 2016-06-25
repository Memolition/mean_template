
main_app.controller('main_controller', ['$scope', function($scope) {
    $scope.greeting = "Index page working with Express!";
}]);

main_app.controller('nav_bar_controller', ['$scope', '$location', 'AuthService', '$window',
    function($scope, $location, AuthService, $window) {

    $scope.login_str = "Login";
    $scope.register_str = "Register";
    $scope.logout_str = "Logout";

    $scope.nav_sections = [
        {name: "Home", url: "home"},
        {name: "Create new post", url: "create_post"}];

    $scope.news_public_controller = function (page) {
      var currentRoute = $location.path().substring(1) || 'index';
        return page === currentRoute ? 'active' : '';
    };

    $scope.logout = function () {

      // call logout from service
      AuthService.logout().then(function() {
        $window.location.reload();
      });
    };

}]);

main_app.controller('home_controller', ['$scope', 'BlogService', function($scope, BlogService) {
    $scope.greet = "Home controller!";
    BlogService.find().then(function(data) {
        $scope.blog = data.posts;
    });
}]);

main_app.controller('login_controller', ['$scope', '$location', 'AuthService', '$window',
    function($scope, $location, AuthService, $window) {

    $scope.username = "Username";
    $scope.password = "Password";

    $scope.login = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
//          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
//          $window.location.assign('#/home');
          $window.location.reload();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };
}]);

main_app.controller('register_controller', ['$scope', '$location', 'AuthService', '$route',
    function ($scope, $location, AuthService, $route) {
    
    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

main_app.controller('blog_create_controller', ['$scope', '$location', 'BlogService', function ($scope, $location, BlogService) {
    $scope.username = user.username;
    $scope.createPost = function (title, body, author) {
        $scope.error= false;
        $scope.disabled = true;

        BlogService.createPost($scope.createForm.title, $scope.createForm.body, $scope.createForm.author)
        .then(function () {
          $location.path('/home');
          $scope.disabled = false;
          $scope.createForm = {};
        });

    };
}]);
