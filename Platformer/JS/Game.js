// Game.js - ПОЛНАЯ ВЕРСИЯ С 5 УРОВНЯМИ
class Game {
    constructor(canvas, ctx) {
        console.log('=== GAME CONSTRUCTOR ===');
        this.canvas = canvas;
        this.ctx = ctx;
        this.running = false;
        
        // Уровни
        this.levels = [1, 2, 3, 4, 5]; // Теперь 5 уровней
        this.currentLevelIndex = 0; // Текущий уровень
        
        this.paused = false;
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.gameTime = 0;
        
        // Создаем простые объекты
        this.player = this.createPlayer();
        this.setupLevel(this.level);  // ← ИЗМЕНЕНО: используем setupLevel вместо отдельных методов
        
        console.log('Объекты созданы:');
        console.log('- Игрок:', this.player);
        console.log('- Платформы:', this.platforms.length);
        console.log('- Монеты:', this.coins.length);
        console.log('- Враги:', this.enemies.length);
        
        // Обработчик ввода
        this.keys = {};
        this.setupInput();
    }
    
    // ========== МЕТОД ДЛЯ НАСТРОЙКИ УРОВНЕЙ ==========
    setupLevel(levelNumber) {
        console.log(`Настройка уровня ${levelNumber}`);
        this.level = levelNumber;
        
        if (levelNumber === 1) {
            this.setupLevel1();
        } else if (levelNumber === 2) {
            this.setupLevel2();
        } else if (levelNumber === 3) {
            this.setupLevel3();
        } else if (levelNumber === 4) {
            this.setupLevel4();
        } else if (levelNumber === 5) {
            this.setupLevel5();
        }
    }
    
    createPlayer() {
        return {
            x: 100,
            y: 300,
            width: 30,
            height: 50,
            color: '#4361ee',
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpForce: 15,
            gravity: 0.8,
            isOnGround: false,
            lives: 3
        };
    }
    
    // ========== УРОВЕНЬ 1 ==========
    setupLevel1() {
        this.platforms = [
            // Пол
            {x: 0, y: 450, width: 800, height: 50, color: '#1b3a4b'},
            // Платформы
            {x: 100, y: 400, width: 200, height: 20, color: '#124e66'},
            {x: 400, y: 350, width: 150, height: 20, color: '#124e66'},
            {x: 200, y: 300, width: 100, height: 20, color: '#124e66'},
            {x: 500, y: 250, width: 200, height: 20, color: '#124e66'},
            {x: 100, y: 200, width: 150, height: 20, color: '#124e66'},
            {x: 600, y: 150, width: 100, height: 20, color: '#124e66'},
            {x: 300, y: 100, width: 200, height: 20, color: '#2d6a4f'}
        ];
        
        this.coins = [
            {x: 150, y: 360, radius: 10, color: '#FFD700', collected: false},
            {x: 450, y: 310, radius: 10, color: '#FFD700', collected: false},
            {x: 250, y: 260, radius: 10, color: '#FFD700', collected: false},
            {x: 550, y: 210, radius: 10, color: '#FFD700', collected: false},
            {x: 150, y: 160, radius: 10, color: '#FFD700', collected: false},
            {x: 650, y: 110, radius: 10, color: '#FFD700', collected: false},
            {x: 350, y: 60, radius: 10, color: '#FFD700', collected: false}
        ];
        
        this.enemies = [
            {x: 300, y: 380, width: 30, height: 30, color: '#e63946', direction: 1, speed: 2},
            {x: 550, y: 330, width: 30, height: 30, color: '#e63946', direction: -1, speed: 2}
        ];
        
        this.door = {
            x: 700,
            y: 80,
            width: 40,
            height: 60,
            color: '#8B4513',
            isOpen: false
        };
        
        this.player.x = 100;
        this.player.y = 300;
        this.player.color = '#4361ee';
    }
    
    // ========== УРОВЕНЬ 2 ==========
    setupLevel2() {
        this.platforms = [
            {x: 0, y: 450, width: 800, height: 50, color: '#1b3a4b'},
            {x: 50, y: 420, width: 150, height: 20, color: '#124e66'},
            {x: 300, y: 380, width: 120, height: 20, color: '#124e66'},
            {x: 150, y: 320, width: 100, height: 20, color: '#124e66'},
            {x: 400, y: 280, width: 180, height: 20, color: '#124e66'},
            {x: 200, y: 230, width: 120, height: 20, color: '#2d6a4f'}, // прыгучая
            {x: 500, y: 180, width: 150, height: 20, color: '#124e66'},
            {x: 100, y: 130, width: 100, height: 20, color: '#124e66'},
            {x: 600, y: 90, width: 120, height: 20, color: '#124e66'}
        ];
        
        this.coins = [
            {x: 100, y: 380, radius: 10, color: '#FFD700', collected: false},
            {x: 350, y: 340, radius: 10, color: '#FFD700', collected: false},
            {x: 200, y: 280, radius: 10, color: '#FFD700', collected: false},
            {x: 480, y: 240, radius: 10, color: '#FFD700', collected: false},
            {x: 250, y: 190, radius: 10, color: '#FFD700', collected: false},
            {x: 560, y: 140, radius: 10, color: '#FFD700', collected: false},
            {x: 150, y: 90, radius: 10, color: '#FFD700', collected: false},
            {x: 650, y: 50, radius: 10, color: '#FFD700', collected: false}
        ];
        
        this.enemies = [
            {x: 200, y: 400, width: 30, height: 30, color: '#e63946', direction: 1, speed: 3},
            {x: 500, y: 340, width: 30, height: 30, color: '#e63946', direction: -1, speed: 3},
            {x: 350, y: 200, width: 30, height: 30, color: '#e63946', direction: 1, speed: 2}
        ];
        
        this.door = {
            x: 700,
            y: 50,
            width: 40,
            height: 60,
            color: '#8B4513',
            isOpen: false
        };
        
        this.player.x = 100;
        this.player.y = 350;
        this.player.color = '#2196f3';
    }
    
    // ========== УРОВЕНЬ 3 ==========
    setupLevel3() {
        this.platforms = [
            {x: 0, y: 450, width: 800, height: 50, color: '#1b3a4b'},
            {x: 100, y: 420, width: 120, height: 20, color: '#124e66'},
            {x: 350, y: 390, width: 100, height: 20, color: '#124e66'},
            {x: 200, y: 340, width: 150, height: 20, color: '#2d6a4f'},
            {x: 450, y: 300, width: 120, height: 20, color: '#124e66'},
            {x: 150, y: 250, width: 100, height: 20, color: '#124e66'},
            {x: 500, y: 200, width: 150, height: 20, color: '#124e66'},
            {x: 250, y: 150, width: 120, height: 20, color: '#124e66'},
            {x: 600, y: 100, width: 100, height: 20, color: '#124e66'},
            {x: 350, y: 60, width: 150, height: 20, color: '#2d6a4f'}
        ];
        
        this.coins = [
            {x: 150, y: 380, radius: 10, color: '#FFD700', collected: false},
            {x: 400, y: 350, radius: 10, color: '#FFD700', collected: false},
            {x: 250, y: 300, radius: 10, color: '#FFD700', collected: false},
            {x: 500, y: 260, radius: 10, color: '#FFD700', collected: false},
            {x: 200, y: 210, radius: 10, color: '#FFD700', collected: false},
            {x: 550, y: 160, radius: 10, color: '#FFD700', collected: false},
            {x: 300, y: 110, radius: 10, color: '#FFD700', collected: false},
            {x: 650, y: 60, radius: 10, color: '#FFD700', collected: false},
            {x: 400, y: 20, radius: 10, color: '#FFD700', collected: false}
        ];
        
        this.enemies = [
            {x: 300, y: 400, width: 30, height: 30, color: '#e63946', direction: 1, speed: 4},
            {x: 550, y: 320, width: 30, height: 30, color: '#e63946', direction: -1, speed: 4},
            {x: 200, y: 180, width: 30, height: 30, color: '#e63946', direction: 1, speed: 3},
            {x: 450, y: 100, width: 30, height: 30, color: '#e63946', direction: -1, speed: 3}
        ];
        
        this.door = {
            x: 700,
            y: 20,
            width: 40,
            height: 60,
            color: '#8B4513',
            isOpen: false
        };
        
        this.player.x = 150;
        this.player.y = 370;
        this.player.color = '#9c27b0';
    }
    
    // ========== УРОВЕНЬ 4 ==========
    setupLevel4() {
        this.platforms = [
            {x: 0, y: 450, width: 800, height: 50, color: '#bbdefb'},
            {x: 100, y: 400, width: 200, height: 20, color: '#90caf9'},
            {x: 400, y: 350, width: 150, height: 20, color: '#64b5f6'},
            {x: 200, y: 300, width: 100, height: 20, color: '#42a5f5'},
            {x: 500, y: 250, width: 200, height: 20, color: '#2196f3'},
            {x: 100, y: 200, width: 150, height: 20, color: '#1e88e5'},
            {x: 600, y: 150, width: 100, height: 20, color: '#1976d2'},
            {x: 300, y: 100, width: 200, height: 20, color: '#1565c0'},
            {x: 50, y: 70, width: 100, height: 20, color: '#0d47a1'}
        ];
        
        this.coins = [
            {x: 150, y: 360, radius: 10, color: '#81d4fa', collected: false},
            {x: 450, y: 310, radius: 10, color: '#4fc3f7', collected: false},
            {x: 250, y: 260, radius: 10, color: '#29b6f6', collected: false},
            {x: 550, y: 210, radius: 10, color: '#03a9f4', collected: false},
            {x: 150, y: 160, radius: 10, color: '#039be5', collected: false},
            {x: 650, y: 110, radius: 10, color: '#0288d1', collected: false},
            {x: 350, y: 60, radius: 10, color: '#0277bd', collected: false},
            {x: 100, y: 30, radius: 10, color: '#01579b', collected: false},
            {x: 500, y: 350, radius: 10, color: '#80d8ff', collected: false},
            {x: 300, y: 280, radius: 10, color: '#40c4ff', collected: false}
        ];
        
        this.enemies = [
            {x: 300, y: 380, width: 35, height: 35, color: '#b3e5fc', direction: 1, speed: 2.5},
            {x: 550, y: 330, width: 35, height: 35, color: '#81d4fa', direction: -1, speed: 2.5},
            {x: 200, y: 250, width: 40, height: 40, color: '#4fc3f7', direction: 1, speed: 2},
            {x: 450, y: 180, width: 40, height: 40, color: '#29b6f6', direction: -1, speed: 2},
            {x: 100, y: 100, width: 30, height: 30, color: '#03a9f4', direction: 1, speed: 3}
        ];
        
        this.door = {
            x: 700,
            y: 60,
            width: 50,
            height: 70,
            color: '#29b6f6',
            isOpen: false
        };
        
        this.player.x = 100;
        this.player.y = 300;
        this.player.color = '#29b6f6';
    }
    
    // ========== УРОВЕНЬ 5 ==========
    setupLevel5() {
        this.platforms = [
            {x: 0, y: 470, width: 800, height: 30, color: '#ff5722'},
            {x: 100, y: 400, width: 200, height: 20, color: '#795548'},
            {x: 400, y: 350, width: 150, height: 20, color: '#6d4c41'},
            {x: 200, y: 300, width: 100, height: 20, color: '#5d4037'},
            {x: 500, y: 250, width: 200, height: 20, color: '#4e342e'},
            {x: 100, y: 200, width: 150, height: 20, color: '#3e2723'},
            {x: 600, y: 150, width: 100, height: 20, color: '#bf360c'},
            {x: 300, y: 100, width: 200, height: 20, color: '#dd2c00'},
            {x: 50, y: 70, width: 100, height: 15, color: '#ff6f00'},
            {x: 650, y: 50, width: 80, height: 15, color: '#ff3d00'}
        ];
        
        this.coins = [
            {x: 150, y: 360, radius: 11, color: '#ff9800', collected: false},
            {x: 450, y: 310, radius: 11, color: '#ff5722', collected: false},
            {x: 250, y: 260, radius: 11, color: '#ff3d00', collected: false},
            {x: 550, y: 210, radius: 11, color: '#dd2c00', collected: false},
            {x: 150, y: 160, radius: 11, color: '#d50000', collected: false},
            {x: 650, y: 110, radius: 11, color: '#ff6d00', collected: false},
            {x: 350, y: 60, radius: 11, color: '#ffab00', collected: false},
            {x: 100, y: 30, radius: 11, color: '#ffd600', collected: false},
            {x: 500, y: 350, radius: 11, color: '#ff9100', collected: false},
            {x: 300, y: 280, radius: 11, color: '#ff6500', collected: false},
            {x: 600, y: 190, radius: 11, color: '#ff4000', collected: false},
            {x: 200, y: 120, radius: 11, color: '#ff2000', collected: false}
        ];
        
        this.enemies = [
            {x: 300, y: 380, width: 40, height: 40, color: '#ff5722', direction: 1, speed: 3},
            {x: 550, y: 330, width: 40, height: 40, color: '#ff3d00', direction: -1, speed: 3},
            {x: 200, y: 250, width: 45, height: 45, color: '#dd2c00', direction: 1, speed: 2.5},
            {x: 450, y: 180, width: 45, height: 45, color: '#d50000', direction: -1, speed: 2.5},
            {x: 100, y: 100, width: 35, height: 35, color: '#ff6d00', direction: 1, speed: 3.5},
            {x: 600, y: 60, width: 35, height: 35, color: '#ff9100', direction: -1, speed: 3.5}
        ];
        
        this.door = {
            x: 700,
            y: 20,
            width: 60,
            height: 80,
            color: '#7b1fa2',
            isOpen: false
        };
        
        this.player.x = 100;
        this.player.y = 300;
        this.player.color = '#ff5722';
        this.player.lives += 2; // Бонусные жизни!
        
        console.log('ФИНАЛЬНЫЙ уровень 5! +2 жизни!');
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    init() {
        console.log('=== GAME INIT ===');
        this.updateUI();
    }
    
    start() {
        console.log('=== GAME START ===');
        this.running = true;
        this.paused = false;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.running || this.paused) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.gameTime += deltaTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Управление игроком
        this.updatePlayer();
        
        // Обновление врагов
        this.updateEnemies();
        
        // Проверка коллизий
        this.checkCollisions();
        
        // Обновление UI
        this.updateUI();
    }
    
    updatePlayer() {
        // Гравитация
        this.player.velocityY += this.player.gravity;
        
        // Движение влево/вправо
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.velocityX = -this.player.speed;
        } else if (this.keys['d'] || this.keys['arrowright']) {
            this.player.velocityX = this.player.speed;
        } else {
            this.player.velocityX *= 0.8; // Трение
        }
        
        // Прыжок
        if ((this.keys['w'] || this.keys[' '] || this.keys['arrowup']) && this.player.isOnGround) {
            this.player.velocityY = -this.player.jumpForce;
            this.player.isOnGround = false;
        }
        
        // Применение движения
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Границы canvas
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width;
        }
        
        // Падение
        if (this.player.y > this.canvas.height) {
            this.player.lives--;
            this.player.x = 100;
            this.player.y = 300;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
            
            if (this.player.lives <= 0) {
                this.gameOver = true;
                console.log('Игра окончена!');
            }
        }
        
        // Коллизии с платформами
        this.player.isOnGround = false;
        for (let platform of this.platforms) {
            if (this.checkCollision(this.player, platform)) {
                // Определяем сторону столкновения
                if (this.player.velocityY > 0 && 
                    this.player.y + this.player.height > platform.y && 
                    this.player.y < platform.y) {
                    // Сверху
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.isOnGround = true;
                }
            }
        }
    }
    
    updateEnemies() {
        for (let enemy of this.enemies) {
            enemy.x += enemy.direction * enemy.speed;
            
            // Разворот у краев
            if (enemy.x < 100 || enemy.x > 700) {
                enemy.direction *= -1;
            }
        }
    }
    
    checkCollisions() {
        // Коллизии с монетами
        for (let coin of this.coins) {
            if (!coin.collected && this.checkCollision(this.player, {
                x: coin.x - coin.radius,
                y: coin.y - coin.radius,
                width: coin.radius * 2,
                height: coin.radius * 2
            })) {
                coin.collected = true;
                this.score += 100;
                console.log('Монета собрана! Очки:', this.score);
            }
        }
        
        // Коллизии с врагами
        for (let enemy of this.enemies) {
            if (this.checkCollision(this.player, enemy)) {
                if (this.player.velocityY > 0 && this.player.y + this.player.height - enemy.y < 20) {
                    // Игрок прыгнул на врага
                    this.score += 200;
                    this.enemies = this.enemies.filter(e => e !== enemy);
                    console.log('Враг уничтожен! Очки:', this.score);
                } else {
                    // Игрок получил урон
                    this.player.lives--;
                    this.player.x = 100;
                    this.player.y = 300;
                    console.log('Получен удар! Жизней:', this.player.lives);
                    
                    if (this.player.lives <= 0) {
                        this.gameOver = true;
                    }
                }
            }
        }
        
        // Коллизия с дверью
        if (this.checkCollision(this.player, this.door)) {
            const allCoinsCollected = this.coins.every(c => c.collected);
            if (allCoinsCollected) {
                console.log('Уровень пройден!');
                this.levelComplete = true;
            }
        }

        // Проверяем, все ли монеты собраны
        const allCoinsCollected = this.coins.every(c => c.collected);
        if (allCoinsCollected && !this.door.isOpen) {
            this.door.isOpen = true;
            this.door.color = '#228B22'; // Зеленый цвет
            console.log('Дверь открыта! Все монеты собраны!');
        }
        
        // Если дверь открыта и игрок касается ее
        if (this.door.isOpen && this.checkCollision(this.player, this.door)) {
            console.log('Уровень пройден!');
            this.levelComplete = true;
            this.showLevelCompleteScreen();
        }
    }
    
    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    draw() {
        // Очистка с учетом уровня
        if (this.level === 4) {
            this.ctx.fillStyle = '#0d47a1'; // Синий фон для уровня 4
        } else if (this.level === 5) {
            this.ctx.fillStyle = '#2c0000'; // Темно-красный для уровня 5
        } else {
            this.ctx.fillStyle = '#0d1b2a'; // Стандартный фон
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Звезды на фоне (только для первых 3 уровней)
        if (this.level <= 3) {
            this.ctx.fillStyle = 'white';
            for (let i = 0; i < 50; i++) {
                const x = (i * 17) % this.canvas.width;
                const y = (i * 23) % this.canvas.height;
                this.ctx.fillRect(x, y, 2, 2);
            }
        }
        
        // Отрисовка платформ
        this.platforms.forEach(platform => {
            this.ctx.fillStyle = platform.color;
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Отрисовка монет
        this.coins.forEach(coin => {
            if (!coin.collected) {
                this.ctx.fillStyle = coin.color;
                this.ctx.beginPath();
                this.ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Блеск
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(coin.x - 3, coin.y - 3, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Отрисовка врагов
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Глаза
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 5, 5);
            this.ctx.fillRect(enemy.x + 20, enemy.y + 5, 5, 5);
        });
        
        // Отрисовка двери
        if (this.door.isOpen) {
            // ОТКРЫТАЯ дверь
            this.ctx.fillStyle = '#228B22'; // Зеленый
            this.ctx.fillRect(this.door.x, this.door.y, this.door.width, this.door.height);
            
            // Проем
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(this.door.x + 10, this.door.y + 10, this.door.width - 20, this.door.height - 20);
            
            // Текст "ВХОД"
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ВХОД', this.door.x + this.door.width/2, this.door.y + this.door.height/2);
        } else {
            // ЗАКРЫТАЯ дверь
            this.ctx.fillStyle = this.door.color;
            this.ctx.fillRect(this.door.x, this.door.y, this.door.width, this.door.height);
            this.ctx.fillStyle = '#A0522D';
            this.ctx.fillRect(this.door.x + 5, this.door.y + 5, this.door.width - 10, this.door.height - 10);
            
            // Замок
            this.ctx.fillStyle = '#DAA520';
            this.ctx.beginPath();
            this.ctx.arc(this.door.x + this.door.width - 10, this.door.y + this.door.height/2, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Текст "ЗАКРЫТО"
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ЗАКРЫТО', this.door.x + this.door.width/2, this.door.y + this.door.height/2);
        }
        
        // Отрисовка игрока
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Лицо игрока
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.player.x + 5, this.player.y + 10, 8, 8); // левый глаз
        this.ctx.fillRect(this.player.x + 17, this.player.y + 10, 8, 8); // правый глаз
        
        // Улыбка
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + 15, this.player.y + 25, 10, 0.2, Math.PI - 0.2);
        this.ctx.stroke();
        
        // UI поверх всего
        this.drawUI();
    }
    
    drawUI() {
        // Полупрозрачная панель
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 10, 150, 70);
        this.ctx.strokeStyle = '#4cc9f0';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 150, 70);
        
        // Текст
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Очки: ${this.score}`, 20, 35);
        this.ctx.fillText(`Уровень: ${this.level}/5`, 20, 55); // Показываем прогресс уровней
        this.ctx.fillText(`Жизни: ${this.player.lives}`, 20, 75);
        
        // Таймер
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        this.ctx.fillText(
            `Время: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            this.canvas.width - 150, 30
        );

        // Прогресс сбора монет
        const collected = this.coins.filter(c => c.collected).length;
        const total = this.coins.length;
        
        if (collected < total) {
            // Показываем счетчик монет
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(this.canvas.width/2 - 80, 10, 160, 25);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Монеты: ${collected}/${total}`, this.canvas.width/2, 28);
        } else {
            // Все монеты собраны
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            this.ctx.fillRect(this.canvas.width/2 - 120, 10, 240, 30);
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('✅ ВСЕ МОНЕТЫ СОБРАНЫ!', this.canvas.width/2, 30);
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lives').textContent = this.player.lives;
        document.getElementById('coinsCollected').textContent = this.coins.filter(c => c.collected).length;
        document.getElementById('totalCoins').textContent = this.coins.length;
        
        // Таймер
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // ========== МЕТОД ПЕРЕХОДА НА СЛЕДУЮЩИЙ УРОВЕНЬ ==========
    nextLevel() {
        console.log('Переход на следующий уровень');
        
        // Скрываем экран
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        
        if (this.level < 5) {
            this.level += 1;
            console.log(`Новый уровень: ${this.level}`);
            
            // Настраиваем уровень
            this.setupLevel(this.level);
            
            // Запускаем игру
            this.start();
        } else {
            // ПОБЕДА!
            const finalScore = this.score;
            const playTime = this.gameTime;
            const minutes = Math.floor(playTime / 60);
            const seconds = Math.floor(playTime % 60);
            
            alert(`🎉 ПОЗДРАВЛЯЕМ! 🎉\n\n` +
                  `Вы прошли ВСЕ 5 уровней!\n` +
                  `🏆 Финальный счет: ${finalScore}\n` +
                  `⏱️ Общее время: ${minutes}:${seconds.toString().padStart(2, '0')}\n\n` +
                  `Вы - настоящий чемпион платформеров!`);
            
            // Возвращаемся к уровню 1
            this.reset();
        }
    }
    
    togglePause() {
        this.paused = !this.paused;
        console.log('Пауза:', this.paused);
        
        if (!this.paused) {
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    toggleMute() {
        this.muted = !this.muted;
        console.log('Звук:', this.muted ? 'выключен' : 'включен');
    }
    
    restart() {
        console.log('Рестарт игры');
        this.resetGameState();
        this.start();
    }
    
    reset() {
        console.log('Сброс игры');
        this.running = false;
        this.level = 1;
        this.setupLevel(1); // Начинаем с уровня 1
        this.updateUI();
    }
    
    resetGameState() {
        this.score = 0;
        this.gameTime = 0;
        this.gameOver = false;
        this.levelComplete = false;
        this.paused = false;
        
        this.player = this.createPlayer();
        this.setupLevel(this.level); // Используем setupLevel для текущего уровня
        
        // Сбрасываем состояние двери
        if (this.door) {
            this.door.isOpen = false;
            this.door.color = '#8B4513'; // Коричневый цвет
        }
    }

    showLevelCompleteScreen() {
        console.log('Уровень пройден!');
        
        // Останавливаем игру
        this.running = false;
        
        // Показываем экран завершения
        document.getElementById('levelScore').textContent = this.score;
        document.getElementById('levelCompleteScreen').classList.remove('hidden');
        
        // Бонус за время
        const timeBonus = Math.max(1000 - Math.floor(this.gameTime * 10), 0);
        this.score += timeBonus;
        console.log('Бонус за время:', timeBonus);
        
        // Обновляем UI
        this.updateUI();
    }
}