'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$timeout', '$log', '$stateParams', '$location', 'Authentication', 'Orders',
  function ($scope, $timeout, $log, $stateParams, $location, Authentication, Orders) {
    $scope.authentication = Authentication;

    // Create new Order
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'orderForm');

        return false;
      }

      // Create new Order object
      var order = new Orders({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      order.$save(function (response) {
        $location.path('orders/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Order
    $scope.remove = function (order) {
      if (order) {
        order.$remove();

        for (var i in $scope.orders) {
          if ($scope.orders[i] === order) {
            $scope.orders.splice(i, 1);
          }
        }
      } else {
        $scope.order.$remove(function () {
          $location.path('orders');
        });
      }
    };

    // Update existing Order
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'orderForm');

        return false;
      }

      var order = $scope.order;

      order.$update(function () {
        $location.path('orders/' + order._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Orders
    $scope.find = function () {
      $scope.orders = Orders.query();
      $scope.ordersByDay = Orders.ordersCountByDay();
      $scope.showAllGraphs();
    };

    $scope.showAllGraphs = function () {
      $scope.showGraph();
      $scope.showLineGraph();
    };

    // Find existing Order
    $scope.findOne = function () {
      $scope.order = Orders.get({
        orderId: $stateParams.orderId
      });
    };

    var pendingOrders;
    var deliveredOrders;
    var undeliveredOrders;
    var labels = [];
    var lineLabels = [];
    var cityCountJSON = {};

    $scope.showLineGraph = function() {
      lineLabels = [];
      cityCountJSON = {};

      var totalOrderCountArray = [];
      var cities = ['All Cities'];
      cityCountJSON['All Cities'] = [];

      angular.forEach($scope.ordersByDay, function(ordersJSON,index) {
        cityCountJSON['All Cities'].push(ordersJSON.totalCount);
        lineLabels.push(ordersJSON.date);

        var cityOrdersArray = [];
        for (index in ordersJSON.allOrders) {
          var city = ordersJSON.allOrders[index].city;
          if (cities.indexOf(city) === -1) {
            cities.push(ordersJSON.allOrders[index].city);
          }
          cityOrdersArray.push(ordersJSON.allOrders[index].count);

          if (city in cityCountJSON) {
            cityCountJSON[city].push(ordersJSON.allOrders[index].count);
          } else {
            cityCountJSON[city] = [];
            cityCountJSON[city].push(ordersJSON.allOrders[index].count);
          }
        }
      });

      var dataPointsArray = [];
      for (var i in lineLabels) {
        var dataJSON = {
          x: lineLabels[i],
          y: [
            cityCountJSON[cities[0]][i],
            cityCountJSON[cities[1]][i],
            cityCountJSON[cities[2]][i],
            cityCountJSON[cities[3]][i]
          ],
          tooltip: ""
        };

        dataPointsArray.push(dataJSON);
      }

      $scope.firstChartData = {
        series: cities,
        data: dataPointsArray
      };

      $scope.selectedCity = cities[1];
      $scope.showLineChartForCity($scope.selectedCity);

      $scope.allCities = cities;
    };

    $scope.showLineChartForCity = function (city) {
      $scope.selectedCity = city;

      var dataPointsArray1 = [];
      for (var i1 in lineLabels) {
        var dataJSON1 = {
          x: lineLabels[i1],
          y: [cityCountJSON[$scope.selectedCity][i1]],
          tooltip: ""
        };
        dataPointsArray1.push(dataJSON1);
      }

      $scope.cityChartData = {
        series: [$scope.selectedCity],
        data: dataPointsArray1
      };
    };

    $scope.showGraph = function() {

      angular.forEach($scope.orders, function(kiosksJSON,index) {
        if (labels.indexOf(kiosksJSON._id.kiosk) === -1) {
          labels.push(kiosksJSON._id.kiosk);
        }
      });

      var orderStatuses = ['PENDING', 'DELIVERED', 'UNDELIVERED'];
      pendingOrders = new Array(labels.length + 1).join('0').split('');
      deliveredOrders = new Array(labels.length + 1).join('0').split('');
      undeliveredOrders = new Array(labels.length + 1).join('0').split('');

      var totalPendingOrders = 0;
      var totalDeliveredOrders = 0;
      var totalUndeliveredOrders = 0;

      angular.forEach($scope.orders,function(kiosksJSON,index) {
        if (labels.indexOf(kiosksJSON._id.kiosk) === -1) {
          labels.push(kiosksJSON._id.kiosk);
        }
        if (orderStatuses.indexOf(kiosksJSON._id.orderStatus) === -1) {
          orderStatuses.push(kiosksJSON._id.orderStatus);
        }
        switch (kiosksJSON._id.orderStatus) {
          case 'PENDING':
          pendingOrders[labels.indexOf(kiosksJSON._id.kiosk)] = kiosksJSON.orderCount;
          break;
          case 'DELIVERED':
          deliveredOrders[labels.indexOf(kiosksJSON._id.kiosk)] = kiosksJSON.orderCount;
          // deliveredOrders.splice(labels.indexOf(kiosksJSON._id.kiosk), 0, kiosksJSON.orderCount);
          break;
          case 'UNDELIVERED':
          undeliveredOrders[labels.indexOf(kiosksJSON._id.kiosk)] = kiosksJSON.orderCount;
          break;
          default:
          break;
        }
      });

      $scope.labels = labels;
      $scope.series = orderStatuses;
      $scope.barData = [pendingOrders, deliveredOrders, undeliveredOrders];

      totalPendingOrders = $scope.sumOfArray(pendingOrders);
      totalDeliveredOrders = $scope.sumOfArray(deliveredOrders);
      totalUndeliveredOrders = $scope.sumOfArray(undeliveredOrders);

      $scope.pieLabels = orderStatuses;
      $scope.pieData = [totalPendingOrders, totalDeliveredOrders, totalUndeliveredOrders];

      var dataPointsArray = [];
      for (var i in labels) {
        var dataJSON = {
          x: labels[i],
          y: [pendingOrders[i], deliveredOrders[i], undeliveredOrders[i]],
          tooltip: ""
        };

        dataPointsArray.push(dataJSON);
      }
      $scope.data = {
        series: orderStatuses,
        data : dataPointsArray
      };
    };

    $scope.firstChartType = 'line';
    $scope.firstChartConfig = {
      labels: false,
      title : "Orders Received by Day",
      legend : {
        display: false,
        position:'right'
      },
      click : function(d) {
        $scope.messages.push('clicked!');
      },
      mouseover : function(d) {
        $scope.messages.push('mouseover!');
      },
      mouseout : function(d) {
        $scope.messages.push('mouseout!');
      },
      innerRadius: 0,
      lineLegend: 'lineEnd',
    };

    $scope.sumOfArray = function (array) {
      var totalSum = 0;
      for (var index in array) {
        totalSum += parseInt(array[index]);
      }
      return totalSum;
    };

    $scope.messages = [];

    $scope.chartType = 'bar';

    $scope.config = {
      labels: false,
      title : "Orders by Kiosk",
      legend : {
        display: true,
        position:'right'
      },
      click : function(d) {
        $scope.messages.push('clicked!');
      },
      mouseover : function(d) {
        $scope.messages.push('mouseover!');
      },
      mouseout : function(d) {
        $scope.messages.push('mouseout!');
      },
      innerRadius: 0,
      lineLegend: 'traditional',
    };

    $scope.selectedKiosk = "Select a Kiosk";
    $scope.showPieChartForKiosk = function(kioskId) {
      $scope.selectedKiosk = kioskId;

      var kioskIndex = labels.indexOf(kioskId);
      if (kioskIndex !== -1) {
        $scope.pieData = [pendingOrders[kioskIndex], deliveredOrders[kioskIndex], undeliveredOrders[kioskIndex]];
      }
    };


    // var acData = {
    //   series: ["Sales", "Income", "Expense"],
    //   data: [{
    //     x: "Computers",
    //     y: [54, 0, 879],
    //     tooltip: "This is a tooltip"
    //   },
    //   {
    //     x: "Computers",
    //     y: [54, 0, 879],
    //     tooltip: "This is a tooltip"
    //   }]
    // };

  }
]);
