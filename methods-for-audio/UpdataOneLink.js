const { v4: uuidv4 } = require('uuid');
const AudioSchema = require("../model/audio");

module.exports = async function updateLinksById(req, res) {
  const { id, id2 } = req.params;
  const { links } = req.body;

  if (!id || !id2 || !links) {
    return res.status(400).json({ error: 'Missing required parameters or body.' });
  }

  try {
    // Find the main audio document by ID
    const mainAudio = await AudioSchema.findById(id);
    
    if (!mainAudio) {
      return res.status(404).json({ error: 'Main Audio document not found.' });
    }

    // Find the nested audio document by ID within the main audio document
    const nestedAudio = mainAudio.audios.find(audio => audio.id === id2);
    
    if (!nestedAudio) {
      return res.status(404).json({ error: 'Nested Audio document not found.' });
    }

    // Update the links array of the specific nested audio document
    nestedAudio.links = links.map(link => ({
      id: link.id || uuidv4(), // Generate a new ID if not provided
      title: link.title,
      link: link.link
    }));

    // Save the changes to the main audio document
    const updatedMainAudio = await mainAudio.save();

    if (updatedMainAudio) {
      res.status(200).json(updatedMainAudio);
    } else {
      throw new Error('Failed to update links for the nested audio entry.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};
