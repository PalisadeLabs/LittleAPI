const functions = require('firebase-functions');
const https = require('https');
const bodyParser = require('body-parser');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// URL in form of: littleapi.com/<ApiName>/<QueryData if any>/<filters>

exports.helloWorld = functions.https.onRequest((request, response) => {

	https.get(request.query.name, (resp) => {
	  let data = '';
	 
	  // A chunk of data has been recieved.
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	 
	  // The whole response has been received. Print out the result.
	  resp.on('end', () => {

	  	var parsedData = JSON.parse(data);

	    response.send(parsedData[request.query.key]);
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});

 	

});
