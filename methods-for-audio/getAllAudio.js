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

module.exports = function getAllAudio(req, res) {
  AudioSchema.find()
    .then((audios) => {
      const audiosWithUrls = audios.map((sound) => {
        const uploadDir = path.join(__dirname, '..', 'audio-uploads');
        
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        let smallAudioPath = "";
        let image = "";

        if (sound.smallaudio && sound.smallaudio.buffer) {
          smallAudioPath = `smallaudio-${sound._id}.mp3`;
          const smallAudioBufferData = arrayBufferToBuffer(sound.smallaudio.buffer);
          const fullPath = path.join(uploadDir, smallAudioPath);
          try {
            fs.writeFileSync(fullPath, smallAudioBufferData, 'binary');
          } catch (error) {
            console.error(`Error writing smallaudio for audio ${sound._id}: ${error.message}`);
          }
        }

        let audioFiles = []; // Initialize the array to store audio files

        // Process each audio entry in the 'audios' array
        sound.audios.forEach((audioItem, index) => {
          let audioFileName = ""; // Initialize for each audio item
          if (audioItem.audio && audioItem.audio.buffer) {
            audioFileName = `smallaudio-${sound._id}-${index}.mp3`;
            const audioBufferData = arrayBufferToBuffer(audioItem.audio.buffer);
            const fullPath = path.join(uploadDir, audioFileName);
            try {
              fs.writeFileSync(fullPath, audioBufferData, 'binary');
            } catch (error) {
              console.error(`Error writing audio for audio ${sound._id} at index ${index}: ${error.message}`);
            }
          }

          audioFiles.push({
            id: audioItem.id,
            title: audioItem.title,
            description: audioItem.description,
            audio: `/audio-uploads/${audioFileName}` // Use the variable here
          });
        });

        if (sound.image && sound.image.buffer) {
          image = `image-${sound._id}.png`;
          const imageBufferData = arrayBufferToBuffer(sound.image.buffer);
          const fullPath = path.join(uploadDir, image);
          try {
            fs.writeFileSync(fullPath, imageBufferData, 'binary');
          } catch (error) {
            console.error(`Error writing image for audio ${sound._id}: ${error.message}`);
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
      });

      res.send(audiosWithUrls);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error." });
    });
};
