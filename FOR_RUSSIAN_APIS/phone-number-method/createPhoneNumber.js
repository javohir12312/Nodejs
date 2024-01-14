const Phone = require("../../model-for-russian/phoneNumber");

module.exports = function createPhoneRussion(req, res) {
  const { number, instagram } = req.body;
  console.log(req.body);
  const existingBlog = Phone.findOne();

  if (existingBlog) {
    return res.status(400).json({ error: "A blog post already exists. Cannot create another one." });
  }

  if (!number) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  const newPhone = new Phone({ number, instagram });

  newPhone.save()
    .then((createdPhone) => {
      res.status(201).json(createdPhone);
    })
    .catch((error) => {
      console.error(error);

      // Check if the error is due to validation (e.g., required field missing)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Internal Server Error. Failed to create phone number." });
    });
};
