// Система обработки коллизий
class Collision {
    // Проверка коллизии AABB (Axis-Aligned Bounding Box)
    static checkAABB(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    // Обработка коллизий игрока с платформами
    static handlePlatformCollisions(player, platforms) {
        const playerBounds = player.getBounds();
        let collisionResult = {
            hasCollision: false,
            isOnGround: false,
            bounce: 0
        };
        
        for (let platform of platforms) {
            const platformBounds = platform.getBounds();
            
            if (this.checkAABB(playerBounds, platformBounds)) {
                collisionResult.hasCollision = true;
                
                // Определяем сторону столкновения
                const playerBottom = playerBounds.y + playerBounds.height;
                const playerRight = playerBounds.x + playerBounds.width;
                const platformBottom = platformBounds.y + platformBounds.height;
                const platformRight = platformBounds.x + platformBounds.width;
                
                // Вычисляем глубину проникновения с каждой стороны
                const bottomOverlap = playerBottom - platformBounds.y;
                const topOverlap = platformBottom - playerBounds.y;
                const rightOverlap = playerRight - platformBounds.x;
                const leftOverlap = platformRight - playerBounds.x;
                
                // Находим минимальное перекрытие для определения стороны столкновения
                const minOverlap = Math.min(
                    bottomOverlap, topOverlap, rightOverlap, leftOverlap
                );
                
                // Коллизия сверху (игрок приземляется на платформу)
                if (minOverlap === bottomOverlap && playerBounds.velocityY > 0) {
                    player.y = platformBounds.y - playerBounds.height;
                    player.velocityY = 0;
                    player.isOnGround = true;
                    collisionResult.isOnGround = true;
                    
                    // Обработка специальных платформ
                    if (platformBounds.type === 'breaking') {
                        platform.break();
                    } else if (platformBounds.type === 'bouncy') {
                        player.velocityY = -platformBounds.bounceForce;
                        collisionResult.bounce = platformBounds.bounceForce;
                    }
                }
                // Коллизия снизу (игрок ударяется головой)
                else if (minOverlap === topOverlap && playerBounds.velocityY < 0) {
                    player.y = platformBottom;
                    player.velocityY = 0;
                }
                // Коллизия слева
                else if (minOverlap === rightOverlap) {
                    player.x = platformBounds.x - playerBounds.width;
                    player.velocityX = 0;
                }
                // Коллизия справа
                else if (minOverlap === leftOverlap) {
                    player.x = platformRight;
                    player.velocityX = 0;
                }
            }
        }
        
        return collisionResult;
    }
    
    // Обработка коллизий игрока с монетами
    static handleCoinCollisions(player, coins) {
        const playerBounds = player.getBounds();
        let collectedCoins = 0;
        let totalScore = 0;
        
        for (let coin of coins) {
            if (!coin.collected && this.checkAABB(playerBounds, coin.getBounds())) {
                totalScore += coin.collect();
                collectedCoins++;
            }
        }
        
        return { collectedCoins, totalScore };
    }
    
    // Обработка коллизий игрока с дверью
    static handleDoorCollision(player, door) {
        const playerBounds = player.getBounds();
        const doorBounds = door.getBounds();
        
        if (this.checkAABB(playerBounds, doorBounds) && door.isOpen) {
            return true;
        }
        
        return false;
    }
    
    // Обработка коллизий игрока с врагами
    static handleEnemyCollisions(player, enemies) {
        const playerBounds = player.getBounds();
        
        for (let enemy of enemies) {
            const enemyBounds = enemy.getBounds();
            
            if (this.checkAABB(playerBounds, enemyBounds)) {
                // Если игрок падает на врага сверху
                if (playerBounds.velocityY > 0 && 
                    playerBounds.y + playerBounds.height - enemyBounds.y < 20) {
                    return { hit: true, fromTop: true, enemy: enemy };
                } else {
                    return { hit: true, fromTop: false, enemy: enemy };
                }
            }
        }
        
        return { hit: false, fromTop: false, enemy: null };
    }
    
    // Проверка коллизий врагов с платформами
    static handleEnemyPlatformCollisions(enemy, platforms) {
        const enemyBounds = enemy.getBounds();
        
        for (let platform of platforms) {
            const platformBounds = platform.getBounds();
            
            if (this.checkAABB(enemyBounds, platformBounds)) {
                // Определяем сторону столкновения
                const enemyBottom = enemyBounds.y + enemyBounds.height;
                const enemyRight = enemyBounds.x + enemyBounds.width;
                const platformBottom = platformBounds.y + platformBounds.height;
                const platformRight = platformBounds.x + platformBounds.width;
                
                // Вычисляем глубину проникновения
                const bottomOverlap = enemyBottom - platformBounds.y;
                const topOverlap = platformBottom - enemyBounds.y;
                const rightOverlap = enemyRight - platformBounds.x;
                const leftOverlap = platformRight - enemyBounds.x;
                
                // Находим минимальное перекрытие
                const minOverlap = Math.min(bottomOverlap, topOverlap, rightOverlap, leftOverlap);
                
                // Столкновение сверху
                if (minOverlap === bottomOverlap && enemyBounds.velocityY > 0) {
                    enemy.y = platformBounds.y - enemyBounds.height;
                    enemy.velocityY = 0;
                    enemy.isOnGround = true;
                    return true;
                }
                // Столкновение слева
                else if (minOverlap === rightOverlap) {
                    enemy.x = platformBounds.x - enemyBounds.width;
                    enemy.direction *= -1;
                    return true;
                }
                // Столкновение справа
                else if (minOverlap === leftOverlap) {
                    enemy.x = platformRight;
                    enemy.direction *= -1;
                    return true;
                }
            }
        }
        
        return false;
    }
}