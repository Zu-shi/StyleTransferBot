exports.run = (client, config, message, args) => {

    // TO DO:
    // 1) Return the actual image through discord (text sufficient?)
    // 2) Allow for multi-word input
    // 3) Figure out which image to select of first few results
    // 4) Allow bot to recognize conversation without prefix
    //      e.g.) "I'd like flowers in the style of Monet"
    //      e.g.) "I'd like Cactus in the style of Final Fantasy"

    // ARGS
    // [0]: search key term
    // [1]: number of images you want returned
    // Example: !getimage flower 5

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
    message.channel.send('Searching for args[0]: ' + args[0] + ' original art')
    let term = args[0] + ' original art';

    // Get results in JSON format
    let response_handler = function (response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            // Store into JSON for easy access
            let results = JSON.parse(body);
            let numOfResults = args[1];
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
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
            };

            let imageToDL = 0;
            download(imageUrl[imageToDL], 'style_base.jpg', function(){
            console.log('done');
            });
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