const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
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
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error + "sadaaaaaaaaaaaaaaaaa");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, "image-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

app.get("/api/hero", (req, res) => {
  Blog.find()
    .then((result) => {
      const blogsWithUrls = result.map(blog => {
        return {
          ...blog._doc,
          image: `/uploads/${blog.image}`,
        };
      });

      res.send(blogsWithUrls);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/hero/:id", (req, res) => {
  const blogId = req.params.id;

  Blog.findById(blogId)
    .then((result) => {
      const blogWithUrl = {
        ...result._doc,
        image: `/uploads/${result.image}`,
      };

      res.send(blogWithUrl);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/hero", upload.single("image"), (req, res) => {
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
});

app.delete("/api/hero/:id", (req, res) => {
  const blogId = req.params.id;

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

connect();

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
