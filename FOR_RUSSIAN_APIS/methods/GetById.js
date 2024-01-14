const Blog = require("../../model-for-russian/model");

module.exports = function getBlogByIdRussion(req, res) {
  const blogId = req.params.id;

  Blog.findById(blogId)
    .then((result) => {
      const blogWithUrl = {
        ...result._doc,
        image: `/uploads/${result.image}`,
      };

      res.send(blogWithUrl);
    })
    .catch((err) => {
      console.log(err);
    });
}