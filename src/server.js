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

const app = express();
const PORT = process.env.PORT || 5001;
const url = process.env.MONGODB_URI || "mongodb+srv://abduxalilovjavohir393:1984god123@cluster0.uifiguj.mongodb.net/?retryWrites=true&w=majority";

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
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, "image-" + uniqueSuffix + fileExtension);
  },
});

const storageAudio = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "audio-uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, "audio-" + uniqueSuffix + fileExtension);
  },
});

const uploadImage = multer({ storage: storage });
const uploadAudio = multer({
  storage: storageAudio,
  limits: {
    fileSize: 50 * 1024 * 1024 , 
  },
});

app.use(cors());
app.use(express.json());

app.get("/api/hero", getAllBlogs);
app.get("/api/audios", getAllAudio);
// app.get("/api/audios/:id", getAllAudioById);
app.get("/api/hero/:id", getBlogById) 

app.post("/api/hero", uploadImage.single("image"), createBlog);

app.post("/api/audios", uploadAudio.fields([{ name: 'audio' }, { name: 'image' }]), CreateForAudio);
app.put("/api/audios/:id", );
app.put("/api/audios/:id", (req, res) => {
  console.log("PUT request received:", req.params.id);
  uploadAudio.fields([{ name: 'audio' }, { name: 'image' }]), UpdateAudio
});
app.delete("/api/hero/:id", deleteBlog);
app.put("/api/hero/:id", uploadImage.single("image"), updateBlog);


connect();

app.use("/uploads", express.static("uploads"));
app.use("/audio-uploads", express.static("audio-uploads"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
