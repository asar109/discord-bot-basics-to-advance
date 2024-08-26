const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callBack: async (client, interaction) => {
    await interaction.deferReply();
    const targetUserId = interaction.options.get("target-user")?.value;
    const duration = interaction.options.get("duration")?.value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";
    const targetUser = await interaction.guild.members.fetch(targetUserId);

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid duration.");
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Please provide a duration between 5 seconds and 28 days."
      );
      return;
    }

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't timeout that user because they're the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't timeout that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't timeout that user because they have the same/higher role than me."
      );
      return;
    }

    // timeout the targetUser
    try {
      const { default: msPretty } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(ms(duration), reason);
        await interaction.editReply(
          `User ${targetUser} was update to ${msPretty(msDuration, {
            verbose: true,
          })}`
        );
        return;
      }

      await targetUser.timeout(ms(duration), reason);
      await interaction.editReply(
        `User ${targetUser} is now in time-out for ${msPretty(msDuration, {
          verbose: true,
        })}`
      );
    } catch (error) {
      console.log(`There was an error when time outing user: ${error}`);
    }
  },

  name: "timeout",
  description: "Time-out a member from this server.",
  options: [
    {
      name: "target-user",
      description: "The user you want to time-out.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "The duration for you want to time-out.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason you want to time-out.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
};
