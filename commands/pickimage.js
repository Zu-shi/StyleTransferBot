exports.run = (client, config, message, args) => {
    // Where to store user requests in progress
    let requestStoragePath = './requests/'
    var fs = require('fs');

    var userId = message.member.user.id;

    if (!fs.existsSync(requestStoragePath)){
        message.channel.send("Sorry, something broke! Request storage path not found.");
        return;
    }

    if (!fs.existsSync(requestStoragePath + userId)){
        message.channel.send("Sorry, something broke! User path not found.");
        return;
    }

    //fs.writeFileSync(requestStoragePath + userId + '/data.json'
    var datapath = requestStoragePath + userId + '/data.json';
	var userImageData = JSON.parse(fs.readFileSync(datapath, 'utf8'));

	var userPick = 0;

	if (message.content.includes("1")) {
		userPick = 1;
	} else if (message.content.includes("2")) {
		userPick = 2;
	} else if (message.content.includes("3")) {
		userPick = 3;
	} else if (message.content.toLowerCase().includes("one")) {
		userPick = 1;
	} else if (message.content.toLowerCase().includes("two")) {
		userPick = 2;
	} else if (message.content.toLowerCase().includes("three")) {
		userPick = 3;
	} else {
		message.channel.send("Sorry, I didn't get that. Try something like \"Picture 1\".")
		return;
	}

	message.channel.send("Here's your image! ", {files:[userImageData[userPick]["url"]]});
}