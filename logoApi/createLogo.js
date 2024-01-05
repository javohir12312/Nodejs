const Logo = require("../model/logo");
const fs = require("fs");

module.exports = function createLogo(req, res) {
  const { title } = req.body;
  const image = req.files && req.files.image ? req.files.image[0].path : undefined;

  console.log("Received request with fields:", req.files);

  const existingBlog = Logo.findOne();

  if (existingBlog) {
    return res.status(400).json({ error: "A blog post already exists. Cannot create another one." });
  }

  if (!title || !image) {
    return res.status(400).json({ err: "Missing required fields for creating a new logo." });
  }
  const readFileToBuffer = (filePath) => {
    try {
      return fs.readFileSync(filePath);
    } catch (error) {
      console.error(`Error reading file from path ${filePath}:`, error);
      return null;
    }
  };

  const imageBuffer = readFileToBuffer(image);
  const newLogo = new Logo({
    title,
    image: imageBuffer,
  });

  newLogo.save()
    .then((createdLogo) => {
      const logoWithUrl = {
        ...createdLogo._doc,
        image: `/uploads-logo/${createdLogo.image}`,
      };

      res.status(201).json(logoWithUrl);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
};
