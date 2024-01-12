const mongoose = require("mongoose");

const CreateNewLinkSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
      type: String,
      required: true
  }
});

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
  links: [CreateNewLinkSchema] // Corrected to an array of CreateNewLinkSchema
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
  description: {
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
  video: {
    type: String,
    required: true
  },
  audios: [nestedAudioSchema]
});

module.exports = mongoose.model("Audio", audioSchema);
