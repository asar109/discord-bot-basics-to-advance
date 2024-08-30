const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");
const { AttachmentBuilder } = require("discord.js");
const Level = require("../../models/level");
const { Font } = require("canvacord");
const canvacord = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");

Font.loadDefault();

module.exports = {
  name: "level",
  description: "To show the current Rank/Level of the user",
  options: [
    {
      name: "target-user",
      description: "Select user who's rank/level to be shown",
      type: ApplicationCommandOptionType.Role,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callBack: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("This command can only be used in a server");
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get("target-user")?.value;
    const targetUser = mentionedUserId || interaction.member.id;
    const user = await interaction.guild.members.fetch(targetUser);

    const fetchedUser = await Level.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    if (!fetchedUser) {
      interaction.editReply(
        mentionedUserId
          ? `${user.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again."
      );
      return;
    }

    // create card
    const card = new canvacord.RankCardBuilder()
      .setAvatar(user.user.displayAvatarURL({ size: 256 }))
      .setRank(fetchedUser.level)
      .setLevel(fetchedUser.level)
      .setCurrentXP(fetchedUser.xp)
      .setRequiredXP(calculateLevelXp(fetchedUser.level))
      .setStatus(user.presence.status)
      .setUsername(user.user.username)

    const image = await card.build({ format: "png" });

    const attachment = new AttachmentBuilder(image, { name: "rank.png" });

    interaction.editReply({
      files: [attachment],
    });
  },
};
