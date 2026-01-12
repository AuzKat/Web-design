// Базовый абстрактный класс для всех виджетов
export default class UIComponent {
    constructor(config) {
        if (new.target === UIComponent) {
            throw new Error('UIComponent is an abstract class and cannot be instantiated directly');
        }
        
        this.id = config.id || `widget-${Date.now()}`;
        this.title = config.title || 'Виджет';
        this.icon = config.icon || 'fas fa-cube';
        this.config = config;
        this.element = null;
        this.isMinimized = false;
        this.isLoading = false;
        this.error = null;
        
        // Стиль виджета
        this.widgetType = config.type || 'default';
    }

    // Создание DOM-элемента виджета
    render() {
        this.element = document.createElement('div');
        this.element.className = `widget ${this.widgetType}-widget`;
        this.element.id = this.id;
        
        this.element.innerHTML = this.renderTemplate();
        
        this.attachEvents();
        return this.element;
    }

    // Шаблон виджета
    renderTemplate() {
        return `
            <div class="widget-header">
                <div class="widget-title">
                    <div class="widget-icon">
                        <i class="${this.icon}"></i>
                    </div>
                    <span>${this.title}</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-btn minimize-btn" title="${this.isMinimized ? 'Развернуть' : 'Свернуть'}">
                        <i class="fas ${this.isMinimized ? 'fa-expand-alt' : 'fa-minus'}"></i>
                    </button>
                    <button class="widget-btn close-btn" title="Закрыть">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="widget-body">
                ${this.renderBody()}
            </div>
        `;
    }

    // Абстрактный метод для рендеринга содержимого (должен быть переопределен)
    renderBody() {
        throw new Error('Method renderBody() must be implemented in child class');
    }

    // Привязка обработчиков событий
    attachEvents() {
        if (!this.element) return;
        
        // Кнопка сворачивания
        const minimizeBtn = this.element.querySelector('.minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });
        }
        
        // Кнопка закрытия
        const closeBtn = this.element.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        }
    }

    // Сворачивание/разворачивание виджета
    toggleMinimize() {
        const body = this.element.querySelector('.widget-body');
        const icon = this.element.querySelector('.minimize-btn i');
        
        if (this.isMinimized) {
            // Разворачиваем
            body.style.display = 'block';
            icon.className = 'fas fa-minus';
            this.isMinimized = false;
        } else {
            // Сворачиваем
            body.style.display = 'none';
            icon.className = 'fas fa-expand-alt';
            this.isMinimized = true;
        }
    }

    // Закрытие виджета
    close() {
        if (this.element && this.element.parentNode) {
            // Анимация закрытия
            this.element.classList.add('animate__animated', 'animate__fadeOut');
            
            setTimeout(() => {
                this.element.parentNode.removeChild(this.element);
                this.destroy();
                
                // Обновляем глобальную статистику
                if (typeof window.appInstance?.updateWidgetsCount === 'function') {
                    window.appInstance.updateWidgetsCount();
                    window.appInstance.updateStats();
                }
            }, 300);
        }
    }

    // Уничтожение виджета
    destroy() {
        // Очистка обработчиков событий
        const minimizeBtn = this.element?.querySelector('.minimize-btn');
        const closeBtn = this.element?.querySelector('.close-btn');
        
        if (minimizeBtn) {
            const newMinimizeBtn = minimizeBtn.cloneNode(true);
            minimizeBtn.parentNode.replaceChild(newMinimizeBtn, minimizeBtn);
        }
        
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        }
        
        // Вызов метода очистки в дочернем классе
        if (typeof this.onDestroy === 'function') {
            this.onDestroy();
        }
        
        this.element = null;
    }

    // Обновление содержимого виджета
    update() {
        if (this.element) {
            const body = this.element.querySelector('.widget-body');
            if (body) {
                body.innerHTML = this.renderBody();
                this.attachEvents();
            }
        }
    }

    // Показать состояние загрузки
    showLoading() {
        this.isLoading = true;
        this.update();
    }

    // Скрыть состояние загрузки
    hideLoading() {
        this.isLoading = false;
        this.update();
    }

    // Показать ошибку
    showError(message) {
        this.error = message;
        this.update();
    }

    // Скрыть ошибку
    hideError() {
        this.error = null;
        this.update();
    }

    // Восстановление из localStorage (если нужно)
    restoreFromStorage() {
        // Метод должен быть переопределен в дочерних классах
    }

    // Сохранение в localStorage (если нужно)
    saveToStorage() {
        // Метод должен быть переопределен в дочерних классах
    }

    // Метод для обработки обновления данных
    refresh() {
        // Метод должен быть переопределен в дочерних классах
    }
}