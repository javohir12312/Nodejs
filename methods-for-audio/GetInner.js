const AudioSchema = require("../model/audio");

module.exports =GetInner = async function (req, res) {
  const mainAudioId = req.params.id; // Extracting main audio ID from request parameters
  const innerAudioId = req.params.id2; // Extracting inner audio ID from request parameters

  try {
    // Fetch the main audio document by its ID
    const mainAudioDocument = await AudioSchema.findById(mainAudioId);

    // Check if main audio document exists
    if (!mainAudioDocument) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    // Find the inner audio entry by its ID within the audios array
    const innerAudioEntry = mainAudioDocument.audios.find(audio => audio.id === innerAudioId);

    // Check if inner audio entry exists
    if (!innerAudioEntry) {
      return res.status(404).json({ error: 'Inner Audio entry not found.' });
    }

    // If inner audio entry exists, send it in the response
    res.status(200).json(innerAudioEntry);

  } catch (error) {
    console.error(error);

    // Handle error
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};
