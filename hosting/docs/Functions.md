---
id: Functions
title: Function Guide
sidebar_label: Function Guide
---

Little API offers two functions for working with API data.

One function receives any URL and parses data based on a set of parameters a user can deliver.

The second function uses a collection of APIs and parses data in a more curated way in an attempt to handle some of the more common API Data needs.

## Custom Query

A custom query allows you to query data from any URL, and then parse the data in the cloud.

The custom query accepts these keys:
* URL - The API Query that you would like to parse
* Route - The route to the data in the JSON returned by the API in the original URL
* Filter - A short logic statement that can be used to gather data from a specific route that fits specific logic.

### Example

Lets say that I want to make my Arduino alert me when bitcoin goes below a certain value.

The first thing I'll do is go find an API like this that will give me bitcoin prices:
```
https://api.bitcoincharts.com/v1/weighted_prices.json
```

You only care about seeing the value in USD over 24 hours, so you'll either need to parse the data on the Arduino or just use Little API.

You can pass this API straight to Little API by writing a URL that looks like this:
```
https://us-central1-little-api.cloudfunctions.net/CustomQuery?name=https://api.bitcoincharts.com/v1/weighted_prices.json
```

This isn't very useful. So lets leverage little API by having it return only the data we care about.

To do this, we just add the route key to our URL and route through the JSON hierarchy.
```
https://us-central1-little-api.cloudfunctions.net/CustomQuery?name=https://api.bitcoincharts.com/v1/weighted_prices.json&route=USD/24h/
```

Now that we have only the data we care about, our Arduino is empowered because it no longer needs to locally contain ArduinoJSON or any other local parsing. It simply receives a value, and then operates on it immediately.

## Collection Query

Collection queries use handpicked APIs to aggregate and easily deliver data to the user. Little API is all about open source, so if you would like to curate an easy query. Go ahead and write it up, submit a Pull Request, and add it to the docs!

| Collection Name   | API     |   Need Key? |
|-------------------|:-------:|:-----------:|
| weather           | DarkSky | Yes         |

### Example

Lets get current summary data for the weather in LA.

First we need to grab an API Key from www.darksky.net

Then we can test our query by just using a the Little API Weather Collection as shown below.
```
https://us-central1-little-api.cloudfunctions.net/CollectionQuery/Weather/<YOUR API KEY>/37.8267,-122.4233
```

Now we need to filter to get our summary data. Simply make a path through the hierarchy to the data you care about.
```
https://us-central1-little-api.cloudfunctions.net/CollectionQuery/Weather/43253088460ab65d9e8e43cf289f5b69/37.8267,-122.4233/currently/summary/
```

Now our API directly gives us the summary data we care about, and we only need to receive one packet and will not overload our Arduino IOT devices!
