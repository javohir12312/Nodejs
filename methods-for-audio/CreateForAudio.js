const AudioSchema = require("../model/audio");

module.exports = function createAudio(req, res) {
  const { title, number } = req.body;
  const audios = req.files['audio'];
  const images = req.files['image'];

  if (!title || !number || !audios || !images || images.length === 0) {
    return res.status(400).json({ error: "Missing required fields for creating a new blog post." });
  }

  const audioPaths = audios.map(audio => `/${audio.filename}`);
  const firstImage = images[0];

  const newBlog = new AudioSchema({
    title,
    number,
    audios: audioPaths,
    image: `${firstImage.filename}`, // Assuming filename is the correct property
  });

  // console.log("Image Path:", `/audi/${firstImage.filename}`);
  console.log("Image Object:", firstImage);

  newBlog.save()
    .then((createdAudio) => {
      const blogWithUrls = {
        ...createdAudio._doc,
        audios: createdAudio.audios.map(audio => `${audio}`),
        image: `${createdAudio.image}`,
      };

      res.status(201).json(blogWithUrls);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to save the audio entry." });
    });
};
