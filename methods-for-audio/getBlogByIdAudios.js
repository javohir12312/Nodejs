const AudioSchema = require("../model/audio");

module.exports = getBlogByIdAudios = async function (req, res) {
  const audioId = req.params.id; // Extracting audio ID from request parameters

  try {
    // Fetch the audio document by its ID
    const audioDocument = await AudioSchema.findById(audioId);

    // Check if audio document exists
    if (!audioDocument) {
      return res.status(404).json({ error: 'Audio document not found.' });
    }

    // If audio document exists, send it in the response
    res.status(200).json(audioDocument);

  } catch (error) {
    console.error(error);

    // Handle error
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};
