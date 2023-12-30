const AudioSchema = require("../model/audio");

module.exports = async function updateAudio(req, res) {
  const { id } = req.params; // Extracting the ID from the request parameters
  const { firstname, lastname } = req.body;
  const smallaudioFile = req.files['smallaudio'] ? `${req.files['smallaudio'][0].filename}` : null;
  const imageFile = req.files['image'] ? `${req.files['image'][0].filename}` : null;

  try {
    // Find the audio entry by its ID
    const audioEntry = await AudioSchema.findById(id);

    // If audio entry doesn't exist, return 404 error
    if (!audioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    // Update the audio entry fields if provided in the request body
    if (firstname) audioEntry.firstname = firstname;
    if (lastname) audioEntry.lastname = lastname;
    if (smallaudioFile) audioEntry.smallaudio = smallaudioFile;
    if (imageFile) audioEntry.image = imageFile;

    // Save the updated audio entry
    const updatedAudioEntry = await audioEntry.save();

    // Return the updated audio entry in the response
    res.status(200).json(updatedAudioEntry);
  } catch (error) {
    console.error(error);
    // Handle different types of errors (e.g., ObjectID error)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio entry ID format.' });
    }
    // Return a generic 500 Internal Server Error if any other error occurs
    res.status(500).json({ error: 'Internal Server Error. Failed to update the audio entry.' });
  }
};
