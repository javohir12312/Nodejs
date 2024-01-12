const AudioSchema = require("../model/audio");

module.exports = getBlogByIdAudios = async function (req, res) {
  const audioId = req.params.id; 

  try {
    const audioDocument = await AudioSchema.findById(audioId);

    if (!audioDocument) {
      return res.status(404).json({ error: 'Audio document not found.' });
    }

    res.status(200).json(audioDocument);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};
