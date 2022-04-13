// pour les API keys
import { myKeys } from "./config.js";
// pour les fonctions accessoires et les icones
import * as Util from "./utils.js";
import { weatherIcons } from "./weather_icons.js";

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
let weatherTemp;
let weatherTempMinMax;
let timeStamp;
let selectedNumber;
let wImage;

// pour nettoyer
function cleanUp() {
  let showNodeWCont = document.getElementById("weather-container");

  // let classes2remove = document.getElementById("weather-container").classList;
  if (showNodeWCont.classList.contains("to-hide")) {
    showNodeWCont.classList.toggle("to-hide");
  }
  // console.log(showNodeWCont, classes2remove);
  // if (classes2remove.length > 0) {
  //   classes2remove.forEach(function(classe) {
  //     console.log("cl", classe);
  //     showNodeWCont.classList.remove(classe);
  //   })
  // }

  let class2remove = document.getElementById("weather-container").className;

  // console.log(class2remove);
  // console.log(showNodeWCont);

  if (class2remove) {
    showNodeWCont.classList.remove(class2remove);
  }
  // console.log(showNodeWCont);
  if (showNodeWCont.hasChildNodes()) {
    while (showNodeWCont.firstChild) {
      showNodeWCont.removeChild(showNodeWCont.firstChild);
    }
  }
}

// pour savoir si nuit ou jour pour affichage bkgd
function getNightOrDay(timeStamp, timeSunSet, timeSunRise) {
  const sunSet = new Date(timeSunSet * 1000);
  const sunRise = new Date(timeSunRise * 1000);
  const now = new Date(timeStamp * 1000);
  let nowTime = parseFloat(now.getUTCHours() + now.getUTCMinutes() * 0.01);
  let nowRise = parseFloat(
    sunRise.getUTCHours() + sunRise.getUTCMinutes() * 0.01
  );
  let nowSet = parseFloat(sunSet.getUTCHours() + sunSet.getUTCMinutes() * 0.01);

  if ((nowTime >= 0 && nowTime < nowRise) || nowTime >= nowSet) {
    document.querySelector("body").style.background =
      "linear-gradient(to bottom, #000000, #082e4e)";
  } else if (nowTime < nowSet && nowTime > nowRise) {
    document.querySelector("body").style.background =
      "linear-gradient(to bottom, #004683, #881da8)";
  } else {
    console.log("PB!!!!!!");
  }
}

// pour calculer le jour
function getTheDay(timeStamp) {
  const myDate = new Date(timeStamp * 1000);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dday = days[myDate.getUTCDay()];
  return dday;
}

// pour creer div container txt/img
function createDivItem(
  timeStamp,
  weatherTemp,
  weatherTempMinMax,
  metrics,
  selectedNumber
) {
  let metric;
  if (metrics === "celsius") {
    metric = "&#8451;";
  } else {
    metric = "&#8457;";
  }
  let dday = getTheDay(timeStamp);

  let divItem = document.createElement("div");
  divItem.classList.add("weather-item");

  let divTxt = document.createElement("div");
  divTxt.classList.add("weather-text", "heading-secondary");
  divTxt.textContent = dday;
  divItem.setAttribute("id", dday.toLowerCase());
  divItem.appendChild(divTxt);

  let divTemp = document.createElement("div");
  divTemp.classList.add("weather-temp", "heading-secondary");
  divTemp.innerHTML = weatherTemp + metric;
  divItem.appendChild(divTemp);

  let divTempMinMax = document.createElement("div");
  divTempMinMax.classList.add("weather-temp-min-max", "heading-tertiary");
  divTempMinMax.innerHTML = weatherTempMinMax;
  divItem.appendChild(divTempMinMax);

  let display = "";
  if (selectedNumber > 4) {
    display = "display-grid-" + selectedNumber;
  } else {
    display = "display-flex";
  }
  // console.log(display);
  document.getElementById("weather-container").classList.add(display);
  document.getElementById("weather-container").appendChild(divItem);
}

// pour ajouter attributs src et alt a icone creee
function setImgSrcAlt(dict) {
  wImage.setAttribute(dict[0][0], dict[0][1]);
  wImage.setAttribute(dict[1][0], dict[1][1]);
}

// pour creer icone
function createImage(weatherId, weatherMain) {
  // creation et selection image
  let divBox = document.createElement("div");
  divBox.classList.add("weather-img-box");
  // console.log("img div i", i);
  wImage = document.createElement("img");
  wImage.classList.add("weather-img");
  if (weatherMain === "Snow") {
    setImgSrcAlt(weatherIcons.Snow);
  } else if (weatherMain === "Clear") {
    setImgSrcAlt(weatherIcons.Clear);
  } else if (weatherMain === "Clouds") {
    if (weatherId === "801" || weatherId === "802") {
      setImgSrcAlt(weatherIcons.Cloudy);
    } else {
      setImgSrcAlt(weatherIcons.Clouds);
    }
  } else {
    setImgSrcAlt(weatherIcons.Else);
  }

  divBox.appendChild(wImage);
  let dday = getTheDay(timeStamp).toLowerCase();
  document.getElementById(dday).appendChild(divBox);
}

// recup donnees pour appel fcts affichage image
function getWeatherDays(data, metrics) {
  for (let i = 0; i < selectedNumber; i += 1) {
    console.log(data);
    let offset = data.timezone_offset;
    let timeSunSet = data.current.sunset + offset;
    let timeSunRise = data.current.sunrise + offset;
    if (i === 0) {
      weatherId = data.current.weather[0].id;
      weatherMain = data.current.weather[0].main;
      weatherTemp = data.current.temp;
      weatherTempMinMax =
        data.daily[i].temp.min.toFixed(0) +
        "° / " +
        data.daily[i].temp.max.toFixed(0) +
        "°";
      timeStamp = data.current.dt + offset;
      getNightOrDay(timeStamp, timeSunSet, timeSunRise);
      // console.log(weatherTempMinMax);
    } else {
      weatherId = data.daily[i].weather[0].id;
      weatherMain = data.daily[i].weather[0].main;
      weatherTemp = data.daily[i].temp.day;
      weatherTempMinMax =
        data.daily[i].temp.min.toFixed(0) +
        "° / " +
        data.daily[i].temp.max.toFixed(0) +
        "°";
      timeStamp = data.daily[i].dt + offset;
    }
    // console.log(weatherTemp);
    weatherTemp = weatherTemp.toFixed(0);
    // console.log(weatherTemp);
    createDivItem(
      timeStamp,
      weatherTemp,
      weatherTempMinMax,
      metrics,
      selectedNumber
    );
    createImage(weatherId, weatherMain);
  }
}

/*
    récupère lat et lng par res de l'api openCage
*/
function getLatLng(data) {
  // console.log("YY", data);
  // 2 syntaxes quasi identiques
  // document.getElementById("city-formatted").textContent = data[0]["formatted"];
  // cityLat = data[0]["geometry"]["lat"];
  if (data.length > 0) {
    document.getElementById("city-formatted").textContent = data[0].formatted;
    cityLat = data[0].geometry.lat;
    cityLong = data[0].geometry.lng;
    if (cityLat && cityLong) {
      return;
    }
  } else {
    console.log("exit");
    // document.getElementById("missing-error-message").textContent = "Can't find that city, sorry!";
    // document.getElementById("city-formatted").textContent = "";
    // document.getElementById("weather-container").style.display = "none";
  }
}

// async / await = asynchrone synchrone
// rendre synchrone la resolution des PROMESSES
// g a AWAIT

async function main(city, metrics) {
  await fetch(`${openCageApi}key=${openCageApiKey}&q=${city}&language=en`)
    // .catch(error => console.log('non', error))
    .then((result) => result.json())
    .then((json) => json.results)
    .then((results) => {
      // console.log("XX" + results);
      // getLatLng(results);
      // console.log(results.length);
      if (results.length > 0) {
        getLatLng(results);
      } else {
        document.getElementById("missing-error-message").textContent =
          "Can't find that city, sorry!";
        document.getElementById("city-formatted").textContent = "";
        // document.getElementById("weather-container").style.display = "none";
        document.getElementById("weather-container").classList.add("to-hide");
        // cleanUp();
        // return;
      }
    });
  if (!cityLat || !cityLong) {
    console.log("EXIT HERE", cityLat, cityLong);
  } else {
    let metricApi = "";
    if (metrics === "celsius") {
      metricApi = "&units=metric";
    }
    let meteo = await fetch(
      `${openWeatherApi}lat=${cityLat}&lon=${cityLong}&exclude=${openWeatherExclude}&appid=${openWeatherApiKey}${metricApi}`
    )
      .then((result) => result.json())
      .then((json) => json);
    // console.log(meteo);
    getWeatherDays(meteo, metrics);
  }
}

// action
$(document).ready(function () {
  $("button").click(function (e) {
    e.preventDefault();
    cleanUp();
    let city = document.getElementById("city-name-input").value;
    // console.log(city);
    if (city) {
      document.getElementById("missing-error-message").textContent = "";
      let selectElmt = document.getElementById("week-days");
      selectedNumber = selectElmt.options[selectElmt.selectedIndex].value;
      // console.log(selectedNumber);
      let metrics = $("input[name='radio']:checked").val();
      // console.log(metrics);
      // $("input[type='radio']")
      // .change(function(){ // bind a function to the change event
      //   if( $(this).is(":checked") ){ // check if the radio is checked
      //       var val = $(this).val(); // retrieve the value
      //   }
      // // .click(function(){
      // //   var val = $("input[name='radio']:checked").val();
      // //   if(val){
      //     console.log("choix temp " + val);
      // //   }
      // });
      main(city, metrics);
    } else {
      document.getElementById("missing-error-message").textContent =
        "Need a name!";
      document.getElementById("city-formatted").textContent = "";
    }
    // document.getElementById("form-city").reset();
  });
});

Util.setScrolling();
///////////////////////////////////////////////////////////
// pour calculer copyright year
// const copyrightYear = document.querySelector(".copyright-year");
// const currentYear = new Date().getFullYear();
// copyrightYear.textContent = currentYear;
// document.querySelector(".copyright-year").textContent = new Date().getFullYear();
Util.setCopyright();
Util.checkFlexGap();
