'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a order
 */
exports.create = function (req, res) {
  var order = new Order(req.body);
  order.user = req.user;

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * Show the current order
 */
exports.read = function (req, res) {
  res.json(req.order);
};

/**
 * Update a order
 */
exports.update = function (req, res) {
  var order = req.order;

  order.title = req.body.title;
  order.content = req.body.content;

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * Delete an order
 */
exports.delete = function (req, res) {
  var order = req.order;

  order.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list1 = function (req, res) {
  Order.find()
  .sort('-created')
  .populate('user', 'displayName')
  .select('-_id orderId kioskId orderStatus vendor')
  .exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(orders);
    }
  });
};

exports.allKiosks = function (req, res) {
  Order.find().distinct('kioskId')
  .exec(function (err, kiosks) {

    Order.find().distinct('orderStatus')
    .exec(function (err, statuses) {

    });
    
  });
};

exports.list2 = function (req, res) {
  Order.aggregate()
  .group({ _id: '$kioskId', count: {$sum: 1} })
  .exec(function (err, results) {
    if (err) {
        res.json(err);
    } else {
        res.json(results);
    }
  });
  // Order.aggregate([
  //       {
  //           $group: {
  //               _id: '$kioskId',  //$region is the column name in collection
  //               count: {$sum: 1}
  //           }
  //       }
  //   ], function (err, result) {
  //       if (err) {
  //           res.json(err);
  //       } else {
  //           res.json(result);
  //       }
  //   });
};

exports.list = function (req, res) {
  Order.aggregate()
  .group({ _id: { kiosk: '$kioskId', orderStatus: '$orderStatus' }, orderCount: {$sum: 1} })
  .exec(function (err, results) {
    if (err) {
      res.json(err);
    } else {
      res.json(results);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};
