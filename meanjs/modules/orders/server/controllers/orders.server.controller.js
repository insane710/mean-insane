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

exports.list3 = function (req, res) {
  // Order.aggregate()
  // .group({ _id: '$kioskId', count: {$sum: 1} })
  // .exec(function (err, results) {
  //   if (err) {
  //       res.json(err);
  //   } else {
  //       res.json(results);
  //   }
  // });
  Order.aggregate([
        {
            $group: {
                _id: { kiosk: '$kioskId', orderStatus: '$orderStatus' },
                count: {$sum: 1}
            }
        },
        {
          $project: {
              kioskId: "$_id.kiosk",
              orderStatus: "$_id.orderStatus",
              count: 1,
              _id: 0
            }
        },
        {
          $sort: {
            orderStatus: 1
          }
        }
    ], function (err, result) {
      var result1 = groupBy(result, function(item) {
          return item.kioskId;
      });

      var finalResult = createJSON(result1);
        if (err) {
            res.json(err);
        } else {
            res.json(finalResult);
        }
    });
};

function createJSON(kiosks) {
  var finalJSONArray = [];
  for (var i = 0; i < kiosks.length; i++) {
    var jsonArray = kiosks[i];

    var kioskJSON = {};
    kioskJSON.id = jsonArray[0].kioskId;
    kioskJSON.deliveredCount = jsonArray[0].count;
    kioskJSON.pendingCount = jsonArray[1].count;
    kioskJSON.undeliveredCount = jsonArray[2].count;

    finalJSONArray.push(kioskJSON);
  }
  return finalJSONArray;
}

function arrayFromObject(obj) {
    var arr = [];
    for (var i in obj) {
        arr.push(obj[i]);
    }
    return arr;
}

function groupBy(list, fn) {
    var groups = {};
    for (var i = 0; i < list.length; i++) {
        var group = JSON.stringify(fn(list[i]));
        if (group in groups) {
            groups[group].push(list[i]);
        } else {
            groups[group] = [list[i]];
        }
    }
    return arrayFromObject(groups);
}

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

exports.ordersCountByDay = function (req, res) {
  Order.aggregate([
    {
      $group : {
        _id: { date: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } }, city: "$city" },
        count: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        date: "$_id.date",
        orders: {
          city: "$_id.city",
          count: "$count"
        },
        _id: 0
      }
    },
    {
      $sort: {
        "date": 1
      }
    }
  ], function (err, result) {
    var result1 = groupBy(result, function(item) {
        return item.date;
    });
    var finalResult = createDateWiseJSON(result1);
    if (err) {
      res.json(err);
    } else {
      res.json(finalResult);
    }
  });
};

function createDateWiseJSON(list) {
  var finalJSONArray = [];
  for (var i = 0; i < list.length; i++) {
    var jsonArray = list[i];

    var kioskJSON = {};
    kioskJSON.date = jsonArray[0].date;
    kioskJSON.allOrders = [];
    kioskJSON.allOrders.push(jsonArray[0].orders);
    kioskJSON.allOrders.push(jsonArray[1].orders);
    kioskJSON.allOrders.push(jsonArray[2].orders);
    kioskJSON.allOrders = sortArray(kioskJSON.allOrders);

    kioskJSON.orders = {};
    kioskJSON.orders[jsonArray[0].orders.city] = jsonArray[0].orders.count;
    kioskJSON.orders[jsonArray[1].orders.city] = jsonArray[1].orders.count;
    kioskJSON.orders[jsonArray[2].orders.city] = jsonArray[2].orders.count;
    kioskJSON.totalCount = jsonArray[0].orders.count + jsonArray[1].orders.count + jsonArray[2].orders.count;

    finalJSONArray.push(kioskJSON);
  }

  return finalJSONArray;
}

function sortArray(list) {
  list.sort(function (a, b) {
    return (a.city).localeCompare(b.city);
  });

  return list;
}
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
