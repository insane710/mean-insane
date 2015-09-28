'use strict';

var kiosks = require('../controllers/kiosks.server.controller');

module.exports = function (app) {

  app.route('/api/kiosks')
    .get(kiosks.list);
    // .post(kiosks.create);

  // Single kiosk routes
  app.route('/api/kiosks/:kioskId')
    .get(kiosks.read);
    // .put(kiosks.update)
    // .delete(kiosks.delete);

  // Finish by binding the kiosk middleware
  app.param('kioskId', kiosks.kioskByID);

  app.route('/api/kiosks/searchByLocation')
    .post(kiosks.kioskByNearestDistance);

  app.route('/api/kiosks/searchByPincode')
    .post(kiosks.kioskByPincode);
};
