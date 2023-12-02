const requestBodyparser = require("../util/body-parser");
const writeToFile = require("../util/write-to-file");

module.exports = async (req, res) => {
  if (req.url === "/api/hero") {
    try {
      let body = await requestBodyparser(req);

      // Initialize req.datas as an array if it's undefined
      req.datas = req.datas || [];

      // Assuming you want to add the body object to req.datas
      req.datas[0] = { ...body };

      writeToFile(req.datas);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(req.datas[0]));
    } catch (err) {
      console.log(err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "Validation Failed",
          message: "Request body is not valid",
        })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
  }
};
