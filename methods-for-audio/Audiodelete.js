const AudioSchema = require("../model/audio");

module.exports = async function deleteAudio(req, res) {
  const { id } = req.params; // Extracting the ID from the request parameters

  try {
    // Find the audio entry by its ID and remove it
    const deletedAudioEntry = await AudioSchema.findByIdAndDelete(id);

    // If audio entry doesn't exist, return 404 error
    if (!deletedAudioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    // Return a success message along with the deleted audio entry details
    res.status(200).json({ message: 'Audio entry successfully deleted.', deletedAudioEntry });

  } catch (error) {
    console.error(error);
    // Handle different types of errors (e.g., ObjectID error)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio entry ID format.' });
    }
    // Return a generic 500 Internal Server Error if any other error occurs
    res.status(500).json({ error: 'Internal Server Error. Failed to delete the audio entry.' });
  }
};
