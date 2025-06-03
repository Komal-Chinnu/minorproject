const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  imgSrc: { type: String },
  photos: [{ type: String }],
  amenities: [{ type: String }],
  shortDescription: { type: String },
  description: [{ type: String }],
  mapLink: { type: String },
  VlogLink: { type: String }
});

const Resort = mongoose.model('Resort', resortSchema);

module.exports = Resort;