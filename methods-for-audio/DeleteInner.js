const AudioSchema = require("../model/audio");

const delteInner = async (req, res) => {
  const { id, id2 } = req.params; 

  try {
    const blog = await AudioSchema.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    const audioIndex = blog.audios.findIndex(audio => audio.id === id2);

    if (audioIndex === -1) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    blog.audios.splice(audioIndex, 1);

    const updatedBlog = await blog.save();

    res.status(200).json(updatedBlog);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }(404).json({ error: 'Audio entry not found.' });

    return res.status(500).json({ error: 'Internal Server Error. Failed to delete the audio entry.' });
  }
};

module.exports = delteInner;
