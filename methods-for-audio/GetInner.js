const AudioSchema = require("../model/audio");

const GetInner = async (req, res) => {
  const { id, id2 } = req.params;

  try {
    const blog = await AudioSchema.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    const audioEntry = blog.audios.find(audio => audio.id === id2);

    if (!audioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    res.status(200).json(audioEntry);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    return res.status(500).json({ error: 'Internal Server Error. Failed to fetch the audio entry.' });
  }
};

module.exports = GetInner;
