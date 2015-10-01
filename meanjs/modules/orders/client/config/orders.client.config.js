'use strict';

// Configuring the Orders module
angular.module('orders').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Orders',
      state: 'orders',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'orders', {
      title: 'List Orders',
      state: 'orders.list'
    });

  }
]);
