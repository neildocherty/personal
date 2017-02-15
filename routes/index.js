var express = require('express');
var router = express.Router();
var http = require("http");

/* GET home page. */
router.get('/', function(req, res, next) {

  // ping other apps to wake in preperation of visiting
  http.get("http://ubiquitous-quote.herokuapp.com");


  res.render('index', { title: 'Express' });
});

module.exports = router;
