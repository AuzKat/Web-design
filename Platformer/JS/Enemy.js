// Класс врага (нужно добавить в index.html после Platform.js)
class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.velocityX = 2;
        this.velocityY = 0;
        this.speed = 2;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.gravity = 0.8;
        this.isOnGround = false;
        
        this.animationFrame = 0;
        this.color = '#e63946';
        this.eyeColor = '#0d1b2a';
        
        this.moveRange = 150;
        this.originalX = x;
    }
    
    update(platforms) {
        this.animationFrame++;
        
        // Применение гравитации
        this.velocityY += this.gravity;
        
        // Движение по горизонтали
        this.velocityX = this.direction * this.speed;
        
        // Обновление позиции
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Проверка границ движения
        if (Math.abs(this.x - this.originalX) > this.moveRange) {
            this.direction *= -1;
        }
        
        // Проверка коллизий с платформами
        this.isOnGround = false;
        Collision.handleEnemyPlatformCollisions(this, platforms);
        
        // Сброс вертикальной скорости если на земле
        if (this.isOnGround) {
            this.velocityY = 0;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Тело врага
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Голова
        ctx.fillStyle = '#a4161a';
        ctx.beginPath();
        ctx.arc(0, -this.height / 2 - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = this.eyeColor;
        const eyeOffset = Math.sin(this.animationFrame * 0.2) * 2;
        ctx.beginPath();
        ctx.arc(-3 + eyeOffset, -this.height / 2 - 5, 2, 0, Math.PI * 2);
        ctx.arc(3 + eyeOffset, -this.height / 2 - 5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Ноги
        ctx.fillStyle = '#7209b7';
        const legOffset = Math.sin(this.animationFrame * 0.3) * 3;
        ctx.fillRect(-this.width / 4, this.height / 2 - 5, this.width / 4, 8 + legOffset);
        ctx.fillRect(this.width / 4, this.height / 2 - 5, this.width / 4, 8 - legOffset);
        
        // Шипы на спине
        ctx.fillStyle = '#3a0ca3';
        for (let i = -this.width / 2 + 5; i < this.width / 2; i += 10) {
            ctx.beginPath();
            ctx.moveTo(i, -this.height / 2);
            ctx.lineTo(i + 5, -this.height / 2 - 8);
            ctx.lineTo(i + 10, -this.height / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
            direction: this.direction,
            isOnGround: this.isOnGround
        };
    }
}