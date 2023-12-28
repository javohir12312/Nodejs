const AudioSchema = require("../model/audio");

module.exports = function createAudio(req, res) {
  const { title, number } = req.body;
  const audios = req.files['audios'] ? req.files['audios'].map(file => `/audio-uploads/${file.filename}`) : [];
  const audioFile = req.files['audio'] ? `${req.files['audio'][0].filename}` : null;
  const imageFile = req.files['image'] ? `${req.files['image'][0].filename}` : null;
  console.log(req.body);

  if (!title || !number || audios.length === 0 || !audioFile || !imageFile) {
    return res.status(400).json({ error: "Missing required fields for creating a new audio entry." });
  }

  const newAudioEntry = new AudioSchema({
    title,
    number,
    audios: [...audios],
    audio: audioFile,
    image: imageFile
  });

  newAudioEntry.save()
    .then((createdAudio) => {
      const audioWithUrls = {
        ...createdAudio._doc,
        audios: createdAudio.audios.map(audio => `${audio}`),
        audio: `${createdAudio.audio}`,
        image: `${createdAudio.image}`
      };
      res.status(201).json(audioWithUrls);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to save the audio entry." });
    });
};
