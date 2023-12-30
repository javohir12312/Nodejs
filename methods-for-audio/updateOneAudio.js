const AudioSchema = require("../model/audio");

const updateOneAudio = async (req, res) => {
  const { id, id2 } = req.params;
  const { title, description } = req.body;
  const audio = req.files['audio'] ? `/audio-uploads/${req.files['audio'][0].filename}` : null;

  console.log(id, id2);

  try {
    const blog = await AudioSchema.findById(id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // Find the audio entry within the blog's audios array
    const audioEntry = blog.audios.find(audio => audio.id === id2);
    
    if (!audioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    if (title) audioEntry.title = title;
    if (description) audioEntry.description = description;
    if (audio) audioEntry.audio = audio;

    // Save the updated blog
    const updatedBlog = await blog.save();

    if (updatedBlog) {
      return res.status(200).json(updatedBlog);
    } else {
      throw new Error('Failed to update audio entry.');
    }

  } catch (error) {
    console.error(error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

// Export the updateOneAudio function to be used in your routes
module.exports = updateOneAudio;
