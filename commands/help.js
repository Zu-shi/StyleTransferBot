exports.run = (client, config, message, args) => {
  let userID = message.mentions.members.first().id;
  message.channel.send(userID)
  // 471110404991614989 is styletransfer's ID
  if (userID == 471110404991614989) {
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: "Style Transfer Bot Command Guide",
      url: "http://google.com",
      description: "The Delight Style Transfer Bot is a simple bot created to allow you to create fun, custom art style transferred images",
      fields: [
      {
        name: "@styletransferbot please give me \"moutains\" in the style of \"starry night\"",
        value: "Mention this bot then type a sentence with (1) a subject (in quotes) and (2) a style (in quotes)."
      },
      {
        name: "..",
        value: "..",
      },
      {
        name: "@styletransferbot how much time is left?",
        value: "Returns the estimated time remaining until your request is done"
      },
      {
        name: "...",
        value: "...",
      },
      {
        name: "@styletransfer help",
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
        text: "© Zuoming Shi, Nile Wilson, Amy Yu"
      }
    }

    });
  } else {
    return
  }

}