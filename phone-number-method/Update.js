const Phone = require("../model/phoneNumber");
module.exports = function updatePhoneById(req, res) {
  const { id } = req.params;
  const { number } = req.body;

  Phone.findByIdAndUpdate(id, { number }, { new: true })
    .then((updatedPhone) => {
      if (!updatedPhone) {
        return res.status(404).json({ error: "Phone number not found." });
      }
      res.status(200).json(updatedPhone);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to update phone number." });
    });
};
