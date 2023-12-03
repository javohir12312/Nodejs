const Blog = require("../model/model");

app.post('/createAudio', upload.single('audioFile'), async (req, res) => {
  try {
    // Faylni yuklab olingan buffer ma'lumotlarni olish
    const audioBuffer = req.file.buffer;

    // Yangi audio obyektini yaratish
    const newAudio = new Blog({
      title: req.body.title,
      audioData: audioBuffer,
      number :req.body.numer,
      image: req.body.image
    });

    // MongoDB'ga saqlash
    await newAudio.save();

    res.status(201).send('Audio saved successfully');
  } catch (error) {
    console.error('Error saving audio:', error);
    res.status(500).send('Internal Server Error');
  }
});