const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const Main = require("../model/audio"); // Use the Main model
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

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

const UpdateById = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { mainId, nestedId } = req.params;

    if (!title || !description) {
      return res.status(400).json({ error: 'Missing required fields for updating the nested audio entry.' });
    }

    const mainAudio = await Main.findById(mainId);

    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    // Find the nested audio entry within the 'ru' or 'uz' array
    const nestedAudio = mainAudio.ru.find(element => element.audios.some(audio => audio.id === nestedId))
      || mainAudio.uz.find(element => element.audios.some(audio => audio.id === nestedId));

    if (!nestedAudio) {
      return res.status(404).json({ error: 'Nested Audio entry not found.' });
    }

    // Update the nested audio entry
    nestedAudio.audios.forEach(audio => {
      if (audio.id === nestedId) {
        audio.title = title;
        audio.description = description;
      }
    });

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