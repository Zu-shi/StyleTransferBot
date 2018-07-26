exports.run = (client, config, message, args_full) => {

    let lockpath = "/home/azureuser/StyleTransferBot/requests/global.lock";
    // TO DO:
    // 1) Call shell script to run style transfer
    // 2) Figure out which image to select of first few results (Zuoming)
    // 3) Make numOfResults from input argument again (just an int), also imageToDL

    // ARGS (old)
    // [0]: search key term
    // [1]: number of images you want returned
    // Example: !getimage flower 5

    // ARGS (now)
    // [0]: search key term(s) for object
    // [1]: search key term(s) for style
    // Example: @styletransfer please paint me some "flowers" in the style of "rembrandt"

    // Parse arguments from input sentence
    // You will want to take in the words surrounded by quotes
    // pseudocode: in args_full, if start with ' or ", take as first word in args[0]
    //             in args_full, if end with ' or ", take as last work in args[0]
    //             do same for args[1], where args[0] = object, args[1] = style
    let startQuote = false;
    var args = [];
    var arg_cnt = 0;

    const EventEmitter = require('events');
    var doneDownloadEvent = new EventEmitter();
    doneDownloadEvent.on('doneDownloadingOneFile', function() {
        doneDownloadEvent.on('doneDownloadingOneFile', function() {
            doneDownloadEvent.removeAllListeners('doneDownloadingOneFile');
            andThenThis()
        });
    });

    for (i=0; i<args_full.length; i++) {
        word = args_full[i];
        if (word[0] == '\'' || word[0] == '\"') {
            // If just single word (does not span multiple)
            if (word[word.length-1] == '\'' || word[word.length-1] == '\"') {
                args[arg_cnt] = word.substr(1);
                args[arg_cnt] = args[arg_cnt].substr(0, args[arg_cnt].length-1);
                arg_cnt++;
            } else {
                args[arg_cnt] = word.substr(1); // take off first character (quote)
                startQuote = true;
            }
        } else if (word[word.length-1] == '\'' || word[word.length-1] == '\"') {
            // ends in quote, close
            args[arg_cnt] = args[arg_cnt] + ' ' + word.substr(0,word.length-1);
            arg_cnt++;
        } else {
            // If still within quotes, append words and spaces
            if (startQuote == true) {
                args[arg_cnt] = args[arg_cnt] + ' ' + word;
            }

            // Else, skip over to next word
        }
    }
    // If there are no arguments
    if (arg_cnt == 0) {
        return;
    }

    // Bing Image Search API
    // Follow https://docs.microsoft.com/en-us/azure/cognitive-services/bing-image-search/quickstarts/nodejs
    'use strict';
    let https = require('https');
    let subscriptionKey = config.BingSearchAPIsubscriptionKey;

    // Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
    // search APIs.  In the future, regional endpoints may be available.  If you
    // encounter unexpected authorization errors, double-check this host against
    // the endpoint for your Bing Search instance in your Azure dashboard.
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/images/search';

    // Where to store user requests in progress
    let requestStoragePath = './requests/'

    // Let user know command went in
    var fs = require('fs');

    // Get results in JSON format
    let response_handler = function (response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // Store into JSON for easy access
            let results = JSON.parse(body);
            let searchTerm = results.webSearchUrl;
            let numOfResults = 1;
            let imageUrl = [];
            for (var i = 0; i < numOfResults; i++)
                imageUrl[i] = results.value[i].contentUrl

            // Send back to discord as text (for now)
            for (var i = 0; i < numOfResults; i++)
                message.channel.send(imageUrl[i])

            // Download to local
            request = require('request');

            var download = function(uri, filename, callback){
                request.head(uri, function(err, res, body){
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };

            let imageToDL = 0;
            // Create folder dedicated to user
            var userID = message.member.user.id;
            if (!fs.existsSync(requestStoragePath)){
                fs.mkdirSync(requestStoragePath);
            }

            if (!fs.existsSync(requestStoragePath + userID)){
                fs.mkdirSync(requestStoragePath + userID);
            }

            if (searchTerm.includes(term_subject) == true) {
                var save_file = (requestStoragePath + userID + '/subject.jpg');
            } else if (searchTerm.includes(term_style) == true) {
                var save_file = (requestStoragePath + userID + '/style_base.jpg');
            }
            message.channel.send('downloading image: ' + Date.now())
            download(imageUrl[imageToDL], save_file, function(){
                doneDownloadEvent.emit('doneDownloadingOneFile')
                console.log('done');
            });

            /*
            // if done downloading subject and then style
            if (searchTerm.includes(term_style) == true) {
                andThenThis()
            } */
        });

        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    let bing_image_search = function (search) {
        let request_params = {
            method : 'GET',
            hostname : host,
            path : path + '?q=' + encodeURIComponent(search),
            headers : {
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
            }
        };

        let req = https.request(request_params, response_handler);
        req.end();
    }

    function andThenThis() {
        message.channel.send('andThenThis: ' + Date.now())
        message.channel.send('Your picture should be done in a minute! (this is currently hardcoded)')

        // Lastly, run style transfer command in shell
        var isWin = process.platform === "win32";
        if (isWin == false) {
            var spawn = require('child_process').spawn;
            var userID = message.member.user.id;

            //kick off process of listing files
            //var child = spawn('python',['/home/azureuser/neural-style/neural-style/neural_style.py','--content','/home/azureuser/StyleTransferBot/subject.jpg','--styles','\"/home/azureuser/StyleTransferBot/style_base.jpg\"','--output','result.jpg','--iterations','500','--print-iterations','10','--overwrite','--maxwidth','500','--userid','a','--network','/home/azureuser/neural-style/neural-style/imagenet-vgg-verydeep-19.mat']);
            var child = spawn('bash',['/home/azureuser/StyleTransferBot/run_user.bash', userID]);
            //spit stdout to screen
            child.stdout.on('data', function (data) {   process.stdout.write(data.toString());  });

            //spit stderr to screen
            child.stderr.on('data', function (data) {   process.stdout.write(data.toString());  });

            child.on('close', function (code) { 
                message.channel.send("I finished a " + term_style + " version of " + term_subject + "!", {files:["./requests/"+userID+"/results.jpg"]});
                console.log("Finished with code " + code);

                try{
                    console.log("deleting lock");
                    client.user.setPresence({game: null, status: 'online' });
                    fs.unlinkSync(lockpath);
                }catch (e){
                    console.log("Cannot write file ", e);
                }
            });
        }
    }
    

    var filepath = "/home/azureuser/StyleTransferBot/requests/"+message.member.user.id+"/progress.json";
    var dirPath = "/home/azureuser/StyleTransferBot/requests/"+message.member.user.id;
    if (fs.existsSync(filepath)) {
        var progressPath = fs.readFileSync(filepath, {"encoding": "utf-8"});
        var progress = JSON.parse(progressPath);

        if (progress.time_remaining != 0) {
            message.channel.send("I have a project for you in progress, please wait until that one is done!");
            return;
        }
    }

    if (fs.existsSync(lockpath)) {
        message.channel.send("I'm away right now, try me in a minute or when you see me online!");
        return;
    }

    try{
        console.log("creating lock");
        client.user.setPresence({ game: { name: 'with style' }, status: 'idle' });
        fs.writeFileSync(lockpath, "");
    }catch (e){
        console.log("Cannot write file ", e);
    }

    var term_subject = args[0];
    var term_style = args[1];
    message.channel.send('Searching for ' + term_subject + ' and ' + term_style);

    var deleteFolderRecursive = function(path) {
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
          var curPath = path + "/" + file;
          if (fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    };

    deleteFolderRecursive(dirPath);

    //message.channel.send('doThis: ' + Date.now())
    if (subscriptionKey.length === 32) {
        //bing_image_search(term_subject);
        //bing_image_search(term_style);
        bing_image_search(term_subject, function(){
            console.log('subject.jpg downloaded');
        });
        
        bing_image_search(term_style, function(){
            console.log('style_base.jpg downloaded')
        });
    } else {
        console.log('Invalid Bing Search API subscription key!');
        console.log('Please paste yours into the source code.');
    }
    return;
}
