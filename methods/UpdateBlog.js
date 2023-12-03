const Blog = require("../model/model")

module.exports =  function updateBlog(req, res) {
  const blogId = req.params.id;
  const { title, description, image } = req.body;

  if (!title && !description && !image) {
    return res.status(400).json({ error: "No data provided for update." });
  }

  const updateObject = {};
  if (title) updateObject.title = title;
  if (description) updateObject.description = description;
  if (image) updateObject.image = image;

  // Update the blog post in the database
  Blog.findByIdAndUpdate(blogId, updateObject, { new: true })
    .then((updatedBlog) => {
      if (!updatedBlog) {
        return res.status(404).json({ error: "Blog post not found." });
      }
      res.json(updatedBlog);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
}