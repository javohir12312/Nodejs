const AudioSchema = require("../model/audio");


module.exports = function createAudio(req, res) {
  const { title, number } = req.body;
  const audios = req.files['audio'];
  const image = req.files['image'];

if (!image || image.length === 0) {
  return res.status(400).json({ error: "No images uploaded for the 'image' field." });
}

const firstImage = image[0];

  if (!title || !number || !audios || !image) {
    return res.status(400).json({ error: "Missing required fields for creating a new blog post." });
  }

  const audioPaths = audios.map(audio => `/audio-uploads/${audio.filename}`);

  const newBlog = new AudioSchema({
    title,
    number,
    audios: audioPaths,
    image: `${firstImage.path}`,
  });

  console.log(image+"xaxaxaxaxaxaxaxaxaxaxaxaxax");
  console.log(image);
  


  newBlog.save()
    .then((createdAudio) => {
      const blogWithUrls = {
        ...createdAudio._doc,
        audios: createdAudio.audios.map(audio => `audio-uploads/${audio}`),
        image: `/audio-uploads/${createdAudio.image}`,
      };

      res.status(201).json(blogWithUrls);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
};