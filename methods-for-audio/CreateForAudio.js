  const Audio = require("../model/audio");

  module.exports = function createAudio(req, res) {
    const { title, number } = req.body;
    const audios = req.files['audio'];
    const image = req.files['image'];

    if (!title || !number || !audios || audios.length === 0 || !image) {
      return res.status(400).json({ error: "Missing required fields for creating a new audio blog post." });
    }

    const audioPaths = audios.map(audio => `/audio-uploads/${audio.filename}`);

    const newAudio = new Audio({
      title,
      number,
      audios: audioPaths,
      image: `/audio-uploads/${image.filename}`,
    });

    console.log(req.body );

    newAudio.save()
      .then((createdAudio) => {
        const audioWithUrls = {
          ...createdAudio._doc,
          audios: createdAudio.audios.map(audio => `/audio-uploads/${audio}`),
          image: `/audio-uploads/${createdAudio.image}`,
        };

        res.status(201).json(audioWithUrls);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error." });
      });
  };
