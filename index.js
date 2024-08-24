const { Client, GatewayIntentBits } = require("discord.js");
const eventHandlers = require("./handlers/eventHandlers");
require("dotenv").config({
  path: "./config/.env",
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

eventHandlers(client);

client
  .login(process.env.TOKEN)
  .then(() => {
    console.log("Logged in");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
