const Links = require("../../model-for-russian/links");

module.exports = function getAllLinksRussion (req, res) {
  Links.find()
    .then((links) => {
      res.status(200).json(links);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error. Failed to fetch phone numbers." });
    });
};
