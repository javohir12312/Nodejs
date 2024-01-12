const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const AudioSchema = require("../model/audio");
const path = require('path');

// AWS Configuration
AWS.config.update({
  accessKeyId: "DO00RZZQCCEHPQH448HK",
  secretAccessKey: "qtuZR0ViIx3P8oI1LcjLhWoclWnvqH+Gs1T1tf6Hp9U",
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-app-javohir.blr1.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();

const uploadToS3 = async (file) => {
  const fileContent = await fs.readFile(file.path);
  const params = {
    Bucket: 'audio-uploads',
    Key: `${uuidv4()}.mp3`,
    Body: fileContent,
    ACL: 'public-read',
  };
  const uploadedData = await s3.upload(params).promise();
  console.log('Uploaded to S3:', uploadedData.Location);
  return uploadedData.Location;
};

module.exports = async function updateOneAudio(req, res) {
  const { title, description } = req.body;
  const { id, id2 } = req.params;
  const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

    // const links  = JSON.parse(req.body.links);

  if (!title || !description || !audioFile) {
    return res.status(400).json({ error: 'Missing required fields for updating the inner audio entry.' });
  }

  try {
    const audioUrl = await uploadToS3(audioFile);
    const mainAudio = await AudioSchema.findById(id);

    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }
// //  const newLinks = links.map(link => ({
    //   id: uuidv4(),
    //   title: link.title,
    //   link: link.link
    // }));
    const innerAudioIndex = mainAudio.audios.findIndex(audio => audio.id === id2);

    if (innerAudioIndex === -1) {
      return res.status(404).json({ error: 'Inner Audio entry not found.' });
    }

    if (mainAudio.audios[innerAudioIndex].audio) {
      await deleteFromS3(mainAudio.audios[innerAudioIndex].audio);
    }

    mainAudio.audios[innerAudioIndex] = {
      id: id2,
      title,
      description,
      audio: audioUrl,
      // // links: newLinks 
    };

    const updatedMainAudio = await mainAudio.save();
    
    res.status(200).json(updatedMainAudio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};

const deleteFromS3 = async (url) => {
  const key = path.basename(url);
  const params = {
    Bucket: 'audio-uploads',
    Key: key
  };
  await s3.deleteObject(params).promise();
};
