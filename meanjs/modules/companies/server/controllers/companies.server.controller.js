/**
 * Created by dheeraj.gembali on 09/09/15.
 */

'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function(req, res) {
    var company = new Company(req.body);
    company.user = req.user;

    company.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(company);
        }
    });
};

exports.update = function(req, res) {
    var company = req.company;

    company.name = req.body.companyname;

    company.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(company);
        }
    });
};
