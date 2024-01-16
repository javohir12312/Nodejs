const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const Main = require("../model/audio");
const path = require('path');


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

const deleteFromS3 = async (url) => {
  const key = path.basename(url);
  const params = {
    Bucket: 'audio-uploads',
    Key: key
  };
  await s3.deleteObject(params).promise();
};

const UpdateById = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id, id2 } = req.params;

    if (!title || !description) {
      return res.status(400).json({ error: 'Missing required fields for updating the nested audio entry.' });
    }

    const mainAudio = await Main.findById(id).maxTimeMS(20000); // Set the timeout to 20 seconds


    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    // Find the nested audio entry within the 'ru' array
    const nestedAudioRu = mainAudio.ru.reduce((acc, curr) => acc.concat(curr.audios), [])
      .find(audio => audio.id === id2);

    // Find the nested audio entry within the 'uz' array
    const nestedAudioUz = mainAudio.uz.reduce((acc, curr) => acc.concat(curr.audios), [])
      .find(audio => audio.id === id2);

    if (nestedAudioRu) {
      // Upload the new audio file to S3
      await deleteFromS3(nestedAudioRu.audio);
      const newAudioUrl = await uploadToS3(req.files['audio'][0]);

      // Update the nested audio entry in 'ru'
      nestedAudioRu.title = title;
      nestedAudioRu.description = description;
      nestedAudioRu.audio = newAudioUrl;
    }

    if (nestedAudioUz) {
      // Upload the new audio file to S3
      const newAudioUrl = await uploadToS3(req.files['audio'][0]);

      // Update the nested audio entry in 'uz'
      nestedAudioUz.title = title;
      nestedAudioUz.description = description;
      nestedAudioUz.audio = newAudioUrl;
    }

    // Save the updated main audio document
    const updatedMainAudio = await mainAudio.save();

    if (updatedMainAudio) {
      // Successful response
      res.status(200).json({ message: 'Nested audio entry updated successfully', data: updatedMainAudio });
    } else {
      throw new Error('Failed to update the nested audio entry.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};



module.exports = UpdateById;
