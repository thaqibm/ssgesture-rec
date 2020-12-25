var express = require('express');
var router = express.Router();
var path = require('path');
const { five_point_rec } = require('../utils/gesture_rec');
var rec = require('../utils/gesture_rec'); 


const StrToArr = (str) =>{
	var re = /\[\d+\.*\d*,\d+\.*\d*\]/g;
	var inner =  str.match(re);
	
	var final = []; 
	inner.forEach(element => {
		var re2 = /\d+\.*\d+/g; 
		var nums = element.match(re2); 
		
		var x = parseFloat(nums[0]); 
		var y = parseFloat(nums[1]); 
		
		final.push([x,y]); 
	}); 
	return final; 
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join('../public/index.html'));
});
router.post('/users', function(req, res, next) {
	
	const gesture = StrToArr(req.body.data); 
	res.send(JSON.stringify(rec.five_point_rec(gesture))); 

});



module.exports = router;
