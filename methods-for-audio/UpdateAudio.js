const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const AudioSchema = require("../model/audio");


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

const uploadToS3 = async (file, fileType) => {
  try {
    const fileContent = await fs.readFile(file.path);
    const params = {
      Bucket: 'audio-uploads',
      Key: `${uuidv4()}.${fileType}`,
      Body: fileContent,
      ACL: 'public-read',
    };
    const uploadedData = await s3.upload(params).promise();
    console.log('Uploaded to S3:', uploadedData.Location);
    return uploadedData.Location;
  } catch (error) {
    console.error(`Error uploading file ${file.originalname} to S3:`, error);
    throw error;
  }
};

module.exports = async function updateAudio(req, res) {
  const audioId = req.params.id; // Assuming you have audio ID in the request parameters
  const { firstname, lastname } = req.body;
  const smallaudioFile = req.files['smallaudio'] ? req.files['smallaudio'][0] : null;
  const imageFile = req.files['image'] ? req.files['image'][0] : null;

  if (!firstname || !lastname) {
    return res.status(400).json({ error: 'Missing required fields for updating the audio entry.' });
  }

  try {
    let updatedFields = {
      firstname,
      lastname,
    };

    if (smallaudioFile) {
      const smallaudioURL = await uploadToS3(smallaudioFile, 'mp3');
      updatedFields.smallaudio = smallaudioURL;
    }

    if (imageFile) {
      const imageURL = await uploadToS3(imageFile, 'png');
      updatedFields.image = imageURL;
    }

    const updatedAudio = await AudioSchema.findByIdAndUpdate(audioId, updatedFields, { new: true });

    if (!updatedAudio) {
      return res.status(404).json({ error: 'Audio not found.' });
    }

    res.status(200).json(updatedAudio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
  }
};