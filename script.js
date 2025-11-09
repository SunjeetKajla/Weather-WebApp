let date = new Date().getDate();
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();
let currentCity = '';

document.getElementById('2-day').innerText = (date + 2) + "-" + month + "-" + year;
document.getElementById('3-day').innerText = (date + 3) + "-" + month + "-" + year;
document.getElementById('4-day').innerText = (date + 4) + "-" + month + "-" + year;
document.getElementById('5-day').innerText = (date + 5) + "-" + month + "-" + year;

// Add event listeners for forecast buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('#day-selection button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => getForecastWeather(index));
    });
});

function getWeather() {
    const city = document.getElementById('city').value;
    if (city) {
        getWeatherData(city);
    }
}

function getWeatherData(city) {
    currentCity = city;
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
            document.getElementById('day-selection').style.display = 'block';
            displayWeatherData(data);
            document.getElementById('city').value = '';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('weatherInfo').style.display = 'none';
            document.getElementById('day-selection').style.display = 'none';
        });
}

function getForecastWeather(dayIndex) {
    if (!currentCity) return;
    
    const apiKey = '86af87d3830921d5071278e4dd48a39d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (dayIndex === 0) {
                getWeatherData(currentCity);
            } else {
                const forecastData = getForecastForDay(data, dayIndex);
                displayWeatherData(forecastData, dayIndex);
            }
        })
        .catch(error => console.error('Forecast fetch error:', error));
}

function getForecastForDay(data, dayIndex) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayIndex);
    
    // Get all forecasts for the target day
    const dayForecasts = data.list.filter(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.toDateString() === targetDate.toDateString();
    });
    
    if (dayForecasts.length === 0) {
        const forecastIndex = Math.min(dayIndex * 8, data.list.length - 1);
        return data.list[forecastIndex];
    }
    
    // Calculate min/max temperatures for the day
    const temps = dayForecasts.map(f => f.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    const baseForecast = dayForecasts.find(f => f.dt_txt.includes('12:00')) || dayForecasts[0];
    
    return {
        ...baseForecast,
        main: {
            ...baseForecast.main,
            temp_min: minTemp,
            temp_max: maxTemp
        }
    };
}

function displayWeatherData(data, dayIndex = null) {
    const cityName = data.name || currentCity;
    if (dayIndex !== null) {
        const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
        document.getElementById('cityName').innerText = `${days[dayIndex]} in ${cityName}`;
    } else {
        document.getElementById('cityName').innerText = `Weather in ${cityName}`;
    }
    
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