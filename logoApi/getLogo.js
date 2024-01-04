const pathModule = require("path"); // Renamed to pathModule to avoid conflict with later usage
const fs = require("fs");
const Logo = require("../model/logo");

function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = function getAllBlogs(req, res) {
  Logo.find()
    .then((result) => {
      const blogsWithUrls = result.map(blog => {

        const uploadDir = pathModule.join(__dirname, '..', 'uploads-logo');

        let image = "";
        const imagePath = pathModule.join(uploadDir, `image-${blog._id}.mp3`); // Renamed path to imagePath
        if (!fs.existsSync(imagePath)) {
          if (blog.image && blog.image.buffer) {
            image = `image-${blog._id}.png`;
            const imageBufferData = arrayBufferToBuffer(blog.image.buffer);
            const fullPath = pathModule.join(uploadDir, image);
            try {
              fs.writeFileSync(fullPath, imageBufferData, 'binary');
            } catch (error) {
              image = `smallaudio-${blog._id}.mp3`;
              console.error(`Error writing image for audio ${blog._id}: ${error.message}`);
            }
          }
        }
        return {
          ...blog._doc,
          image: `/uploads-logo/${image}`,
        };
      });

      res.send(blogsWithUrls);
    })
    .catch((err) => {
      console.log(err);
    });
};
