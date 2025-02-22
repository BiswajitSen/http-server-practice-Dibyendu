const logger = (req, res) => {
  console.log(req.method, req.url);
}

module.exports = { logger };