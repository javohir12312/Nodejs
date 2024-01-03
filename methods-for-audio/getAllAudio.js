const fs = require('fs').promises; // Use promises-based fs module
const path = require('path');
const AudioSchema = require("../model/audio");

function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = async function getAllAudio(req, res) {
  try {
    const audios = await AudioSchema.find();
    const uploadDir = path.join(__dirname, '..', 'audio-uploads');
    
    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const audiosWithUrls = await Promise.all(audios.map(async (sound) => {
      let smallAudioPath = `smallaudio-${sound._id}.mp3`;
      let fullPath = path.join(uploadDir, smallAudioPath);

      try {
        // Check if the file exists by attempting to access it
        await fs.access(fullPath);
      } catch (error) {
        if (sound.smallaudio && sound.smallaudio.buffer) {
          const smallAudioBufferData = arrayBufferToBuffer(sound.smallaudio.buffer);
          await fs.writeFile(fullPath, smallAudioBufferData); // Using asynchronous writeFile
        }
      }

      let audioFiles = [];
      sound.audios.forEach(async (audioItem, index) => {
        let audioFileName = `smallaudio-${audioItem.id}-${index}.mp3`;
        const fullPath = path.join(uploadDir, audioFileName);
        
        try {
          await fs.access(fullPath);
        } catch (error) {
          if (audioItem.audio && audioItem.audio.buffer) {
            const audioBufferData = arrayBufferToBuffer(audioItem.audio.buffer);
            await fs.writeFile(fullPath, audioBufferData); // Using asynchronous writeFile
          }
        }

        audioFiles.push({
          id: audioItem.id,
          title: audioItem.title,
          description: audioItem.description,
          audio: `/audio-uploads/${audioFileName}`
        });
      });

      let image = `image-${sound._id}.png`;
      let fullPathimage = path.join(uploadDir, image);

      try {
        await fs.access(fullPathimage);
      } catch (error) {
        if (sound.image && sound.image.buffer) {
          const imageBufferData = arrayBufferToBuffer(sound.image.buffer);
          await fs.writeFile(fullPathimage, imageBufferData); // Using asynchronous writeFile
        }
      }

      return {
        ...sound._doc,
        _id: sound._id,
        firstname: sound.firstname,
        lastname: sound.lastname,
        image: `/audio-uploads/${image}`,
        smallaudio: `/audio-uploads/${smallAudioPath}`,
        audios: audioFiles,
        __v: sound.__v
      };
    }));

    res.send(audiosWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
