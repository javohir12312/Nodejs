const fs = require('fs').promises;
const path = require('path');
const AudioSchema = require("../model/audio");

module.exports = async function createAudio(req, res) {
  const { firstname, lastname } = req.body;
  const smallaudioFile = req.files['smallaudio'] ? req.files['smallaudio'][0].path : null;
  const imageFile = req.files['image'] ? req.files['image'][0].path : null;

  if (!firstname || !lastname || !smallaudioFile || !imageFile) {
    return res.status(400).json({ error: "Missing required fields for creating a new audio entry." });
  }

  const readFileToBuffer = async (filePath) => {
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      console.error(`Error reading file from path ${filePath}:`, error);
      return null;
    }
  };

  const [smallaudioBuffer, imageBuffer] = await Promise.all([
    readFileToBuffer(smallaudioFile),
    readFileToBuffer(imageFile)
  ]);

  if (!smallaudioBuffer || !imageBuffer) {
    return res.status(500).json({ error: "Failed to read file data." });
  }

  try {
    const newAudioEntry = new AudioSchema({
      firstname,
      lastname,
      smallaudio: smallaudioBuffer,
      image: imageBuffer
    });

    const createdAudio = await newAudioEntry.save();
    res.status(201).json(createdAudio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save the audio entry.", detailedError: error.message });
  }
};
