const Blog = require("../model/model");

module.exports = function createBlog(req, res) {
  const { title, description } = req.body;
  const image = req.file.filename;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "Missing required fields for creating a new blog post." });
  }

  const newBlog = new Blog({
    title,
    description,
    image,
  });

  newBlog.save()
    .then((createdBlog) => {
      const blogWithUrl = {
        ...createdBlog._doc,
        image: `/uploads/${createdBlog.image}`,
      };

      res.status(201).json(blogWithUrl);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
}