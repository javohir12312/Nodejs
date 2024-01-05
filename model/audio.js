const mongoose = require("mongoose");

const nestedAudioSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  audio: {
    type: String,
    required: true
  },
});

const audioSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  smallaudio: {
    type: String,
    required: true
  },
  audios: [nestedAudioSchema]
});

module.exports = mongoose.model("Audio", audioSchema);
