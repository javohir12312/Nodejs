const Logo = require("../model/logo");

module.exports = function getAllBlogs(req, res) {
  Logo.find()
    .then((result) => {
      const blogsWithUrls = result.map(blog => {
        return {
          ...blog._doc,
          image: `/uploads-logo/${blog.image}`,
        };
      });

      res.send(blogsWithUrls);
    })
    .catch((err) => {
      console.log(err);
    });
}

