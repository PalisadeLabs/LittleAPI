const functions = require('firebase-functions');
const https = require('https');

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

	https.get(request.query.url, (resp) => {

	 fetchData(resp, (data) => {

	 	routeAction(request, response, data)
	 })

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
		response.send("Error: Requires API URL");
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

	if (request.query.route) {
		console.log("Routing Path: " + request.query.route);

		fetchKey(response, data, request.query.route);

	} else if ( request.query.filter ) {
		filterData(response, data, request.query.filterkey, request.query.condition, request.query.value);
	} else {
		response.send(data);
	}
}

const parseJSONData = (data, splitPath, curIndex, callback) => {

	var useCallback = true;
	for(curIndex; curIndex < splitPath.length-1; curIndex++)
	{
		console.log(curIndex);

		if(splitPath[curIndex] == "*")
		{
			useCallback = false;

			var result = Object.keys(data).map(key => {
				return {
					[key]: {
						[splitPath[curIndex + 1]]: data[key][splitPath[curIndex + 1]]
						}
					}
				}
			);

			var resultObject = {};

			result.map(item => {
				resultObject[Object.keys(item)[0]] = item[Object.keys(item)[0]]
			})

			callback(resultObject);
			break;
		}
		else
		{
			data = data[splitPath[curIndex]];
		}
	}

	if(useCallback)
	{
		callback(data);
	}
}

const fetchKey = (response, data, key) => {

	var splitPath = key.split("/");

	var i = 0;
	parseJSONData(data, splitPath, i, (data) => {
		response.send(JSON.stringify(data));
	});
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
