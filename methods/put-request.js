const requestBodyparser = require("../util/body-parser");
const writeToFile = require("../util/write-to-file");

const path = require('path');

const id = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

// Assuming movies.json is in the 'data' directory at the root of your project
// const moviesDataPath = path.join(__dirname, '..', 'data', 'data.json');

// const moviesData = require(moviesDataPath);

module.exports = async (req, res) => {
  if (req.url === "/api/hero") {
    try {
      let body = await requestBodyparser(req);

      // Initialize req.datas as an array if it's undefined
      req.datas = req.datas;

      // Assuming you want to add the body object to req.datas
      req.datas = { id, ...body };

      writeToFile(req.datas);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(req.datas));
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
