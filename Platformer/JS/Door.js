// Класс двери для завершения уровня (добавить в существующие файлы)
class Door {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isOpen = false;
        this.openProgress = 0;
    }
    
    update() {
        if (this.isOpen && this.openProgress < 1) {
            this.openProgress += 0.05;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Дверная рама
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Дверь
        const doorOffset = this.isOpen ? -this.width * 0.7 * this.openProgress : 0;
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x + 5 + doorOffset, this.y + 5, this.width - 10, this.height - 10);
        
        // Ручка
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(this.x + this.width - 15 + doorOffset, this.y + this.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Открытая дверь (внутренняя часть)
        if (this.isOpen && this.openProgress > 