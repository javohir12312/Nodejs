const AWS = require('aws-sdk');
const path = require('path');
const AudioSchema = require("../model/audio");

module.exports = async function getAllAudio(req, res) {
  try {
    // Fetch all audio documents from the database
    const audios = await AudioSchema.find({}, '_id firstname lastname smallaudio image audios');
    
    // Check if no audio documents are found
    if (!audios || audios.length === 0) {
      return res.status(404).json({ error: "Audio data not found." });
    }
    
    // Convert audio documents to include URLs if necessary
    const audioWithUrls = audios.map(audio => ({
      _id: audio._id,
      firstname: audio.firstname,
      lastname: audio.lastname,
      smallaudio: audio.smallaudio,
      image: `${audio.image}`, // Convert to URL format if necessary
      // audios: audio.audios.map((item) => ({
      //   id: item.id,
      //   title: item.title,
      //   description: item.description,
      //   audio: `${item.audio}` // Convert to URL format if necessary
      // }))
      audios:audio.audios
    }));

    // Return the transformed audio data in the response
    res.status(200).json(audioWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
