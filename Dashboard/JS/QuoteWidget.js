import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
    constructor(config) {
        super({
            ...config,
            type: 'quote'
        });
        
        this.quotes = [
            {
                text: "Единственный способ сделать великую работу — любить то, что ты делаешь.",
                author: "Стив Джобс"
            },
            {
                text: "Не бойтесь отказываться от хорошего в пользу отличного.",
                author: "Джон Д. Рокфеллер"
            },
            {
                text: "Успех — это способность идти от поражения к поражению, не теряя энтузиазма.",
                author: "Уинстон Черчилль"
            },
            {
                text: "Ваше время ограничено, не тратьте его, живя чужой жизнью.",
                author: "Стив Джобс"
            },
            {
                text: "Самый большой риск — не рисковать вообще.",
                author: "Марк Цукерберг"
            },
            {
                text: "Если вы не можете объяснить что-то просто, вы сами этого не понимаете.",
                author: "Альберт Эйнштейн"
            },
            {
                text: "Лучше быть уверенным в хорошем результате, чем надеяться на отличный.",
                author: "Уоррен Баффет"
            },
            {
                text: "Не ошибается только тот, кто ничего не делает.",
                author: "Теодор Рузвельт"
            },
            {
                text: "Сложнее всего начать действовать, все остальное зависит только от упорства.",
                author: "Амелия Эрхарт"
            },
            {
                text: "Возможности не приходят сами — вы создаете их.",
                author: "Крис Гроссер"
            }
        ];
        
        this.currentQuoteIndex = Math.floor(Math.random() * this.quotes.length);
        this.quoteHistory = [this.currentQuoteIndex];
        
        // Восстановление из localStorage
        this.restoreFromStorage();
    }

    renderBody() {
        if (this.isLoading) {
            return `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка цитаты...</p>
                </div>
            `;
        }

        if (this.error) {
            return `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <p>${this.error}</p>
                    <button class="retry-btn" onclick="this.closest('.widget').__widget__.refresh()">
                        Попробовать снова
                    </button>
                </div>
            `;
        }

        const quote = this.quotes[this.currentQuoteIndex];

        return `
            <div class="quote-content">
                <div class="quote-text">${quote.text}</div>
                <div class="quote-author">— ${quote.author}</div>
                <div class="quote-controls">
                    <button class="quote-btn" onclick="this.closest('.widget').__widget__.nextQuote()">
                        <i class="fas fa-random"></i> Следующая
                    </button>
                    <button class="quote-btn secondary" onclick="this.closest('.widget').__widget__.copyQuote()">
                        <i class="fas fa-copy"></i> Копировать
                    </button>
                </div>
            </div>
        `;
    }

    attachEvents() {
        super.attachEvents();
        
        if (!this.element) return;
        
        // Сохраняем ссылку на экземпляр в DOM-элементе
        this.element.__widget__ = this;
    }

    nextQuote() {
        // Генерируем новый индекс, отличный от текущего
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.quotes.length);
        } while (newIndex === this.currentQuoteIndex && this.quotes.length > 1);
        
        this.currentQuoteIndex = newIndex;
        this.quoteHistory.push(newIndex);
        
        // Сохраняем в localStorage
        this.saveToStorage();
        
        // Анимация смены цитаты
        this.element.querySelector('.quote-content').classList.add('animate__animated', 'animate__fadeOut');
        
        setTimeout(() => {
            this.update();
            this.element.querySelector('.quote-content').classList.add('animate__animated', 'animate__fadeIn');
            
            setTimeout(() => {
                this.element.querySelector('.quote-content').classList.remove('animate__animated', 'animate__fadeOut', 'animate__fadeIn');
            }, 500);
        }, 300);
    }

    copyQuote() {
        const quote = this.quotes[this.currentQuoteIndex];
        const text = `"${quote.text}" — ${quote.author}`;
        
        navigator.clipboard.writeText(text).then(() => {
            // Показать уведомление об успешном копировании
            const btn = this.element.querySelector('.quote-btn.secondary');
            const originalHtml = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btn.style.color = 'white';
            btn.style.border = 'none';
            
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.border = '';
            }, 2000);
        }).catch(err => {
            console.error('Ошибка копирования:', err);
        });
    }

    refresh() {
        this.nextQuote();
    }

    restoreFromStorage() {
        try {
            const key = `quote-widget-${this.id}`;
            const data = localStorage.getItem(key);
            
            if (data) {
                const parsed = JSON.parse(data);
                this.currentQuoteIndex = parsed.currentQuoteIndex || this.currentQuoteIndex;
                this.quoteHistory = parsed.quoteHistory || this.quoteHistory;
            }
        } catch (error) {
            console.error('Ошибка загрузки цитат из localStorage:', error);
        }
    }

    saveToStorage() {
        try {
            const key = `quote-widget-${this.id}`;
            const data = {
                currentQuoteIndex: this.currentQuoteIndex,
                quoteHistory: this.quoteHistory
            };
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Ошибка сохранения цитат в localStorage:', error);
        }
    }

    onDestroy() {
        this.saveToStorage();
    }
}