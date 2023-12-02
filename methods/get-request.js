module.exports = (req, res) => {
  // let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  // let id = req.url.split("/")[3];
  // const regexV4 = new RegExp(
  //   /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  // );

  if (req.url === "/api/hero") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(req.data));
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
  }
};
