const AudioSchema = require("../model/audio");

module.exports = function getAllAudios(req, res) {
  AudioSchema.find()
    .then((result) => {
      const audiosWithUrls = result.map(audio => {
        return {
          ...audio._doc,
          image: `/audio-uploads/${audio.image}`, // Assuming the image is stored in the "uploads" directory
          smallaudio: `/audio-uploads/${audio.smallaudio}`, // Updated this line for smallaudio
          audios: audio.audios.map(a => ({
            id:a.id,
            title: a.title,
            description: a.description,
            audio: `${a.audio}`
          })) // Updated this line to map the nested audios correctly
        };
      });
      res.send(audiosWithUrls);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error." });
    });
}
