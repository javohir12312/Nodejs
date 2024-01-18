const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const MainSchema = require("../model/audio");

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

module.exports = async function UpdateAudioEntry(req, res) {
  const { id } = req.params;

  try {
    const existingAudioEntry = await MainSchema.findById(id).maxTimeMS(30000);

    if (!existingAudioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    const { ru, uz } = req.body;

    const Rudata = JSON.parse(ru);
    const Uzdata = JSON.parse(uz);

    // Check if required fields are present
    if (
      !Rudata ||
      !Rudata.firstname ||
      !Rudata.lastname ||
      !Rudata.description ||
      !Uzdata ||
      !Uzdata.firstname ||
      !Uzdata.lastname ||
      !Uzdata.description
    ) {
      console.log('Missing required fields for updating the audio entry.');
      return res.status(400).json({
        error: 'Missing required fields for updating the audio entry.',
      });
    }

    const [ruSmallaudioURL, ruImageURL, ruVideoURL, uzSmallaudioURL, uzImageURL, uzVideoURL] = await Promise.all([
      uploadToS3(req.files['ru_smallaudio'][0], 'mp3'),
      uploadToS3(req.files['ru_image'][0], 'png'),
      uploadToS3(req.files['ru_video'][0], 'mp4'),
      uploadToS3(req.files['uz_smallaudio'][0], 'mp3'),
      uploadToS3(req.files['uz_image'][0], 'png'),
      uploadToS3(req.files['uz_video'][0], 'mp4')
    ]);

    // Update only the required fields
    existingAudioEntry.ru = {
      ...Rudata,
      smallaudio: ruSmallaudioURL,
      image: ruImageURL,
      video: ruVideoURL,
    };

    existingAudioEntry.uz = {
      ...Uzdata,
      smallaudio: uzSmallaudioURL,
      image: uzImageURL,
      video: uzVideoURL,
    };

    const updatedAudioEntry = await existingAudioEntry.save();

    res.status(200).json(updatedAudioEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
  }
};
