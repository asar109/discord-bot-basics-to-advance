const path = require("path");
const getAllFilesOrFolders = require("./getAllFilesOrFolders");

module.exports = (exception = []) => {
  const localCommands = [];

  const commandsCategories = getAllFilesOrFolders(
    path.join(__dirname, "..", "commands"),
    true
  );

  for (const commandCategory of commandsCategories) {
    const commandFiles = getAllFilesOrFolders(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);

      if (exception.includes(commandObject.name)) {
        continue;
      }

      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
