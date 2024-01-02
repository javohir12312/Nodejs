const fs = require('fs');
const AudioSchema = require("../model/audio");

const updateOneAudio = async (req, res) => {
  const { id, id2 } = req.params;
  const { title, description } = req.body;
  const audioPath = req.files && req.files['audio'] ? req.files['audio'][0].path : null;

  console.log(id, id2);

  try {
    // Find the blog post by ID
    const blog = await AudioSchema.findById(id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // Function to read file and return as Buffer
    const readFileToBuffer = (filePath) => {
      try {
        return fs.readFileSync(filePath);
      } catch (error) {
        console.error(`Error reading file from path ${filePath}:`, error);
        return null;
      }
    };

    // Find the audio entry within the blog's audios array
    const audioEntry = blog.audios.find(audio => audio.id === id2);
    const audioBuffer = audioPath ? readFileToBuffer(audioPath) : null;
    
    if (!audioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    // Update fields if provided
    if (title) audioEntry.title = title;
    if (description) audioEntry.description = description;
    if (audioPath && audioBuffer) {
      // Assuming audioEntry.audio can store a buffer type in your schema
      audioEntry.audio = audioBuffer;
    }

    // Save the updated blog
    const updatedBlog = await blog.save();

    if (updatedBlog) {
      return res.status(200).json(updatedBlog);
    } else {
      throw new Error('Failed to update audio entry.');
    }

  } catch (error) {
    console.error(error);

    // Handle specific error cases
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format.' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

// Export the updateOneAudio function to be used in your routes
module.exports = updateOneAudio;
