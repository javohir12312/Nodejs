const AWS = require('aws-sdk');
const path = require('path');
const AudioSchema = require("../model/audio");

module.exports = async function getAllAudio(req, res) {
  try {
    const audios = await AudioSchema.find({}, '_id firstname lastname smallaudio image audios description video instagram');
    
    if (!audios || audios.length === 0) {
      return res.status(404).json({ error: "Audio data not found." });
    }
      
    const audioWithUrls = audios.map(audiox => {
      const extractFileName = (url) => {
        const parts = url.split('/');
        return parts.pop() || parts.pop();
      };

      const data = audiox.audios.map(item=>{
       return {
        id: item.id,
        title: item.title,
        audio:"https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(item.audio),
        description: item.description,
        waveformData: item.waveformData,
       }
      })

      return {
        _id: audiox._id,
        firstname: audiox.firstname,
        lastname: audiox.lastname,
        description: audiox.description,
        smallaudio: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(audiox.smallaudio),
        image: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(audiox.image),
        video: "https://audio-app-javohir.blr1.digitaloceanspaces.com/audio-uploads/"+extractFileName(audiox.video),
        instagram: audiox.instagram,
        audios: data
      };
    });

    res.status(200).json(audioWithUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
