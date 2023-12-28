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
const CreateForAudio = require("../methods-for-audio/CreateForAudio");
const getAllAudio = require("../methods-for-audio/getAllAudio");
const UpdateAudio = require("../methods-for-audio/UpdateAudio");
const Audiodelete = require("../methods-for-audio/Audiodelete");
const getBlogByIdAudios = require("../methods-for-audio/getBlogByIdAudios");

const app = express();
const PORT = process.env.PORT || 5001;
const url ="mongodb+srv://abduxalilovjavohir393:1984god123@cluster0.uifiguj.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const storageAudio = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "audio-uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "audio-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadImage = multer({ storage });
const uploadAudio = multer({
  storage: storageAudio,
  limits: { fileSize: 100000000 },
});

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes

// Hero
app.get("/api/hero", getAllBlogs);
app.get("/api/hero/:id", getBlogById);
app.post("/api/hero", uploadImage.single("image"), createBlog);
app.delete("/api/hero/:id", deleteBlog);
app.put("/api/hero/:id", uploadImage.single("image"), updateBlog);


// Audios
app.get("/api/audios", getAllAudio);
app.get("/api/audios/:id", getBlogByIdAudios);
app.post("/api/audios", uploadAudio.fields([{ name: 'audios' }, { name: 'audio' }, { name: 'image' }]), CreateForAudio);
app.put("/api/audios/:id", uploadAudio.fields([{ name: 'audios' }, { name: 'audio' }, { name: 'image' }]), UpdateAudio);
app.delete("/api/audios/:id", Audiodelete)

// Serve static files
app.use("/uploads", express.static("uploads"));
app.use("/audio-uploads", express.static("audio-uploads"));

// Request logging middleware
app.use((req, res, next) => {
  console.log("Received request with fields:", req.body);
  next();
});

// Connect to MongoDB and start server
connect();
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

// Handle SIGINT signal
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});
