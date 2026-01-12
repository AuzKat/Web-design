// Класс платформы
class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // normal, moving, breaking, bouncy
        
        // Для движущихся платформ
        this.moveSpeed = type === 'moving' ? 2 : 0;
        this.moveDirection = 1;
        this.moveRange = type === 'moving' ? 150 : 0;
        this.originalX = x;
        
        // Для ломающихся платформ
        this.breakTime = 0;
        this.isBreaking = false;
        
        // Для прыгучих платформ
        this.bounceForce = type === 'bouncy' ? 20 : 0;
        
        // Цвета в зависимости от типа
        this.colors = {
            normal: '#1b3a4b',
            moving: '#124e66',
            breaking: '#9d0208',
            bouncy: '#2d6a4f'
        };
        
        this.color = this.colors[type] || this.colors.normal;
    }
    
    // Обновление платформы
    update() {
        // Движение для движущихся платформ
        if (this.type === 'moving') {
            this.x += this.moveSpeed * this.moveDirection;
            
            if (this.x > this.originalX + this.moveRange || this.x < this.originalX - this.moveRange) {
                this.moveDirection *= -1;
            }
        }
        
        // Ломание для ломающихся платформ
        if (this.type === 'breaking' && this.isBreaking) {
            this.breakTime++;
            
            // Платформа полностью сломана
            if (this.breakTime > 60) {
                return false; // Удалить платформу
            }
        }
        
        return true; // Платформа активна
    }
    
    // Активация ломающейся платформы
    break() {
        if (this.type === 'breaking' && !this.isBreaking) {
            this.isBreaking = true;
        }
    }
    
    // Отрисовка платформы
    draw(ctx) {
        // Для ломающейся платформы - эффект разрушения
        if (this.type === 'breaking' && this.isBreaking) {
            const alpha = 1 - (this.breakTime / 60);
            ctx.fillStyle = `rgba(157, 2, 8, ${alpha})`;
            
            // Эффект трещин
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
            ctx.lineWidth = 2;
            
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Рисуем трещины
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.2, this.y + this.height * 0.3);
            ctx.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.7);
            ctx.lineTo(this.x + this.width * 0.8, this.y + this.height * 0.4);
            ctx.stroke();
        } else {
            // Обычная отрисовка
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Добавляем текстуру
            ctx.fillStyle = this.type === 'bouncy' ? '#40916c' : 'rgba(255, 255, 255, 0.1)';
            
            if (this.type === 'normal' || this.type === 'moving') {
                // Текстура для нормальных и движущихся платформ
                for (let i = 0; i < this.width; i += 20) {
                    for (let j = 0; j < this.height; j += 10) {
                        ctx.fillRect(this.x + i, this.y + j, 10, 5);
                    }
                }
            } else if (this.type === 'bouncy') {
                // Текстура для прыгучих платформ
                ctx.fillStyle = '#52b788';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Обводка платформы
            ctx.strokeStyle = this.type === 'bouncy' ? '#1b4332' : 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        
        // Для движущихся платформ - стрелка направления
        if (this.type === 'moving') {
            ctx.fillStyle = '#4cc9f0';
            const arrowSize = 10;
            const centerX = this.x + this.width / 2;
            const centerY = this.y - arrowSize - 5;
            
            ctx.beginPath();
            if (this.moveDirection > 0) {
                // Стрелка вправо
                ctx.moveTo(centerX - arrowSize, centerY - arrowSize);
                ctx.lineTo(centerX + arrowSize, centerY);
                ctx.lineTo(centerX - arrowSize, centerY + arrowSize);
            } else {
                // Стрелка влево
                ctx.moveTo(centerX + arrowSize, centerY - arrowSize);
                ctx.lineTo(centerX - arrowSize, centerY);
                ctx.lineTo(centerX + arrowSize, centerY + arrowSize);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // Получение границ для коллизий
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            type: this.type,
            bounceForce: this.bounceForce
        };
    }
}