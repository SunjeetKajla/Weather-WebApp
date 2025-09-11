function getWeather() {
    const city = document.getElementById('city').value;
    if (city) {
        getWeatherData(city);
    }
}

function getWeatherData(city) {
    
    const apiKey = '86af87d3830921d5071278e4dd48a39d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                document.getElementById('weatherInfo').style.display = 'none';
                alert("City not found!");
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('weatherInfo').style.display = 'block';
            displayWeatherData(data);
            document.getElementById('city').value = '';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('weatherInfo').style.display = 'none';
        });
}

function displayWeatherData(data) {
    document.getElementById('cityName').innerText = `Weather in ${data.name}`;
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp} °C`;
    document.getElementById('feelslike').innerText = `Feels Like: ${data.main.feels_like} °C`;
    document.getElementById('minTemp').innerText = `Min Temperature: ${data.main.temp_min} °C`;
    document.getElementById('maxTemp').innerText = `Max Temperature: ${data.main.temp_max} °C`;
    document.getElementById('description').innerText = `Description: ${data.weather[0].description}`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('windSpeed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
}