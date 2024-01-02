const fs = require('fs');
const path = require('path');
const AudioSchema = require("../model/audio");

// Function to convert ArrayBuffer to Buffer
function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = async function getInnerAudio(req, res) {
  const { id, id2 } = req.params;
  const uploadDir = path.join(__dirname, '..', 'audio-uploads');

  try {
    const blog = await AudioSchema.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    let audioFiles = []; // Initialize array for audio files

    if (blog.audios && blog.audios.length > 0) {
      blog.audios.forEach((audioItem, index) => {
        let audioFileName = "";
        if (audioItem.audio && audioItem.audio.buffer) {
          audioFileName = `audio-${blog._id}-${index}.mp3`;
          const audioBufferData = arrayBufferToBuffer(audioItem.audio.buffer);
          const fullPath = path.join(uploadDir, audioFileName);

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          try {
            fs.writeFileSync(fullPath, audioBufferData, 'binary');
          } catch (error) {
            console.error(`Error writing audio for blog ${blog._id} at index ${index}: ${error.message}`);
          }

          audioFiles.push({
            id: audioItem.id,
            title: audioItem.title,
            description: audioItem.description,
            audio: `/audio-uploads/${audioFileName}`
          });
        }
      });
    }

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
