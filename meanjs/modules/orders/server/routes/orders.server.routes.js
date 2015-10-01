'use strict';

var orders = require('../controllers/orders.server.controller');

module.exports = function (app) {

  app.route('/api/orders')
    .get(orders.list);

  app.route('/api/orders/:orderId')
    .get(orders.read);

  app.param('orderId', orders.orderByID);
};
