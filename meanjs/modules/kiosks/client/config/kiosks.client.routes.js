'use strict';

// Setting up route
angular.module('kiosks').config(['$stateProvider',
  function ($stateProvider) {
    // Kiosks state routing
    $stateProvider
      .state('kiosks', {
        abstract: true,
        url: '/kiosks',
        template: '<ui-view/>'
      })
      .state('kiosks.list', {
        url: '',
        templateUrl: 'modules/kiosks/client/views/list-kiosks.client.view.html'
      })
      // .state('kiosks.create', {
      //   url: '/create',
      //   templateUrl: 'modules/kiosks/client/views/create-article.client.view.html',
      //   data: {
      //     roles: ['user', 'admin']
      //   }
      // })
      .state('kiosks.view', {
        url: '/:kioskId',
        templateUrl: 'modules/kiosks/client/views/view-kiosk.client.view.html'
      })
      .state('kiosks.edit', {
        url: '/:kioskId/edit',
        templateUrl: 'modules/kiosks/client/views/edit-kiosk.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
