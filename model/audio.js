const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  audios: {
    type: [String], // Array of audio paths
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Audio", audioSchema);
