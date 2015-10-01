'use strict';

var kiosks = require('../controllers/kiosks.server.controller');

module.exports = function (app) {

  app.route('/api/kiosks')
    .get(kiosks.list);

  app.route('/api/kiosks/:kioskId')
    .get(kiosks.read);

  app.param('kioskId', kiosks.kioskByID);

  // app.route('/api/kiosks/searchByLocation')
  //   .post(kiosks.kioskByNearestDistance);
  //
  // app.route('/api/kiosks/searchByPincode')
  //   .post(kiosks.kioskByPincode);
};
