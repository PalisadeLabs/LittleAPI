const functions = require('firebase-functions');
const https = require('https');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// URL in form of: littleapi.com/<ApiName>/<QueryData if any>/<filters>

exports.CollectionQuery = functions.https.onRequest((request, response) => {

	var splitPath = request.originalUrl.split("/");

	console.log(splitPath);

	var Type = splitPath[1];

	if(Type == "Weather")
	{
		var APIKey = splitPath[2]
		var LatitudeLongitude = splitPath[3]

		https.get("https://api.darksky.net/forecast/" + APIKey + "/" + LatitudeLongitude, (resp) => {
			fetchData(resp, (data) => {

				var i;

				console.log("Spit Path Size: " + splitPath.length)

				for(i = 4; i < splitPath.length-1; i++)
				{
					data = data[splitPath[i]];
				}

				response.send(JSON.stringify(data));
			})
		})
	}
	else
	{
		response.send(`{ "Error" : "Unrecognized Category" }` );
	}
})

exports.CustomQuery = functions.https.onRequest((request, response) => {

	https.get(request.query.name, (resp) => {
	  
	 fetchData(resp, (data) => {

	 	routeAction(request, response, data)
	 })

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});

const fetchDataAsString = (resp, callback) => {
	let data = '';
	 
	resp.on('data', (chunk) => {
		data += chunk;
	});

	resp.on('end', () => {
		callback(data)
	});
}

const fetchData = (resp, callback) => {
	let data = '';
	 
	resp.on('data', (chunk) => {
		data += chunk;
	});

	resp.on('end', () => {
		callback(JSON.parse(data))
	});
}

const routeAction = (request, response, data) => {

	if (request.query.key) {
		console.log("Routing Path: " + request.query.key);

		fetchKey(response, data, request.query.key);

	} else if ( request.query.filter ) {
		filterData(response, data, request.query.filterkey, request.query.condition, request.query.value);
	} else {
		response.send(data);
	}
}

const fetchKey = (response, data, key) => {

	var i;

	var splitPath = key.split("/");

	for(i = 0; i < splitPath.length-1; i++)
	{
		data = data[splitPath[i]];
	}

	response.send(JSON.stringify(data));
}

const filterData = (response, data, key, condition, value) => {

	var filtered = [];

	for (var element in data) {

	  
	  if (condition == 'greater') {

			if (parseInt(data[element][key]) > parseInt(value)) {

				console.log(parseInt(data[element][key]));
				filtered.push( {[element]: data[element]} )
			}

	  } else if (condition == 'less') {

	  		if (parseInt(data[element][key]) < parseInt(value)) {
				filtered.push({[element]: data[element]})
			}
	  }
	  
	}

	response.send(filtered)
}

