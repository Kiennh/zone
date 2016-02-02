
angular.module('zoapp', ['facebook'])

.config([
    'FacebookProvider',
    function(FacebookProvider) {
        var myAppId = '523680331135122';

        // You can set appId with setApp method
        // FacebookProvider.setAppId('myAppId');

        /**
         * After setting appId you need to initialize the module.
         * You can pass the appId on the init method as a shortcut too.
         */
        FacebookProvider.init(myAppId);

    }
])

.controller('zocont', [
    '$scope',
    '$http',
    '$timeout',
    'Facebook',
    function($scope, $http, $timeout, Facebook) {

        // Define user empty data :/
        $scope.user = {};

        // Define token
        $scope.token = "";

        // Defining user logged status
        $scope.logged = false;

        // And some fancy flags to display messages upon user status change
        $scope.byebye = false;
        $scope.salutation = false;

        /**
         * Watch for Facebook to be ready.
         * There's also the event that could be used
         */
        $scope.$watch(
            function() {
                return Facebook.isReady();
            },
            function(newVal) {
                if (newVal) {
                    $scope.facebookReady = true;
                    console.log("Fb sdk loaded");
                    $http.get("/zone1/token.php").then(function(response) {
                        $scope.token = response.data;
                        if ($scope.token != "") {
                            $scope.logged = true;
                            $scope.onlogged();
                        }
                    });
                    $scope.onstart();
                }
            }
        );

        var userIsConnected = false;

        Facebook.getLoginStatus(function(response) {
            if (response.status == 'connected') {
                userIsConnected = true;
            }
        });

        /**
         * IntentLogin
         */
        $scope.IntentLogin = function() {
            if (!userIsConnected) {
                $scope.login();
            }
        };

        /**
         * Login
         */
        $scope.login = function() {
            Facebook.login(function(response) {
                if (response.status == 'connected') {
                    $http.get("/zone1/token.php?login").then(function(response) {
                        $scope.token = response.data;
                        $scope.logged = true;
                        $scope.me();
                        $scope.onlogged();
                    });
                }
            }, {
                scope: ['email', 'user_likes', 'user_about_me', 'user_photos', 'user_friends']
            });
        };

        /**
         * Logout
         */
        $scope.logout = function() {
            //$scope.user = {};
            $scope.logged = false;
            $scope.token = "";
            $http.get("/zone1/token.php?logout").then(function(response) {
                $scope.onstart();
            });
        };

        /**
         * me
         */
        $scope.me = function() {
            Facebook.api('/me', {
                accessToken: $scope.token
            }, function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */

                if (!response || response.error)
                    $scope.logout();
                $scope.$apply(function() {
                    $scope.user = response;
                });

            });
        };

        /**
         * cover
         */
        $scope.cover = function() {
            Facebook.api('me', {
                access_token: $scope.token,
                fields: 'cover'
            }, function(response) {
                if (!response || response.error)
                    $scope.logout();
                $scope.$apply(function() {
                    $scope.photo = response.cover.source;
                });
            });
        }

        /**
         * onlogged
         */

        $scope.onlogged = function() {
            $scope.cover();
        }

        /**
         * onstart
         */

        $scope.onstart = function() {
            $scope.photo = 'https://s-media-cache-ak0.pinimg.com/originals/e0/f5/a5/e0f5a5f8c2e378df4fddd75e26e9a5a3.gif';
        }
    }
]);
