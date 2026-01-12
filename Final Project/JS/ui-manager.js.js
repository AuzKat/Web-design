import { NewsService } from './news-service.js';

export class UIManager {
    constructor() {
        console.log('UIManager инициализирован');
        
        this.newsService = new NewsService();
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.currentSort = 'newest';
        this.currentPage = 1;
        this.itemsPerPage = 6;
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderNews();
    }
    
    initializeElements() {
        console.log('Инициализация элементов DOM');
        
        this.newsContainer = document.getElementById('news-container');
        this.newsCount = document.getElementById('news-count');
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.sortSelect = document.getElementById('sort-select');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.pagination = document.getElementById('pagination');
        this.newsModal = document.getElementById('news-modal');
        this.closeModal = document.getElementById('close-modal');
        this.modalBody = document.getElementById('modal-body');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.noNewsMessage = document.getElementById('no-news-message');
        
        console.log('Элементы найдены:', {
            newsContainer: !!this.newsContainer,
            newsCount: !!this.newsCount,
            searchInput: !!this.searchInput,
            categoryButtons: this.categoryButtons.length
        });
    }
    
    setupEventListeners() {
        console.log('Настройка обработчиков событий');
        
        // Поиск
        this.searchButton.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Сортировка
        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.currentPage = 1;
            this.renderNews();
        });
        
        // Категории
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Клик по категории:', e.target.dataset.category);
                this.handleCategoryChange(e);
            });
        });
        
        // Пагинация
        this.pagination.addEventListener('click', (e) => this.handlePagination(e));
        
        // Модальное окно
        this.closeModal.addEventListener('click', () => this.closeNewsModal());
        this.newsModal.addEventListener('click', (e) => {
            if (e.target === this.newsModal) this.closeNewsModal();
        });
        
        // Клики по карточкам новостей (делегирование событий)
        this.newsContainer.addEventListener('click', (e) => {
            const newsCard = e.target.closest('.news-card');
            if (newsCard) {
                const newsId = parseInt(newsCard.dataset.id);
                console.log('Открытие новости ID:', newsId);
                this.openNewsModal(newsId);
            }
        });
        
        // Категории в футере
        document.querySelectorAll('.footer-section a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                console.log('Клик по категории в футере:', category);
                
                // Имитируем клик по соответствующей кнопке категории
                const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
                if (categoryBtn) {
                    categoryBtn.click();
                }
            });
        });
    }
    
    handleSearch() {
        console.log('Поиск:', this.searchInput.value);
        this.currentSearch = this.searchInput.value.trim();
        this.currentPage = 1;
        this.renderNews();
    }
    
    handleCategoryChange(e) {
        const category = e.target.dataset.category;
        console.log('Смена категории на:', category);
        
        this.currentCategory = category;
        this.currentPage = 1;
        
        // Обновление активной кнопки категории
        this.categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        this.renderNews();
    }
    
    handlePagination(e) {
        const target = e.target;
        console.log('Клик пагинации:', target.className);
        
        if (target.classList.contains('prev-btn')) {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderNews();
            }
        } else if (target.classList.contains('next-btn')) {
            this.currentPage++;
            this.renderNews();
        } else if (target.classList.contains('page-number')) {
            this.currentPage = parseInt(target.dataset.page);
            this.renderNews();
        }
    }
    
    // Получение отфильтрованных новостей
    getFilteredNews() {
        let news = this.newsService.getAllNews();
        console.log('Всего новостей:', news.length);
        
        // Фильтрация по категории
        if (this.currentCategory !== 'all') {
            news = this.newsService.filterByCategory(this.currentCategory);
            console.log('После фильтрации по категории:', this.currentCategory, news.length);
        }
        
        // Поиск
        if (this.currentSearch) {
            news = this.newsService.searchNews(this.currentSearch);
            console.log('После поиска:', this.currentSearch, news.length);
        }
        
        // Сортировка
        news = this.newsService.sortNews(news, this.currentSort);
        
        return news;
    }
    
    // Рендеринг новостей
    renderNews() {
        console.log('Рендеринг новостей, страница:', this.currentPage);
        
        // Показываем индикатор загрузки
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.add('active');
        }
        
        // Имитируем задержку для UX (в реальном проекте здесь был бы запрос к API)
        setTimeout(() => {
            const allNews = this.getFilteredNews();
            const totalNews = allNews.length;
            
            // Обновление счетчика
            if (this.newsCount) {
                this.newsCount.textContent = totalNews;
            }
            
            // Пагинация
            const totalPages = Math.ceil(totalNews / this.itemsPerPage);
            const paginatedNews = this.newsService.getNewsByPage(allNews, this.currentPage, this.itemsPerPage);
            
            // Очистка контейнера
            if (this.newsContainer) {
                this.newsContainer.innerHTML = '';
            }
            
            // Скрываем сообщение "нет новостей" по умолчанию
            if (this.noNewsMessage) {
                this.noNewsMessage.style.display = 'none';
            }
            
            // Рендеринг карточек
            if (paginatedNews.length === 0) {
                // Показываем сообщение "нет новостей"
                if (this.noNewsMessage) {
                    this.noNewsMessage.style.display = 'block';
                }
                
                // Создаем fallback сообщение на случай, если элемент не найден
                const noNewsHTML = `
                    <div class="no-news">
                        <i class="fas fa-newspaper" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                        <h3>Новости не найдены</h3>
                        <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
                    </div>
                `;
                
                if (this.newsContainer) {
                    this.newsContainer.innerHTML = noNewsHTML;
                }
            } else {
                paginatedNews.forEach(news => {
                    const newsCard = this.createNewsCard(news);
                    if (this.newsContainer) {
                        this.newsContainer.appendChild(newsCard);
                    }
                });
            }
            
            // Обновление пагинации
            this.updatePagination(totalPages);
            
            // Скрываем индикатор загрузки
            if (this.loadingSpinner) {
                this.loadingSpinner.classList.remove('active');
            }
            
            console.log('Рендеринг завершен, отображено:', paginatedNews.length, 'новостей');
        }, 300); // Небольшая задержка для лучшего UX
    }
    
    // Создание карточки новости
    createNewsCard(news) {
        const categoryNames = {
            politics: 'Политика',
            economy: 'Экономика',
            technology: 'Технологии',
            sports: 'Спорт',
            culture: 'Культура'
        };
        
        const card = document.createElement('article');
        card.className = 'news-card';
        card.dataset.id = news.id;
        
        card.innerHTML = `
            <img src="${news.image}" alt="${news.title}" class="news-image" loading="lazy">
            <div class="news-content">
                <span class="news-category">${categoryNames[news.category]}</span>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <div class="news-meta">
                    <span><i class="far fa-calendar"></i> ${this.formatDate(news.date)}</span>
                    <span><i class="far fa-eye"></i> ${news.views} просмотров</span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Обновление пагинации
    updatePagination(totalPages) {
        console.log('Обновление пагинации, всего страниц:', totalPages, 'текущая:', this.currentPage);
        
        if (!this.pagination) return;
        
        const prevBtn = this.pagination.querySelector('.prev-btn');
        const nextBtn = this.pagination.querySelector('.next-btn');
        const pageNumbers = this.pagination.querySelector('#page-numbers');
        
        if (!prevBtn || !nextBtn || !pageNumbers) return;
        
        // Кнопки "Назад" и "Вперед"
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Номера страниц
        pageNumbers.innerHTML = '';
        
        // Скрываем пагинацию если нет страниц
        if (totalPages <= 1) {
            this.pagination.style.display = 'none';
            return;
        } else {
            this.pagination.style.display = 'flex';
        }
        
        // Определяем диапазон отображаемых страниц
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Корректировка startPage, если endPage близок к концу
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Генерация номеров страниц
        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('div');
            pageNumber.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            pageNumber.dataset.page = i;
            pageNumbers.appendChild(pageNumber);
        }
    }
    
    // Открытие модального окна с новостью
    openNewsModal(newsId) {
        const news = this.newsService.getNewsById(newsId);
        if (!news) {
            console.error('Новость не найдена ID:', newsId);
            return;
        }
        
        const categoryNames = {
            politics: 'Политика',
            economy: 'Экономика',
            technology: 'Технологии',
            sports: 'Спорт',
            culture: 'Культура'
        };
        
        const modalHTML = `
            <img src="${news.image}" alt="${news.title}" class="modal-news-image">
            <div class="modal-news-meta">
                <span class="modal-news-category">${categoryNames[news.category]}</span>
                <span><i class="far fa-calendar"></i> ${this.formatDate(news.date)}</span>
                <span><i class="fas fa-user"></i> ${news.author}</span>
                <span><i class="far fa-eye"></i> ${news.views} просмотров</span>
            </div>
            <h2 class="modal-news-title">${news.title}</h2>
            <div class="modal-news-content">${news.content}</div>
        `;
        
        if (this.modalBody) {
            this.modalBody.innerHTML = modalHTML;
        }
        
        if (this.newsModal) {
            this.newsModal.classList.add('active');
            this.newsModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Закрытие модального окна
    closeNewsModal() {
        if (this.newsModal) {
            this.newsModal.classList.remove('active');
            this.newsModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Форматирование даты
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('ru-RU', options);
    }
    
