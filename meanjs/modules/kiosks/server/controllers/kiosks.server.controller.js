'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  Kiosk = mongoose.model('Kiosk');

  exports.list = function (req, res) {
    Kiosk.find()
    .sort('-createdAt')
    .exec(function (err, kiosks) {
      if (err) {
        return res.status(400).send({
          message: "Something went wrong. Please try again later"
        });
      } else {
        res.send(kiosks);
      }
    });
  };

  exports.kioskByNearLocation = function (req, res) {
    var maxDistance = 5000;
    if (req.body.distance !== undefined) {
      maxDistance = req.body.distance * 1000;
    }

    var kioskCountLimit = 5;
    if (req.body.limit !== undefined) {
      kioskCountLimit = req.body.limit;
    }

    Kiosk.find(
      {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [req.body.longitude, req.body.latitude]
            },
            $maxDistance: maxDistance
          }
        }
      }
    )
    // .sort('-createdAt')
    .limit(kioskCountLimit)
    .exec(function (err, kiosks) {
      if (err) {
        return res.status(400).send({
          message: "Something went wrong. Please try again later"
        });
      } else {

        var responseJSON = {
          noOfKiosks: kiosks.length,
          kiosks:kiosks
        };
        res.send(responseJSON);
      }
    });
  };

  exports.kioskByNearestDistance = function (req, res) {
    var maxDistance = 5000;
    if (req.body.distance !== undefined) {
      maxDistance = req.body.distance * 1000;
    }

    var kioskCountLimit = 5;
    if (req.body.limit !== undefined && parseInt(req.body.limit) !== parseInt(0)) {
      console.log(req.body);
      kioskCountLimit = req.body.limit;
    }

    var point = { type : "Point", coordinates : [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] };
    Kiosk.geoNear(point,
        {
          maxDistance : maxDistance,
          spherical : true,
          num: parseInt(kioskCountLimit)
        },
          function(err, kiosks, stats) {
            var responseJSON = {
              noOfKiosks: kiosks.length,
              kiosks:kiosks
            };
          res.send(responseJSON);
        }
    );

  };

  exports.kioskByPincode = function (req, res) {
    Kiosk.find({pincode: req.body.pincode})
    .sort('-createdAt')
    .exec(function (err, kiosks) {
      if (err) {
        return res.status(400).send({
          message: "Something went wrong. Please try again later"
        });
      } else {

        var responseJSON = {
          noOfKiosks: kiosks.length,
          kiosks:kiosks
        };
        res.send(responseJSON);
      }
    });
  };

  /**
   * Show the current article
   */
  exports.read = function (req, res) {
    res.json(req.kiosk);
  };

  /**
   * Kiosk middleware
   */
  exports.kioskByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Kiosk is invalid'
      });
    }

    Kiosk.findById(id).populate('user', 'displayName').exec(function (err, kiosk) {
      if (err) {
        return next(err);
      } else if (!kiosk) {
        return res.status(404).send({
          message: 'No kiosk with that identifier has been found'
        });
      }
      req.kiosk = kiosk;
      next();
    });
  };
