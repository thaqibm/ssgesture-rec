var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join('../public/index.html'));
});
router.post('/users', function(req, res, next) {
  console.log(req.body.points); 
  res.send('Got a POST request '); 
});

module.exports = router;
