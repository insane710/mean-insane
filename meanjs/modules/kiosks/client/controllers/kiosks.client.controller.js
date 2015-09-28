'use strict';

// Kiosks controller
angular.module('kiosks').controller('KiosksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Kiosks',
  function ($scope, $stateParams, $location, Authentication, Kiosks) {
    $scope.authentication = Authentication;

    // Create new Kiosk
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'kioskForm');

        return false;
      }

      // Create new Kiosk object
      var kiosk = new Kiosks({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      kiosk.$save(function (response) {
        $location.path('kiosks/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Kiosk
    $scope.remove = function (kiosk) {
      if (kiosk) {
        kiosk.$remove();

        for (var i in $scope.kiosks) {
          if ($scope.kiosks[i] === kiosk) {
            $scope.kiosks.splice(i, 1);
          }
        }
      } else {
        $scope.kiosk.$remove(function () {
          $location.path('kiosks');
        });
      }
    };

    // Update existing Kiosk
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'kioskForm');

        return false;
      }

      var kiosk = $scope.kiosk;

      kiosk.$update(function () {
        $location.path('kiosks/' + kiosk._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Kiosks
    $scope.find = function () {
      $scope.kiosks = Kiosks.query();
    };

    // Find existing Kiosk
    $scope.findOne = function () {
      $scope.kiosk = Kiosks.get({
        kioskId: $stateParams.kioskId
      });
    };
  }
]);
