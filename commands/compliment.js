exports.run = (client, config, message, args) => {
  let member = message.mentions.members.first();
  message.channel.send('Hey ' + member + ', you look great today!')
}