var fs = require('fs');

const readFile = (fileName, prefix = "./pages/") => {
  const filePath = prefix + fileName;
  return fs.readFileSync(filePath, { encoding: "utf8" });
}

module.exports = { readFile };