/**
 * Created by dheeraj.gembali on 11/09/15.
 */

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async'),
    Company = mongoose.model('Company');

exports.updateCompanyDetails = function (req, res) {
    var companyDetails = req.body;
    var message = null;

    if (req.user) {
        if (companyDetails.name) {
            User.findById(req.user.id, function (err, user) {
                console.log(req.body);
                if (!err && user) {
                    var company = new Company(req.body);
                    company.save(function (err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                        else {
                            req.user.company = company;
                            req.user.save(function (err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                }
                                else {
                                    res.send();
                                }
                            });
                        }
                    });
                }
                else {

                }
            });
        }
        else {

        }

    }

};

