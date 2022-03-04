// pour les API keys
import { myKeys } from "./config.js";

const openCageApiKey = myKeys.cageApiKey;
const openWeatherApiKey = myKeys.weatherApiKey;

// pour les base_url
const openCageApi = "https://api.opencagedata.com/geocode/v1/json?";
const openWeatherApi = "https://api.openweathermap.org/data/2.5/onecall?";
// pour les options openweather
const openWeatherExclude = "alerts,minutely,hourly";

let cityLat;
let cityLong;
let weatherId;
let weatherMain;
let timeStamp;
let selectedNumber;
let wImage;

const weatherIcons = {
  "Snow" : [
    ["src", "img/snow-white.png"],
    ["alt", "Snow icon"],
  ],
  "Clear" : [
    ["src", "img/sun-white.png"],
    ["alt", "Sun icon"],
  ],
  "Cloudy" : [
    ["src", "img/cloudy-white.png"],
    ["alt", "Cloudy icon"],
  ],
  "Clouds" : [
    ["src", "img/clouds-white.png"],
    ["alt", "Cloudy icon"],
  ],
  "Else" : [
    ["src", "img/rain-white.png"],
    ["alt", "Rain and rest icon"],
  ],
}


function cleanUp() {
  let showNodeH2 = document.getElementById("tr-h2");
  let showNodeImg = document.getElementById("tr-img");
  if (showNodeH2.hasChildNodes()) {
    while(showNodeH2.firstChild) {
      showNodeH2.removeChild(showNodeH2.firstChild);
    }
  }
  if (showNodeImg.hasChildNodes()) {
    while(showNodeImg.firstChild) {
      showNodeImg.removeChild(showNodeImg.firstChild);
    }
  }
}

// pour savoir si nuit ou jour pour affichage bkgd
function getNightOrDay(timeStamp, timeSunSet, timeSunRise) {
  const sunSet = new Date(timeSunSet * 1000);
  const sunRise = new Date(timeSunRise * 1000);
  const now = new Date(timeStamp * 1000);
  let nowTime = parseFloat(now.getUTCHours() + (now.getUTCMinutes() * 0.01));
  let nowRise = parseFloat(sunRise.getUTCHours() + (sunRise.getUTCMinutes() * 0.01));
  let nowSet = parseFloat(sunSet.getUTCHours() + (sunSet.getUTCMinutes() * 0.01));

  if (((nowTime >= 0) && (nowTime < nowRise)) || (nowTime >= nowSet)){
    document.querySelector("body").style.background = "linear-gradient(to bottom, #000000, #082e4e)";
  }
  else if ((nowTime < nowSet) && (nowTime > nowRise)) {
    document.querySelector("body").style.background = "linear-gradient(to bottom, #004683, #881da8)";
  } else {
    console.log("PB!!!!!!")
  }
}

// pour calculer le jour
function getTheDay(timeStamp) {
  const myDate = new Date(timeStamp * 1000);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dday = days[myDate.getUTCDay()];
  return dday;
}

// pour creer h2
function createH2(timeStamp) {
  let tdDay = document.createElement("td");
  let h2day = document.createElement("h2");
  h2day.classList.add("d-day");
  let dday = getTheDay(timeStamp);
  h2day.setAttribute("id", dday);
  h2day.textContent = dday;
  tdDay.appendChild(h2day);
  document.getElementById("tr-h2").appendChild(tdDay);
}


// pour ajouter attributs src et alt a img creee
function setImgSrcAlt(dict) {
  wImage.setAttribute(dict[0][0], dict[0][1]);
  wImage.setAttribute(dict[1][0], dict[1][1]);
}

// pour creer image
function createImage(weatherId, weatherMain) {
  // creation et selection image
  let tdImg = document.createElement("td");
  wImage = document.createElement("img");
  wImage.classList.add("weather-img");
  if (weatherMain === "Snow") {
      setImgSrcAlt(weatherIcons["Snow"]);
  } else if (weatherMain === "Clear") {
      setImgSrcAlt(weatherIcons["Clear"]);
  } else if (weatherMain === "Clouds") {
      if (weatherId === "801" || weatherId === "802") {
        setImgSrcAlt(weatherIcons["Cloudy"]);
      } else {
        setImgSrcAlt(weatherIcons["Clouds"]);
      }
  } else {
      setImgSrcAlt(weatherIcons["Else"]);
  }
  tdImg.appendChild(wImage);
  document.getElementById("tr-img").appendChild(tdImg);
}

// recup donnees pour appel fcts affichage image
function getWeatherDays(data) {
  for (let i = 0; i < selectedNumber; i += 1) {
    let offset = data["timezone_offset"];
    let timeSunSet = data["current"]["sunset"] + offset;
    let timeSunRise = data["current"]["sunrise"] + offset;
    if (i === 0) {
      weatherId = data["current"]["weather"][0]["id"];
      weatherMain = data["current"]["weather"][0]["main"];
      timeStamp = data["current"]["dt"] + offset;
      getNightOrDay(timeStamp, timeSunSet, timeSunRise);
    }
    else {
      weatherId = data["daily"][i]["weather"][0]["id"];
      weatherMain = data["daily"][i]["weather"][0]["main"];
      timeStamp = data["daily"][i]["dt"] + offset;
    }
    createH2(timeStamp);
    createImage(weatherId, weatherMain);
  }
}

/*
    récupère lat et lng par res de l'api openCage
*/
function getLatLng(data) {
  document.getElementById("city-formatted").textContent = data[0]["formatted"];
  cityLat = data[0]["geometry"]["lat"];
  cityLong = data[0].geometry.lng;
  if (cityLat && cityLong) {
    return;
  }
}

// async / await = asynchrone synchrone
// rendre synchrone la resolution des PROMESSES
// g a AWAIT

async function main(city) {
  await fetch(`${openCageApi}key=${openCageApiKey}&q=${city}`)
    .then(result => result.json())
    .then(json => json.results)
    .then(results => {
      // console.log(results);
      getLatLng(results);
    })

  let meteo = await fetch(`${openWeatherApi}lat=${cityLat}&lon=${cityLong}&exclude=${openWeatherExclude}&appid=${openWeatherApiKey}&lang=fr&units=metric`)
    .then(result => result.json())
    .then(json => json)
    // console.log(meteo);
    getWeatherDays(meteo);
}

// action
$(document).ready(function(){
  $("button").click(function(e) {
    e.preventDefault();
    cleanUp();
    let city = document.getElementById("city-name-input").value;
    // console.log(city);
    if (city) {
      document.getElementById("missing-error-message").textContent = "";
      let selectElmt = document.getElementById("week-days");
      selectedNumber = selectElmt.options[selectElmt.selectedIndex].value;
      main(city);
    }
    else {
      document.getElementById("missing-error-message").textContent = "Need a name!";
    }
    document.getElementById("form-city").reset();
  });
})
