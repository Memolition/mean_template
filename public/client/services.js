main_app.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {
    // create user variable
    var user = null;
    var userName = null;

    function isLoggedIn() {
        if(user) {
            return true;
        } else {
            return false;
        }
    }

    function getUserStatus() {
        return $http.get('/user/status')
        // handle success
        .success(function (data) {
            if(data.status){
            user = true;
            } else {
            user = false;
            }
        })
        // handle error
        .error(function (data) {
            user = false;
        });

    }

    function login(username, password) {
        var deferred = $q.defer();

        $http.post('/user/login', {username: username, password: password})
            .success(function (data, status) {
                if(status === 200 && data.status){
                    user = true;
                    userName = username;
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            })
            .error(function (data) {
                user = false;
                deferred.reject();
            });

        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();

        $http.get('/user/logout')
            .success(function (data) {
                user = false;
                userName = null;
                deferred.resolve();
            })
            .error(function (data) {
                user = false;
                deferred.reject();
            });

        return deferred.promise;
    }
    function register(username, password) {
        var deferred = $q.defer();

        $http.post('/user/register',
            {username: username, password: password})
            .success(function (data, status) {
                if(status === 200 && data.status){
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .error(function (data) {
                deferred.reject();
            });
        return deferred.promise;
    }

    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });
}]);

main_app.factory('BlogService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {
    function find() {
        var deferred = $q.defer();
        $http.post('/blog/load_all')
            .success(function (data, status) {
                if(status === 200 && data.status){
                    deferred.resolve(data);
                } else {
                    deferred.reject();
                }
            })
            .error(function (data) {
                deferred.reject();
            });
        return deferred.promise;
    }
    function createPost(title, body, author) {
        var deferred = $q.defer();

        $http.post('/blog/create', {title: title, body: body, author: author})
            .success(function (data, status) {
                if(status === 200 && data.status){
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .error(function (data) {
                deferred.reject();
            });
        return deferred.promise;
    }

    return ({
      find: find,
      createPost: createPost
    });
}]);
