'use strict';

//Orders service used for communicating with the articles REST endpoints
angular.module('orders').factory('Orders', ['$resource',
function ($resource) {
  return $resource('api/orders/:orderId', {
    orderId: '@_id'
  },
  {
    ordersCountByDay: {
      method: 'GET',
      url: 'api/ordersByDay',
      isArray:true
    }
  });
}

]);
