exports.run = (client, config, message, args) => {
  console.log("Running help command");
  let userID = message.mentions.members.first().id;
  message.channel.send(userID)
  // 471383832159846400 is styleselector's ID
  if (userID == 471383832159846400) {
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: "Chronus Command Guide",
      url: "http://google.com",
      description: "Chronus is a simple bot to help you keep your discord friends accountable for going to sleep on time...",
      fields: [{
        name: "!setzone @username [utc-time]",
        value: "Set the timezone for a mentioned user. [utc-time] should be replaced with UTC time zones in the following format (change the number and sign to match your zone): **utc-0400** or **utc+0545**"
      },
      {
        name: ".",
        value: ".",
      },
      {
        name: "!getzone @username",
        value: "Get the timezone for the mentioned user."
      },
      {
        name: "..",
        value: "..",
      },
      {
        name: "!gettime @username [hourFormat]",
        value: "Get the current local time for the mentioned user. [hourFormat] is an optional argument and default to **12**. [hourFormat] should be either **12** (for am/pm format) or **24** (for 24 hour format)."
      },
      {
        name: "...",
        value: "...",
      },
      {
        name: "!help @Chronus",
        value: "Pull up this help menu."
      },
      {
        name: "....",
        value: "...."
      }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© Nile Wilson"
      }
    }

    });
  } else {
    return
  }

}