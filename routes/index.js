var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Marker = mongoose.model('Marker');
var checkForParams = require('../middleware/checkForParams');

router.get('/markers', function(req, res, next) {
  Marker.find(function(err, markers){
    if(err){ return next(err); }
    res.json(markers);
  });
});

router.post('/markers',[
  checkForParams(['title', 'description', 'lat', 'lng']),
  function(req, res, next) {
    var marker = new Marker(req.body);
    marker.save(function(err, marker){
      if(err){ return next(err); }
      res.json(marker);
    });
  }
]);

module.exports = router;
