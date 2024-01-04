const path = require('path');
const fs = require('fs').promises;
const AudioSchema = require("../model/audio");

function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = async function getAllAudios(req, res) {
  try {
    const blogId = req.params.id;
    const result = await AudioSchema.findById(blogId);
    
    if (!result) {
      return res.status(404).json({ error: "Audio entry not found." });
    }

    const uploadDir = path.join(__dirname, '..', 'audio-uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const processedAudios = await Promise.all(result.audios.map(async (audioItem, index) => {
      const audioFileName = `smallaudio-${audioItem.id}-${index}.mp3`;
      const fullPath = path.join(uploadDir, audioFileName);

      try {
        await fs.access(fullPath);
      } catch (error) {
        if (audioItem.audio && audioItem.audio.buffer) {
          const audioBufferData = arrayBufferToBuffer(audioItem.audio.buffer);
          await fs.writeFile(fullPath, audioBufferData);
        }
      }

      return {
        id: audioItem.id,
        title: audioItem.title,
        description: audioItem.description,
        audio: `/audio-uploads/${audioFileName}`
      };
    }));

    const processedResult = {
      _id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
      image: `/audio-uploads/image-${result._id}.png`,
      smallaudio: `/audio-uploads/smallaudio-${result._id}.mp3`,
      audios: processedAudios,
      __v: result.__v
    };

    res.send(processedResult);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
