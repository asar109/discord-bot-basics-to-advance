const wait = require("node:timers/promises").setTimeout;
module.exports = {
  name: "ping",
  description: "Do Ping for pong!",
  // devOnly: boolean,
  Options: [],
  deleted: false,
  callBack: async (client, interaction) => {
    await interaction.deferReply();
    await wait(2_000);
    await interaction.editReply("Pong!");
  },
};
