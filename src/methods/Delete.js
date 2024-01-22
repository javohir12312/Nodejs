const fs = require('fs').promises; // Using fs.promises for async file deletion
const Blog = require("../model/model");

module.exports = async function deleteBlog(req, res) {
  try {
    const blogId = req.params.id; // Assuming the blog ID is passed as a route parameter

    // Check if the blog with the given ID exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the image file from the filesystem
    const imagePath = existingBlog.uz.image; // Assuming the image path is stored in the 'uz' language field
    await fs.unlink(`.${imagePath}`); // Adjust the path accordingly

    // Delete the blog entry from the database
    await existingBlog.deleteOne(); // Use deleteOne instead of remove
    
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
