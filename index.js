//Defining all the variables and DOM.

let cityName = document.getElementById("inputData");
let temp = document.getElementById("temp");
let min_max = document.querySelector("#min_max #temp_range");
let weather = document.querySelector("#min_max #weather");
let slider = document.getElementById("slider_button");
let airPressure = document.querySelector(".pressure");
let windSpeed = document.querySelector(".wind");
let visibility = document.querySelector(".visibility");
let rainfall = document.querySelector(".rain");
let forcast = document.querySelector(".forcast").firstElementChild;
let lastChild = document.querySelector(".forcast").lastElementChild;
let feels_like = document.querySelector(".feels_like");
let collectionOfElems = document.getElementsByClassName("hourlyForcast");
let hourlyData = Array.from(collectionOfElems);
let horizontalSlider = document.getElementById("horizontalSlide");
let buttons = document.getElementsByClassName("button");
let arrayOfButtons = Array.from(buttons);
const api_key = "970c671602970b7ec8f4c05a7ac46ea9";


//Here we are calling the function on change of the value of input element...
cityName.addEventListener("change", (event) => {
  getData();
  hourlyForcast();
});

//This function below  makes first letter capital casing....
const letterCasing = () => {
  let arrayOfNames = [cityName.value, weather.innerHTML];
  arrayOfNames.forEach(function (elem) {
    let correctName = elem.charAt(0).toUpperCase() + elem.slice(1);
    if (elem == cityName.value) {
      cityName.value = correctName;
    } else {
      weather.innerHTML = correctName;
    }
  });
};

//Fetching current weather data using async/await.
const getData = async () => {
  try {
    //Here we are fetching the weather related data from the weather API...
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&appid=${api_key}`
    );
    const data = await response.json();

    //We are extracting the temperature basis on the cityname...
    if (data.main?.temp == undefined) {
      return (temp.innerHTML = "Not found !!");
    } else {
      temp.innerHTML = Math.ceil(data.main.temp - 273.15) + "°C";
    }

    //We are extracting the waether description from the data we have got as a response...
    let weather_description = data.weather[0].description;
    weather.innerHTML = weather_description;

    //Check about this function above and this is the correct place to call this func...
    letterCasing();

    // Here we will get the min and max temperature from the data...
    let min_temp = Math.floor(data.main.temp_min - 273.15);
    let max_temp = Math.ceil(data.main.temp_max - 273.15);
    min_max.innerHTML = min_temp + " ~ " + max_temp + "°C";

    //Air pressure
    airPressure.innerHTML = data.main.pressure + " hPa";

    //Wind speed
    windSpeed.innerHTML = data.wind.speed + " m/s";

    //Visibility
    visibility.innerHTML = data.visibility / 1000 + " km";

    //Chances of Rain
    rainfall.innerHTML = data.clouds.all + " %";

    //Getting city name and temp..
    forcast.innerHTML = cityName.value;
    lastChild.innerHTML = temp.innerHTML;
    feels_like.innerHTML = Math.ceil(data.main.feels_like - 273.15) + " °C";
  } catch (error) {
    console.log(error);
    console.log("link has been broken !!!");
  }
};

getData();

//Fetching hourlyforcast weather data.
const hourlyForcast = async () => {
  try {
    let fetchingData = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName.value}&appid=${api_key}`
    );
    let res = await fetchingData.json();

    //  Here we are modifying our html static values with 3 hour gap dynamic weather related information.
    //Here we will get weather related information with a gap of each 3hours...
    let dataList = res.list;
    for (let i = 0; i <= 6; i++) {
      let hourlyTime = dataList[i].dt_txt.slice(11).substr(0, 5);
      let elementsForHourlyTime =
        hourlyData[i].firstElementChild.nextElementSibling;
      elementsForHourlyTime.innerHTML = hourlyTime;
      let storeHourlytemp = dataList[i];
      let storeElem = hourlyData[i].lastElementChild;
      let finalHourlyTemp = Math.floor(storeHourlytemp.main.temp - 273.15);
      storeElem.innerHTML = finalHourlyTemp + "°C";
    }
  } catch (error) {
    console.log(error);
    console.log("Link has been broken");
  }
};

hourlyForcast();

//Sliding effect on a button click....
const [button1, button2] = arrayOfButtons;
arrayOfButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    //  console.log(event.target);
    if (button1.firstElementChild == event.target) {
      console.log("First");
      horizontalSlider.classList.remove("-translate-x-28");
      horizontalSlider.classList.add("translate-x-1");
    } else {
      horizontalSlider.classList.remove("translate-x-1");
      horizontalSlider.classList.add("-translate-x-28");
    }
  });
});

//This function below creates animation.......
let x = 0;
slider.addEventListener("click", () => {
  let animate = document.querySelector(".animate");
  let arrowAnimate = document.querySelector(".arrow");
  console.log(arrowAnimate);
  if (x == 0) {
    animate.classList.remove("reverse");
    animate.classList.add("slider_div");
    arrowAnimate.style.transform = "rotate(180deg)";
    button1.style.bottom = "26.7rem";
    button2.style.bottom = "26.7rem";
    x = 1;
  } else {
    animate.classList.remove("slider_div");
    animate.classList.add("reverse");
    arrowAnimate.style.transform = "rotate(0deg)";
    button1.style.bottom = "3.7rem";
    button2.style.bottom = "3.7rem";
    x = 0;
  }
});

//Preventing default regreshing of the page when enter key is pressed..
function mykey(event) {
  let keyPress = event.key;
  if (keyPress == "Enter") {
    event.preventDefault();
    getData();
    hourlyForcast();
  }
}

