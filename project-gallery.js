/**
 * Полноэкранный просмотр проектов непосредственно на странице
 */
document.addEventListener('DOMContentLoaded', () => {
    // Находим все карточки проектов
    const projectItems = document.querySelectorAll('.project-item');
    
    // Добавляем обработчики событий для каждого проекта
    projectItems.forEach(project => {
        project.addEventListener('click', function(e) {
            // Если клик был по кнопке навигации карусели, игнорируем
            if (e.target.closest('.nav-button')) {
                return;
            }
            
            // Находим все необходимые данные о проекте
            const img = project.querySelector('.project-image img');
            const title = project.querySelector('.project-overlay h3') || 
                        project.querySelector('.project-info h4');
            const description = project.querySelector('.project-info p');
            const tags = project.querySelectorAll('.project-tags .project-tag');
            
            if (img) {
                // Собираем теги в массив
                const tagsArray = [];
                tags.forEach(tag => {
                    tagsArray.push(tag.textContent.trim());
                });
                
                // Создаем полноэкранный просмотр на текущей странице
                createFullscreenView(
                    img.src, 
                    img.alt,
                    title ? title.textContent.trim() : '',
                    description ? description.textContent.trim() : '',
                    tagsArray
                );
            }
        });
    });
    
    /**
     * Создание полноэкранного просмотра изображения непосредственно на текущей странице
     * @param {string} src - URL изображения
     * @param {string} alt - Альтернативный текст изображения
     * @param {string} title - Название проекта
     * @param {string} description - Описание проекта
     * @param {Array} tags - Массив технологий проекта
     */
    function createFullscreenView(src, alt, title, description, tags) {
        // Создаем контейнер для просмотра на весь экран
        const fullscreenContainer = document.createElement('div');
        fullscreenContainer.className = 'fullscreen-container';
        
        // Создаем область клика для закрытия просмотра
        const clickArea = document.createElement('div');
        clickArea.className = 'fullscreen-click-area';
        
        // Создаем элемент изображения
        const image = document.createElement('img');
        image.className = 'fullscreen-image';
        image.src = src;
        image.alt = alt || 'Изображение проекта';
        
        // Создаем подсказку
        const hint = document.createElement('div');
        hint.className = 'fullscreen-hint';
        hint.textContent = 'Нажмите в любом месте вне изображения, чтобы закрыть';
        
        // Создаем подсказку для увеличения
        const zoomHint = document.createElement('div');
        zoomHint.className = 'fullscreen-zoom-hint';
        zoomHint.innerHTML = '<i class="fa fa-search-plus"></i> Нажмите на изображение для увеличения';
        
        // Создаем боковую панель с информацией
        const sidebar = document.createElement('div');
        sidebar.className = 'fullscreen-sidebar';
        
        // Заполняем боковую панель содержимым
        let sidebarContent = '';
        if (title) {
            sidebarContent += `<h2 class="fullscreen-title">${title}</h2>`;
        }
        if (description) {
            sidebarContent += `<p class="fullscreen-description">${description}</p>`;
        }
        if (tags && tags.length > 0) {
            sidebarContent += `<h3 class="fullscreen-tech-title">Технологии:</h3>`;
            sidebarContent += `<div class="fullscreen-tags">`;
            tags.forEach(tag => {
                sidebarContent += `<span class="fullscreen-tag">${tag}</span>`;
            });
            sidebarContent += `</div>`;
        }
        sidebar.innerHTML = sidebarContent;
        
        // Создаем кнопку для мобильной версии, чтобы показывать/скрывать информацию
        const infoToggle = document.createElement('button');
        infoToggle.className = 'fullscreen-info-toggle';
        infoToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>';
        
        // Добавляем все элементы в контейнер
        fullscreenContainer.appendChild(clickArea);
        fullscreenContainer.appendChild(image);
        fullscreenContainer.appendChild(hint);
        fullscreenContainer.appendChild(zoomHint);
        fullscreenContainer.appendChild(sidebar);
        fullscreenContainer.appendChild(infoToggle);
        
        // Добавляем стили для полноэкранного просмотра
        const style = document.createElement('style');
        style.textContent = `
            .fullscreen-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fs-fade-in 0.2s ease-out;
                overflow: hidden;
            }
            
            .fullscreen-click-area {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            
            .fullscreen-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                z-index: 2;
                user-select: none;
                -webkit-user-drag: none;
                cursor: zoom-in;
                transition: transform 0.3s ease;
            }
            
            .fullscreen-image.zoomed {
                transform: scale(2);
                cursor: zoom-out;
            }
            
            .fullscreen-hint {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.7);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                opacity: 1;
                transition: opacity 0.5s ease;
                z-index: 3;
                pointer-events: none;
            }
            
            .fullscreen-zoom-hint {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.7);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                opacity: 1;
                transition: opacity 0.5s ease;
                z-index: 3;
                pointer-events: none;
            }
            
            .fullscreen-sidebar {
                position: absolute;
                top: 0;
                right: 0;
                width: 300px;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 30px 20px;
                overflow-y: auto;
                z-index: 4;
                border-left: 1px solid rgba(255, 255, 255, 0.1);
                transition: transform 0.3s ease;
            }
            
            .fullscreen-title {
                font-size: 1.8rem;
                margin-bottom: 15px;
                color: var(--accent-color, #4169e1);
                line-height: 1.2;
            }
            
            .fullscreen-description {
                font-size: 1rem;
                line-height: 1.6;
                margin-bottom: 20px;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .fullscreen-tech-title {
                font-size: 1rem;
                margin-bottom: 10px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .fullscreen-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 20px;
            }
            
            .fullscreen-tag {
                background-color: var(--accent-color, #4169e1);
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
            }
            
            .fullscreen-info-toggle {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background-color: rgba(0, 0, 0, 0.6);
                border: none;
                border-radius: 50%;
                color: white;
                display: none;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                z-index: 5;
                transition: background-color 0.2s ease;
            }
            
            .fullscreen-info-toggle:hover {
                background-color: var(--accent-color, #4169e1);
            }
            
            @keyframes fs-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fs-fade-out {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @media (max-width: 1024px) {
                .fullscreen-sidebar {
                    transform: translateX(100%);
                }
                
                .fullscreen-info-toggle {
                    display: flex;
                }
                
                .fullscreen-sidebar.active {
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 768px) {
                .fullscreen-sidebar {
                    width: 280px;
                }
                
                .fullscreen-hint, .fullscreen-zoom-hint {
                    font-size: 12px;
                    padding: 6px 12px;
                }
                
                .fullscreen-image.zoomed {
                    transform: scale(1.5);
                }
            }
        `;
        
        // Добавляем все в документ
        document.head.appendChild(style);
        document.body.appendChild(fullscreenContainer);
        
        // Блокируем прокрутку страницы
        document.body.style.overflow = 'hidden';
        
        // Автоматически скрываем подсказки через 3 секунды
        setTimeout(() => {
            hint.style.opacity = '0';
            zoomHint.style.opacity = '0';
        }, 3000);
        
        // Флаг для отслеживания состояния увеличения
        let isZoomed = false;
        
        // Обработчик для увеличения/уменьшения изображения при клике
        image.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            
            isZoomed = !isZoomed; // Инвертируем состояние
            
            if (isZoomed) {
                // При увеличении устанавливаем начало трансформации в точку клика
                const rect = image.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Устанавливаем точку трансформации относительно изображения
                // Это позволит увеличивать изображение с центром в точке клика
                image.style.transformOrigin = `${x}px ${y}px`;
                
                // Применяем класс для увеличения
                image.classList.add('zoomed');
            } else {
                // Возвращаем нормальный размер
                image.classList.remove('zoomed');
                
                // Возвращаем точку трансформации в центр
                image.style.transformOrigin = 'center center';
            }
        });
        
        // Обработчик для закрытия по клику вне изображения
        clickArea.addEventListener('click', (e) => {
            if (e.target === clickArea) {
                closeFullscreen(fullscreenContainer, style);
            }
        });
        
        // Предотвращаем закрытие при клике на боковую панель
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Переключение видимости боковой панели на мобильных устройствах
        infoToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // Обработчик клавиши Escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                if (isZoomed) {
                    // Если изображение увеличено, сначала возвращаем нормальный размер
                    isZoomed = false;
                    image.classList.remove('zoomed');
                } else {
                    // Иначе закрываем просмотр
                    closeFullscreen(fullscreenContainer, style);
                    document.removeEventListener('keydown', escHandler);
                }
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Поддержка жеста смахивания для мобильных устройств
        let touchStartY = 0;
        const touchStartHandler = (e) => {
            touchStartY = e.touches[0].clientY;
        };
        
        const touchEndHandler = (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            // Смахивание вниз
            if (touchEndY - touchStartY > 100) {
                if (isZoomed) {
                    // Если изображение увеличено, сначала возвращаем нормальный размер
                    isZoomed = false;
                    image.classList.remove('zoomed');
                } else {
                    // Иначе закрываем просмотр
                    closeFullscreen(fullscreenContainer, style);
                    fullscreenContainer.removeEventListener('touchstart', touchStartHandler);
                    fullscreenContainer.removeEventListener('touchend', touchEndHandler);
                }
            }
        };
        
        fullscreenContainer.addEventListener('touchstart', touchStartHandler);
        fullscreenContainer.addEventListener('touchend', touchEndHandler);
    }
    
    /**
     * Закрытие полноэкранного просмотра
     * @param {HTMLElement} container - Контейнер полноэкранного просмотра
     * @param {HTMLElement} style - Элемент стилей для полноэкранного просмотра
     */
    function closeFullscreen(container, style) {
        // Анимация закрытия
        container.style.animation = 'fs-fade-out 0.2s ease-out';
        
        // После завершения анимации удаляем элементы
        setTimeout(() => {
            document.body.removeChild(container);
            document.head.removeChild(style);
            
            // Восстанавливаем прокрутку страницы
            document.body.style.overflow = '';
        }, 200);
    }
}); 