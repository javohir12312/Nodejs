const Logo =require("../model/logo")
module.exports.updateLogo = async function(req, res) {
  const { id } = req.params; 
  const { title } = req.body;
  const image = req.files && req.files.image ? req.files.image[0].filename : undefined;
  console.log(image,title,id);
  if (!title && !image) {
    return res.status(400).json({ err: "Nothing to update." });
  }

  try {
    let logo = await Logo.findById(id);

    if (!logo) {
      return res.status(404).json({ err: "Logo not found." });
    }

    if (title) {
      logo.title = title;
    }

    if (image) {
      logo.image = image;
    }

    await logo.save();

    res.status(200).json({
      id: logo._id,
      title: logo.title,
      image: `/uploads-logo/${logo.image}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

