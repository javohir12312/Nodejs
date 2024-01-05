const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const AudioSchema = require("../model/audio");

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
    // Check if file exists at the specified path
    const exists = await fs.access(file.path).then(() => true).catch(() => false);
    if (!exists) {
      throw new Error('File not found at the specified path.');
    }

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

module.exports = async function updateOneAudio(req, res) {
  const { title, description } = req.body;
  const { id, id2 } = req.params; // Extract both id and id2
  const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

  if (!title || !description || !audioFile) {
    return res.status(400).json({ error: 'Missing required fields for updating the inner audio entry.' });
  }
console.log(id,id2);
  try {
    const audioUrl = await uploadToS3(audioFile);

    const mainAudio = await AudioSchema.findById(id); // Use id for mainAudio

    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    const innerAudioIndex = mainAudio.audios.findIndex(audio => audio.id === id2);

    if (innerAudioIndex === -1) {
      return res.status(404).json({ error: 'Inner Audio entry not found.' });
    }

    mainAudio.audios[innerAudioIndex] = {
      id: id2,
      title: title,
      description: description,
      audio: audioUrl,
    };

    const updatedMainAudio = await mainAudio.save();

    if (updatedMainAudio) {
      res.status(200).json(updatedMainAudio);
    } else {
      throw new Error('Failed to update the inner audio entry.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};