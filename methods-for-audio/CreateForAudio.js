const AWS = require('aws-sdk');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const MainSchema = require("../model/audio");  // Assuming you've renamed your model to "Main"

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

module.exports = async function CreateForAudio(req, res) {
    // Extract ru and uz directly from req.body
    const { ru, uz } = req.body;

    console.log(req.body);
  const Rudata = JSON.parse(ru)
  const Uzdata = JSON.parse(uz)

    const ruSmallaudioFile = req.files['ru_smallaudio'] ? req.files['ru_smallaudio'][0] : null;
    const ruImageFile = req.files['ru_image'] ? req.files['ru_image'][0] : null;
    const ruVideoFile = req.files['ru_video'] ? req.files['ru_video'][0] : null;

    const uzSmallaudioFile = req.files['uz_smallaudio'] ? req.files['uz_smallaudio'][0] : null;
    const uzImageFile = req.files['uz_image'] ? req.files['uz_image'][0] : null;
    const uzVideoFile = req.files['uz_video'] ? req.files['uz_video'][0] : null;

    // Check if required fields are present
    if (
      !Rudata ||
      !Rudata.firstname ||
      !Rudata.lastname ||
      !Rudata.description ||
      !Uzdata ||
      !Uzdata.firstname ||
      !Uzdata.lastname ||
      !Uzdata.description ||
      !ruSmallaudioFile ||
      !ruImageFile ||
      !ruVideoFile ||
      !uzSmallaudioFile ||
      !uzImageFile ||
      !uzVideoFile
    ) {
      console.log('Missing required fields for creating a new audio entry.');
      return res.status(400).json({
        error: 'Missing required fields for creating a new audio entry.',
      });
    }
  try {
    const [ruSmallaudioURL, ruImageURL, ruVideoURL, uzSmallaudioURL, uzImageURL, uzVideoURL] = await Promise.all([
      uploadToS3(ruSmallaudioFile, 'mp3'),
      uploadToS3(ruImageFile, 'png'),
      uploadToS3(ruVideoFile, 'mp4'),
      uploadToS3(uzSmallaudioFile, 'mp3'),
      uploadToS3(uzImageFile, 'png'),
      uploadToS3(uzVideoFile, 'mp4')
    ]);

    const newAudioEntry = new MainSchema({
      id: uuidv4(),
      ru: {
        ...Rudata,
        smallaudio: ruSmallaudioURL,
        image: ruImageURL,
        video: ruVideoURL,
        audios:[]
      },
      uz: {
        ...Uzdata,
        smallaudio: uzSmallaudioURL,
        image: uzImageURL,
        video: uzVideoURL,
        audios:[]
      },
    });

    const createdAudio = await newAudioEntry.save();
    res.status(201).json(createdAudio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
  }
};
