let isCelsius = false;
let currentWeatherData = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    fetchData();
});

function initializeEventListeners() {
    const searchInput = document.querySelector('.search-input');
    const toggleSwitch = document.querySelector('.measurement-toggle');
    
    // Search functionality
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const location = e.target.value.trim();
            if (location) {
                fetchDataForLocation(location);
            }
        }
    });
    
    // Temperature unit toggle
    toggleSwitch.addEventListener('change', function(e) {
        isCelsius = e.target.checked;
        updateTemperatureDisplay();
        updateToggleLabels();
    });
}

// Show loading indicator
function showLoading() {
    const loader = document.getElementById('loading');
    loader.classList.add('active');
}

// Hide loading indicator
function hideLoading() {
    const loader = document.getElementById('loading');
    loader.classList.remove('active');
}

// Convert temperature between Fahrenheit and Celsius
function convertTemperature(temp, toCelsius = false) {
    if (toCelsius) {
        return Math.round((temp - 32) * 5/9);
    } else {
        return Math.round((temp * 9/5) + 32);
    }
}

// Update temperature display based on current unit
function updateTemperatureDisplay() {
    if (!currentWeatherData) return;
    
    const tempElement = document.getElementById('city-temp');
    const unitElement = document.querySelector('.temp-unit');
    
    let displayTemp = currentWeatherData.temperature;
    
    if (isCelsius) {
        displayTemp = convertTemperature(displayTemp, true);
        unitElement.textContent = '°C';
    } else {
        unitElement.textContent = '°F';
    }
    
    tempElement.textContent = displayTemp;
}

// Update toggle labels based on current selection
function updateToggleLabels() {
    const labels = document.querySelectorAll('.toggle-label');
    labels.forEach((label, index) => {
        if (index === 0) { // Fahrenheit label
            label.style.opacity = isCelsius ? '0.5' : '1';
            label.style.fontWeight = isCelsius ? '400' : '600';
        } else { // Celsius label
            label.style.opacity = isCelsius ? '1' : '0.5';
            label.style.fontWeight = isCelsius ? '600' : '400';
        }
    });
}

// Update weather icon based on conditions
function updateWeatherIcon(conditions) {
    const weatherIcon = document.querySelector('.weather-svg');
    
    // Simple icon mapping based on conditions
    const conditionLower = conditions.toLowerCase();
    
    let iconSVG = '';
    
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
        iconSVG = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    } else if (conditionLower.includes('cloud')) {
        iconSVG = `
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        `;
    } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
        iconSVG = `
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
            <path d="M16 14v6m-4-6v6m-4-6v6"></path>
        `;
    } else if (conditionLower.includes('snow')) {
        iconSVG = `
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        `;
    } else {
        // Default to sun icon
        iconSVG = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    }
    
    weatherIcon.innerHTML = iconSVG;
}

// Update all weather display elements
function updateWeatherDisplay(data) {
    const temp = data.currentConditions.temp;
    const conditions = data.currentConditions.conditions;
    const humidity = data.currentConditions.humidity;
    const windSpeed = data.currentConditions.windspeed;
    
    // Store current weather data
    currentWeatherData = {
        temperature: temp,
        conditions: conditions,
        humidity: humidity,
        windSpeed: windSpeed
    };
    
    // Update DOM elements
    const cityTemp = document.getElementById("city-temp");
    const cityConditions = document.getElementById("weather");
    const cityHumidity = document.getElementById("humidity");
    const cityWindSpeed = document.getElementById("wind");
    
    // Update temperature display
    updateTemperatureDisplay();
    
    // Update other weather data
    cityConditions.textContent = conditions;
    cityHumidity.textContent = `${humidity}%`;
    cityWindSpeed.textContent = `${windSpeed} mph`;
    
    // Update weather icon
    updateWeatherIcon(conditions);
    
    // Add smooth reveal animation
    const weatherSection = document.querySelector('.weather-section');
    weatherSection.style.opacity = '0';
    weatherSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        weatherSection.style.transition = 'all 0.6s ease';
        weatherSection.style.opacity = '1';
        weatherSection.style.transform = 'translateY(0)';
    }, 100);
}

// Fetch weather data for default location (Grand Junction)
function fetchData() {
    showLoading();
    
    fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/colorado/2025-07-13?key=X9CNXWSHWUESEV4FDA8ZNL5WL", {
        mode: 'cors'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        updateWeatherDisplay(data);
        hideLoading();
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        hideLoading();
        showError('Failed to load weather data. Please try again.');
    });
}

// Fetch weather data for a specific location
function fetchDataForLocation(location) {
    showLoading();
    
    // Update city name immediately for better UX
    document.getElementById('city').textContent = location;
    
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/2025-07-13?key=X9CNXWSHWUESEV4FDA8ZNL5WL`;
    
    fetch(apiUrl, {
        mode: 'cors'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        updateWeatherDisplay(data);
        hideLoading();
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        hideLoading();
        showError(`Failed to load weather data for ${location}. Please check the location and try again.`);
        // Revert to previous city name if API call fails
        document.getElementById('city').textContent = 'Grand Junction';
    });
}

// Show error message
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        backdrop-filter: blur(10px);
        z-index: 9999;
        font-size: 0.875rem;
        max-width: 300px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for error notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);