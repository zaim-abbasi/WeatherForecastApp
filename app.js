const API_KEY = 'bc0fa202a86cb245163f46098adb1397';
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
import { GoogleGenerativeAI } from "google-generative-ai";

const GEMINI_API_KEY = "AIzaSyBiAqNp9D5w_lssMVnDhmfk6d5kqa7WPxw";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// temp comment
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const geolocateBtn = document.getElementById('geolocateBtn');
const celsiusCheckbox = document.getElementById('celsius');
const fahrenheitCheckbox = document.getElementById('fahrenheit');
const weatherWidget = document.getElementById('weatherWidget');
const cityName = document.getElementById('cityName');
const weatherInfo = document.getElementById('weatherInfo');
const forecastTableBody = document.getElementById('forecastTableBody');
const pagination = document.getElementById('pagination');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

const sortAscBtn = document.getElementById('sortAscBtn');
const sortDescBtn = document.getElementById('sortDescBtn');
const filterRainBtn = document.getElementById('filterRainBtn');
const highestTempBtn = document.getElementById('highestTempBtn');

let currentWeatherData = null;
let forecastData = null;
let currentUnit = 'metric';
// LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL



// DONKEY OIL
function initializeApp() {
    getWeatherBtn.addEventListener('click', () => getWeather(cityInput.value));
    geolocateBtn.addEventListener('click', getUserLocation);
    sendChatBtn.addEventListener('click', sendChatMessage);
    celsiusCheckbox.addEventListener('change', handleUnitChange);
    fahrenheitCheckbox.addEventListener('change', handleUnitChange);
    document.getElementById('dashboardLink').addEventListener('click', showDashboard);
    document.getElementById('tablesLink').addEventListener('click', showTables);
    showDashboard();
    sortAscBtn.addEventListener('click', () => sortTemperatures('asc'));
    sortDescBtn.addEventListener('click', () => sortTemperatures('desc'));
    filterRainBtn.addEventListener('click', filterRainyDays);
    highestTempBtn.addEventListener('click', showHighestTemperature);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    sendChatBtn.addEventListener('click', sendChatMessage);

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getWeather(cityInput.value);
    });
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    // Add animations
    getWeatherBtn.classList.add('pulse');
    geolocateBtn.classList.add('bounce');
    loadingSpinner.querySelector('div').classList.add('rotate');
}

function handleUnitChange(event) {
    if (event.target.checked) {
        currentUnit = event.target.value;
        if (event.target.id === 'celsius') {
            fahrenheitCheckbox.checked = false;
        } else {
            celsiusCheckbox.checked = false;
        }
        if (currentWeatherData && forecastData) {
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);
            updateCharts(forecastData);
        }
    } else {
        event.target.checked = true; // Ensure at least one checkbox is always checked
    }
}

async function getWeather(city) {
    if (!city) return;

    showLoading(true);

    try {
        const currentWeather = await fetchWeatherData(`${WEATHER_API_BASE_URL}/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}`);
        const forecast = await fetchWeatherData(`${WEATHER_API_BASE_URL}/forecast?q=${city}&units=${currentUnit}&appid=${API_KEY}`);

        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
        updateCharts(forecast);

        currentWeatherData = currentWeather;
        forecastData = forecast;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    } finally {
        showLoading(false);
    }
}

async function fetchWeatherData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Weather data not found');
    }
    return response.json();
}

function displayCurrentWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    weatherInfo.innerHTML = `
        <div class="fade-in">
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" class="weather-icon">
            <p>${data.weather[0].description}</p>
        </div>
        <div class="slide-in">
            <p>Temperature: ${Math.round(data.main.temp)}${tempUnit}</p>
            <p>Feels like: ${Math.round(data.main.feels_like)}${tempUnit}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
    `;
    weatherWidget.style.backgroundImage = getWeatherBackground(data.weather[0].main);
    weatherWidget.classList.remove('hidden');
}

function getWeatherBackground(weatherCondition) {
    const backgrounds = {
        Clear: 'url("clear.png")',
        Clouds: 'url("clouds.jpg")',
        Rain: 'url("Rainy.png")',
        Snow: 'url("snow.jpg")',
        Thunderstorm: 'url("Thunderstorm.jpg")',
    };
    return backgrounds[weatherCondition] || backgrounds.Clear;
}

function displayForecast(data) {
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    forecastTableBody.innerHTML = '';
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    dailyForecasts.forEach(forecast => {
        const row = forecastTableBody.insertRow();
        row.innerHTML = `
            <td>${new Date(forecast.dt * 1000).toLocaleDateString()}</td>
            <td>${Math.round(forecast.main.temp)}${tempUnit}</td>
            <td>${forecast.weather[0].description}</td>
            <td>${forecast.main.humidity}%</td>
            <td>${forecast.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</td>
        `;
        row.classList.add('hover-scale');
    });
}

function updateCharts(data) {
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    const dates = dailyForecasts.map(forecast => new Date(forecast.dt * 1000).toLocaleDateString());
    const temperatures = dailyForecasts.map(forecast => Math.round(forecast.main.temp));
    const conditions = dailyForecasts.map(forecast => forecast.weather[0].main);

    updateTemperatureBarChart(dates, temperatures);
    updateConditionsDoughnutChart(conditions);
    updateTemperatureLineChart(dates, temperatures);
}

function updateTemperatureBarChart(labels, data) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (${currentUnit === 'metric' ? '°C' : '°F'})`,
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                delay: 500
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateConditionsDoughnutChart(conditions) {
    const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('conditionsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                data: Object.values(conditionCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                delay: 500
            }
        }
    });
}

function updateTemperatureLineChart(labels, data) {
    const ctx = document.getElementById('temperatureLineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (${currentUnit === 'metric' ? '°C' : '°F'})`,
                data: data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeOutBounce'
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addChatMessage('user', message);
    chatInput.value = '';

    const weatherKeyword = message.toLowerCase().includes('weather');
    const recommendationKeywords = ['recommend', 'suggestion', 'advice', 'what should i', 'going outside'];
    const cityName = extractCityName(message);

    if (!cityName) {
        addChatMessage('bot', "I'm sorry, I don't have enough information to answer that question. Please include a city name in your question.");
        return;
    }

    try {
        showLoading(true);
        const weatherData = await fetchWeatherData(`${WEATHER_API_BASE_URL}/weather?q=${cityName}&units=${currentUnit}&appid=${API_KEY}`);
        const geminiResponse = await generateGeminiResponse(message, cityName, weatherData, weatherKeyword, recommendationKeywords.some(keyword => message.toLowerCase().includes(keyword)));
        addChatMessage('bot', geminiResponse, true);
    } catch (error) {
        console.error('Error fetching weather data or generating response:', error);
        addChatMessage('bot', "I'm sorry, I couldn't fetch the weather information. Please try again later.");
    } finally {
        showLoading(false);
    }
}

function extractCityName(message) {
    const words = message.split(' ');
    const cityIndex = words.findIndex(word => word.toLowerCase() === 'in') + 1;
    return cityIndex > 0 && cityIndex < words.length ? words[cityIndex] : null;
}

async function generateGeminiResponse(userQuery, cityName, weatherData, isWeatherQuery, isRecommendationQuery) {
    let prompt = `
        User query: "${userQuery}"
        City: ${cityName}
        Weather data: ${JSON.stringify(weatherData)}
        
        Please generate a response to the user's query about ${cityName}. 
    `;

    if (isWeatherQuery) {
        prompt += `Include current weather information. `;
    }

    if (isRecommendationQuery) {
        prompt += `Provide recommendations for going outside, including what to wear or activities suitable for the current weather. `;
    }

    prompt += `The response should be 2-3 sentences long and professional in tone.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

function addChatMessage(sender, message, isStyled = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    if (isStyled && sender === 'bot') {
        const styledMessage = styleBotMessage(message);
        messageElement.innerHTML = styledMessage;
    } else {
        messageElement.textContent = message;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function styleBotMessage(message) {
    const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#7ED321'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `<span style="color: ${randomColor}; font-weight: bold;">${message}</span>`;
}

function showDashboard() {
    document.getElementById('dashboardPage').classList.remove('hidden');
    document.getElementById('tablesPage').classList.add('hidden');
    document.getElementById('dashboardLink').classList.add('bg-gray-700');
    document.getElementById('tablesLink').classList.remove('bg-gray-700');
}

function showTables() {
    document.getElementById('dashboardPage').classList.add('hidden');
    document.getElementById('tablesPage').classList.remove('hidden');
    document.getElementById('dashboardLink').classList.remove('bg-gray-700');
    document.getElementById('tablesLink').classList.add('bg-gray-700');
}

function getUserLocation() {
    if (navigator.geolocation) {
        showLoading(true);
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            error => {
                console.error('Error getting user location:', error);
                alert('Unable to get your location. Please enter a city name manually.');
                showLoading(false);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter a city name manually.');
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const currentWeather = await fetchWeatherData(`${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`);
        const forecast = await fetchWeatherData(`${WEATHER_API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`);

        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
        updateCharts(forecast);

        currentWeatherData = currentWeather;
        forecastData = forecast;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    loadingSpinner.classList.toggle('hidden', !isLoading);
}

function sortTemperatures(order) {
    if (!forecastData) return;

    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
    dailyForecasts.sort((a, b) => {
        return order === 'asc' ? a.main.temp - b.main.temp : b.main.temp - a.main.temp;
    });

    displayForecast({ list: dailyForecasts });
}

function filterRainyDays() {
    if (!forecastData) return;

    const rainyDays = forecastData.list.filter(item => item.weather[0].main.toLowerCase().includes('rain'));
    displayForecast({ list: rainyDays });
}

function showHighestTemperature() {
    if (!forecastData) return;

    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
    const highestTemp = dailyForecasts.reduce((max, forecast) => {
        return forecast.main.temp > max.main.temp ? forecast : max;
    }, dailyForecasts[0]);

    displayForecast({ list: [highestTemp] });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);