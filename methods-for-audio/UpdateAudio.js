const AudioSchema = require("../model/audio");

module.exports = function updateAudio(req, res) {
  const audioId = req.params.id;
  const { title, number } = req.body;

  console.log('Updating audio with ID:', audioId);

  if (!title && !number) {
    return res.status(400).json({ error: "No data provided for update." });
  }

  const updateObject = {};
  if (title) updateObject.title = title;
  if (number) updateObject.number = number;

  if (req.files && req.files.image) {
    const image = req.files.image[0];
    updateObject.image = `audio-uploads/${image.filename}`;
  }

  if (req.files && req.files.audio) {
    const audioFiles = req.files.audio;
    updateObject.audios = audioFiles.map(audio => `${audio.filename}`);
  }

  console.log('Update Object:', updateObject);

  AudioSchema.findByIdAndUpdate(audioId, updateObject, { new: true })
    .then((updatedAudio) => {
      if (!updatedAudio) {
        console.log('Audio entry not found.');
        return res.status(404).json({ error: "Audio entry not found." });
      }
      
      const audioWithUrls = {
        ...updatedAudio._doc,
        audios: updatedAudio.audios.map(audio => `${audio}`),
        image: `${updatedAudio.image}`,
      };

      res.json(audioWithUrls);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
};
