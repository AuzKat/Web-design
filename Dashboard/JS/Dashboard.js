export default class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = new Map();
        this.layout = 'grid'; // grid, compact, single-column
        this.nextZIndex = 1;
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Контейнер с ID "${containerId}" не найден`);
            return;
        }
        
        // Загрузка виджетов из localStorage
        this.loadFromStorage();
        
        // Инициализация событий перетаскивания
        this.initDragAndDrop();
    }

    addWidget(widget) {
        if (!widget || !widget.render) {
            console.error('Некорректный виджет');
            return;
        }
        
        // Создаем элемент виджета
        const widgetElement = widget.render();
        
        // Устанавливаем z-index для правильного отображения
        widgetElement.style.zIndex = this.nextZIndex++;
        
        // Добавляем в контейнер
        this.container.appendChild(widgetElement);
        
        // Сохраняем виджет в коллекции
        this.widgets.set(widget.id, widget);
        
        // Сохраняем в localStorage
        this.saveToStorage();
        
        // Обновляем отображение
        this.updateLayout();
        
        return widget;
    }

    removeWidget(widgetId) {
        const widget = this.widgets.get(widgetId);
        if (!widget) return false;
        
        // Удаляем из DOM
        const widgetElement = document.getElementById(widgetId);
        if (widgetElement) {
            widgetElement.remove();
        }
        
        // Удаляем из коллекции
        this.widgets.delete(widgetId);
        
        // Сохраняем в localStorage
        this.saveToStorage();
        
        // Обновляем отображение
        this.updateLayout();
        
        return true;
    }

    getWidget(widgetId) {
        return this.widgets.get(widgetId);
    }

    getWidgets() {
        return Array.from(this.widgets.values());
    }

    clear() {
        // Удаляем все виджеты из DOM
        this.widgets.forEach((widget, widgetId) => {
            const widgetElement = document.getElementById(widgetId);
            if (widgetElement) {
                widgetElement.remove();
            }
        });
        
        // Очищаем коллекцию
        this.widgets.clear();
        
        // Очищаем localStorage
        localStorage.removeItem('dashboard-widgets');
        
        // Обновляем отображение
        this.updateLayout();
    }

    updateLayout() {
        // Обновляем классы контейнера в зависимости от текущего layout
        this.container.classList.remove('grid', 'compact', 'single-column');
        this.container.classList.add(this.layout);
    }

    setLayout(layout) {
        if (['grid', 'compact', 'single-column'].includes(layout)) {
            this.layout = layout;
            this.updateLayout();
            this.saveToStorage();
        }
    }

    initDragAndDrop() {
        let draggedWidget = null;
        let offsetX = 0;
        let offsetY = 0;
        
        // Для реализации перетаскивания в реальном проекте
        // можно использовать библиотеку или более сложную логику
    }

    saveToStorage() {
        try {
            const widgetsData = [];
            
            this.widgets.forEach((widget, id) => {
                // Сохраняем только данные, необходимые для восстановления
                widgetsData.push({
                    id: id,
                    type: widget.widgetType,
                    title: widget.title,
                    icon: widget.icon,
                    config: widget.config
                });
            });
            
            localStorage.setItem('dashboard-widgets', JSON.stringify(widgetsData));
        } catch (error) {
            console.error('Ошибка сохранения дашборда:', error);
        }
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('dashboard-widgets');
            if (!savedData) return;
            
            const widgetsData = JSON.parse(savedData);
            
            // В реальном приложении здесь была бы логика
            // восстановления виджетов с их состояниями
            // Для упрощения просто очищаем старые данные
            console.log('Загружены данные дашборда:', widgetsData);
            
        } catch (error) {
            console.error('Ошибка загрузки дашборда:', error);
        }
    }

    // Утилиты для работы с позиционированием
    arrangeWidgets() {
        // Логика автоматического расположения виджетов
        // В реальном проекте можно использовать Masonry или подобные библиотеки
    }

    // Экспорт состояния дашборда
    exportState() {
        return {
            widgets: Array.from(this.widgets.entries()),
            layout: this.layout
        };
    }

    // Импорт состояния дашборда
    importState(state) {
        // В реальном проекте здесь была бы логика
        // восстановления состояния из экспортированных данных
    }
}