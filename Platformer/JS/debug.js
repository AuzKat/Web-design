// Отладочный скрипт
console.log('=== ДЕБАГ ИГРЫ ===');

// Проверка загрузки классов
console.log('Проверка классов:');
console.log('- Game:', typeof Game);
console.log('- Player:', typeof Player);
console.log('- Platform:', typeof Platform);
console.log('- Coin:', typeof Coin);
console.log('- Enemy:', typeof Enemy);
console.log('- Door:', typeof Door);
console.log('- Collision:', typeof Collision);
console.log('- InputHandler:', typeof InputHandler);
console.log('- Renderer:', typeof Renderer);

// Проверка элементов на странице
console.log('\nПроверка элементов:');
console.log('- Canvas:', document.getElementById('gameCanvas'));
console.log('- Start button:', document.getElementById('startBtn'));
console.log('- Start screen:', document.getElementById('startScreen'));

// Перехват ошибок
window.addEventListener('error', function(e) {
    console.error('Глобальная ошибка:', e.message);
    console.error('В файле:', e.filename);
    console.error('На строке:', e.lineno);
    console.error('Полная ошибка:', e.error);
});

// Проверка нажатия кнопки
document.getElementById('startBtn').addEventListener('click', function() {
    console.log('=== КНОПКА "НАЧАТЬ ИГРУ" НАЖАТА ===');
    console.log('Эта функция вызвана');
    
    // Проверяем доступность game
    console.log('window.game существует?', !!window.game);
    
    // Прячем стартовый экран
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        console.log('Скрываем стартовый экран');
        startScreen.classList.add('hidden');
    }
});