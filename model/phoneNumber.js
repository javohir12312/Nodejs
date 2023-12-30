const mongoose = require("mongoose");

const Phoneschema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Phone = mongoose.model("Phone", Phoneschema);

module.exports = Phone;
