#!/usr/bin/env node

/*

Responsible for transforming the json data from the format ActivityInfo provides into
a more workable, readable version.

Run with `node transformJSON.js`

*/

var Path = require('path');
var fs = require('fs');
// var _ = require('underscore');
var config = require('./config');

/*
Helper method used to take a services referral information and
transform it into an object like:
{
    'required': true|false,
    'type':'some string description'
}

@param service:  the service we want to transform referral info for.
*/
var transformReferralMethod = function(service) {
    // Check if this feature has referral method "No Referral"
    var referralData = service.referralMethod;

    /*
     *  There are 7 possible values:
     *  "Email on a per case basis"
     *  "Referrals not accepted"       <-- marked as referral-not-required
     *  "IA Form"
     *  "Telephone on a per case basis"
     *  "RAIS"
     *  "Referral is not required"     <-- marked as referral-not-required
     *  And not defined at all         <-- marked as referral-not-required
     *
     *  The rest are marked as referral-required
     */

    var referralRequired = false;

    if (referralData) {
        if (referralData["Referrals not accepted"] === true || referralData["Referral is not required"]) {
            referralRequired = false;
        } else {
            referralRequired = true;
        }

    }

    var referral = {};
    referral.required = referralRequired;
    referral.type = referralData;
    // console.log(referral);
    return referral;
};

// var transformServicesProvided = function (newService, servicesProvided) {
//     var categories = [];
//     var categoriesFlat = [];
//
//     var addCategory = function (name, depth, siblings, parent) {
//         var exists = _.find(siblings, function (v) {
//             return name == v.name;
//         });
//
//         var item = {};
//
//         if (!exists) {
//             var id = parent === null ? (name + depth) : (parent.id + name + depth);
//             item.id = id.replace(/\s/g, "");
//             item.name = name;
//             item.depth = depth;
//             item.children = [];
//
//             siblings.push(item);
//         } else {
//             item = exists;
//         }
//
//         return item;
//     };
//
//     if (servicesProvided.length > 0) {
//         _.each(servicesProvided.split('||'), function (branch) {
//             var depth = 0;
//             var siblings = categories;
//             var parent = null;
//
//             _.each(branch.split('›'), function (serviceItem) {
//                 var item = addCategory(serviceItem, depth, siblings, parent);
//
//                 var exists = _.find(categoriesFlat, function (v) {
//                     return item.id === v.id;
//                 });
//
//                 if (!exists) {
//                     categoriesFlat.push(item);
//                 }
//                 depth++;
//                 siblings = item.children;
//                 parent = item;
//             });
//         });
//     }
//
//     newService.servicesProvided = categories;
//     newService.servicesProvidedFlat = categoriesFlat;
// };

/*
Transforms the data from activity info into a format that services
advisor can understand.
@param services: the list of services (from activity info)
@param language: the language we want the services to be translated in.
*/
var transformActivityInfoServices = function(services) {
    var transformedServices = [];
    var nids = [];

    for (var i = 0; i < services.length; i++){
        var serviceUntransformed = services[i];
        if (nids.indexOf(serviceUntransformed.id) >= 0){
            continue;
        } else {
            nids.push(serviceUntransformed.id);
        }

        if ((serviceUntransformed.location == null || serviceUntransformed.location.location == null) && serviceUntransformed.locationAlternate == null) {
            continue;
        }

        var serviceTransformed = {};
        serviceTransformed.id = serviceUntransformed.id;
        serviceTransformed.originalId = serviceUntransformed.originalId;
        serviceTransformed.name = serviceUntransformed.serviceName;
        serviceTransformed.region = serviceUntransformed.region;

        //Init the organization
        var untransformedOrganization = serviceUntransformed.organization || {};
        var transformedOrganization = {};
        transformedOrganization.name = untransformedOrganization.title || "";
        serviceTransformed.logoUrl = untransformedOrganization.logoURL || "";
        serviceTransformed.organization = transformedOrganization;

        //Init the category
        var category = {};
        category.name = serviceUntransformed.category;
        var subCategory = {};
        subCategory.name = serviceUntransformed.subCategory;
        category.subCategory = subCategory;
        serviceTransformed.category = category;

        serviceTransformed.startDate = serviceUntransformed.startDate;
        serviceTransformed.endDate = serviceUntransformed.endDate;

        serviceTransformed.servicesProvided = serviceUntransformed.servicesProvided;

        // transformServicesProvided(serviceTransformed, serviceUntransformed.servicesProvided);

        var locationFeature = {};
        locationFeature.type = "Feature";

        if (serviceUntransformed.locationAlternate){
            locationFeature.geometry = serviceUntransformed.locationAlternate;
        } else {
            locationFeature.geometry = serviceUntransformed.location.location;
        }
        serviceTransformed.location = locationFeature;

        serviceTransformed.nationality            = serviceUntransformed.nationality;
        serviceTransformed.intakeCriteria         = serviceUntransformed.intakeCriteria;
        serviceTransformed.accessibility          = serviceUntransformed.accessibility;
        serviceTransformed.coverage               = serviceUntransformed.coverage;
        serviceTransformed.availability           = serviceUntransformed.availability;
        serviceTransformed.referralMethod         = serviceUntransformed.referralMethod;
        serviceTransformed.referralNextSteps      = serviceUntransformed.referralNextSteps;
        serviceTransformed.feedbackMechanism      = serviceUntransformed.feedbackMechanism;
        serviceTransformed.feedbackDelay          = serviceUntransformed.feedbackDelay;
        serviceTransformed.legalDocumentsRequired = serviceUntransformed["Legal Documents Required"]
        serviceTransformed.complaintsMechanism    = serviceUntransformed.complaintsMechanism;
        serviceTransformed.hotlinePhone           = serviceUntransformed.hotlinePhone;
        serviceTransformed.infoLink               = serviceUntransformed.infoLink;
        serviceTransformed.publicAddress          = serviceUntransformed.publicAddress;
        serviceTransformed.additionalDetails      = serviceUntransformed.additionalDetails;
        serviceTransformed.comments               = serviceUntransformed.comments;

        serviceTransformed.referral = transformReferralMethod(serviceUntransformed);

        serviceTransformed.officeHours = transformOfficeHours(serviceUntransformed.officeHours);

        transformedServices.push(serviceTransformed);
    }
    return transformedServices;
};

// **** MAIN - Loop through each language, transform **** //

var initialize = function (language){
    console.log("Transforming " + language.name);
    var untransformedServices = require(language.downloaded_json);

    var services = transformActivityInfoServices(untransformedServices);

    var outputFilename = Path.resolve(__dirname, language.transformed_json);

    fs.writeFile(outputFilename, JSON.stringify(services), function (err) {
        if (err) {
            console.log(err);
        }
    });
};

for (var i in config.languages) {
    initialize(config.languages[i]);
}

function transformOfficeHours(sourceOfficeHours) {
    var officeHours = sourceOfficeHours.reduce(
        function (hours, value) {
            if (!hours[value.day]) {
                hours[value.day] = [];
            }
            hours[value.day].push(value.start + "-" + value.end);
            return hours;
        },
        {}
    );

    return  Object.keys(officeHours).map(function (day) {
        return {
            name: day,
            time: officeHours[day].join(', ')
        };
    });
}
