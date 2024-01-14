const Logo = require("../../model-for-russian/logo");


module.exports =  function deleteBlogRussion(req, res) {
  const blogId = req.params.id;

  Logo.findByIdAndDelete(blogId)
    .then((deletedBlog) => {
      if (!deletedBlog) {
        return res.status(404).json({ error: "Blog post not found." });
      }
      res.json({ message: "Blog post deleted successfully." });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error." });
    });
}