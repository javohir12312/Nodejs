const Audio = require("../model/audio"); 

module.exports = function UpdateAudio(req, res) {
  const audioId = req.params.id;
  const { title, number } = req.body;

  if (!title && !number && !req.files) {
    return res.status(400).json({ error: "No data provided for update." });
  }

  const updateObject = {};
  if (title) updateObject.title = title;
  if (number) updateObject.number = number;

  if (req.files && req.files.image) {
    const image = req.files.image[0];
    updateObject.image = `${image.filename}`;
  }

  if (req.files && req.files.audios) {
    const audioFiles = req.files.audios;
    updateObject.audios = audioFiles.map(audios => `/audio-uploads/${audios.filename}`);
  }

  if (req.files && req.files.audio) {
    const audioFiles = req.files.audio;
    updateObject.audio = audioFiles.map(audio => `${audio.filename}`);
  }

  Audio.findByIdAndUpdate(audioId, updateObject, { new: true })
    .then((updatedAudio) => {
      if (!updatedAudio) {
        return res.status(404).json({ error: "Audio entry not found." });
      }
      res.json(updatedAudio);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
};
