const AudioSchema = require("../model/audio");

module.exports = function getAllAudios(req, res) {
  AudioSchema.find()
    .then((result) => {
      const audiosWithUrls = result.map(audio => {
        return {
          ...audio._doc,
          image: `/audio-uploads/${audio.image}`,
          audios: audio.audios.map(a => `${a}`),  // Updated this line
          audio: audio.audio.map(a => `/audio-uploads/${a}`)     // Updated this line
        };
      });
      res.send(audiosWithUrls);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error." });
    });
}
