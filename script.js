async function getWeatherInfo(cityName, units) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&APPID=7ac9785e14eca9edee665cd8714f7dd7`, {mode: 'cors'});
        if (response.status == 200) {
            const weatherData = await response.json();
            return weatherData;
        } else {
            throw new Error(response.status);
        }
    } catch(error) {
        return;
    }
}

function organizeData(weatherData) {
    this.name = weatherData.name;
    this.weather = weatherData.weather[0];
    this.temperature = weatherData.main.temp;
    this.feelsLike = weatherData.main.feels_like;
    this.wind = weatherData.wind.speed;
}

function loadDataIntoDom(cityData, units) {
    const container = document.querySelector('.container');
    const dataContainer = document.createElement('div');
    dataContainer.classList.add('infoDisplay');
    
    const cityName = document.createElement('div');
    cityName.classList.add('name');
    cityName.innerHTML = cityData.name;
    
    const generalWeather = document.createElement('div');
    generalWeather.classList.add('generalWeather');

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weatherIcon');
    weatherIcon.src = `http://openweathermap.org/img/wn/${cityData.weather.icon}@2x.png`;

    const desc = document.createElement('div');
    desc.classList.add('desc');

    const weather = document.createElement('p');
    weather.classList.add('weather');
    weather.innerHTML = cityData.weather.main;

    const weatherDesc = document.createElement('p');
    weatherDesc.classList.add('weatherDesc');
    weatherDesc.innerHTML = cityData.weather.description;

    desc.appendChild(weather);
    desc.appendChild(weatherDesc);

    generalWeather.appendChild(weatherIcon);
    generalWeather.appendChild(desc);

    const specifics = document.createElement('div');
    specifics.classList.add('specifics');

    const others = document.createElement('div');
    others.classList.add('others');

    const temperature = document.createElement('div');
    temperature.classList.add('temperature');
    temperature.innerHTML = 'Temperature:';

    const feelsLike = document.createElement('div');
    feelsLike.classList.add('feelsLike');
    feelsLike.innerHTML = 'Feels Like:';

    const windSpeed = document.createElement('div');
    windSpeed.classList.add('windSpeed');
    windSpeed.innerHTML = 'Wind Speed:';

    others.appendChild(temperature);
    others.appendChild(feelsLike);
    others.appendChild(windSpeed);

    const values = document.createElement('div');
    values.classList.add('values');

    const temperatureValue = document.createElement('div');
    temperatureValue.classList.add('temperatureValue');

    const feelsLikeValue = document.createElement('div');
    feelsLikeValue.classList.add('feelsLikeValue');

    const windSpeedValue = document.createElement('div');
    windSpeedValue.classList.add('windSpeedValue');

    if (units == 'metric') {
        temperatureValue.innerHTML = `${cityData.temperature} °C`;
        feelsLikeValue.innerHTML = `${cityData.feelsLike} °C`;
        windSpeedValue.innerHTML = `${cityData.wind} Km/h`;
    } else {
        temperatureValue.innerHTML = `${cityData.temperature} °F`;
        feelsLikeValue.innerHTML = `${cityData.feelsLike} °F`;
        windSpeedValue.innerHTML = `${cityData.wind} Mph`;
    }

    values.appendChild(temperatureValue);
    values.appendChild(feelsLikeValue);
    values.appendChild(windSpeedValue);

    specifics.appendChild(others);
    specifics.appendChild(values);

    dataContainer.appendChild(cityName);
    dataContainer.appendChild(generalWeather);
    dataContainer.appendChild(specifics);
    container.append(dataContainer);
}

function removeOldData() {
    const oldData = document.querySelector('.container');
    oldData.innerHTML = '';
}

function loadingMsg() {
    const container = document.querySelector('.container');
    const loadingMsg = document.createElement('div');
    loadingMsg.classList.add('loading');
    loadingMsg.innerHTML = "Retrieving data...";
    container.appendChild(loadingMsg);
}

function backgroundChanges(cityData) {
    const weatherId = parseInt(cityData.weather.id);
    const dayOrNight = cityData.weather.icon[2];
    if (weatherId == 800) {
        if (dayOrNight == 'd') {
            document.body.style.backgroundColor = 'rgba(17, 158, 223, 0.486)';
        } else {
            document.body.style.backgroundColor = 'rgb(216, 216, 216)';
        }
    } else if (weatherId / 100 >> 0 == 2) {
        document.body.style.backgroundColor = 'rgba(114, 114, 114, 0.486)';
    } else if (weatherId / 100 >> 0 == 3) {
        document.body.style.backgroundColor = 'rgba(168, 168, 168, 0.486)';
    } else if (weatherId / 100 >> 0 == 5) {
        if (dayOrNight == 'd') {
            document.body.style.backgroundColor = 'rgba(116, 109, 88, 0.486)';
        } else {
            document.body.style.backgroundColor = 'rgba(88, 101, 116, 0.486)';
        }
    } else if (weatherId / 100 >> 0 == 6) {
        document.body.style.backgroundColor = 'rgba(129, 185, 189, 0.486)';
    } else if (weatherId / 100 >> 0 == 7) {
        document.body.style.backgroundColor = 'rgba(41, 60, 61, 0.603)';
    } else if (weatherId / 100 >> 0 == 8) {
        document.body.style.backgroundColor = 'rgba(134, 145, 146, 0.377)';
    }
}

document.querySelector('.searchBtn').addEventListener('click', async function() {
    removeOldData();
    const searchInput = document.querySelector('.citySearch').value;
    let units = document.querySelector('.toggleSwitch');
    if (units.checked) {
        units = 'imperial';
    } else {
        units = 'metric'
    }
    loadingMsg();
    const weatherData = await getWeatherInfo(searchInput, units);
    removeOldData();
    if (weatherData) {
        const cityData = new organizeData(weatherData);
        backgroundChanges(cityData);
        loadDataIntoDom(cityData, units);
    } else {
        const container = document.querySelector('.container');
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('errorMsg');
        errorMsg.innerHTML = "Couldn't find city weather data";
        container.appendChild(errorMsg);
    }
})