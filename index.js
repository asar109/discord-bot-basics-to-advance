const { Client, GatewayIntentBits } = require("discord.js");
const eventHandlers = require("./handlers/eventHandlers");
const mongoConnector = require("./utils/mongoConnector");
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

// MongoDB connector

mongoConnector();

eventHandlers(client);

client
  .login(process.env.TOKEN)
  .then(() => {
    console.log("Logged in");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
