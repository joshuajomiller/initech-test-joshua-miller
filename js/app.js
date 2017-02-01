var app = angular.module('initechTest', []);

app.controller('loginCtrl', function($scope, $rootScope, $http, authorization){

    $scope.authorization = authorization;
    $scope.showError = false;

    $scope.doLogin = function () {
        if ($scope.username && $scope.password){
            var user = JSON.stringify({"username": $scope.username, "password" : $scope.password});
            $http({
                method:'POST',
                url: 'http://178.62.182.182/login',
                data: user,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function successCallback(response) {
                    $scope.authorization.authorized = true;
                    $scope.authorization.auth_token = response.data.token;
                    $rootScope.$emit('login');
                }, function errorCallback(response) {
                    $scope.showError = true;
                }
            );
        }
    }
});

app.controller('contentCtrl', function($scope, $rootScope, $http, authorization){

    $scope.authorization = authorization;
    $scope.content = {
        text: "",
        title: "",
        image_url: ""
    };

    $rootScope.$on('login', function(event, args) {
        $http({
            method:'GET',
            url: 'http://178.62.182.182/page',
            headers: {
                "Authorization": "Token " + $scope.authorization.auth_token
            }
        }).then(
            function successCallback(response) {
                $scope.content.image_url = response.data.image_url;
                $scope.content.title = response.data.title;
                $scope.content.text = response.data.text;
            }, function errorCallback(response) {
            }
        );
    });

    $scope.doLogout = function () {
        $scope.authorization.authorized = false;
        $scope.authorization.auth_token = false;
    }
});

app.service('authorization', function($http){
    return {
        authorized: false,
        auth_token: false
    }
});