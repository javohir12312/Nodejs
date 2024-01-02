const fs = require('fs');
const path = require('path');
const AudioSchema = require("../model/audio");

module.exports = function createAudio(req, res) {
  const { firstname, lastname } = req.body;
  const smallaudioFile = req.files['smallaudio'] ? req.files['smallaudio'][0].path : null;
  const imageFile = req.files['image'] ? req.files['image'][0].path : null;

  if (!firstname || !lastname || !smallaudioFile || !imageFile) {
    return res.status(400).json({ error: "Missing required fields for creating a new audio entry." });
  }

  // Function to read file and return as Buffer
  const readFileToBuffer = (filePath) => {
    try {
      return fs.readFileSync(filePath);
    } catch (error) {
      console.error(`Error reading file from path ${filePath}:`, error);
      return null;
    }
  };

  const smallaudioBuffer = readFileToBuffer(smallaudioFile);
  const imageBuffer = readFileToBuffer(imageFile);

  if (!smallaudioBuffer || !imageBuffer) {
    return res.status(500).json({ error: "Failed to read file data." });
  }

  const newAudioEntry = new AudioSchema({
    firstname,
    lastname,
    smallaudio: smallaudioBuffer,
    image: imageBuffer
  });

  newAudioEntry.save()
    .then((createdAudio) => {
      res.status(201).json(createdAudio);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to save the audio entry." });
    });
};
