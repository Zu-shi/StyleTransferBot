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

  /*
  // Check to see if file exists, if not, create
  let guildID = message.guild.id;
  if (!fs.existsSync("./guildFiles/timezones"+guildID+".json")) {
    console.log("Creating timezone log file for this guild...")
    let tmpCommand = require('./commands/createNewZoneLog.js');
    tmpCommand.run(client, config, message);
    
  */
  
  if (message.author.bot) return;

  // First need to check if there is a mention
  if (message.mentions.members.first() == undefined) {
    return;
  } else {
    // run command if starting with @botname (ID for styletransfer is 471110404991614989)
    if (message.mentions.members.first().id==471110404991614989) {
      const args = message.content.trim().split(/ +/g);

      // Help Command
      if (message.content.trim().split(/ +/g)[1] == 'help') {
        let commandFile = require(`./commands/help.js`);
        commandFile.run(client, config, message, args);
      }
      // Progress Command
      else if (message.content.trim().split(/ +/g)[1] == 'progress') {
        let commandFile = require(`./commands/progress.js`);
        commandFile.run(client, config, message, args);
      }
      // Get Image Command (Style Transfer)
      else {
        let commandFile = require(`./commands/getimage.js`);
        commandFile.run(client, config, message, args);
      }
    } else {
      return; // prevent bot from doing anything if not mentioned
    }
  }
    
});

client.login(config.token);