const AWS = require('aws-sdk');
const fs = require('fs').promises;
const Main = require("../model/audio");

AWS.config.update({
  accessKeyId: "DO00RZZQCCEHPQH448HK",
  secretAccessKey: "qtuZR0ViIx3P8oI1LcjLhWoclWnvqH+Gs1T1tf6Hp9U",
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://audio-app-javohir.blr1.digitaloceanspaces.com'),
  s3ForcePathStyle: true,
});

const s3 = new AWS.S3();

const deleteFromS3 = async (url) => {
  const key = url.split('/').pop(); // Extract the key from the URL
  const params = {
    Bucket: 'audio-uploads',
    Key: key
  };
  await s3.deleteObject(params).promise();
};

const DeleteAudioById = async (req, res) => {
  try {
    const { id, id2 } = req.params;

    const mainAudio = await Main.findById(id);

    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    // Find the nested audio entry within the 'ru' array
    const nestedAudioRuIndex = mainAudio.ru.reduce((acc, curr) => acc.concat(curr.audios), [])
      .findIndex(audio => audio.id === id2);

    // Find the nested audio entry within the 'uz' array
    const nestedAudioUzIndex = mainAudio.uz.reduce((acc, curr) => acc.concat(curr.audios), [])
      .findIndex(audio => audio.id === id2);

    if (nestedAudioRuIndex !== -1) {
      // Delete the audio file from S3
      await deleteFromS3(mainAudio.ru[0].audios[nestedAudioRuIndex].audio);

      // Remove the nested audio entry from 'ru'
      mainAudio.ru[0].audios.splice(nestedAudioRuIndex, 1);
    }

    if (nestedAudioUzIndex !== -1) {
      // Delete the audio file from S3
      await deleteFromS3(mainAudio.uz[0].audios[nestedAudioUzIndex].audio);

      // Remove the nested audio entry from 'uz'
      mainAudio.uz[0].audios.splice(nestedAudioUzIndex, 1);
    }

    // Save the updated main audio document
    const updatedMainAudio = await mainAudio.save();

    if (updatedMainAudio) {
      // Successful response
      res.status(200).json({ message: 'Nested audio entry deleted successfully', data: updatedMainAudio });
    } else {
      throw new Error('Failed to delete the nested audio entry.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};

module.exports = DeleteAudioById;
