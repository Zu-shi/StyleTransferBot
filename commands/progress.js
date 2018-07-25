exports.run = (client, config, message, args) => {
  var fs = require("fs");
  var contents = fs.readFileSync("/home/azureuser/StyleTransferBot/tmp_userid/progress.json", {"encoding": "utf-8"});
  var data = JSON.parse(contents);
  if (data.time_remaining == 0) {
    message.channel.send("All done!");
  }
  else {
    message.channel.send(hms(data.time_remaining) + " left :grin:");
  }
}

function hms(seconds) {
  seconds = seconds | 0; // truncate to int
  hours = (seconds / (60 * 60)) | 0;
  minutes = ((seconds / 60) % 60) | 0;
  seconds = (seconds % 60) | 0;
  if(hours > 0) {
    return hours + ' hr ' + minutes + ' min';
  }
  else if (minutes > 0) {
    return minutes + ' min ' + seconds + ' sec';
  }
  else {
    return seconds + ' sec';
  }
}
