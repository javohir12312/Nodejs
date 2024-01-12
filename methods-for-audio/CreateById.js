const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const AudioSchema = require("../model/audio");
const { v4: uuidv4 } = require('uuid');

// AWS Configuration
const secretAccessKey = "qtuZR0ViIx3P8oI1LcjLhWoclWnvqH+Gs1T1tf6Hp9U";
const accessKeyId = "DO00RZZQCCEHPQH448HK";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-app-javohir.blr1.digitaloceanspaces.com'),
  s3ForcePathStyle: true,

});

const s3 = new AWS.S3();
const uploadToS3 = async (file) => {
  try {
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
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

module.exports = async function CreateById(req, res) {
  const audioFile = req.file;
  console.log("salom");
  if (!audioFile) {
    return res.status(400).json({ error: 'Missing required audio file.' });
  }

  try {
    const audioUrl = await uploadToS3(audioFile);
    const { links } = JSON.parse(req.body.links);
    const { title, description } = req.body;
    const mainAudioId = req.params.id;

    if (!title || !description) {
      return res.status(400).json({ error: 'Missing required fields for creating a new inner audio entry.' });
    }

    const mainAudio = await AudioSchema.findById(mainAudioId);

    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    const newLinks = links.map(link => ({
      id: uuidv4(),
      title: link.title,
      link: {
        path: link.path
      }
    }));

    const innerAudioId = uuidv4();

    const newInnerAudioEntry = {
      id: innerAudioId,
      title: title,
      description: description,
      audio: audioUrl,
      links: newLinks 
    };

    mainAudio.audios.push(newInnerAudioEntry);

    const updatedMainAudio = await mainAudio.save();

    if (updatedMainAudio) {
      res.status(201).json(updatedMainAudio);
    } else {
      throw new Error('Failed to save the inner audio entry.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};