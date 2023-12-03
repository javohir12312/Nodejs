const Blog = require("../model/model");

module.exports = function getAllBlogs(req, res) {
  Blog.find()
    .then((result) => {
      const blogsWithUrls = result.map(blog => {
        return {
          ...blog._doc,
          image: `/uploads/${blog.image}`,
        };
      });

      res.send(blogsWithUrls);
    })
    .catch((err) => {
      console.log(err);
    });
}

