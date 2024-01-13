const Logo = require("../model/logo");
const fs = require("fs");

module.exports = updateLogo = async function (req, res) {
  const { id } = req.params;
  const { title } = req.body;
  const darkImage = req.files && req.files["dark"] ? req.files["dark"][0].path : undefined;
  const lightImage = req.files && req.files["light"] ? req.files["light"][0].path : undefined;

  const logo = await Logo.findById(id);
  if (!logo) {
    return res.status(404).json({ error: "Logo not found." });
  }

  if (!title && !darkImage && !lightImage) {
    return res.status(400).json({ error: "Nothing to update." });
  }

  if (title) {
    logo.title = title;
  }

  const readFileToBuffer = (filePath) => {
    return fs.readFileSync(filePath);
  };

  if (darkImage) {
    logo.dark = readFileToBuffer(darkImage);
  }

  if (lightImage) {
    logo.light = readFileToBuffer(lightImage);
  }

  try {
    const updatedLogo = await logo.save();
    res.status(200).json(updatedLogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
