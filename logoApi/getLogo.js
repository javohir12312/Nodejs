const path  = require("path");
const  fs  = require("fs");
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

        const uploadDir = path.join(__dirname, '..', 'uploads-logo');

        let image = ""
        const path =  path.join(uploadDir, `smallaudio-${sound._id}.mp3`)
        if(!fs.existsSync(path)){
          if (blog.image && blog.image.buffer) {
            image = `image-${blog._id}.png`;
            const imageBufferData = arrayBufferToBuffer(blog.image.buffer);
            const fullPath = path.join(uploadDir, image);
            try {
              fs.writeFileSync(fullPath, imageBufferData, 'binary');
            } catch (error) {
              image = `smallaudio-${sound._id}.mp3`
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
}

