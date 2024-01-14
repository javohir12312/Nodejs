const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const getAllBlogs = require("../methods/GetAll");
const getLinkyId = require("../links-methods/GetByid")
const deleteLinkById = require("../links-methods/delteLink")
const updateLinkById = require("../links-methods/Update")
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
const  updateLogo  = require("../logoApi/UpdateLogo");
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
const updateOneLink = require("../methods-for-audio/UpdataOneLink");
const CreateLink = require("../links-methods/CreateLink");
const GetAllLinks = require("../links-methods/GetAllLinks");



const getAllBlogsRussian = require(".././FOR_RUSSIAN_APIS/methods/GetAll");
const getLinkyIdRussian = require(".././FOR_RUSSIAN_APIS/links-methods/GetByid")
const deleteLinkByIdRussian = require(".././FOR_RUSSIAN_APIS/links-methods/delteLink")
const updateLinkByIdRussian = require(".././FOR_RUSSIAN_APIS/links-methods/Update")
const getBlogByIdRussian = require(".././FOR_RUSSIAN_APIS/methods/GetById");
const createBlogRussian = require(".././FOR_RUSSIAN_APIS/methods/CreateBlog");
const deleteBlogRussian = require(".././FOR_RUSSIAN_APIS/methods/Delete");
const updateBlogRussian = require(".././FOR_RUSSIAN_APIS/methods/UpdateBlog");
const CreateForAudioRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/CreateForAudio");
const getAllAudioRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/getAllAudio");
const UpdateAudioRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/UpdateAudio");
const AudiodeleteRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/Audiodelete");
const getBlogByIdAudiosRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/getBlogByIdAudios");
const getLogoRussian = require(".././FOR_RUSSIAN_APIS/logoApi/getLogo");
const createLogoRussian = require(".././FOR_RUSSIAN_APIS/logoApi/createLogo");
const DeleteLogoRussian = require(".././FOR_RUSSIAN_APIS/logoApi/DeleteLogo");
const  updateLogoRussian  = require(".././FOR_RUSSIAN_APIS/logoApi/UpdateLogo");
const CreateByIdRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/CreateById");
const updateOneAudioRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/updateOneAudio");
const delteInnerRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/DeleteInner");
const GetInnerRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/GetInner");
const createPhoneRussian = require('.././FOR_RUSSIAN_APIS/phone-number-method/createPhoneNumber');
const getAllRussian = require(".././FOR_RUSSIAN_APIS/phone-number-method/GetAllNumber")
const getPhoneByIdRussian = require(".././FOR_RUSSIAN_APIS/phone-number-method/GetByid")
const updatePhoneByIdRussian = require(".././FOR_RUSSIAN_APIS/phone-number-method/Update")
const deletePhoneByIdRussian = require(".././FOR_RUSSIAN_APIS/phone-number-method/deletePhone");
const updateOneLinkRussian = require(".././FOR_RUSSIAN_APIS/methods-for-audio/UpdataOneLink");
const CreateLinkRussian = require(".././FOR_RUSSIAN_APIS/links-methods/CreateLink");
const GetAllLinksRussian = require(".././FOR_RUSSIAN_APIS/links-methods/GetAllLinks");


const PORT = process.env.PORT || 5001;
const url = "mongodb+srv://abduxalilovjavohir393:1984god123@cluster0.uifiguj.mongodb.net/?retryWrites=true&w=majority";
// Connect to MongoDB
const app = express();
deleteAllFilesFromUploadsFolder()
async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000,
      
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
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "video-uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "video-" + uniqueSuffix + path.extname(file.originalname));
  },
});


const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 100000000 } });
const uploadImage = multer({ storage });
const uploadLogo = multer({ storage: LogoStorage });
const uploadSmallAudio = multer({ storage: audioStorage, limits: { fileSize: 100000000 } });
const uploadAudio = multer({ storage: audioStorage, limits: { fileSize: 100000000 } });



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
app.post("/api/audios", 
uploadSmallAudio.fields([{ name: 'smallaudio' }, { name: 'image' },{ name: 'video' }]),
CreateForAudio
);
app.put("/api/audios/:id", uploadAudio.fields([{ name: 'smallaudio' }, { name: 'image' },{ name: 'video' }]), UpdateAudio);
app.put("/api/audios/:id/:id2", uploadAudio.fields([{ name: 'audio' }]), updateOneAudio);
app.put("/api/audios/:id/:id2/:id3",updateOneLink);
app.delete("/api/audios/:id", Audiodelete);
app.delete("/api/audios/:id/:id2", delteInner);

// Logo
app.get("/api/logo", getLogo);
app.post("/api/logo", uploadLogo.fields([{ name: 'dark' },{ name: 'light' }]), createLogo);
app.delete("/api/logo/:id", DeleteLogo);
app.put("/api/logo/:id", uploadLogo.fields([{ name: 'dark' },{ name: 'light' }]), updateLogo);

// Number
app.post('/api/phone-number', createPhone);
app.get('/api/phone-number', getAll);
app.get('/api/phone-number/:id', getPhoneById);
app.put('/api/phone-number/:id', updatePhoneById);
app.delete('/api/phone-number/:id', deletePhoneById);

// Links
app.post('/api/links', CreateLink);
app.get('/api/links', GetAllLinks);
app.get('/api/links/:id', getLinkyId);
app.put('/api/links/:id', updateLinkById);
app.delete('/api/links/:id', deleteLinkById);



//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// Russian

// Routes
app.get("/api/ru/hero", getAllBlogsRussian);
app.get("/api/ru/hero/:id", getBlogByIdRussian);
app.post("/api/ru/hero", uploadImage.single("image"), createBlogRussian);
app.delete("/api/ru/hero/:id", deleteBlogRussian);
app.put("/api/ru/hero/:id", uploadImage.single("image"), updateBlogRussian);



app.get("/api/ru/audios", getAllAudioRussian);
app.get("/api/ru/audios/:id", getBlogByIdAudiosRussian);
app.get("/api/ru/audios/:id/:id2", GetInnerRussian);
app.post("/api/ru/audios/:id", uploadAudio.fields([{ name: 'audio' }]), CreateByIdRussian);
app.post("/api/ru/audios", 
uploadSmallAudio.fields([{ name: 'smallaudio' }, { name: 'image' },{ name: 'video' }]),
CreateForAudioRussian
);
app.put("/api/ru/audios/:id", uploadAudio.fields([{ name: 'smallaudio' }, { name: 'image' },{ name: 'video' }]), UpdateAudioRussian);
app.put("/api/ru/audios/:id/:id2", uploadAudio.fields([{ name: 'audio' }]), updateOneAudioRussian);
app.put("/api/ru/audios/:id/:id2/:id3",updateOneLinkRussian);
app.delete("/api/ru/audios/:id", AudiodeleteRussian);
app.delete("/api/ru/audios/:id/:id2", delteInnerRussian);

// Logo
app.get("/api/ru/logo", getLogoRussian);
app.post("/api/ru/logo", uploadLogo.fields([{ name: 'dark' },{ name: 'light' }]), createLogoRussian);
app.delete("/api/ru/logo/:id", DeleteLogoRussian);
app.put("/api/ru/logo/:id", uploadLogo.fields([{ name: 'dark' },{ name: 'light' }]), updateLogoRussian);

// Number
app.post('/api/ru/phone-number', createPhoneRussian);
app.get('/api/ru/phone-number', getAllRussian);
app.get('/api/ru/phone-number/:id', getPhoneByIdRussian);
app.put('/api/ru/phone-number/:id', updatePhoneByIdRussian);
app.delete('/api/ru/phone-number/:id', deletePhoneByIdRussian);

// Links
app.post('/api/ru/links', CreateLinkRussian);
app.get('/api/ru/links', GetAllLinksRussian);
app.get('/api/ru/links/:id', getLinkyIdRussian);
app.put('/api/ru/links/:id', updateLinkByIdRussian);
app.delete('/api/ru/links/:id', deleteLinkByIdRussian);
// Static file serving
app.use("/uploads", express.static("uploads"));
app.use("/uploads-logo", express.static("uploads-logo"));
app.use("/audio-uploads", express.static("audio-uploads"));

// Request logging middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

// Handle SIGINT signalxop 
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});


