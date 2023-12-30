const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const AudioSchema = require("../model/audio");

module.exports = async function createAudio(req, res) {
  const { title, description } = req.body;
  const audioFile = req.files && req.files['audio'] ? `/audio-uploads/${req.files['audio'][0].filename}` : null;
  const blogId = req.params.id;

  if (!title || !description || !audioFile) {
    return res.status(400).json({ error: "Missing required fields for creating a new audio entry." });
  }

  try {
    // Find the blog post by ID
    const blog = await AudioSchema.findById(blogId);
  
    if (!blog) {
      return res.status(404).json({ error: "Blog post not found." });
    }

    // Generate a unique ID for the audio entry
    const audioId = uuidv4();
    
    // Create a new audio entry associated with the found blog post
    const newAudioEntry = {
      id: audioId,
      title: title,
      description: description,
      audio: audioFile
    };

    // Push the new audio entry into the 'audios' array of the blog post
    blog.audios.push(newAudioEntry);

    // Log the updated blog before saving to ensure 'id' is set correctly
    console.log("Updated Blog with Audio Entry:", blog);

    // Save the updated blog post (with the new audio entry)
    const updatedBlog = await blog.save();
  
    // Check if the updatedBlog exists and return it
    if (updatedBlog) {
      res.status(201).json(updatedBlog);
    } else {
      throw new Error("Failed to save the audio entry.");
    }
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid blog ID format." });
    }
    res.status(500).json({ error: "Internal Server Error." });
  }
};
