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

            $http.put('/api/users/company', $scope.companyDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.$broadcast('show-errors-reset', 'companyForm');

                $scope.success = true;
                $scope.companyDetails = null;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };
    }
]);
