const MainSchema = require("../model/audio");

const getById = async (req, res) => {
  const audioId = req.params.id;

  try {
    const audioDocument = await MainSchema.findById(audioId);

    if (!audioDocument) {
      return res.status(404).json({ error: 'Audio document not found.' });
    }

    // Assuming you want to extract data for a specific language (ru or uz)
    const extractLanguageData = (languageData) => {
      const extractFileName = (url) => {
        const parts = url.split('/');
        return parts.pop() || parts.pop();
      };

      return {
        _id: languageData._id,
        firstname: languageData.firstname,
        lastname: languageData.lastname,
        description: languageData.description,
        smallaudio: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(languageData.smallaudio),
        image: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(languageData.image),
        video: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(languageData.video),
        instagram: languageData.instagram,
        audios: languageData.audios.map(item => ({
          id: item.id,
          title: item.title,
          audio: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/" + extractFileName(item.audio),
          description: item.description,
        })),
      };
    };

    const eldata = {
      id: audioDocument.id,
      ru: audioDocument.ru.map(extractLanguageData),
      uz: audioDocument.uz.map(extractLanguageData),
    };

    res.status(200).json(eldata);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};

module.exports = getById;
