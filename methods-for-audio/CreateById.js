const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const AudioSchema = require("../model/audio");
const fs = require('fs');
const path = require('path');

module.exports = async function createInnerAudio(req, res) {
  const { title, description } = req.body;
  const audioFilePath = req.files && req.files['audio'] ? req.files['audio'][0].path : null;
  const mainAudioId = req.params.id; // ID of the main audio document

  if (!title || !description || !audioFilePath) {
    return res.status(400).json({ error: "Missing required fields for creating a new inner audio entry." });
  }

  try {
    // Find the main audio document by ID
    const mainAudio = await AudioSchema.findById(mainAudioId);
  
    if (!mainAudio) {
      return res.status(404).json({ error: "Main Audio document not found." });
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

    // Read audio file to buffer
    const audioBuffer = readFileToBuffer(audioFilePath);

    if (!audioBuffer) {
      return res.status(500).json({ error: "Failed to read audio file data." });
    }
    
    // Generate a unique ID for the inner audio entry
    const innerAudioId = uuidv4();
    
    // Create a new inner audio entry
    const newInnerAudioEntry = {
      id: innerAudioId,
      title: title,
      description: description,
      audio: audioBuffer
    };

    // Push the new inner audio entry into the 'audios' array of the main audio document
    mainAudio.audios.push(newInnerAudioEntry);

    // Save the updated main audio document (with the new inner audio entry)
    const updatedMainAudio = await mainAudio.save();
  
    // Check if the updatedMainAudio exists and return it
    if (updatedMainAudio) {
      res.status(201).json(updatedMainAudio);
    } else {
      throw new Error("Failed to save the inner audio entry.");
    }
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid main audio ID format." });
    }
    res.status(500).json({ error: "Internal Server Error." });
  }
};
