// const crypto = require("crypto");
// const requestBodyparser = require("../util/body-parser");
// const writeToFile = require("../util/write-to-file");
// module.exports = async (req, res) => {
//   if (req.url === "/api/hero") {
//     try {
//       let body = await requestBodyparser(req);
//       body.id = crypto.randomUUID();
//       req.data.push(body);
//       writeToFile(req.data);
//       res.writeHead(201, { "Content-Type": "application/json" });
//       res.end();
//     } catch (err) {
//       console.log(err);
//       res.writeHead(400, { "Content-Type": "application/json" });
//       res.end(
//         JSON.stringify({
//           title: "Validation Failed",
//           message: "Request body is not valid",
//         })
//       );
//     }
//   } else {
//     res.writeHead(404, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
//   }
// };
