'use strict';

//Kiosks service used for communicating with the articles REST endpoints
angular.module('kiosks').factory('Kiosks', ['$resource',
  function ($resource) {
    return $resource('api/kiosks/:kioskId', {
      kioskId: '@externalKioskId'
    });
  }
]);


/*
//Kiosks service used to communicate Kiosks REST endpoints
angular.module('kiosks').factory('Kiosks', ['$resource',
	function($resource) {
		return $resource('kiosks/:kioskId', { kioskId: '@kioskId'
		}, {
			save: {
				url:'kiosks',
				method: 'POST'
			},
			update: {
				url:'kiosks/:kioskId',
				method: 'PUT'
			},
			findByUser: {
                    method: 'GET',
                    url: 'kiosks/search?manager=:manager',
                    isArray:true
                  },
		});
	}
]);
*/
