const AudioSchema = require("../model/audio");

const delteInner = async (req, res) => {
  const { id, id2 } = req.params; // Extracting the IDs from the request parameters

  try {
    // Find the blog post by its ID
    const blog = await AudioSchema.findById(id);

    // If blog doesn't exist, return 404 error
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // Find the index of the audio entry within the blog's audios array
    const audioIndex = blog.audios.findIndex(audio => audio.id === id2);

    // If audio entry doesn't exist, return 404 error
    if (audioIndex === -1) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    // Remove the audio entry from the blog's audios array
    blog.audios.splice(audioIndex, 1);

    // Save the updated blog
    const updatedBlog = await blog.save();

    // Return the updated blog in the response
    res.status(200).json(updatedBlog);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }

    return res.status(500).json({ error: 'Internal Server Error. Failed to delete the audio entry.' });
  }
};

// Export the deleteOneAudio function to be used in your routes
module.exports = delteInner;
