
main_app.controller('main_controller', ['$scope', function($scope) {
    $scope.greeting = "Index page working with Express!";
}]);

main_app.controller('nav_bar_controller', ['$scope', '$location', 'AuthService', '$cookies', function($scope, $location, AuthService, $cookies) {
    $scope.nav_sections = [
        {name: "Home", url: "home"},
        {name: "Create new post", url: "create_post"}];
    
    AuthService.getUserStatus().then(function() {
        if(!AuthService.isLoggedIn()) {
            $scope.nav_sections.push(
            {name: "Login", url: "login"},
            {name: "Register", url: "register"});
        } else {
            $scope.nav_sections.push({name: "user.username", url: "user_dashboard"},
            {name: "Logout", url: 'logout'});
        }
    });

    $scope.news_public_controller = function (page) {
      var currentRoute = $location.path().substring(1) || 'index';
        return page === currentRoute ? 'active' : '';
    };

}]);

main_app.controller('home_controller', ['$scope', 'BlogService', function($scope, BlogService) {
    $scope.greet = "Home controller!";
    BlogService.find().then(function(data) {
        $scope.blog = data.posts;
    });
}]);

main_app.controller('login_controller', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
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
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
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

main_app.controller('register_controller', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
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

main_app.controller('logout_controller', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };
}]);

main_app.controller('blog_create_controller', ['$scope', '$location', 'BlogService', 'AuthService', function ($scope, $location, BlogService, AuthService) {
    $scope.username = AuthService.getUsername();
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
