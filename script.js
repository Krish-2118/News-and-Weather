// API Keys - Replace these with your actual API keys
const WEATHER_API_KEY = '57a3370aa89a77dbe0a7a068f44255e8';
const NEWS_API_KEY = '54a33a04bc4f40e8bcdb3394c5f6b45d';

// DOM Elements
const weatherBtn = document.getElementById('weatherBtn');
const newsBtn = document.getElementById('newsBtn');
const searchSection = document.querySelector('.search-section');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const newsContainer = document.getElementById('newsContainer');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const closeModal = document.querySelector('.close');

let currentMode = null; // 'weather' or 'news'

// Event Listeners
weatherBtn.addEventListener('click', () => showSearchSection('weather'));
newsBtn.addEventListener('click', () => showSearchSection('news'));
searchBtn.addEventListener('click', handleSearch);
closeModal.addEventListener('click', () => errorModal.style.display = 'none');

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === errorModal) {
        errorModal.style.display = 'none';
    }
});

function showSearchSection(mode) {
    currentMode = mode;
    searchSection.style.display = 'block';
    weatherInfo.style.display = 'none';
    newsContainer.style.display = 'none';
    
    // Update placeholder based on mode
    searchInput.placeholder = mode === 'weather' 
        ? 'Enter city name for weather...' 
        : 'Enter keyword or city for news...';
}

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        showError('Please enter a search term');
        return;
    }

    if (currentMode === 'weather') {
        await getWeather(query);
    } else {
        await getNews(query);
    }
}

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === '404') {
            showError('City not found');
            return;
        }

        weatherInfo.style.display = 'block';
        weatherInfo.innerHTML = `
            <div class="weather-details">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-main">
                    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                    <h3>${Math.round(data.main.temp)}°C</h3>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-info">
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                    <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
                </div>
            </div>
        `;
    } catch (error) {
        showError('Error fetching weather data');
    }
}

async function getNews(query) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();

        if (data.status !== 'ok') {
            showError('Error fetching news');
            return;
        }

        newsContainer.style.display = 'grid';
        newsContainer.innerHTML = data.articles.slice(0, 6).map(article => `
            <div class="news-card">
                <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>${article.description || 'No description available'}</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `).join('');
    } catch (error) {
        showError('Error fetching news data');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

