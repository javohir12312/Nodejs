const fs = require('fs');
const Blog = require("../../model-for-russian/model");

module.exports = async function createBlogRussion(req, res) {
  const { title, description } = req.body;
  const image = req.file ? req.file.path : null;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "Missing required fields for creating a new blog post." });
  }

  try {
    const existingBlog = await Blog.findOne();

    if (existingBlog) {
      return res.status(400).json({ error: "A blog post already exists. Cannot create another one." });
    }

    const readFileToBuffer = (filePath) => {
      try {
        return fs.readFileSync(filePath);
      } catch (error) {
        console.error(`Error reading file from path ${filePath}:`, error);
        return null;
      }
    };

    const imageBuffer = readFileToBuffer(image);

    const newBlog = new Blog({
      title,
      description,
      image: imageBuffer,
    });

    const createdBlog = await newBlog.save();

    const blogWithUrl = {
      ...createdBlog._doc,
      image: `/uploads/${createdBlog.image}`,  // Assuming the image path is saved as a string
    };

    res.status(201).json(blogWithUrl);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};
