const AudioSchema = require("../../model-for-russian/audio");

module.exports = getBlogByIdAudiosRussion = async function (req, res) {
  const audioId = req.params.id; 

  try {
    const audioDocument = await AudioSchema.findById(audioId);

    if (!audioDocument) {
      return res.status(404).json({ error: 'Audio document not found.' });
    }

      const extractFileName = (url) => {
        const parts = url.split('/');
        return parts.pop() || parts.pop();
      };

      const data = audioDocument.audios.map(item=>{
       return {
        id: item.id,
        title: item.title,
        audio:"https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(item.audio),
        description: item.description,
       }
      })

      const eldata =  {
        _id: audioDocument._id,
        firstname: audioDocument.firstname,
        lastname: audioDocument.lastname,
        description: audioDocument.description,
        smallaudio: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(audioDocument.smallaudio),
        image: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(audioDocument.image),
        video: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(audioDocument.video),
        instagram: audioDocument.instagram,
        audios: data
      };
    

    res.status(200).json(eldata);

  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid audio ID format.' });
    }

    res.status(500).json({ error: 'Internal Server Error.', detailedError: error.message });
  }
};
