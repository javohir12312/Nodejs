const AudioSchema = require("../model/audio");

module.exports = function getAllAudios(req, res) {
  AudioSchema.find()
    .then((result) => {
      const blogsWithUrls = result.map(blog => {
        return {
          ...blog._doc,
          image: `/audio-uploads/${blog.image}`,
          audio: `/audio-uploads/${blog.audio}`,
        };
      });
      res.send(blogsWithUrls);
    })
    .catch((err) => {
      console.log(err);
    });
}
