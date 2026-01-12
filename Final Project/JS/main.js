// ModernNews - Новостной портал с NewsAPI
document.addEventListener('DOMContentLoaded', function() {
    console.log('ModernNews с NewsAPI загружается...');
    
    // === КОНФИГУРАЦИЯ API ===
    const API_CONFIG = {
        provider: 'newsapi', // Меняем на newsapi
        apiKey: 'e25ee5feca7f484cb3ca8e5c1cbbb3b5', // ЗАМЕНИТЕ НА ВАШ КЛЮЧ NEWSAPI!
        baseUrl: 'https://newsapi.org/v2/top-headlines',
        
        // Настройки для русских новостей
        country: 'ru', // Россия
        pageSize: 30, // Количество новостей
        
        // Соответствие наших категорий категориям NewsAPI
        categories: {
            all: '',
            politics: 'general',
            economy: 'business',
            technology: 'technology',
            sports: 'sports',
            culture: 'entertainment'
        },
        
        // Русские названия категорий
        categoryNames: {
            all: 'Все новости',
            politics: 'Политика',
            economy: 'Экономика',
            technology: 'Технологии',
            sports: 'Спорт',
            culture: 'Культура'
        }
    };
    
    // === КАЧЕСТВЕННЫЕ ИЗОБРАЖЕНИЯ ДЛЯ ЗАГЛУШЕК ===
    const FALLBACK_IMAGES = {
        politics: [
            'https://images.unsplash.com/photo-1551135049-8a33b2fb2f7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        economy: [
            'https://images.unsplash.com/photo-1620336655055-bd87c5d1d73f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        technology: [
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        sports: [
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        culture: [
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        general: [
            'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
    };
    
    // === DOM ЭЛЕМЕНТЫ ===
    const elements = {
        newsContainer: document.getElementById('news-container'),
        newsCount: document.getElementById('news-count'),
        searchButton: document.getElementById('search-button'),
        searchInput: document.getElementById('search-input'),
        sortSelect: document.getElementById('sort-select'),
        categoryButtons: document.querySelectorAll('.category-btn'),
        newsModal: document.getElementById('news-modal'),
        closeModal: document.getElementById('close-modal'),
        modalBody: document.getElementById('modal-body'),
        loadingSpinner: document.getElementById('loading-spinner'),
        pagination: document.getElementById('pagination'),
        pageNumbers: document.getElementById('page-numbers')
    };
    
    // === СОСТОЯНИЕ ===
    const state = {
        currentCategory: 'all',
        currentSearch: '',
        currentSort: 'newest',
        currentPage: 1,
        itemsPerPage: 9,
        allNews: [],
        isLoading: false
    };
    
    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    
    function setLoading(loading) {
        state.isLoading = loading;
        if (elements.loadingSpinner) {
            elements.loadingSpinner.classList.toggle('active', loading);
        }
        if (loading && elements.newsContainer) {
            elements.newsContainer.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                    <div class="spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1a73e8; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 20px; color: #666;">Загружаем актуальные новости...</p>
                </div>
            `;
        }
    }
    
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 60) {
                return `${diffMins} минут назад`;
            } else if (diffHours < 24) {
                return `${diffHours} часов назад`;
            } else if (diffDays < 7) {
                return `${diffDays} дней назад`;
            } else {
                return date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        } catch (e) {
            return 'Недавно';
        }
    }
    
    function cleanText(text) {
        if (!text) return 'Описание отсутствует';
        
        // Убираем [что-то] из описания
        let cleaned = text
            .replace(/\[.*?\]/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .trim();
        
        if (cleaned.length > 150) {
            cleaned = cleaned.substring(0, 150) + '...';
        }
        
        return cleaned;
    }
    
    function getNewsImage(article, category = 'general', articleIndex = 0) {
        // 1. Пробуем получить изображение из статьи
        if (article.urlToImage && article.urlToImage.startsWith('http')) {
            return article.urlToImage;
        }
        
        // 2. Пробуем получить из мультимедиа
        if (article.multimedia && article.multimedia.length > 0) {
            const image = article.multimedia.find(img => img.format === 'mediumThreeByTwo210');
            if (image && image.url) {
                return 'https://static01.nyt.com/' + image.url;
            }
        }
        
        // 3. Используем красивую заглушку по категории
        const fallbackImages = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.general;
        const index = articleIndex % fallbackImages.length;
        return fallbackImages[index];
    }
    
    function getCategoryFromArticle(article) {
        // NewsAPI возвращает категории, используем их
        if (article.category) return article.category;
        
        // Пробуем определить по источнику или заголовку
        const text = (article.title + ' ' + (article.description || '')).toLowerCase();
        
        const keywords = {
            economy: [
                'рубл', 'доллар', 'евро', 'валюта', 'бирж', 'акци', 'инвест',
                'бизнес', 'финанс', 'банк', 'кредит', 'экономик', 'инфляц'
            ],
            technology: [
                'технолог', 'гаджет', 'смартфон', 'компьютер', 'ии',
                'искусственн', 'интеллект', 'робот', 'космос', 'спутник'
            ],
            sports: [
                'спорт', 'футбол', 'хокке', 'баскетбол', 'теннис',
                'олимпи', 'чемпион', 'матч', 'игр', 'команд'
            ],
            culture: [
                'культур', 'кино', 'театр', 'музык', 'искусств',
                'худож', 'выставк', 'концерт', 'фестивал', 'фильм'
            ]
        };
        
        for (const [category, words] of Object.entries(keywords)) {
            if (words.some(word => text.includes(word))) {
                return category;
            }
        }
        
        return 'politics'; // По умолчанию
    }
    
    function buildApiUrl(category = 'all', keyword = '') {
        const config = API_CONFIG;
        let url = `${config.baseUrl}?apiKey=${config.apiKey}&country=${config.country}&pageSize=${config.pageSize}`;
        
        if (category !== 'all' && config.categories[category]) {
            url += `&category=${config.categories[category]}`;
        }
        
        if (keyword && keyword.trim()) {
            url += `&q=${encodeURIComponent(keyword.trim())}`;
        }
        
        return url;
    }
    
    // === ЗАГРУЗКА НОВОСТЕЙ С NEWSAPI ===
    
    async function fetchNewsFromNewsAPI(category = 'all', keyword = '') {
        setLoading(true);
        
        try {
            const apiUrl = buildApiUrl(category, keyword);
            console.log('Запрашиваем:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Ошибка NewsAPI: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || data.status !== 'ok' || !Array.isArray(data.articles)) {
                throw new Error('Некорректный ответ от NewsAPI');
            }
            
            // Фильтруем новости с изображениями
            const articlesWithImages = data.articles.filter(article => 
                article.title && 
                article.title !== '[Removed]' &&
                article.url &&
                (article.urlToImage || article.multimedia)
            );
            
            if (articlesWithImages.length === 0) {
                console.warn('Нет новостей с изображениями');
                return getFallbackNewsWithImages(category);
            }
            
            // Преобразуем в наш формат
            const newsItems = articlesWithImages.map((article, index) => {
                const categoryFromArticle = getCategoryFromArticle(article);
                
                return {
                    id: index + 1,
                    title: article.title || 'Без заголовка',
                    excerpt: cleanText(article.description) || 'Описание отсутствует',
                    content: cleanText(article.content || article.description) || 'Полное описание отсутствует',
                    category: categoryFromArticle,
                    date: article.publishedAt || new Date().toISOString(),
                    image: article.urlToImage,
                    author: article.author || article.source?.name || 'Автор не указан',
                    source: article.source?.name || 'Неизвестный источник',
                    url: article.url || '#',
                    originalUrl: article.url, // Сохраняем оригинальную ссылку
                    views: Math.floor(Math.random() * 5000) + 100
                };
            });
            
            // Оставляем только новости с хорошими данными
            const validNews = newsItems.filter(item => 
                item.title && 
                item.title.length > 10 &&
                item.excerpt.length > 20
            );
            
            state.allNews = validNews;
            return validNews;
            
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            return getFallbackNewsWithImages(category);
            
        } finally {
            setLoading(false);
        }
    }
    
    function getFallbackNewsWithImages(category = 'all') {
        // Тестовые новости с качественными изображениями и ссылками
        const allNews = [
            {
                id: 1,
                title: "Россия и Китай укрепляют экономическое сотрудничество",
                excerpt: "Страны подписали новые соглашения в области торговли и инвестиций.",
                content: "На встрече лидеров России и Китая были подписаны важные экономические соглашения. Стороны договорились увеличить товарооборот и запустить совместные проекты в энергетике.",
                category: "economy",
                date: new Date().toISOString(),
                image: FALLBACK_IMAGES.economy[0],
                author: "ТАСС",
                source: "ТАСС",
                url: "https://tass.ru/ekonomika/12345678",
                originalUrl: "https://tass.ru/ekonomika/12345678",
                views: 3245
            },
            {
                id: 2,
                title: "Новый российский процессор показал рекордную производительность",
                excerpt: "Отечественный чип превзошел зарубежные аналоги в тестах.",
                content: "Российские инженеры представили новый процессор, который демонстрирует выдающиеся результаты в тестах производительности.",
                category: "technology",
                date: new Date(Date.now() - 3600000).toISOString(),
                image: FALLBACK_IMAGES.technology[0],
                author: "РИА Новости",
                source: "РИА",
                url: "https://ria.ru/20231115/protsessor-1234567890.html",
                originalUrl: "https://ria.ru/20231115/protsessor-1234567890.html",
                views: 4123
            },
            {
                id: 3,
                title: "Сборная России завоевала золото на чемпионате Европы",
                excerpt: "Спортсмены показали лучший результат за последние годы.",
                content: "На чемпионате Европы российские атлеты завоевали 5 золотых медалей, установив новый рекорд.",
                category: "sports",
                date: new Date(Date.now() - 7200000).toISOString(),
                image: FALLBACK_IMAGES.sports[0],
                author: "Спорт-Экспресс",
                source: "Спорт",
                url: "https://www.sport-express.ru/olympicgames/news/1234567/",
                originalUrl: "https://www.sport-express.ru/olympicgames/news/1234567/",
                views: 5678
            },
            {
                id: 4,
                title: "В Москве открылась новая выставка современного искусства",
                excerpt: "Экспозиция представляет работы молодых российских художников.",
                content: "В столице открылась масштабная выставка современного искусства, на которой представлены работы талантливых молодых художников.",
                category: "culture",
                date: new Date(Date.now() - 10800000).toISOString(),
                image: FALLBACK_IMAGES.culture[0],
                author: "Коммерсантъ",
                source: "Коммерсант",
                url: "https://www.kommersant.ru/doc/1234567",
                originalUrl: "https://www.kommersant.ru/doc/1234567",
                views: 2345
            },
            {
                id: 5,
                title: "Правительство утвердило новую стратегию цифрового развития",
                excerpt: "Документ определяет основные направления цифровизации страны.",
                content: "На заседании правительства была утверждена новая стратегия цифрового развития России до 2030 года.",
                category: "politics",
                date: new Date(Date.now() - 14400000).toISOString(),
                image: FALLBACK_IMAGES.politics[0],
                author: "Интерфакс",
                source: "Интерфакс",
                url: "https://www.interfax.ru/russia/1234567",
                originalUrl: "https://www.interfax.ru/russia/1234567",
                views: 1876
            },
            {
                id: 6,
                title: "ЦБ сохранил ключевую ставку на прежнем уровне",
                excerpt: "Решение принято на фоне стабилизации инфляции.",
                content: "Центральный банк России оставил ключевую ставку без изменений, что соответствует ожиданиям аналитиков.",
                category: "economy",
                date: new Date(Date.now() - 18000000).toISOString(),
                image: FALLBACK_IMAGES.economy[1],
                author: "РБК",
                source: "РБК",
                url: "https://www.rbc.ru/economics/15/11/2023/1234567890",
                originalUrl: "https://www.rbc.ru/economics/15/11/2023/1234567890",
                views: 2987
            }
        ];
        
        if (category !== 'all') {
            return allNews.filter(news => news.category === category);
        }
        
        return allNews;
    }
    
    // === ОТОБРАЖЕНИЕ НОВОСТЕЙ ===
    
    function getFilteredNews() {
        let filtered = [...state.allNews];
        
        if (state.currentCategory !== 'all') {
            filtered = filtered.filter(news => news.category === state.currentCategory);
        }
        
        if (state.currentSearch) {
            const keyword = state.currentSearch.toLowerCase();
            filtered = filtered.filter(news => 
                news.title.toLowerCase().includes(keyword) || 
                news.excerpt.toLowerCase().includes(keyword)
            );
        }
        
        filtered.sort((a, b) => {
            if (state.currentSort === 'newest') {
                return new Date(b.date) - new Date(a.date);
            } else {
                return new Date(a.date) - new Date(b.date);
            }
        });
        
        return filtered;
    }
    
    function renderNews() {
        const filteredNews = getFilteredNews();
        const totalNews = filteredNews.length;
        
        if (elements.newsCount) {
            elements.newsCount.textContent = totalNews;
        }
        
        const totalPages = Math.ceil(totalNews / state.itemsPerPage);
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const newsToShow = filteredNews.slice(startIndex, endIndex);
        
        if (elements.newsContainer) {
            elements.newsContainer.innerHTML = '';
        }
        
        if (newsToShow.length === 0 && !state.isLoading) {
            if (elements.newsContainer) {
                elements.newsContainer.innerHTML = `
                    <div class="no-news" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                        <i class="fas fa-newspaper" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                        <h3>Новости не найдены</h3>
                        <p>${state.currentSearch ? `По запросу "${state.currentSearch}" ничего не найдено.` : 'Попробуйте выбрать другую категорию.'}</p>
                    </div>
                `;
            }
        } else {
            newsToShow.forEach((news, index) => {
                const newsCard = document.createElement('article');
                newsCard.className = 'news-card';
                newsCard.dataset.id = news.id;
                
                const categoryName = API_CONFIG.categoryNames[news.category] || 'Новости';
                const imageUrl = news.image || getNewsImage(news, news.category, index);
                
                newsCard.innerHTML = `
                    <div class="news-image-container">
                        <img src="${imageUrl}" alt="${news.title}" class="news-image" loading="lazy"
                             onerror="this.onerror=null; this.src='${FALLBACK_IMAGES[news.category]?.[0] || FALLBACK_IMAGES.general[0]}'">
                        <div class="news-category" data-category="${news.category}">${categoryName}</div>
                    </div>
                    <div class="news-content">
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-excerpt">${news.excerpt}</p>
                        <div class="news-meta">
                            <span><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
                            <span><i class="far fa-eye"></i> ${news.views} просмотров</span>
                            <span><i class="fas fa-newspaper"></i> ${news.source}</span>
                        </div>
                        ${news.url && news.url !== '#' ? 
                            `<a href="${news.url}" target="_blank" rel="noopener noreferrer" class="read-more">
                                Читать на сайте источника <i class="fas fa-external-link-alt"></i>
                            </a>` : ''
                        }
                    </div>
                `;
                
                if (elements.newsContainer) {
                    elements.newsContainer.appendChild(newsCard);
                }
            });
        }
        
        updatePagination(totalPages);
    }
    
    function updatePagination(totalPages) {
        if (!elements.pagination) return;
        
        const prevBtn = elements.pagination.querySelector('.prev-btn');
        const nextBtn = elements.pagination.querySelector('.next-btn');
        const pageNumbers = elements.pageNumbers;
        
        if (!prevBtn || !nextBtn || !pageNumbers) return;
        
        prevBtn.disabled = state.currentPage === 1;
        nextBtn.disabled = state.currentPage === totalPages || totalPages === 0;
        
        pageNumbers.innerHTML = '';
        
        if (totalPages <= 1) {
            elements.pagination.style.display = 'none';
        } else {
            elements.pagination.style.display = 'flex';
            
            let startPage = Math.max(1, state.currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            
            if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('div');
                pageBtn.className = `page-number ${i === state.currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.dataset.page = i;
                pageNumbers.appendChild(pageBtn);
            }
        }
    }
    
    async function loadAndRenderNews(category = 'all', keyword = '') {
        await fetchNewsFromNewsAPI(category, keyword);
        renderNews();
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    
    elements.categoryButtons.forEach(button => {
        button.addEventListener('click', async function() {
            if (state.isLoading) return;
            
            const category = this.dataset.category;
            state.currentCategory = category;
            state.currentPage = 1;
            state.currentSearch = '';
            
            if (elements.searchInput) elements.searchInput.value = '';
            
            elements.categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            await loadAndRenderNews(category);
        });
    });
    
    if (elements.searchButton && elements.searchInput) {
        elements.searchButton.addEventListener('click', async function() {
            if (state.isLoading) return;
            
            state.currentSearch = elements.searchInput.value.trim();
            state.currentPage = 1;
            
            await loadAndRenderNews(state.currentCategory, state.currentSearch);
        });
        
        elements.searchInput.addEventListener('keyup', async function(e) {
            if (e.key === 'Enter') {
                if (state.isLoading) return;
                
                state.currentSearch = elements.searchInput.value.trim();
                state.currentPage = 1;
                
                await loadAndRenderNews(state.currentCategory, state.currentSearch);
            }
        });
    }
    
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener('change', function() {
            state.currentSort = this.value;
            renderNews();
        });
    }
    
    document.addEventListener('click', function(e) {
        if (state.isLoading) return;
        
        if (e.target.classList.contains('page-number')) {
            state.currentPage = parseInt(e.target.dataset.page);
            renderNews();
        } else if (e.target.classList.contains('prev-btn')) {
            if (state.currentPage > 1) {
                state.currentPage--;
                renderNews();
            }
        } else if (e.target.classList.contains('next-btn')) {
            const filteredNews = getFilteredNews();
            const totalPages = Math.ceil(filteredNews.length / state.itemsPerPage);
            
            if (state.currentPage < totalPages) {
                state.currentPage++;
                renderNews();
            }
        }
        
        // Обработка кликов по "Читать на сайте источника"
        if (e.target.classList.contains('read-more') || e.target.closest('.read-more')) {
            e.preventDefault();
            const link = e.target.closest('.read-more');
            if (link && link.href) {
                window.open(link.href, '_blank', 'noopener,noreferrer');
            }
        }
    });
    
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', function() {
            if (elements.newsModal) {
                elements.newsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    if (elements.newsModal) {
        elements.newsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Открытие модального окна с новостью
    if (elements.newsContainer) {
        elements.newsContainer.addEventListener('click', function(e) {
            const newsCard = e.target.closest('.news-card');
            const readMoreLink = e.target.closest('.read-more');
            
            // Если кликнули на "Читать на сайте источника" - ничего не делаем (откроется в новой вкладке)
            if (readMoreLink) return;
            
            if (newsCard) {
                const newsId = parseInt(newsCard.dataset.id);
                const news = state.allNews.find(n => n.id === newsId);
                
                if (news && elements.modalBody) {
                    const categoryName = API_CONFIG.categoryNames[news.category] || 'Новости';
                    const imageUrl = news.image || getNewsImage(news, news.category, news.id);
                    
                    elements.modalBody.innerHTML = `
                        <div class="modal-image-container">
                            <img src="${imageUrl}" alt="${news.title}" class="modal-news-image"
                                 onerror="this.onerror=null; this.src='${FALLBACK_IMAGES[news.category]?.[0] || FALLBACK_IMAGES.general[0]}'">
                            <div class="modal-news-category" data-category="${news.category}">${categoryName}</div>
                        </div>
                        <div class="modal-news-meta">
                            <span><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
                            <span><i class="fas fa-user"></i> ${news.author}</span>
                            <span><i class="far fa-eye"></i> ${news.views} просмотров</span>
                            <span><i class="fas fa-newspaper"></i> ${news.source}</span>
                        </div>
                        <h2 class="modal-news-title">${news.title}</h2>
                        <div class="modal-news-content">
                            <p>${news.content}</p>
                        </div>
                        ${news.url && news.url !== '#' ? `
                            <div class="modal-actions">
                                <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="btn-original">
                                    <i class="fas fa-external-link-alt"></i> Читать оригинал на сайте
                                </a>
                                <button class="btn-close-modal" id="btn-close-modal">
                                    <i class="fas fa-times"></i> Закрыть
                                </button>
                            </div>
                        ` : ''}
                    `;
                    
                    if (elements.newsModal) {
                        elements.newsModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                    
                    // Добавляем обработчик для кнопки закрытия
                    const closeBtn = document.getElementById('btn-close-modal');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            if (elements.newsModal) {
                                elements.newsModal.classList.remove('active');
                                document.body.style.overflow = 'auto';
                            }
                        });
                    }
                }
            }
        });
    }
    
    // Категории в футере
    document.querySelectorAll('.footer-section a[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (categoryBtn) {
                categoryBtn.click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    // === ЗАПУСК ===
    console.log('ModernNews с NewsAPI запущен');
    
    // Проверяем API ключ
    if (!API_CONFIG.apiKey || API_CONFIG.apiKey === 'e25ee5feca7f484cb3ca8e5c1cbbb3b5') {
        console.warn('NewsAPI ключ не установлен, используются тестовые данные');
        state.allNews = getFallbackNewsWithImages();
        renderNews();
    } else {
        loadAndRenderNews();
    }
});