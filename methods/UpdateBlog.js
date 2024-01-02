const fs = require('fs');
const Blog = require("../model/model");

module.exports = async function updateBlog(req, res) {
  const blogId = req.params.id;
  const { title, description } = req.body;
  const image = req.file ? req.file.path : null;

  // Check for no data provided for update
  if (!title && !description && !image) {
    return res.status(400).json({ error: "No data provided for update." });
  }

  try {
    const blogToUpdate = await Blog.findById(blogId);

    if (!blogToUpdate) {
      return res.status(404).json({ error: "Blog post not found." });
    }

    const updateObject = {};

    if (title) updateObject.title = title;
    if (description) updateObject.description = description;
    if (image) {
      const imageBuffer = fs.readFileSync(image); // Read the image file into a buffer
      updateObject.image = imageBuffer;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateObject, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ error: "Failed to update blog post." });
    }

    const blogWithUrl = {
      ...updatedBlog._doc,
      image: `/uploads/${updatedBlog.image}`, // Assuming the image path is saved as a string
    };

    res.json(blogWithUrl);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};
