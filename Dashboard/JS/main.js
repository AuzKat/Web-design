// Основной файл приложения
import Dashboard from './js/Dashboard.js';
import ToDoWidget from './js/ToDoWidget.js';
import QuoteWidget from './js/QuoteWidget.js';
import WeatherWidget from './js/WeatherWidget.js';
import CryptoWidget from './js/CryptoWidget.js';

class App {
    constructor() {
        this.dashboard = null;
        this.widgetCount = 0;
        this.init();
    }

    init() {
        // Инициализация приложения
        this.setupEventListeners();
        this.updateDateTime();
        this.initializeDashboard();
        this.hideLoadingModal();
    }

    setupEventListeners() {
        // Кнопки добавления виджетов
        document.getElementById('add-todo').addEventListener('click', () => this.addWidget('todo'));
        document.getElementById('add-quote').addEventListener('click', () => this.addWidget('quote'));
        document.getElementById('add-weather').addEventListener('click', () => this.addWidget('weather'));
        document.getElementById('add-crypto').addEventListener('click', () => this.addWidget('crypto'));

        // Кнопки управления дашбордом
        document.getElementById('toggle-layout').addEventListener('click', () => this.toggleLayout());
        document.getElementById('toggle-compact').addEventListener('click', () => this.toggleCompact());
        document.getElementById('auto-arrange').addEventListener('click', () => this.autoArrange());
        document.getElementById('reset-dashboard').addEventListener('click', () => this.resetDashboard());

        // Переключатели
        document.getElementById('theme-toggle').addEventListener('change', (e) => this.toggleTheme(e));
        document.getElementById('animations-toggle').addEventListener('change', (e) => this.toggleAnimations(e));
        document.getElementById('grid-density').addEventListener('input', (e) => this.changeGridDensity(e));

        // Обновление времени
        setInterval(() => this.updateDateTime(), 1000);
    }

    initializeDashboard() {
        this.dashboard = new Dashboard('dashboard');
        this.updateWidgetsCount();
    }

    addWidget(type) {
        let widget;
        
        switch(type) {
            case 'todo':
                widget = new ToDoWidget({
                    id: `todo-${Date.now()}`,
                    title: 'Список задач',
                    icon: 'fas fa-tasks'
                });
                break;
                
            case 'quote':
                widget = new QuoteWidget({
                    id: `quote-${Date.now()}`,
                    title: 'Цитата дня',
                    icon: 'fas fa-quote-right'
                });
                break;
                
            case 'weather':
                widget = new WeatherWidget({
                    id: `weather-${Date.now()}`,
                    title: 'Погода',
                    icon: 'fas fa-cloud-sun',
                    city: 'Москва'
                });
                break;
                
            case 'crypto':
                widget = new CryptoWidget({
                    id: `crypto-${Date.now()}`,
                    title: 'Криптовалюты',
                    icon: 'fas fa-coins'
                });
                break;
        }
        
        if (widget) {
            this.dashboard.addWidget(widget);
            this.updateWidgetsCount();
            this.updateStats();
            
            // Анимация добавления
            const widgetElement = document.getElementById(widget.id);
            if (widgetElement) {
                widgetElement.classList.add('animate__animated', 'animate__fadeInUp');
                setTimeout(() => {
                    widgetElement.classList.remove('animate__animated', 'animate__fadeInUp');
                }, 1000);
            }
        }
    }

    updateWidgetsCount() {
        const widgets = this.dashboard?.getWidgets() || [];
        const count = widgets.length;
        
        document.getElementById('widgets-count').textContent = count;
        
        // Показать/скрыть пустое состояние
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = count > 0 ? 'none' : 'flex';
        }
    }

    updateStats() {
        // Обновление статистики в боковой панели
        const widgets = this.dashboard?.getWidgets() || [];
        
        const todoWidgets = widgets.filter(w => w instanceof ToDoWidget);
        const todoTasks = todoWidgets.reduce((total, widget) => total + (widget.tasks?.length || 0), 0);
        const completedTasks = todoWidgets.reduce((total, widget) => 
            total + (widget.tasks?.filter(t => t.completed)?.length || 0), 0);
        
        document.getElementById('tasks-count').textContent = completedTasks;
        
        const cryptoWidgets = widgets.filter(w => w instanceof CryptoWidget);
        const cryptoCount = cryptoWidgets.reduce((total, widget) => 
            total + (widget.cryptoData?.length || 0), 0);
        
        document.getElementById('crypto-count').textContent = cryptoCount;
        
        const quoteWidgets = widgets.filter(w => w instanceof QuoteWidget);
        document.getElementById('quotes-count').textContent = quoteWidgets.length;
    }

    toggleLayout() {
        const btn = document.getElementById('toggle-layout');
        const dashboard = document.getElementById('dashboard');
        
        btn.classList.toggle('active');
        dashboard.classList.toggle('single-column');
        
        btn.innerHTML = dashboard.classList.contains('single-column') 
            ? '<i class="fas fa-list"></i> Список' 
            : '<i class="fas fa-grid"></i> Сетка';
    }

    toggleCompact() {
        const btn = document.getElementById('toggle-compact');
        const dashboard = document.getElementById('dashboard');
        
        btn.classList.toggle('active');
        dashboard.classList.toggle('compact');
    }

    autoArrange() {
        const btn = document.getElementById('auto-arrange');
        const dashboard = document.getElementById('dashboard');
        
        // Анимация перестановки
        dashboard.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            dashboard.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
        
        // В реальном приложении здесь была бы логика перестановки виджетов
        console.log('Авторасположение виджетов...');
    }

    resetDashboard() {
        if (confirm('Вы уверены, что хотите сбросить дашборд? Все виджеты будут удалены.')) {
            this.dashboard.clear();
            this.updateWidgetsCount();
            this.updateStats();
            
            // Анимация сброса
            const dashboard = document.getElementById('dashboard');
            dashboard.classList.add('animate__animated', 'animate__fadeOut');
            
            setTimeout(() => {
                dashboard.classList.remove('animate__animated', 'animate__fadeOut');
                dashboard.classList.add('animate__animated', 'animate__fadeIn');
                
                setTimeout(() => {
                    dashboard.classList.remove('animate__animated', 'animate__fadeIn');
                }, 500);
            }, 300);
        }
    }

    toggleTheme(e) {
        const isDark = e.target.checked;
        document.body.classList.toggle('light-theme', !isDark);
        
        // Сохранение в localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    toggleAnimations(e) {
        const animationsEnabled = e.target.checked;
        document.body.classList.toggle('no-animations', !animationsEnabled);
        
        // Сохранение в localStorage
        localStorage.setItem('animations', animationsEnabled ? 'enabled' : 'disabled');
    }

    changeGridDensity(e) {
        const density = e.target.value;
        const dashboard = document.getElementById('dashboard');
        
        // Удаляем предыдущие классы плотности
        dashboard.classList.remove('density-1', 'density-2', 'density-3', 'density-4', 'density-5');
        
        // Добавляем новый класс
        dashboard.classList.add(`density-${density}`);
        
        // Сохранение в localStorage
        localStorage.setItem('grid-density', density);
    }

    updateDateTime() {
        const now = new Date();
        
        // Время
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
        
        // Дата
        const dateString = now.toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }

    hideLoadingModal() {
        setTimeout(() => {
            const modal = document.getElementById('loading-modal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }

    // Глобальные функции для обновления статистики (вызываются из виджетов)
    static updateGlobalStats() {
        if (window.appInstance) {
            window.appInstance.updateStats();
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new App();
    
    // Восстановление настроек из localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.getElementById('theme-toggle').checked = false;
        document.body.classList.add('light-theme');
    }
    
    const savedAnimations = localStorage.getItem('animations');
    if (savedAnimations === 'disabled') {
        document.getElementById('animations-toggle').checked = false;
        document.body.classList.add('no-animations');
    }
    
    const savedDensity = localStorage.getItem('grid-density');
    if (savedDensity) {
        document.getElementById('grid-density').value = savedDensity;
        document.getElementById('dashboard').classList.add(`density-${savedDensity}`);
    }
});

// Экспорт для использования в других модулях
export { App };