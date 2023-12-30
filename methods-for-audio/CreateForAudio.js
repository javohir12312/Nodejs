const AudioSchema = require("../model/audio");

module.exports = function createAudio(req, res) {
  const { firstname, lastname } = req.body;
  const smallaudioFile = req.files['smallaudio'] ? `${req.files['smallaudio'][0].filename}` : null;
  const imageFile = req.files['image'] ? `${req.files['image'][0].filename}` : null;

  // Check for required fields
  if (!firstname || !lastname || !smallaudioFile || !imageFile) {
    return res.status(400).json({ error: "Missing required fields for creating a new audio entry." });
  }

  // Construct the new AudioSchema instance
  const newAudioEntry = new AudioSchema({
    firstname,
    lastname,
    smallaudio: `${smallaudioFile}`,
    image: imageFile // Assign the image filename here
  });

  // Save to MongoDB
  newAudioEntry.save()
    .then((createdAudio) => {
      res.status(201).json(createdAudio);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to save the audio entry." });
    });
};
