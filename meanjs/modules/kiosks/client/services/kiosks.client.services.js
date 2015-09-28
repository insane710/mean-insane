'use strict';

//Kiosks service used for communicating with the articles REST endpoints
angular.module('kiosks').factory('Kiosks', ['$resource',
  function ($resource) {
    return $resource('api/kiosks/:kioskId', {
      kioskId: '@_id'
    });
  }
]);
