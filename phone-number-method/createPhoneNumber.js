const Phone = require("../model/phoneNumber");

module.exports = function createPhone (req, res) {
  const { number,instagram } = req.body;
  console.log(number,req.body);

  if (!number || !instagram) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  const newPhone = new Phone({ number,instagram });

  newPhone.save()
    .then((createdPhone) => {
      res.status(201).json(createdPhone);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to create phone number." });
    });
};
