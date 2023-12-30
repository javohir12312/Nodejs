const AudioSchema = require("../model/audio");

module.exports = function getAllAudios(req, res) {
  const blogId = req.params.id;
  console.log(blogId);
  
  AudioSchema.findById(blogId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Audio entry not found." });
      }

      const audiosWithUrls = {
        ...result._doc,
        image: `/audio-uploads/${result.image}`,
      };

      res.send(audiosWithUrls);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error." });
    });
}
