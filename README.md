# WeatherApp
## Goals
- Use AJAX & jQuery to make asynchronous requests (bonus)
- Read an API's documentation
- Be familiar with the ES6 syntax

Build a first interactive web page using JavaScript to fetch data from APIs and display dynamic information in an HTML page, without ever reloading the page.

## Overview

A month ago, you coded your first API. As you remember, your Santa API answered requests with raw data - either in JSON or in XML format.

That's the purpose of an API: to answer queries with formatted data. The answer from an API is not meant to be displayed to internet users directly, because the data is not visually structured. APIs basically just send back raw data to be used by another application.

When we use data from an API, we call that "consuming" the API. The API offers some information, and as a developer you consume that information.

Now that you built two Flask applications, you understand that a web application defines specific routes that can be requested by clients. Whether the application is a normal website or an API, it doesn't change the fact that you can only request specific URLs.

And so the main challenge when you consume an API is to respect strictly the requests it expects.

For example, you remember you had a /toys route on Santa? What would have happened if a user had requested the URL /allofthetoys? 

Well, they would have gotten an error! Because your Santa API only defined a route for /toys, and not for /allofthetoys.

So, when you consume an API, it's important that you take the time to read the API's documentation to figure out what kind of queries you can send it. Of course, you will also need to make sense of what the API sends back at you!

Note: You don't need to read all of the API's documentation. Most APIs have a lot of options and configurations. Identify what information you need to get back from the API, and figure out how to obtain that information only.

## Step 1

For this project, you will code a small weather forecast page, entirely in JavaScript. You will use APIs to fetch the weather forecast for a specific city.

To do so, you will have a simple HTML page with a form. The form will let your visitor search for a specific city. Then, using JavaScript, you will get the forecast for that city and modify the HTML page to display it.

How to get the weather forecast from a city name? You'll need to use two APIs:

- the OpenCage Geocoder API will help you get the GPS coordinates from the city name
- the OpenWeather API will give you the weather forecast for the next 7 days for given GPS coordinates (you will use their One Call API)

You need to sign up to obtain an API key, for both APIs. Figuring out how to use the APIs (how to format your URL and how to use the data it sends back) is part of the project!

If you wish to, you may use jQuery (to manipulate the DOM) and Bootstrap (to style your page more easily).

Start by putting the foundations in place.

From the provided city name, you will get the current weather forecast and display it, along with the day's name.

To be able to do so, you will need to figure out how to use the APIs. Look at the demo & documentation on the API websites, and test them. Request different URLs and pay attention to what kind of data the API sends back. Then, you can figure out how to extract the necessary information from the API's answer.

Only start coding when you have a good understanding of how the APIs work!
 
To send a request to an API and handle its response without reloading the page, you can use jQuery's get method.

When it comes to displaying the information on the HTML page, you will group it into the 5 following weathers:
- Clear
- Snow
- Clouds (if there are more than 50% of clouds)
- Cloudy (between 0 and 50% of clouds)
- Rain (in all other cases, so including Thunderstorm, Mist, etc)

## Step 2
Next, you will provide the forecast for the five next days.

## Step 3
For the final step, you will allow your visitor to choose how many days should be forecasted, between 1 and 7.

## Bonuses
Here are bonuses that will be considered during the project review:
- A day/night styling of your page (if it's night time for the requested city, switch to night mode). You can use the Sunrise Sunset API to figure this out.
- Using Promises to handle the asynchronous requests. This will only count if you understand it and can explain how it works!
- Caching information to limit API calls
- Proper usage of object-oriented programming concepts to structure your program. Justify the design of your classes and your choices of implementation. Is each class modelling a well-defined, independent concept? Do they all have a separate responsibility? For example, if you have a City class, is it justified to modify the DOM inside it?

