const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Blog = require("../model/model");

const app = express();
const PORT = process.env.PORT || 5001;
const url = "mongodb+srv://abduxalilovjavohir393:1984god123@cluster0.uifiguj.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error);
  }
}

app.use(cors());
app.use(express.json()); // Use built-in Express JSON middleware



app.get("/api/hero", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/hero/:id", (req, res) => {
  const blogId = req.params.id;

  Blog.findById(blogId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});


app.put("/api/hero/:id", (req, res) => {
  const blogId = req.params.id;
  const { title, description, image } = req.body;

  // Check if at least one field is provided in the request body
  if (!title && !description && !image) {
    return res.status(400).json({ error: "No data provided for update." });
  }

  // Construct the update object with provided fields
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
});


app.post("/api/hero", (req, res) => {
  const { title, description, image } = req.body;

  // Check if all required fields are provided in the request body
  if (!title || !description || !image) {
    return res.status(400).json({ error: "Missing required fields for creating a new blog post." });
  }

  // Create a new blog post
  const newBlog = new Blog({
    title,
    description,
    image,
  });

  // Save the new blog post to the database
  newBlog.save()
    .then((createdBlog) => {
      res.status(201).json(createdBlog);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
});


app.delete("/api/hero/:id", (req, res) => {
  const blogId = req.params.id;

  // Delete the blog post from the database by its ID
  Blog.findByIdAndDelete(blogId)
    .then((deletedBlog) => {
      if (!deletedBlog) {
        return res.status(404).json({ error: "Blog post not found." });
      }
      res.json({ message: "Blog post deleted successfully." });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
});

connect();

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
