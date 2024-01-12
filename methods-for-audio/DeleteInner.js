const AWS = require('aws-sdk');
const path = require('path'); 
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

const delteInner = async (req, res) => {
  const { id, id2 } = req.params;

  try {
    const blog = await AudioSchema.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    const audioEntry = blog.audios.find(audio => audio.id === id2);

    if (!audioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    if (audioEntry.audio) {
      await deleteFromS3(audioEntry.audio);
    }

    blog.audios = blog.audios.filter(audio => audio.id !== id2);

    const updatedBlog = await blog.save();

    res.status(200).json(updatedBlog);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error. Failed to delete the audio entry.' });
  }
};

module.exports = delteInner;

const deleteFromS3 = async (url) => {
  const key = path.basename(url); 
  console.log(key);
  const params = {
    Bucket: 'audio-uploads',
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`Deleted file from S3: ${url}`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${url}`, error);
    throw error;
  }
};
