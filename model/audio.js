const mongoose = require("mongoose");

// Define the nested audio schema
const nestedAudioSchema = new mongoose.Schema({
  id:{
  type:String,
  required:true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  audio: {
    type: String,
    required: true,
  },
});

// Main Audio Schema
const audioSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
  smallaudio: {
    type: Buffer,
    required: true,
  },
  audios: {
    type: [nestedAudioSchema], // This specifies an array of objects following the nestedAudioSchema
    required: false,
  },
});

module.exports = mongoose.model("Audio", audioSchema);
