module.exports = async function getAllAudio(req, res) {
  try {
    const audios = await AudioSchema.find();
    const audiosWithUrls = [];

    for (const sound of audios) {
      const uploadDir = path.join(__dirname, '..', 'audio-uploads');
      // Create directory if it doesn't exist
      try {
        await fs.mkdir(uploadDir, { recursive: true });
      } catch (mkdirError) {
        if (mkdirError.code !== 'EEXIST') {
          console.error(`Error creating directory: ${mkdirError.message}`);
        }
      }

      const smallAudioPath = await processSoundFile(sound, uploadDir, 'smallaudio', sound._id);
      const image = await processSoundFile(sound, uploadDir, 'image', sound._id);

      const audioFiles = sound.audios.map((audioItem, index) => {
        const audioFileName = `smallaudio-${audioItem.id}-${index}.mp3`;
        return {
          id: audioItem.id,
          title: audioItem.title,
          description: audioItem.description,
          audio: `/audio-uploads/${audioFileName}`
        };
      });

      audiosWithUrls.push({
        ...sound._doc,
        _id: sound._id,
        firstname: sound.firstname,
        lastname: sound.lastname,
        image: image ? `/audio-uploads/image-${sound._id}.png` : null,
        smallaudio: smallAudioPath ? `/audio-uploads/smallaudio-${sound._id}.mp3` : null,
        audios: audioFiles,
        __v: sound.__v
      });
    }

    res.send(audiosWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
