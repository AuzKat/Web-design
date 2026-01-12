// Обработчик ввода с клавиатуры
class InputHandler {
    constructor() {
        this.keys = {};
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        // Обработка нажатий клавиш
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Предотвращаем прокрутку страницы при нажатии пробела или стрелок
            if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Обработка касаний для мобильных устройств
        window.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            
            // Симуляция прыжка при касании
            this.keys[' '] = true;
            
            // Определяем направление касания
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            
            if (touchX < rect.width / 2) {
                this.keys['a'] = true;
                this.keys['arrowleft'] = true;
            } else {
                this.keys['d'] = true;
                this.keys['arrowright'] = true;
            }
            
            e.preventDefault();
        });
        
        window.addEventListener('touchend', (e) => {
            this.keys[' '] = false;
            this.keys['a'] = false;
            this.keys['d'] = false;
            this.keys['arrowleft'] = false;
            this.keys['arrowright'] = false;
        });
    }
    
    // Проверка нажата ли клавиша
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
    
    // Получение направления движения
    getHorizontalInput() {
        let direction = 0;
        
        if (this.isKeyPressed('a') || this.isKeyPressed('arrowleft')) {
            direction -= 1;
        }
        
        if (this.isKeyPressed('d') || this.isKeyPressed('arrowright')) {
            direction += 1;
        }
        
        return direction;
    }
    
    // Проверка нажатия прыжка
    isJumpPressed() {
        return this.isKeyPressed('w') || this.isKeyPressed(' ') || this.isKeyPressed('arrowup');
    }
}