const Logo = require("../model/logo");

module.exports = function createLogo(req, res) {
  const { title } = req.body;
  const image = req.files && req.files.image ? req.files.image[0].filename : undefined;

  console.log("Received request with fields:", req.files);

  if (!title || !image) {
    return res.status(400).json({ err: "Missing required fields for creating a new logo." });
  }

  const newLogo = new Logo({
    title,
    image: image,
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
