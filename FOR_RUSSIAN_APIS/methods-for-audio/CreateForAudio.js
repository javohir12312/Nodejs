  const AWS = require('aws-sdk');
  const fs = require('fs').promises;
  const path = require('path');
  const AudioSchema = require("../../model-for-russian/audio");
  const { v4: uuidv4 } = require('uuid')

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

module.exports = async function createAudioRussion(req, res) {
    const { firstname, lastname, description ,instagram} = req.body;
    const smallaudioFile = req.files['smallaudio'] ? req.files['smallaudio'][0] : null;
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    const videoFile = req.files['video'] ? req.files['video'][0] : null;

    if (!firstname || !lastname || !smallaudioFile || !imageFile || !videoFile || !description||!instagram) {
        return res.status(400).json({ error: 'Missing required fields for creating a new audio entry.' });
    }

    try {
        const [smallaudioURL, imageURL, videoURL] = await Promise.all([
            uploadToS3(smallaudioFile, 'mp3'),
            uploadToS3(imageFile, 'png'),
            uploadToS3(videoFile, 'mp4')
        ]);
        console.log(instagram);
        const newAudioEntry = new AudioSchema({
            firstname,
            lastname,
            description,
            smallaudio: smallaudioURL,
            image: imageURL,
            video: videoURL,
            instagram:instagram,
            audios: []
        });

        const createdAudio = await newAudioEntry.save();
        res.status(201).json(createdAudio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the request.', detailedError: error.message });
    }
};