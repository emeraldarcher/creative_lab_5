var mongoose = require('mongoose');
var MarkerSchema = new mongoose.Schema({
  title: String,
  description: String,
  lat: String,
  lng: String,
});
mongoose.model('Marker', MarkerSchema);
