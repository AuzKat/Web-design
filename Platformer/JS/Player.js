// Класс игрока
class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = 15;
        this.gravity = 0.8;
        this.friction = 0.85;
        
        this.isOnGround = false;
        this.isJumping = false;
        this.direction = 1; // 1 - вправо, -1 - влево
        
        this.color = '#4361ee';
        this.jumpColor = '#f72585';
        this.currentColor = this.color;
        
        this.animationFrame = 0;
        this.jumpAnimationTime = 0;
        
        this.coins = 0;
        this.lives = 3;
        
        // Для плавности анимации
        this.lastX = x;
        this.lastY = y;
    }
    
    // Обновление состояния игрока
    update(input, platforms, canvas) {
        this.lastX = this.x;
        this.lastY = this.y;
        
        // Применение гравитации
        this.velocityY += this.gravity;
        
        // Получение ввода с клавиатуры
        const horizontalInput = input.getHorizontalInput();
        
        // Применение движения по горизонтали
        this.velocityX = horizontalInput * this.speed;
        
        // Применение трения при отсутствии ввода
        if (horizontalInput === 0) {
            this.velocityX *= this.friction;
        }
        
        // Обработка прыжка
        if (input.isJumpPressed() && this.isOnGround && !this.isJumping) {
            this.velocityY = -this.jumpForce;
            this.isJumping = true;
            this.isOnGround = false;
            this.jumpAnimationTime = 10;
            this.currentColor = this.jumpColor;
        }
        
        // Обновление позиции
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Проверка границ холста
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
        
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
            this.velocityX = 0;
        }
        
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
        
        // Смерть при падении
        if (this.y > canvas.height) {
            this.lives--;
            this.resetPosition(canvas);
            return 'fallen';
        }
        
        // Обновление направления
        if (horizontalInput > 0) {
            this.direction = 1;
        } else if (horizontalInput < 0) {
            this.direction = -1;
        }
        
        // Обновление анимации прыжка
        if (this.jumpAnimationTime > 0) {
            this.jumpAnimationTime--;
            if (this.jumpAnimationTime === 0) {
                this.currentColor = this.color;
            }
        }
        
        // Сброс состояния прыжка
        if (!input.isJumpPressed()) {
            this.isJumping = false;
        }
        
        // Сброс состояния на земле
        this.isOnGround = false;
        
        return 'ok';
    }
    
    // Сброс позиции игрока
    resetPosition(canvas) {
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isOnGround = false;
        this.isJumping = false;
    }
    
    // Отрисовка игрока
    draw(ctx) {
        // Анимация прыжка
        const jumpScale = 1 + Math.sin(this.jumpAnimationTime * 0.3) * 0.1;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Отражаем игрока если он движется влево
        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }
        
        // Тело игрока
        ctx.fillStyle = this.currentColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Голова
        ctx.fillStyle = '#3a0ca3';
        ctx.beginPath();
        ctx.arc(0, -this.height / 2 - 5, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(5, -this.height / 2 - 7, 3, 0, Math.PI * 2);
        ctx.arc(-5, -this.height / 2 - 7, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Зрачки
        ctx.fillStyle = '#0d1b2a';
        ctx.beginPath();
        ctx.arc(5, -this.height / 2 - 7, 1.5, 0, Math.PI * 2);
        ctx.arc(-5, -this.height / 2 - 7, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Ноги при движении
        if (Math.abs(this.velocityX) > 0.5) {
            this.animationFrame++;
            const legOffset = Math.sin(this.animationFrame * 0.3) * 5;
            
            // Левая нога
            ctx.fillStyle = '#7209b7';
            ctx.fillRect(-this.width / 4, this.height / 2 - 5, this.width / 4, 10 + legOffset);
            
            // Правая нога
            ctx.fillRect(this.width / 4, this.height / 2 - 5, this.width / 4, 10 - legOffset);
        } else {
            // Ноги в покое
            ctx.fillStyle = '#7209b7';
            ctx.fillRect(-this.width / 4, this.height / 2 - 5, this.width / 4, 10);
            ctx.fillRect(this.width / 4, this.height / 2 - 5, this.width / 4, 10);
        }
        
        // Руки
        ctx.fillStyle = '#4cc9f0';
        const armOffset = this.isJumping ? -5 : 0;
        ctx.fillRect(-this.width / 2 - 5, -this.height / 4 + armOffset, 5, this.height / 2);
        ctx.fillRect(this.width / 2, -this.height / 4 + armOffset, 5, this.height / 2);
        
        ctx.restore();
    }
    
    // Получение границ для коллизий
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            velocityX: this.velocityX,
            velocityY: this.velocityY
        };
    }
}