const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AudioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    required: true
  },
  audio: {
    type: Buffer,
    required: true
  }
}, { timestamps: true });

const Audio = mongoose.model("audio", AudioSchema);
module.exports = Audio;
  