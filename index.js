const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const config = require("./config.json");

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});


client.on("message", message => {
  //console.log("Message Received ");
  //console.log(message);
  /*
  // Check to see if file exists, if not, create
  let guildID = message.guild.id;
  if (!fs.existsSync("./guildFiles/timezones"+guildID+".json")) {
    console.log("Creating timezone log file for this guild...")
    let tmpCommand = require('./commands/createNewZoneLog.js');
    tmpCommand.run(client, config, message);
  */
  
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  if (message.content[1] === config.prefix) return; // avoid doing anything when someone is excited
  console.error("Early exit conditions bypassed.");

  // This is the best way to define args. Trust me.
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {
    console.error("Trying to run command " + command);
  	// Run the command
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, config, message, args);
  } catch (err) {
  	// Throw an error
  	// message.channel.send('Please enter a valid command (see @help chronus)');
    console.error(err);
  }
});

client.login(config.token);