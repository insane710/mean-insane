'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  version = require('mongoose-version'),
	Schema = mongoose.Schema,
	// Id     = mongoose.model('Id'),
  timestamps = require('mongoose-timestamp');

	// var nextCount = function (collection, callback) {
  // 		Id.findOneAndUpdate(
	// 			    {},
	// 			    { $inc:   { count: 1 } },
	// 			    { upsert: true },
	// 			    function (err, idDoc) {
	// 			    	//Pass the updated count in the callback to update the orderId
	// 			    	callback(collection, err, idDoc);
  //
	// 	});
	// };
	var assignKioskToOrder = function(order, kiosk){

	};
	var generateOrderIdFromCount = function(prefix, count){
		//Current order ID to follow 'DON' + count
		return prefix + count;
	};
	/**
	 * A Validation function for local strategy email
	 */
	var validateLocalStrategyEmail = function(email) {
		//TODO check for email syntax
		//return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
		return ((this.provider !== 'local' && !this.updated) || email.length);
	};


	/**
	 * A Validation function for local strategy date
	 */
	var validateLocalStrategyDate = function(date) {
		//TODO check for future date
		return ((this.provider !== 'local' && !this.updated) || date.length);
	};

	/**
	 * A Validation function for local strategy properties
	 */
	var validateLocalStrategyProperty = function(property) {
		return ((this.provider !== 'local' && !this.updated) || property.length);
	};


/**
 * Order Schema
 */
var OrderSchema = new Schema({
	orderId: {
		type: String,
		unique: true,
		trim: true,
		validate: [validateLocalStrategyProperty, 'Order ID missing']
	},
  vendorOrderId: {
    type: String,
    unique: false,
    trim: true,
    require: false,
    validate: [validateLocalStrategyProperty, 'Vendor order ID missing']
  },
	orderStatus: {
		type: String,
		required: false,
		enum: ['PENDING', 'AVAILABLE', 'DELIVERED', 'UNDELIVERED', 'UNDELIVERED ATTEMPTED', 'UNDELIVERED UNATTEMPTED', 'RESCHEDULED', 'REJECTED'],
		default: 'PENDING',
		validate: [validateLocalStrategyProperty, 'Order status missing']
		//PENDING = Order pending from vendor
    //AVAILABLE = Order available at Kiosk
    //DELIVERED = Order delivered to customer
    //UNDELIVERED ATTEMPTED = Delivery attempted but failed. Check comments for more details
    //UNDELIVERED UNATTEMPTED = Delivery not attempted. All pending orders at the end of the day will be marked as this.
    //RESCHEDULED = Customer rescheduled the delivery. rescheduleDateTime field will have the value.
	},
  vendorStatus: {
    type: String,
		required: false
  },
	productCost: {
		type: String,
		trim: true,
		default: '00',
		required: false,
		validate: [validateLocalStrategyProperty, 'Product cost missing']
	},
  customerPayable: {
    type: String,
    trim: true,
    default: '00',
    required: false,
    validate: [validateLocalStrategyProperty, 'Customer payable amount missing']
  },
	orderTitle: {
		type: String,
		trim: true,
		default: 'None',
		required: false,
		validate: [validateLocalStrategyProperty, 'Order Title missing']
	},
	orderDescription: {
		type: String,
		trim: true,
		default: 'None',
		required: false,
		validate: [validateLocalStrategyProperty, 'Order description missing']
	},
	deliveryAddress: {
		type: String,
		trim: true,
		default: 'None',
		required: false,
		validate: [validateLocalStrategyProperty, 'Delivery address missing']
	},
  city: {
    type: String,
    trim: true,
    default: 'None',
    required: false,
    validate: [validateLocalStrategyProperty, 'Delivery city missing']
  },
	vendor: {
		type: String,
		trim: true,
		default: 'None',
		required: false,
		validate: [validateLocalStrategyProperty, 'Vendor missing']
	},
	kioskId: {
		type: String,
		trim: true,
		default: 'None',
		required: false,
		validate: [validateLocalStrategyProperty, 'Kiosk ID missing']
	},
	//Saving the Kiosk ID now, instead of the object
	// kiosk: {
 //        type: Schema.ObjectId,
 //        ref: 'Kiosk',
 //        //required: 'Kiosk details missing',
 //        trim: true
 //    },
	areaPincode: {
		type: String,
		trim: true,
		default: 'None',
		required: false,
		validate: [validateLocalStrategyProperty, 'Area pincode missing']
	},
	paymentType: {
		type: String,
		trim: true,
		default: 'PP',
		required: false,
		enum: ['PP', 'COD'],
		// PRE (PREPAID)
		// COD
		validate: [validateLocalStrategyProperty, 'Payment Type missing']
	},
	deliveryCharges: {
		type: String,
		trim: true,
		default: '0.0',
		required: false,
		validate: [validateLocalStrategyProperty, 'Delivery charges missing']
	},
  extraCharges: {
    type: String,
    trim: true,
    default: '0.0',
    required: false,
    validate: [validateLocalStrategyProperty, 'Extra charges missing']
  },
	expectedDeliveryDateTime: {
		type: Date,
		trim: true,
		default: '',
		validate: [validateLocalStrategyDate, 'Delivery date missing']
	},
	actualDeliveryDateTime: {
		type: Date,
		trim: true,
		default: '',
		validate: [validateLocalStrategyDate, 'Delivery date missing']
	},
	expectedArrivalDateTime: {
		type: Date,
		trim: true,
		default: '',
		validate: [validateLocalStrategyDate, 'Arrival date missing']
	},
	actualArrivalDateTime: {
		type: Date,
		trim: true,
		default: '',
		validate: [validateLocalStrategyDate, 'Arrival date missing']
	},
	customerName: {
        type: String,
        default: '',
        required: 'Please fill in the contact number',
        trim: true
    },
    contactNumber: {
        type: String,
        default: '',
        required: 'Please fill in the contact number',
        trim: true
    },
    customerId: {
        type: String,
        default: '',
        //required: 'Please fill in the customer ID',
        trim: true
    },
    contactEmail: {
        type: String,
        default: '',
        required: 'Please fill in the contact email address',
        trim: true,
        validate: [validateLocalStrategyEmail, 'Email ID missing']
    },
  //   createdAt: {
	// 	type: Date,
	// 	trim: true
	// },
	// updatedAt: {
	// 	type: Date,
	// 	trim: true
	// },
	nonDeliveryReturnDatetime: {
		type: Date,
		trim: true,
		default: '',
		validate: [validateLocalStrategyDate, 'nonDeliveryReturnDatetime date missing']
	},
  //Below is a runsheet ID specific to flipkart file upload orders
  runsheetId: {
        type: String,
        default: '',
        required: false,
        trim: true
    },
  comments: {
        type: String
    }
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }
});

OrderSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.uid = ret._id;
        //delete ret._id;
        //delete ret.__v;
        return ret;
        //add { movie: ret.displayName }
    }
};

var cnt = 0;
//createdAt and updatedAt are added by timestamps plugin
OrderSchema.plugin(timestamps);
OrderSchema.pre('save', function(next) {
  var now = new Date();
  //This pre save is executing multiple times. Possibly caused by the mongoose-version plugin.
  //TO-DO investigate.
  if ( this.orderStatus === 'AVAILABLE'){
  	this.actualArrivalDateTime = now;
  }
  if ( this.orderStatus === 'DELIVERED'){
  	this.actualDeliveryDateTime = now;
  }
  //Set the external Order ID in pre-save.
  //External order id computed from the id model, which saves the latest count
  if( this.orderId ){
  	next();

  }else{
    this.orderId = generateOrderIdFromCount('DON', '111');

		  // nextCount(this, function(order, err, idDoc) {
		  // 	if(!err){
		  // 		order.orderId = generateOrderIdFromCount(idDoc.prefix, idDoc.count);
		  // 		next();
		  // 	}else{
		  // 		console.log('Error generating Order ID' + err);
		  // 	}
		  // });
		}
});
//Refer https://github.com/saintedlama/mongoose-version
//for options on version schema
var options = {
  collection: 'orders_history',
};
// OrderSchema.plugin(version, options);

mongoose.model('Order', OrderSchema);
