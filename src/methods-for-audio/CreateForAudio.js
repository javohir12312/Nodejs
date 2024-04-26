const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const MainSchema = require("../model/audio");  // Assuming you've renamed your model to "Main"

const secretAccessKey = "ERYtbsgstP5l+haWAVuAjz4KUovCsy4/DNh2gyIbgps";
const accessKeyId = "DO00DZBEXD7BD4463RWE";

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: 'us-east-1',
  endpoint: new AWS.Endpoint('https://javohir.sfo3.digitaloceanspaces.com'),
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

module.exports = async function CreateForAudio(req, res) {
  try {
    const { ru, uz } = req.body;
    const Rudata = JSON.parse(ru);
    const Uzdata = JSON.parse(uz);

    const ruSmallaudioFile = req.files['ru_smallaudio'][0];
    const ruImageFile = req.files['ru_image'][0];
    const ruVideoFile = req.files['ru_video'][0];

    if (!Rudata || !Uzdata || !ruSmallaudioFile || !ruImageFile || !ruVideoFile) {
      return res.status(400).json({ error: 'Missing required fields for creating a new audio entry.' });
    }

    const [ruSmallaudioURL, ruImageURL, ruVideoURL] = await Promise.all([
      uploadToS3(ruSmallaudioFile, 'mp3'),
      uploadToS3(ruImageFile, 'png'),
      uploadToS3(ruVideoFile, 'mp4'),
    ]);

    const newAudioEntry = new MainSchema({
      id: uuidv4(),
      ru: { ...Rudata, smallaudio: ruSmallaudioURL, image: ruImageURL, video: ruVideoURL, audios: [] },
      uz: { ...Uzdata, smallaudio: ruSmallaudioURL, image: ruImageURL, video: ruVideoURL, audios: [] },
    });

    const createdAudio = await newAudioEntry.save();
    res.status(201).json(createdAudio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
  }
};
