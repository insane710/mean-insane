'use strict';

// Configuring the Kiosks module
angular.module('kiosks').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Kiosks',
      state: 'kiosks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'kiosks', {
      title: 'List Kiosks',
      state: 'kiosks.list'
    });

  }
]);
