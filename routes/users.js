var Cloudant = require('@cloudant/cloudant');
var express = require('express');
var router = express.Router();

var cloudant_username = process.env.CLOUDANT_USERNAME;
var cloudant_password = process.env.CLOUDANT_PASSWORD;

var cloudant = Cloudant({account:cloudant_username, password:cloudant_password});

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
