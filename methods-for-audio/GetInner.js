const fs = require('fs');
const path = require('path');
const AudioSchema = require("../model/audio");

module.exports = async function getInnerAudio(req, res) {
  const { id } = req.params;
  const uploadDir = path.join(__dirname, '..', 'audio-uploads');

  try {
    const blog = await AudioSchema.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const audioFiles = []; // Initialize array for audio files
    const writeFilePromises = [];

    for (const audioItem of blog.audios) {
      if (audioItem.audio && audioItem.audio.buffer) {
        const audioFileName = `audio-${audioItem._id}.mp3`;
        const fullPath = path.join(uploadDir, audioFileName);

        if (!fs.existsSync(fullPath)) {
          const audioBufferData = arrayBufferToBuffer(audioItem.audio.buffer);
          const writeFilePromise = fs.promises.writeFile(fullPath, audioBufferData, 'binary');
          writeFilePromises.push(writeFilePromise);
          
        }

        audioFiles.push({
          id: audioItem.id,
          title: audioItem.title,
          description: audioItem.description,
          audio: `/audio-uploads/${audioFileName}`
        });
      }
    }

    // Wait for all file writing operations to complete
    await Promise.all(writeFilePromises);

    return res.status(200).json({
      description: blog.description,
      title: blog.title,
      audios: audioFiles,
      __v: blog.__v
    });

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    return res.status(500).json({ error: 'Internal Server Error. Failed to fetch the audio entry.' });
  }
};

// Function to convert ArrayBuffer to Buffer
function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}
