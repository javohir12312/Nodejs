const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const getAllBlogs = require("../methods/GetAll");
const getBlogById = require("../methods/GetById");
const createBlog = require("../methods/CreateBlog");
const deleteBlog = require("../methods/Delete");
const updateBlog = require("../methods/UpdateBlog");
const Audios = require("../model/audio");

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
    console.error(error);
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

app.get("/api/hero", getAllBlogs);
app.get("/api/hero/:id", getBlogById);
app.post("/api/hero", upload.single("image"), createBlog);
app.delete("/api/hero/:id", deleteBlog);
app.put("/api/hero/:id", updateBlog);

connect();

// Check if the model already exists before defining it
const Audio = mongoose.models.Audio || mongoose.model("Audio", Audios);

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "audio-uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, "audio-" + uniqueSuffix + fileExtension);
  },
});

const uploadAudio = multer({ storage: audioStorage });

app.post("/api/upload/audio", uploadAudio.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    const { title, number } = req.body;
    const image = req.file.buffer;

    const newAudio = new Audio({ title, number, image, audio: req.file.buffer });
    await newAudio.save();

    res.status(201).json({ message: "Audio file uploaded and saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
