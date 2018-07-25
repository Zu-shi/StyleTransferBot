exports.run = (client, config, message, args_full) => {

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

    // Let user know command went in
    message.channel.send('Searching for ' + args[0] + ' and ' + args[1] + ' original art');
    var term_subject = args[0];
    var term_style = args[1] + ' original art';

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
            var fs = require('fs'),
            request = require('request');

            var download = function(uri, filename, callback){
            request.head(uri, function(err, res, body){
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
            };

            let imageToDL = 0;
            if (searchTerm.includes(term_subject) == true) {
                var save_file = 'subject.jpg';
            } else if (searchTerm.includes(term_style) == true) {
                var save_file = 'style_base.jpg'
            }
            download(imageUrl[imageToDL], save_file, function(){
            console.log('done');
            });
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

    if (subscriptionKey.length === 32) {
        //bing_image_search(term_subject);
        //bing_image_search(term_style);
    } else {
        console.log('Invalid Bing Search API subscription key!');
        console.log('Please paste yours into the source code.');
    }

    // Lastly, run style transfer command in shell
    var isWin = process.platform === "win32";
    if (isWin == false) {
        var spawn = require('child_process').spawn;

        //kick off process of listing files
        //var child = spawn('python',['/home/azureuser/neural-style/neural-style/neural_style.py','--content','/home/azureuser/StyleTransferBot/subject.jpg','--styles','\"/home/azureuser/StyleTransferBot/style_base.jpg\"','--output','result.jpg','--iterations','500','--print-iterations','10','--overwrite','--maxwidth','500','--userid','a','--network','/home/azureuser/neural-style/neural-style/imagenet-vgg-verydeep-19.mat']);
	var child = spawn('bash',['/home/azureuser/StyleTransferBot/run.bash']);
        //spit stdout to screen
        child.stdout.on('data', function (data) {   process.stdout.write(data.toString());  });

        //spit stderr to screen
        child.stderr.on('data', function (data) {   process.stdout.write(data.toString());  });

        child.on('close', function (code) { 
            console.log("Finished with code " + code);
        });
    }

    return;

}
