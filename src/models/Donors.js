const { Schema, model } = require("mongoose");

const DonursSchema = new Schema({
   
    user_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  blood_group: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  zila: {
    type: String,
    required: true
  }
});

const DonursCollection = model('donurs', DonursSchema);

module.exports = DonursCollection;
