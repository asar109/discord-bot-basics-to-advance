const { Client, Interaction } = require("discord.js");
const Users = require("../../models/user");

let load = 1000;

module.exports = {
  name: "daily",
  description: "Get daily free balance",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callBack: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command only can run in Server",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const user = await Users.findOne({
      userId: client.user.id,
      guildId: interaction.guild.id,
    });

    if (user) {
      const userLastDate = user.lastTime.toDateString();

      const currentDate = new Date().toDateString();

      if (userLastDate === currentDate) {
        await interaction.editReply({
          content: "You have already run this command, try again tomorrow",
        });
        return;
      }
      user.lastTime = new Date();
      user.balance += load;
      await user.save();
    } else {
      await Users.create({
        userId: client.user.id,
        guildId: interaction.guild.id,
        balance: 1000,
        lastTime: new Date(),
      });
    }

    await interaction.editReply({
      content:
        "You have successfully added 1000 balance, now come again tomorrow",
    });
  },
};
