const fs = require('fs');
const Blog = require("../model/model");

module.exports = async function createBlog(req, res) {
  const { uz, ru } = req.body;
  const image = req.file ? req.file.path : null;
  
  const uzData = JSON.parse(uz)
  const ruData = JSON.parse(ru)

  if (!ruData.title || !ruData.description || !image || !ruData.title || !ruData.description ) {
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
      uz:uzda
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
