const fs = require("fs");
const path = require("path");

module.exports = (directory, folderOnly = false) => {
  const res = [];

  const files = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (folderOnly) {
      if (file.isDirectory()) {
        res.push(filePath);
      }
    } else {
      if (file.isFile()) {
        res.push(filePath);
      }
    }
  }

  return res;
};
