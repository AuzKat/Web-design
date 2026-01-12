import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
    constructor(config) {
        super({
            ...config,
            type: 'weather'
        });
        
        this.city = config.city || 'Москва';
        this.weatherData = null;
        this.lastUpdate = null;
        this.units = 'metric'; // metric для Цельсия, imperial для Фаренгейта
        
        // Загружаем данные о погоде
        this.fetchWeather();
    }

    renderBody() {
        if (this.isLoading) {
            return `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка погоды...</p>
                </div>
            `;
        }

        if (this.error) {
            return `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <p>${this.error}</p>
                    <button class="retry-btn" onclick="this.closest('.widget').__widget__.refresh()">
                        Обновить
                    </button>
                </div>
            `;
        }

        if (!this.weatherData) {
            return `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-cloud"></i>
                    </div>
                    <p>Данные о погоде недоступны</p>
                    <button class="retry-btn" onclick="this.closest('.widget').__widget__.refresh()">
                        Попробовать снова
                    </button>
                </div>
            `;
        }

        const temp = Math.round(this.weatherData.main.temp);
        const feelsLike = Math.round(this.weatherData.main.feels_like);
        const humidity = this.weatherData.main.humidity;
        const windSpeed = Math.round(this.weatherData.wind.speed * 10) / 10;
        const description = this.weatherData.weather[0].description;
        const iconCode = this.weatherData.weather[0].icon;
        
        const updateTime = this.lastUpdate 
            ? new Date(this.lastUpdate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
            : '--:--';

        const weatherIcons = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };

        const weatherIcon = weatherIcons[iconCode] || 'fas fa-cloud';

        return `
            <div class="weather-content">
                <div class="weather-current">
                    <div class="weather-icon">
                        <i class="${weatherIcon}"></i>
                    </div>
                    <div class="weather-temp">${temp}°C</div>
                    <div class="weather-description">${this.capitalizeFirstLetter(description)}</div>
                    <div class="weather-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${this.city}</span>
                    </div>
                </div>
                
                <div class="weather-details">
                    <div class="weather-detail">
                        <div class="detail-icon">
                            <i class="fas fa-temperature-low"></i>
                        </div>
                        <div class="detail-info">
                            <div class="detail-value">Ощущается как ${feelsLike}°C</div>
                            <div class="detail-label">Температура</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail">
                        <div class="detail-icon">
                            <i class="fas fa-tint"></i>
                        </div>
                        <div class="detail-info">
                            <div class="detail-value">${humidity}%</div>
                            <div class="detail-label">Влажность</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail">
                        <div class="detail-icon">
                            <i class="fas fa-wind"></i>
                        </div>
                        <div class="detail-info">
                            <div class="detail-value">${windSpeed} м/с</div>
                            <div class="detail-label">Ветер</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail">
                        <div class="detail-icon">
                            <i class="fas fa-compress-alt"></i>
                        </div>
                        <div class="detail-info">
                            <div class="detail-value">${this.weatherData.main.pressure} гПа</div>
                            <div class="detail-label">Давление</div>
                        </div>
                    </div>
                </div>
                
                <div class="weather-update">
                    <div class="update-time">
                        <i class="fas fa-clock"></i>
                        Обновлено: ${updateTime}
                    </div>
                    <button class="update-btn" onclick="this.closest('.widget').__widget__.refresh()">
                        <i class="fas fa-sync-alt"></i>
                        Обновить
                    </button>
                </div>
            </div>
        `;
    }

    async fetchWeather() {
        this.isLoading = true;
        this.error = null;
        this.update();
        
        try {
            // Используем OpenWeatherMap API (нужен API ключ)
            // Для демо используем мок данные, если API недоступно
            const apiKey = 'ваш_api_ключ'; // Замените на свой API ключ
            
            // Если нет API ключа, используем демо-данные
            if (!apiKey || apiKey === 'ваш_api_ключ') {
                // Демо-данные для Москвы
                this.weatherData = {
                    main: {
                        temp: 22,
                        feels_like: 23,
                        pressure: 1013,
                        humidity: 65
                    },
                    weather: [{
                        description: 'ясно',
                        icon: '01d'
                    }],
                    wind: {
                        speed: 3.5
                    }
                };
                this.lastUpdate = new Date();
                this.isLoading = false;
                this.update();
                return;
            }
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(this.city)}&units=${this.units}&lang=ru&appid=${apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`Ошибка API: ${response.status}`);
            }
            
            this.weatherData = await response.json();
            this.lastUpdate = new Date();
            
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            this.error = 'Не удалось получить данные о погоде. Проверьте подключение к интернету.';
            
            // Запасной вариант: демо-данные
            if (!this.weatherData) {
                this.weatherData = {
                    main: {
                        temp: 18 + Math.floor(Math.random() * 10),
                        feels_like: 18 + Math.floor(Math.random() * 10),
                        pressure: 1010 + Math.floor(Math.random() * 10),
                        humidity: 60 + Math.floor(Math.random() * 20)
                    },
                    weather: [{
                        description: 'переменная облачность',
                        icon: Math.random() > 0.5 ? '03d' : '02d'
                    }],
                    wind: {
                        speed: 2 + Math.random() * 5
                    }
                };
                this.lastUpdate = new Date();
            }
        } finally {
            this.isLoading = false;
            this.update();
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    attachEvents() {
        super.attachEvents();
        
        if (!this.element) return;
        
        // Сохраняем ссылку на экземпляр в DOM-элементе
        this.element.__widget__ = this;
    }

    refresh() {
        this.fetchWeather();
    }

    changeCity(city) {
        this.city = city;
        this.fetchWeather();
    }

    toggleUnits() {
        this.units = this.units === 'metric' ? 'imperial' : 'metric';
        this.fetchWeather();
    }

    onDestroy() {
        // Очистка таймеров или подписок, если есть
    }
}