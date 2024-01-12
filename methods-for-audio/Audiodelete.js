const AudioSchema = require("../model/audio");

module.exports = async function deleteAudio(req, res) {
  const { id } = req.params; 

  try {
    const deletedAudioEntry = await AudioSchema.findByIdAndDelete(id);
    if (!deletedAudioEntry) {
      return res.status(404).json({ error: 'Audio entry not found.' });
    }

    res.status(200).json({ message: 'Audio entry successfully deleted.', deletedAudioEntry });

  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio entry ID format.' });
    }
    res.status(500).json({ error: 'Internal Server Error. Failed to delete the audio entry.' });
  }
};
