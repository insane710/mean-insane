'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    // version = require('mongoose-version'),
    Schema = mongoose.Schema;
    // Id     = mongoose.model('Id');

// var nextCount = function (collection, callback) {
//     Id.findOneAndUpdate(
//         {},
//         { $inc:   { count: 1 } },
//         { upsert: true },
//         function (err, idDoc) {
//             //Pass the updated count in the callback to update the externalOrderId
//             callback(collection, err, idDoc);
//
//         });
// };

var generateKioskIdFromCount = function(prefix, count){
    //Current kiosk ID to follow 'DK' + count
    return prefix + count;
};

/**
 * Kiosk Schema
 */
var KioskSchema = new Schema({
//    _id     : Number,
    externalKioskId: {
        type: String
    },
    displayName: {
        type: String,
        default: '',
        required: 'Please fill in Kiosk name',
        trim: true
    },
    pincode: {
        type: Number,
        default: '',
        required: 'Please fill pincode of location',
        trim: true
    },
    isPrimary: {
        type: Boolean,
        default: true,
        required: 'Please fill in if this is the primary kiosk'
    },
    address: {
        type: String,
        default: '',
        required: 'Please fill in the kiosk address',
        trim: true
    },
    landmark: {
        type: String,
        trim: true
    },
    locationCoordinates: {
        latitude: Number,
        longitude: Number
    },
    location: {
      type:{ type: String },
      coordinates: []
    },
    city: {
        type: String,
        default: '',
        required: 'Please fill in the kiosk city',
        trim: true
    },
    state: {
        type: String,
        default: '',
        required: 'Please fill in the kiosk state',
        trim: true
    },
    openingTime: {
        type: String,
        default: '9:00 am',
        required: 'Please fill in the opening time'
    },
    closingTime: {
        type: String,
        default: '9:00 pm',
        required: 'Please fill in the opening time'
    },
    contactNumber: {
        type: String,
        default: '',
        required: 'Please fill in the contact number',
        trim: true
    },
    contactEmail: {
        type: String,
        default: '',
        required: 'Please fill in the contact email address',
        trim: true
    },
    manager: {
        type: Schema.ObjectId,
        ref: 'User',
        unique: true
        //TODO: need to make this mandatory
        //required: 'Please fill in Kiosk manager\'s details'
    },
    marketingManager: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    dimensions: {
        length: Number,
        breadth: Number,
        height: Number,
        area: Number,
        volume: Number,
        units: String
    },
    availabilityStatus: {
        type: String,
        //TODO need to externalize these to enums/constants
        enum: ['AVAILABLE', 'UNAVAILABLE'],
        default: 'AVAILABLE'
    },
    availability: {
    bookedDeliverySlots: Number,
    totalDeliverySlots: Number,
    bookedReturnSlots: Number,
    totalReturnSlots: Number
    },
    businessType: {
        type: String
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
        //TODO: need to make this mandatory
        //required: 'Please fill in Kiosk manager\'s details'
    },
    nearestLandmark: {
        type: String,
        required: 'Please fill in the nearest landmark',
        trim: true
    },
    isDeliveryEnabled: {
        type: Boolean,
        default: false
    },
    comments: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    holidayList: {
        planned: {
            type: Array,
            default: []
        },
        unplanned: {
            type: Array,
            default: []
        }
    },
    areasCovered: {
        type: String,
        default: ''
    },
    staffCount: {
        type: Number,
        default: 0
    },
    ageInMonths: {
        type: Number,
        default: 0
    },
    numberOfDeliveryPersons:{
        type: Number,
        default: 0
    },
    propertyType:{
        type: String,
        enum: ['OWNED', 'RENTED'],
        default: 'OWNED'
    },
    modeOfDelivery:{
        type: String,
        enum: ['BIKE', 'CYCLE', 'WALKING'],
        default: 'BIKE'
    },
    distanceFromRoad:{
        type: String,
        enum: ['0', 'CLOSE', 'INTERIOR'],
        default: '0'
    },
    parkingSpace4Wheeler:{
        type: Boolean,
        default: true
    },
    kioskSurroundingArea:{
        type: String,
        enum: ['GOOD', 'AVERAGE', 'BAD'],
        default: 'AVERAGE'
    },
    kioskLighting:{
        type: String,
        enum: ['GOOD', 'AVERAGE', 'BAD'],
        default: 'AVERAGE'
    },
    kioskRoad:{
        type: String,
        enum: ['GOOD', 'AVERAGE', 'BAD'],
        default: 'AVERAGE'
    },
    kioskNeatness:{
        type: String,
        enum: ['GOOD', 'AVERAGE', 'BAD'],
        default: 'AVERAGE'
    },
    kioskStorageArea:{
        type: String,
        enum: ['GROUND', 'CLOSED SHELF', 'OPEN SHELF'],
        default: 'GROUND'
    },
    isStorageAreaNearElectricBoard:{
        type: Boolean,
        default: false
    },
    isStorageAreaSafeFromPests:{
        type: Boolean,
        default: true
    },
    isStorageAreaSafeFromRain:{
        type: Boolean,
        default: true
    },
    isStorageAreaSafeFromFire:{
        type: Boolean,
        default: true
    },
    canEmployeesSpeakEnglish:{
        type: Boolean,
        default: true
    },
    ownerHasAndroidPhone:{
        type: Boolean,
        default: true
    },
    connectedHub:{
        type: Schema.ObjectId,
        ref: 'Hub',
        unique: false
    }





/*
    }, {
    toObject: {
        transform: function(doc, ret) {
            console.log('*********YESSS**********');
            delete ret.displayName;

        }
    }
*/
});

KioskSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.uid = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
        //add { movie: ret.displayName }
    }
};

KioskSchema.options.toObject = {
    transform: function(doc, ret, options) {
        console.log('******** in toObject() ********** doc: ' + doc.totalSlots);
        console.log('******** in toObject() ********** ret: ' + ret.totalSlots);
        //ret._id = ret.uid;
//        doc.totalSlots = doc.totalSlotss;
//        delete doc.totalSlots;
        return ret;
        //add { movie: ret.displayName }
    }
};

KioskSchema.pre('save', function(next) {
    //Set the external Kiosk ID in pre-save.
    //External kiosk id computed from the id model, the same using which the order id is calculated
    //Set updatedAt and createdAt
      var now = new Date();
      this.updatedAt = now;
      if ( !this.createdAt ) {
        this.createdAt = now;
        this.externalKioskId = generateKioskIdFromCount('KI', 1);
        // nextCount(this, function(kiosk, err, idDoc) {
        // if(!err){
        //     kiosk.externalKioskId = generateKioskIdFromCount(idDoc.kioskPrefix, idDoc.count);
        //     next();
        // }else{
        //     console.log('Error generating Kiosk ID', err);
        // }
        // });
      }else{
      next();
      }


});

//Refer https://github.com/saintedlama/mongoose-version
//for options on version schema
var options = {
  collection: 'kiosks_history',
};
// KioskSchema.plugin(version, options);
KioskSchema.index({ location: '2dsphere' });
mongoose.model('Kiosk', KioskSchema);
