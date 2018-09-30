var express = require('express');
var router = express.Router();

var Cloudant = require('@cloudant/cloudant');
var cloudant_username = process.env.CLOUDANT_USERNAME;
var cloudant_password = process.env.CLOUDANT_PASSWORD;

var cloudant = Cloudant({account:cloudant_username, password:cloudant_password});

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

var db = cloudant.db.use('debs');
var fc = {};

db.find({selector:{type:'Feature'}}, function(er, result) {
  if(er) {
    throw er;
  }
  result.docs.forEach(function(doc) {
    delete doc._id;
    delete doc._rev;
    doc.properties.detections.forEach(function(detection) {
      doc[[detection.model,detection.class].join('__')] = detection.confidence;
    });
    delete doc.properties.detections;
  });
  fc = {
    type: "FeatureCollection",
    "features": result.docs
  };
  console.log(JSON.stringify(fc));
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/data', function(req, res, next) {
  res.send(fc);
});

router.get('/token', function(req, res, next) {
  res.send({ token: process.env.MAPBOX_TOKEN});
});


module.exports = router;
