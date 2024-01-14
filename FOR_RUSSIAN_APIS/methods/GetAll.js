const  path  = require("path");
const  fs  = require("fs");
const Blog = require("../../model-for-russian/model");

function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

module.exports = function getAllBlogsRussion(req, res) {
  Blog.find()
    .then((result) => {
      const blogsWithUrls = result.map(blog => {
        const uploadDir = path.join(__dirname, '../../', 'uploads');

        let image= ""
        
        if (blog.image && blog.image.buffer) {
          image = `image-${blog._id}.png`;
          const imageBufferData = arrayBufferToBuffer(blog.image.buffer);
          const fullPath = path.join(uploadDir, image);
          try {
            fs.writeFileSync(fullPath, imageBufferData, 'binary');
          } catch (error) {
            console.error(`Error writing image for audio ${blog._id}: ${error.message}`);
          }
        }

        return {
          ...blog._doc,
          image: `/uploads/${image}`,
        };
      });

      res.send(blogsWithUrls);
    })
    .catch((err) => {
      console.log(err);
    });
}

