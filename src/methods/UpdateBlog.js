const fs = require('fs').promises; // Using fs.promises for async file operations
const Blog = require("../model/model");

module.exports = async function updateBlog(req, res) {
  try {
    const blogId = req.params.id; // Assuming the blog ID is passed as a route parameter
    const { ru, uz } = req.body;
    const imagePath = req.file ? req.file.path : null; // Check if a new image is provided

    // Check if the blog with the given ID exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the old image file from the filesystem if a new image is provided
    if (imagePath && existingBlog.uz.image) {
      await fs.unlink(`.${existingBlog.uz.image}`);
    }

    // Update the blog entry in the database
    existingBlog.ru = { ...existingBlog.ru, ...JSON.parse(ru) };
    existingBlog.uz = { ...existingBlog.uz, ...JSON.parse(uz) };
    if (imagePath) {
      existingBlog.uz.image = `/${imagePath}`;
      existingBlog.ru.image = `/${imagePath}`;
    }

    await existingBlog.save();

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
