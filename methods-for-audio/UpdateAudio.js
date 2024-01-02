const fs = require('fs');
const path = require('path');
const AudioSchema = require("../model/audio");

module.exports = function updateAudio(req, res) {
  const audioId = req.params.id; // Assuming you'll send the audio ID as a parameter in the route
  const { firstname, lastname } = req.body;
  const smallaudioFile = req.files['smallaudio'] ? req.files['smallaudio'][0].path : null;
  const imageFile = req.files['image'] ? req.files['image'][0].path : null;

  if (!firstname || !lastname || (!smallaudioFile && !imageFile)) {
    return res.status(400).json({ error: "Missing required fields for updating the audio entry." });
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

  const smallaudioBuffer = smallaudioFile ? readFileToBuffer(smallaudioFile) : null;
  const imageBuffer = imageFile ? readFileToBuffer(imageFile) : null;

  if ((!smallaudioBuffer && smallaudioFile) || (!imageBuffer && imageFile)) {
    return res.status(500).json({ error: "Failed to read file data." });
  }

  // Find the existing audio by ID and update its fields
  AudioSchema.findByIdAndUpdate(
    audioId,
    {
      firstname,
      lastname,
      ...(smallaudioBuffer && { smallaudio: smallaudioBuffer }),
      ...(imageBuffer && { image: imageBuffer })
    },
    { new: true } // This ensures that the updated document is returned
  )
    .then((updatedAudio) => {
      if (!updatedAudio) {
        return res.status(404).json({ error: 'Audio not found' });
      }
      res.status(200).json(updatedAudio); // Return the updated audio document
    })
    .catch((error) => {
      console.error('Error updating audio:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};
