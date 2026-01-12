import UIComponent from './UIComponent.js';

export default class ToDoWidget extends UIComponent {
    constructor(config) {
        super({
            ...config,
            type: 'todo'
        });
        
        this.tasks = config.tasks || this.getDefaultTasks();
        this.nextId = this.tasks.length > 0 
            ? Math.max(...this.tasks.map(t => t.id)) + 1 
            : 1;
        
        // Восстановление из localStorage
        this.restoreFromStorage();
    }

    getDefaultTasks() {
        return [
            { id: 1, text: 'Изучить принципы ООП в JavaScript', completed: true },
            { id: 2, text: 'Создать базовый класс для виджетов', completed: true },
            { id: 3, text: 'Реализовать ToDo виджет', completed: false },
            { id: 4, text: 'Добавить работу с API', completed: false },
            { id: 5, text: 'Стилизовать все компоненты', completed: false }
        ];
    }

    renderBody() {
        if (this.isLoading) {
            return `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка задач...</p>
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
                        Попробовать снова
                    </button>
                </div>
            `;
        }

        const completedCount = this.tasks.filter(t => t.completed).length;
        const totalCount = this.tasks.length;
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return `
            <div class="todo-container">
                <div class="todo-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${completedCount} из ${totalCount} завершено</div>
                </div>
                
                <ul class="todo-list">
                    ${this.tasks.map(task => `
                        <li class="todo-item" data-id="${task.id}">
                            <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="todo-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                            <button class="todo-delete" title="Удалить задачу">
                                <i class="fas fa-trash"></i>
                            </button>
                        </li>
                    `).join('')}
                </ul>
                
                <form class="todo-form">
                    <input type="text" class="todo-input" placeholder="Добавить новую задачу..." required>
                    <button type="submit" class="todo-add">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </form>
                
                <div class="todo-stats">
                    <span>Всего задач: ${totalCount}</span>
                    <span>Выполнено: ${completedCount}</span>
                </div>
            </div>
        `;
    }

    attachEvents() {
        super.attachEvents();
        
        if (!this.element) return;
        
        // Сохраняем ссылку на экземпляр в DOM-элементе
        this.element.__widget__ = this;
        
        // Обработчики для чекбоксов
        const checkboxes = this.element.querySelectorAll('.todo-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.toggleTask(e));
        });
        
        // Обработчики для кнопок удаления
        const deleteBtns = this.element.querySelectorAll('.todo-delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteTask(e));
        });
        
        // Обработчик формы
        const form = this.element.querySelector('.todo-form');
        if (form) {
            form.addEventListener('submit', (e) => this.addTask(e));
        }
    }

    toggleTask(e) {
        const checkbox = e.target;
        const taskItem = checkbox.closest('.todo-item');
        const taskId = parseInt(taskItem.dataset.id);
        const taskText = taskItem.querySelector('.todo-text');
        
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = checkbox.checked;
            taskText.classList.toggle('completed', task.completed);
            
            // Сохраняем в localStorage
            this.saveToStorage();
            
            // Обновляем глобальную статистику
            if (typeof window.appInstance?.updateStats === 'function') {
                window.appInstance.updateStats();
            }
        }
    }

    deleteTask(e) {
        const deleteBtn = e.target.closest('.todo-delete');
        const taskItem = deleteBtn.closest('.todo-item');
        const taskId = parseInt(taskItem.dataset.id);
        
        // Анимация удаления
        taskItem.classList.add('animate__animated', 'animate__fadeOut');
        
        setTimeout(() => {
            // Удаляем из массива
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            
            // Обновляем отображение
            this.update();
            
            // Сохраняем в localStorage
            this.saveToStorage();
            
            // Обновляем глобальную статистику
            if (typeof window.appInstance?.updateStats === 'function') {
                window.appInstance.updateStats();
            }
        }, 300);
    }

    addTask(e) {
        e.preventDefault();
        
        const input = this.element.querySelector('.todo-input');
        const text = input.value.trim();
        
        if (text) {
            const newTask = {
                id: this.nextId++,
                text: text,
                completed: false
            };
            
            this.tasks.push(newTask);
            
            // Очищаем поле ввода
            input.value = '';
            
            // Обновляем отображение
            this.update();
            
            // Сохраняем в localStorage
            this.saveToStorage();
            
            // Обновляем глобальную статистику
            if (typeof window.appInstance?.updateStats === 'function') {
                window.appInstance.updateStats();
            }
        }
    }

    refresh() {
        this.update();
    }

    restoreFromStorage() {
        try {
            const key = `todo-widget-${this.id}`;
            const data = localStorage.getItem(key);
            
            if (data) {
                const parsed = JSON.parse(data);
                this.tasks = parsed.tasks || this.tasks;
                this.nextId = parsed.nextId || this.nextId;
            }
        } catch (error) {
            console.error('Ошибка загрузки задач из localStorage:', error);
        }
    }

    saveToStorage() {
        try {
            const key = `todo-widget-${this.id}`;
            const data = {
                tasks: this.tasks,
                nextId: this.nextId
            };
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Ошибка сохранения задач в localStorage:', error);
        }
    }

    onDestroy() {
        this.saveToStorage();
    }
}