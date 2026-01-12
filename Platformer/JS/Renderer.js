// Класс для отрисовки игры
class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.effects = [];
    }
    
    // Очистка холста
    clear() {
        this.ctx.fillStyle = '#0d1b2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Градиентный фон
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0d1b2a');
        gradient.addColorStop(1, '#1b3a4b');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Звезды на фоне
        this.drawStars();
    }
    
    // Отрисовка звезд на фоне
    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Статические звезды
        for (let i = 0; i < 50; i++) {
            const x = (i * 17) % this.canvas.width;
            const y = (i * 23) % this.canvas.height;
            const size = Math.sin(i) * 1.5 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Мерцающие звезды
        for (let i = 0; i < 20; i++) {
            const x = (i * 31) % this.canvas.width;
            const y = (i * 37) % this.canvas.height;
            const alpha = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.2;
            const size = 1.5 + Math.sin(Date.now() * 0.002 + i) * 0.5;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // Отрисовка всех игровых объектов
    draw(gameState) {
        this.clear();
        
        // Отрисовка платформ
        gameState.platforms.forEach(platform => {
            if (platform.update()) {
                platform.draw(this.ctx);
            }
        });
        
        // Отрисовка монет
        gameState.coins.forEach(coin => {
            coin.update();
            coin.draw(this.ctx);
        });
        
        // Отрисовка врагов
        gameState.enemies.forEach(enemy => {
            enemy.update(gameState.platforms);
            enemy.draw(this.ctx);
        });
        
        // Отрисовка двери
        if (gameState.door) {
            gameState.door.update();
            gameState.door.draw(this.ctx);
        }
        
        // Отрисовка игрока
        gameState.player.draw(this.ctx);
        
        // Отрисовка частиц
        this.updateParticles();
        this.drawParticles();
        
        // Отрисовка эффектов
        this.updateEffects();
        this.drawEffects();
        
        // Отрисовка UI поверх всего
        this.drawUI(gameState);
    }
    
    // Отрисовка пользовательского интерфейса
    drawUI(gameState) {
        // Полупрозрачная панель для UI
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 10, 200, 80);
        this.ctx.strokeStyle = '#4cc9f0';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 200, 80);
        
        // Текст счета
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Очки: ${gameState.score}`, 20, 40);
        
        // Текст уровня
        this.ctx.fillText(`Уровень: ${gameState.level}`, 20, 70);
        
        // Прогресс сбора монет
        const collectedCoins = gameState.coins.filter(c => c.collected).length;
        const totalCoins = gameState.coins.length;
        this.ctx.fillText(`Монеты: ${collectedCoins}/${totalCoins}`, 20, 100);
        
        // Отображение жизней
        this.ctx.fillStyle = '#ff4081';
        for (let i = 0; i < gameState.player.lives; i++) {
            this.ctx.beginPath();
            this.ctx.arc(150 + i * 25, 35, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Таймер
        const minutes = Math.floor(gameState.gameTime / 60);
        const seconds = Math.floor(gameState.gameTime % 60);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.ctx.fillStyle = '#4cc9f0';
        this.ctx.fillText(`Время: ${timeString}`, this.canvas.width - 150, 30);
        
        // Сообщение о паузе
        if (gameState.paused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ПАУЗА', this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Нажмите ПРОБЕЛ для продолжения', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }
    
    // Создание эффекта сбора монеты
    createCoinEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + 10,
                y: y + 10,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 8,
                speedY: (Math.random() - 0.5) * 8 - 2,
                color: `hsl(${Math.random() * 30 + 40}, 100%, 50%)`,
                life: 30
            });
        }
        
        // Добавляем текстовый эффект
        this.effects.push({
            type: 'text',
            x: x,
            y: y,
            text: '+100',
            color: '#FFD700',
            life: 60,
            velocityY: -2
        });
    }
    
    // Создание эффекта прыжка
    createJumpEffect(x, y, direction) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (direction > 0 ? 0 : 30),
                y: y + 30,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 4 + direction * 2,
                speedY: Math.random() * -3 - 1,
                color: '#f72585',
                life: 20
            });
        }
    }
    
    // Создание эффекта приземления
    createLandEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI;
            const speed = Math.random() * 3 + 1;
            
            this.particles.push({
                x: x + 15,
                y: y + 30,
                size: Math.random() * 3 + 2,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed - 2,
                color: '#4361ee',
                life: 25
            });
        }
    }
    
    // Обновление частиц
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.1; // Гравитация
            p.life--;
            
            if (p.life <= 0 || p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    // Отрисовка частиц
    drawParticles() {
        this.particles.forEach(p => {
            const alpha = p.life / 30;
            this.ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    // Обновление эффектов
    updateEffects() {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            
            if (effect.type === 'text') {
                effect.y += effect.velocityY;
                effect.life--;
                effect.velocityY *= 0.95;
                
                if (effect.life <= 0) {
                    this.effects.splice(i, 1);
                }
            }
        }
    }
    
    // Отрисовка эффектов
    drawEffects() {
        this.effects.forEach(effect => {
            if (effect.type === 'text') {
                const alpha = effect.life / 60;
                this.ctx.fillStyle = effect.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
                this.ctx.font = `bold ${20 + (60 - effect.life) / 3}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(effect.text, effect.x, effect.y);
            }
        });
    }
}