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
const getLogo = require("../logoApi/getLogo");
const createLogo = require("../logoApi/createLogo");
const DeleteLogo = require("../logoApi/DeleteLogo");
const { updateLogo } = require("../logoApi/UpdateLogo");
const CreateById = require("../methods-for-audio/CreateById");
const updateOneAudio = require("../methods-for-audio/updateOneAudio");
const delteInner = require("../methods-for-audio/DeleteInner");
const GetInner = require("../methods-for-audio/GetInner");
const createPhone = require('../phone-number-method/createPhoneNumber');
const getAll = require("../phone-number-method/GetAllNumber")
const getPhoneById = require("../phone-number-method/GetByid")
const updatePhoneById = require("../phone-number-method/Update")
const deletePhoneById = require("../phone-number-method/deletePhone");
const deleteAllFilesFromUploadsFolder = require("./helpers");
const app = express();
const PORT = process.env.PORT || 5001;
const url = "mongodb+srv://abduxalilovjavohir393:1984god123@cluster0.uifiguj.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
deleteAllFilesFromUploadsFolder()
async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connect();

// Multer configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const LogoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads-logo/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "audio-uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "audio-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadImage = multer({ storage });
const uploadLogo = multer({ storage: LogoStorage });
const uploadSmallAudio = multer({ storage: audioStorage, limits: { fileSize: 100000000 } });
const uploadAudio = multer({ storage: audioStorage, limits: { fileSize: 100000000 } });


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/hero", getAllBlogs);
app.get("/api/hero/:id", getBlogById);
app.post("/api/hero", uploadImage.single("image"), createBlog);
app.delete("/api/hero/:id", deleteBlog);
app.put("/api/hero/:id", uploadImage.single("image"), updateBlog);

app.get("/api/audios", getAllAudio);
app.get("/api/audios/:id", getBlogByIdAudios);
app.get("/api/audios/:id/:id2", GetInner);
app.post("/api/audios/:id", uploadAudio.fields([{ name: 'audio' }]), CreateById);
app.post("/api/audios", uploadSmallAudio.fields([{ name: 'smallaudio' }, { name: 'image' }]), CreateForAudio);
app.put("/api/audios/:id", uploadAudio.fields([{ name: 'smallaudio' }, { name: 'image' }]), UpdateAudio);
app.put("/api/audios/:id/:id2", uploadAudio.fields([{ name: 'audio' }]), updateOneAudio);
app.delete("/api/audios/:id", Audiodelete);delteInner
app.delete("/api/audios/:id/:id2", delteInner);

// Logo
app.get("/api/logo", getLogo);
app.post("/api/logo", uploadLogo.fields([{ name: 'image' }]), createLogo);
app.delete("/api/logo/:id", DeleteLogo);
app.put("/api/logo/:id", uploadLogo.fields([{ name: 'image' }]), updateLogo);

// Number
app.post('/api/phone-number', createPhone);
app.get('/api/phone-number', getAll);
app.get('/api/phone-number/:id', getPhoneById);
app.put('/api/phone-number/:id', updatePhoneById);
app.delete('/api/phone-number/:id', deletePhoneById);

// Static file serving
app.use("/uploads", express.static("uploads"));
app.use("/uploads-logo", express.static("uploads-logo"));
app.use("/audio-uploads", express.static("audio-uploads"));

// Request logging middleware
app.use((req, res, next) => {
  console.log("Received request with fields:", req.body);
  next();
});

// Start the server
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

// // Function for creating audio
// const AudioSchema = require("../model/audio");
// module.exports = function createAudio(req, res) {
  
// };
