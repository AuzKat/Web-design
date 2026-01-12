import UIComponent from './UIComponent.js';

export default class CryptoWidget extends UIComponent {
    constructor(config) {
        super({
            ...config,
            type: 'crypto'
        });
        
        this.cryptoData = null;
        this.lastUpdate = null;
        this.selectedCurrency = 'USD';
        
        // Загружаем данные о криптовалютах
        this.fetchCryptoData();
        
        // Автообновление каждые 5 минут
        this.autoRefreshInterval = setInterval(() => this.fetchCryptoData(), 5 * 60 * 1000);
    }

    renderBody() {
        if (this.isLoading) {
            return `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка данных о криптовалютах...</p>
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

        if (!this.cryptoData || this.cryptoData.length === 0) {
            return `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <p>Данные о криптовалютах недоступны</p>
                    <button class="retry-btn" onclick="this.closest('.widget').__widget__.refresh()">
                        Попробовать снова
                    </button>
                </div>
            `;
        }

        const updateTime = this.lastUpdate 
            ? new Date(this.lastUpdate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
            : '--:--';

        // Рассчитываем общую капитализацию и изменение
        let totalMarketCap = 0;
        let totalChange = 0;
        
        this.cryptoData.forEach(crypto => {
            totalMarketCap += crypto.market_cap || 0;
            totalChange += (crypto.price_change_percentage_24h || 0) * (crypto.market_cap || 0);
        });
        
        const avgChange = totalMarketCap > 0 ? totalChange / totalMarketCap : 0;

        return `
            <div class="crypto-content">
                <div class="crypto-list">
                    ${this.cryptoData.map(crypto => {
                        const change = crypto.price_change_percentage_24h || 0;
                        const changeClass = change >= 0 ? 'positive' : 'negative';
                        const changeIcon = change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
                        const changeSign = change >= 0 ? '+' : '';
                        
                        const icons = {
                            'bitcoin': 'fab fa-bitcoin',
                            'ethereum': 'fab fa-ethereum',
                            'tether': 'fas fa-dollar-sign',
                            'binancecoin': 'fas fa-coins',
                            'solana': 'fas fa-fire',
                            'ripple': 'fas fa-x',
                            'cardano': 'fas fa-chart-bar',
                            'dogecoin': 'fab fa-reddit-alien'
                        };
                        
                        const icon = icons[crypto.id] || 'fas fa-coins';
                        
                        return `
                            <div class="crypto-item">
                                <div class="crypto-icon">
                                    <i class="${icon}"></i>
                                </div>
                                <div class="crypto-info">
                                    <div class="crypto-name">
                                        ${crypto.name}
                                        <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span>
                                    </div>
                                    <div class="crypto-price">$${this.formatNumber(crypto.current_price)}</div>
                                </div>
                                <div class="crypto-change">
                                    <div class="change-percent ${changeClass}">
                                        <i class="${changeIcon}"></i>
                                        ${changeSign}${change.toFixed(2)}%
                                    </div>
                                    <div class="change-24h">
                                        ${changeSign}$${this.formatNumber(Math.abs(crypto.price_change_24h || 0))}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="crypto-summary">
                    <div class="summary-text">
                        Общая капитализация:
                    </div>
                    <div class="summary-value">
                        $${this.formatNumber(totalMarketCap)}
                    </div>
                </div>
                
                <div class="crypto-update">
                    <div class="update-info">
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

    async fetchCryptoData() {
        this.isLoading = true;
        this.error = null;
        this.update();
        
        try {
            // Используем CoinGecko API (публичный, не требует ключа)
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${this.selectedCurrency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=ru`
            );
            
            if (!response.ok) {
                throw new Error(`Ошибка API: ${response.status}`);
            }
            
            this.cryptoData = await response.json();
            this.lastUpdate = new Date();
            
        } catch (error) {
            console.error('Ошибка получения данных о криптовалютах:', error);
            this.error = 'Не удалось получить данные. Используются демо-данные.';
            
            // Запасной вариант: демо-данные
            if (!this.cryptoData) {
                this.cryptoData = this.getDemoData();
                this.lastUpdate = new Date();
            }
        } finally {
            this.isLoading = false;
            this.update();
        }
    }

    getDemoData() {
        const cryptos = [
            { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 45000 + Math.random() * 5000, 
              price_change_24h: (Math.random() - 0.5) * 1000, price_change_percentage_24h: (Math.random() - 0.5) * 5, market_cap: 850000000000 },
            { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3000 + Math.random() * 500, 
              price_change_24h: (Math.random() - 0.5) * 100, price_change_percentage_24h: (Math.random() - 0.5) * 4, market_cap: 360000000000 },
            { id: 'tether', name: 'Tether', symbol: 'usdt', current_price: 1, 
              price_change_24h: 0, price_change_percentage_24h: 0, market_cap: 95000000000 },
            { id: 'binancecoin', name: 'BNB', symbol: 'bnb', current_price: 400 + Math.random() * 50, 
              price_change_24h: (Math.random() - 0.5) * 20, price_change_percentage_24h: (Math.random() - 0.5) * 3, market_cap: 65000000000 },
            { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 100 + Math.random() * 30, 
              price_change_24h: (Math.random() - 0.5) * 10, price_change_percentage_24h: (Math.random() - 0.5) * 6, market_cap: 45000000000 }
        ];
        
        // Добавляем случайные изменения для реалистичности
        return cryptos.map(crypto => ({
            ...crypto,
            current_price: crypto.current_price * (1 + (Math.random() - 0.5) * 0.02),
            price_change_24h: crypto.price_change_24h * (1 + (Math.random() - 0.5) * 0.1),
            price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() - 0.5) * 0.5
        }));
    }

    formatNumber(num) {
        if (num >= 1e12) {
            return (num / 1e12).toFixed(2) + 'T';
        }
        if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        }
        return num.toFixed(2);
    }

    attachEvents() {
        super.attachEvents();
        
        if (!this.element) return;
        
        // Сохраняем ссылку на экземпляр в DOM-элементе
        this.element.__widget__ = this;
    }

    refresh() {
        this.fetchCryptoData();
    }

    changeCurrency(currency) {
        this.selectedCurrency = currency;
        this.fetchCryptoData();
    }

    onDestroy() {
        // Очищаем интервал автообновления
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
    }
}