// main.js - простая версия
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== ИГРА ЗАГРУЖАЕТСЯ ===');
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    if (!canvas) {
        console.error('Canvas не найден!');
        return;
    }
    
    console.log('Создаем игру...');
    window.game = new Game(canvas, ctx);
    window.game.init();
    
    console.log('Настраиваем кнопки...');
    
    // Кнопка "Начать игру"
    document.getElementById('startBtn').addEventListener('click', () => {
        console.log('Нажата кнопка "Начать игру"');
        document.getElementById('startScreen').classList.add('hidden');
        window.game.start();
    });
    
    // Кнопка "Пауза"
    document.getElementById('pauseBtn').addEventListener('click', () => {
        console.log('Нажата кнопка "Пауза"');
        window.game.togglePause();
        
        const icon = document.querySelector('#pauseBtn i');
        if (window.game.paused) {
            icon.className = 'fas fa-play';
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i> Продолжить';
        } else {
            icon.className = 'fas fa-pause';
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> Пауза';
        }
    });
    
    // Кнопка "Звук"
    document.getElementById('muteBtn').addEventListener('click', () => {
        console.log('Нажата кнопка "Звук"');
        window.game.toggleMute();
        
        const icon = document.querySelector('#muteBtn i');
        if (window.game.muted) {
            icon.className = 'fas fa-volume-mute';
            document.getElementById('muteBtn').innerHTML = '<i class="fas fa-volume-mute"></i> Вкл. звук';
        } else {
            icon.className = 'fas fa-volume-up';
            document.getElementById('muteBtn').innerHTML = '<i class="fas fa-volume-up"></i> Выкл. звук';
        }
    });
    
    // Кнопка "Сброс"
    document.getElementById('resetBtn').addEventListener('click', () => {
        console.log('Нажата кнопка "Сброс"');
        window.game.reset();
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('levelCompleteScreen').classList.add('hidden');
    });
    
    // Кнопка "Рестарт" (из экрана Game Over)
    document.getElementById('restartBtn').addEventListener('click', () => {
        console.log('Нажата кнопка "Рестарт"');
        window.game.restart();
        document.getElementById('gameOverScreen').classList.add('hidden');
    });
    
    // Кнопка "Следующий уровень"
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        console.log('Нажата кнопка "Следующий уровень"');
        window.game.nextLevel();
        document.getElementById('levelCompleteScreen').classList.add('hidden');
    });
    
    console.log('=== ИГРА ГОТОВА ===');
    console.log('Нажмите "Начать игру"');
});