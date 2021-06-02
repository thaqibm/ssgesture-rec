var express = require('express');
var pretty = require('express-prettify');

var router = express.Router();
router.use(pretty({ query: 'pretty' }));
const data = require('../data/gesture_templates.json')['Datbase'].map(v => v['letter']);
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({symbols: data});
  res.send();
});

module.exports = router;
