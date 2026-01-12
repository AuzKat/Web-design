/**
 * Портфолио сайт - Основной JavaScript файл
 * Реализованный функционал:
 * 1. Плавная смена темы (Light/Dark)
 * 2. Бургер-меню для мобильных устройств
 * 3. Форма обратной связи с валидацией
 * 4. Анимация появления элементов при прокрутке
 * 5. Динамическое заполнение карточек проектов
 * 6. Плавная анимация прогресс-баров навыков
 */

// Данные проектов для динамического заполнения
const projectsData = [
    {
        id: 1,
        title: "E-commerce Platform",
        description: "Полнофункциональная платформа электронной коммерции с корзиной, платежами и админ-панелью. Реализована на React с использованием Redux для управления состоянием.",
        tech: ["React", "Redux", "Node.js", "MongoDB", "Stripe"],
        link: "https://github.com/alex-petrov/ecommerce-platform",
        demo: "https://demo-ecommerce.alexpetrov.com"
    },
    {
        id: 2,
        title: "Task Management App",
        description: "Приложение для управления задачами с drag-and-drop интерфейсом, уведомлениями и совместной работой в реальном времени.",
        tech: ["Vue.js", "Firebase", "WebSockets", "SCSS"],
        link: "https://github.com/alex-petrov/task-manager",
        demo: "https://tasks.alexpetrov.com"
    },
    {
        id: 3,
        title: "Weather Dashboard",
        description: "Интерактивная панель управления погодой с прогнозами на 7 дней, картами и уведомлениями. Использует OpenWeather API.",
        tech: ["JavaScript", "API", "Chart.js", "LocalStorage"],
        link: "https://github.com/alex-petrov/weather-dashboard",
        demo: "https://weather.alexpetrov.com"
    },
    {
        id: 4,
        title: "Portfolio Website",
        description: "Современный адаптивный сайт-портфолио с анимациями, фильтрацией проектов и формой обратной связи.",
        tech: ["HTML5", "CSS3", "JavaScript", "GSAP"],
        link: "https://github.com/alex-petrov/portfolio",
        demo: "https://portfolio.alexpetrov.com"
    },
    {
        id: 5,
        title: "Fitness Tracker",
        description: "Приложение для отслеживания тренировок и питания с графиками прогресса, календарем тренировок и рецептами.",
        tech: ["React Native", "GraphQL", "PostgreSQL", "D3.js"],
        link: "https://github.com/alex-petrov/fitness-tracker",
        demo: "https://fitness.alexpetrov.com"
    },
    {
        id: 6,
        title: "Real Estate Portal",
        description: "Портал недвижимости с поиском по карте, фильтрами, избранным и системой бронирования просмотров.",
        tech: ["Next.js", "TypeScript", "Mapbox", "PostgreSQL"],
        link: "https://github.com/alex-petrov/real-estate",
        demo: "https://realestate.alexpetrov.com"
    }
];

// DOM элементы
const themeToggle = document.getElementById('themeToggle');
const burgerMenu = document.getElementById('burgerMenu');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const contactForm = document.getElementById('contactForm');
const projectsContainer = document.getElementById('projectsContainer');
const navLinks = document.querySelectorAll('.nav-link');

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Обновляем текст кнопки
    updateThemeToggleText(savedTheme);
}

// Переключение темы
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Обновляем текст кнопки
    updateThemeToggleText(newTheme);
    
    // Добавляем анимацию переключения
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Обновление текста кнопки темы
function updateThemeToggleText(theme) {
    const themeText = theme === 'light' ? 'Темная тема' : 'Светлая тема';
    themeToggle.setAttribute('aria-label', themeText);
}

// Управление мобильным меню
function toggleMobileMenu() {
    burgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

// Закрытие мобильного меню
function closeMobileMenu() {
    burgerMenu.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
}

// Динамическое создание карточек проектов
function renderProjects() {
    if (!projectsContainer) return;
    
    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card reveal';
        
        // Определяем иконку в зависимости от типа проекта
        let icon = 'fa-code';
        if (project.title.includes('E-commerce')) icon = 'fa-shopping-cart';
        if (project.title.includes('Task')) icon = 'fa-tasks';
        if (project.title.includes('Weather')) icon = 'fa-cloud-sun';
        if (project.title.includes('Portfolio')) icon = 'fa-user-tie';
        if (project.title.includes('Fitness')) icon = 'fa-dumbbell';
        if (project.title.includes('Real Estate')) icon = 'fa-home';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <i class="fas ${icon}"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.link}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i>
                        <span>Код</span>
                    </a>
                    <a href="${project.demo}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Демо</span>
                    </a>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
}

// Валидация формы обратной связи
function validateForm() {
    let isValid = true;
    
    // Очистка предыдущих ошибок
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Валидация имени
    if (!name.value.trim()) {
        document.getElementById('nameError').textContent = 'Пожалуйста, введите ваше имя';
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        document.getElementById('emailError').textContent = 'Пожалуйста, введите ваш email';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        document.getElementById('emailError').textContent = 'Пожалуйста, введите корректный email';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    
    // Валидация сообщения
    if (!message.value.trim()) {
        document.getElementById('messageError').textContent = 'Пожалуйста, введите ваше сообщение';
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    } else if (message.value.trim().length < 10) {
        document.getElementById('messageError').textContent = 'Сообщение должно содержать минимум 10 символов';
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

// Обработка отправки формы
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Симуляция отправки формы
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Отправка...</span>';
    submitButton.disabled = true;
    
    // Имитация задержки отправки
    setTimeout(() => {
        // Показываем сообщение об успехе
        document.getElementById('formSuccess').style.display = 'block';
        
        // Сбрасываем форму
        contactForm.reset();
        
        // Восстанавливаем кнопку
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Скрываем сообщение об успехе через 5 секунд
        setTimeout(() => {
            document.getElementById('formSuccess').style.display = 'none';
        }, 5000);
        
        // В реальном приложении здесь был бы fetch запрос к серверу
        console.log('Форма отправлена:', {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        });
    }, 1500);
}

// Анимация появления элементов при прокрутке
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    
    // Запускаем сразу для видимых элементов
    revealOnScroll();
    
    // И при скролле
    window.addEventListener('scroll', revealOnScroll);
}

// Анимация прогресс-баров навыков
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateOnScroll = () => {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition && !bar.classList.contains('animated')) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                bar.classList.add('animated');
            }
        });
    };
    
    // Запускаем анимацию при загрузке и скролле
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
}

// Плавный скролл по якорным ссылкам
function initSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Закрываем мобильное меню если оно открыто
                closeMobileMenu();
                
                // Плавный скролл к элементу
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Обработка нажатия клавиши Escape
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
}

// Инициализация всех функций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация темы
    initTheme();
    
    // Рендер проектов
    renderProjects();
    
    // Инициализация анимаций
    initScrollReveal();
    animateSkillBars();
    initSmoothScroll();
    
    // Назначение обработчиков событий
    themeToggle.addEventListener('click', toggleTheme);
    burgerMenu.addEventListener('click', toggleMobileMenu);
    mobileNavClose.addEventListener('click', closeMobileMenu);
    contactForm.addEventListener('submit', handleFormSubmit);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Добавляем класс reveal для динамически созданных элементов
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('reveal');
        });
        initScrollReveal();
    }, 100);
    
    console.log('Портфолио сайт успешно загружен!');
    console.log('Реализованный функционал:');
    console.log('- Плавная смена темы (Light/Dark)');
    console.log('- Бургер-меню для мобильных устройств');
    console.log('- Форма обратной связи с валидацией');
    console.log('- Анимация появления элементов при прокрутке');
    console.log('- Динамическое заполнение карточек проектов');
    console.log('- Плавная анимация прогресс-баров навыков');
    console.log('- Плавный скролл по якорным ссылкам');
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        closeMobileMenu();
    }
});