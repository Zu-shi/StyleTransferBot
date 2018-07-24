exports.run = (client, config, message, args) => {

    // TO DO:
    // 3) Parse which image they want and return a filter.

    // ARGS
    // [0]: search key term
    // [1]: number of images you want returned
    // Example: !getimage flower 5

    // Bing Image Search API
    // Follow https://docs.microsoft.com/en-us/azure/cognitive-services/bing-image-search/quickstarts/nodejs
    'use strict';
    let https = require('https');
    let subscriptionKey = config.BingSearchAPIsubscriptionKey;

    // Used to recognize file formats of incoming images
    let mime = require('mime-types')

    // Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
    // search APIs.  In the future, regional endpoints may be available.  If you
    // encounter unexpected authorization errors, double-check this host against
    // the endpoint for your Bing Search instance in your Azure dashboard.
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/images/search';

    // Where to store user requests in progress
    let requestStoragePath = './requests/'

    // Let user know command went in
    message.channel.send('Searching for args[0]: ' + args[0] + ' original art')
    let term = args[0] + ' original art';

    // Get results in JSON format
    let response_handler = function (response) {
        let body = '';
        response.on('data', function (d) {
            console.log('Handling response');
            body += d;
        });
        response.on('end', function () {
            // Store into JSON for easy access
            let results = JSON.parse(body);
            let numOfResults = args[1];
            let imageResult = [];
            for (var i = 0; i < numOfResults; i++)
                imageResult.push(results["value"][i]);

            console.log("Results:\n");
            console.log(results);
            console.log("imageResults:\n");
            console.log(imageResult);
            // Send back to discord as text (for now)
            console.log("sending results");
            
            //message.channel.send("Which picture would you like me to use as reference?");

            var filesList = [];
            for (var i = 0; i < numOfResults; i++)
                filesList.push(imageResult[i].contentUrl);
            message.channel.send("Which picture would you like me to use as reference? Let me know if you like \"Picture 1\", \"Picture 2\", or \"Picture 3\"!", {files: filesList});
            console.log(filesList);

            /*
            for (var i = 0; i < numOfResults; i++) {
                let statici = i;
                setTimeout(function(){
                    // this code will only run when time has ellapsed
                    message.channel.send("Picture " + (statici + 1) + ":", {files: [imageResult[statici].contentUrl]});
                }, statici * 500);
            }*/

            // Download to local
            var fs = require('fs'),
            request = require('request');

            // Create folder dedicated to user
            var userId = message.member.user.id;
            if (!fs.existsSync(requestStoragePath)){
                fs.mkdirSync(requestStoragePath);
            }

            if (!fs.existsSync(requestStoragePath + userId)){
                fs.mkdirSync(requestStoragePath + userId);
            }

            var download = function(uri, filename, callback){
                request.head(uri, function(err, res, body){
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };

            var styleCandidatesToFileMap = {};
            for (var i = 0; i < numOfResults; i++) {
                var extension = imageResult[i].encodingFormat == "animatedgif" ? animatedgif : imageResult[i].encodingFormat;
                var filename = "" + (i + 1) + '.' + extension;
                download(imageResult[i].contentUrl, requestStoragePath + userId + '/' + filename, function(){
                    console.log('Downloading image ' + i + ' done!');
                });
                styleCandidatesToFileMap[(i + 1)] = {url: imageResult[i].contentUrl, filename: filename};
            }
            fs.writeFileSync(requestStoragePath + userId + '/data.json', JSON.stringify(styleCandidatesToFileMap) , 'utf-8');
        });

        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    };

    let bing_image_search = function (search) {
        console.log('Searching images for: ' + term);
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
        bing_image_search(term);
    } else {
        console.log('Invalid Bing Search API subscription key!');
        console.log('Please paste yours into the source code.');
    }

}