var searchField = document.querySelector('#searchField');
const cityInput = document.querySelector("#city")
const inputValue = document.querySelector(".inputValue");
const history = document.querySelector(".history");
const display = document.querySelector(".display");
const cityName = document.querySelector(".name");
const date = document.querySelector(".date");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const uv = document.querySelector(".uv");
let wDisplay = document.querySelector("#wDisplay");
const forcast = document.querySelector("#forcastContainer");
let pastSearchBtn = document.querySelector("#pastSearchBtn");
let cities = [];

let formSubmitHandler = function (event) {
    event.preventDefault();
    let city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        getForcast(city);
        cityInput.value = "";
    } else {
        alert("Please enter a City");
    }

    saveSearch();
    pastSearch(city);
}
// getting api  for 5-day forcast
let getForcast = function (city) {
    const requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputValue.value + "&units=imperal&appid=1483407154edd2e0bda63bf21519c92c";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then((data) => {
            console.log(data);

            // empty div to create elements and append
            let cName = document.createElement('h3');
            cName.textContent = data.city.name;
            forcast.append(cName);
            // loop for 5-day forcast
            for (let i = 5; i < data.list.length; i = i + 8) {
                // create element for empty div in html
                let forcastDate = document.createElement("h5");
                let temperature = document.createElement('p');
                let humid = document.createElement('p');
                let weatherIcon = document.createElement("img");
                // let tempF = (data.list[i].main.temp - 273.15) * 1.80 + 32;
                // tempF = Math.floor(tempF);
                forcastDate.textContent = moment.unix(data.list[i].dt).format("MMM D, YYYY");
                temperature.textContent = ("Temperature: " + data.list[i].main.temp);
                humid.textContent = ("Humdity: " + data.list[i].main.humidity + "%");
                weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon + ".png"}`)

                forcast.append(forcastDate);
                forcast.append(weatherIcon);
                forcast.append(temperature);
                forcast.append(humid);
            }
        });
}
// getting api for current day
let getWeather = function (city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1483407154edd2e0bda63bf21519c92c`
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            showWeather(data, city);
            console.log(data);
        })
}

let showWeather = function (weather) {

    let currentDate = document.createElement("span");
    currentDate.textContent = moment(weather.dt.value).format("MMM D, YYYY");
    wDisplay.appendChild(currentDate);

    let wIcon = document.createElement("img")
    wIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    wDisplay.appendChild(wIcon);

    let tempValue = document.querySelector(".temp");
    let humidityValue = document.querySelector(".humidity");
    let windValue = document.querySelector(".wind");


    tempValue.textContent = ("Temperature: " + weather.main.temp + "°F");
    humidityValue.textContent = ("Humdity: " + weather.main.humidity + "%");
    windValue.textContent = ("Wind: " + weather.wind.speed + "MPH");

    let lat = weather.coord.lat;
    let lon = weather.coord.lon;
    getUv(lat, lon)

};
// getting api for uv index
let getUv = function (lat, lon) {
    let api = `https://api.openweathermap.org/data/2.5/uvi?appid=1483407154edd2e0bda63bf21519c92c&lat=${lat}&lon=${lon}`
    fetch(api)
        .then(function (response) {
            response.json().then(function (data) {
                showUv(data)
            });
        });
}

let showUv = function (index) {

    uvIndex = document.createElement("p");
    uvIndex.textContent = "UV Index: "

    uvValue = document.createElement("span")
    uvValue.textContent = index.value

    if (index.value <= 2) {
        uvValue.classList = "good"
    } else if (index.value > 2 && index.value <= 8) {
        uvValue.classList = "moderate"
    }
    else if (index.value > 8) {
        uvValue.classList = "severe"
    };

    uvIndex.appendChild(uvValue);

    display.appendChild(uvIndex);
}

let pastSearch = function (pastSearch) {

    let pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchBtn.prepend(pastSearchEl);
}
let pastSearchHand = function (event) {
    let city = event.target.getattribute("data-city")
    if (city) {
        getWeather(city);
        getForcast(city);
    }
}

let saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
}
searchField.addEventListener('submit', formSubmitHandler);
pastSearchBtn.addEventListener("click", pastSearchHand)


