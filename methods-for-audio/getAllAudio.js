const AWS = require('aws-sdk');
const path = require('path');
const AudioSchema = require("../model/audio");

module.exports = async function getAllAudio(req, res) {
  try {
    const audios = await AudioSchema.find({}, '_id firstname lastname smallaudio image audios description video');
    
    if (!audios || audios.length === 0) {
      return res.status(404).json({ error: "Audio data not found." });
    }
      
    const audioWithUrls = audios.map(audio => ({
      _id: audio._id,
      firstname: audio.firstname,
      lastname: audio.lastname,
      description:audio.description,
      smallaudio: audio.smallaudio,
      image: `${audio.image}`, 
      video: `${audio.video}`, 
      audios:audio.audios
    }));

    res.status(200).json(audioWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
