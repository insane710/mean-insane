/**
 * Created by dheeraj.gembali on 09/09/15.
 */

'use strict';

angular.module('users').controller('UpdateCompanyDetailsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function ($scope, $http, $location, Users, Authentication) {
        $scope.user = Authentication.user;

        // Update user company details
        $scope.updateCompanyDetails = function (isValid) {
            $scope.success = $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'companyForm');

                return false;
            }

            var user = new Users($scope.user);

            user.$update(function (response) {
                $scope.$broadcast('show-errors-reset', 'companyForm');

                $scope.success = true;
                Authentication.user = response;
            }, function (response) {
                $scope.error = response.data.message;
            });
        };
    }
]);
