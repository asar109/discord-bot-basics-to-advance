const path = require("path");
const getAllFilesOrFolders = require("../utils/getAllFilesOrFolders");

module.exports = async (client) => {
  const eventsFolders = getAllFilesOrFolders(
    path.join(__dirname, "..", "events"),
    true
  );

  for (const eventsFile of eventsFolders) {
    const eventFiles = getAllFilesOrFolders(eventsFile);

    eventFiles.sort((a, b) => a > b);

    const eventName = eventsFile.replace(/\\/g, "/").split("/").pop();

    client.on(eventName, async (args) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, args);
      }
    });
  }
};
