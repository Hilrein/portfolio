document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.reveal');
    const backToTop = document.querySelector('.back-to-top');
    const skillsSection = document.getElementById('skills');
    const contactForm = document.querySelector('.contact-form');
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    let lastScrollTop = 0;
    let isScrolling;
    
    function handleScroll() {
        const currentScrollTop = window.scrollY;
        
        if (currentScrollTop > 100) {
            if (currentScrollTop > lastScrollTop && currentScrollTop > 300) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
            nav.classList.add('shadow');
        } else {
            nav.classList.remove('shadow');
        }
        
        lastScrollTop = currentScrollTop;
        
        highlightActiveSection();
        
        handleReveal();
        
        animateSkillsProgress();
        
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
        }, 100);
    }
    
    function highlightActiveSection() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    
    function setupSmoothScroll() {
        const allLinks = document.querySelectorAll('a[href^="#"]');
        
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        e.preventDefault();
                        
                        const offset = window.innerWidth <= 768 ? 60 : 80;
                        
                        window.scrollTo({
                            top: targetSection.offsetTop - offset,
                            behavior: 'smooth'
                        });
                        
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }
    
    function handleReveal() {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = window.innerHeight - 50;
            
            if (elementTop < elementVisible) {
                el.classList.add('active');
            }
        });
    }
    
    function animateSkillsProgress() {
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        const skillsTop = skillsSection.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.8;
        
        if (skillsTop < triggerPoint) {
            skillProgressBars.forEach(bar => {
                bar.classList.add('animate');
            });
        }
    }
    
    function setupFormInteraction() {
        if (formInputs.length > 0) {
            formInputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('active');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('active');
                    }
                });
                
                if (input.value) {
                    input.parentElement.classList.add('active');
                }
            });
        }
    }
    
    function setupFormSubmission() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const isValid = this.checkValidity();
                
                if (isValid) {
                    const formData = new FormData(this);
                    const formButton = this.querySelector('button[type="submit"]');
                    const originalButtonText = formButton.textContent;
                    
                    formButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                    formButton.disabled = true;
                    
                    // Имитация отправки формы (в реальном проекте здесь будет fetch или другой метод)
                    setTimeout(() => {
                        formButton.innerHTML = '<i class="fas fa-check"></i> Сообщение отправлено';
                        formButton.classList.add('success');
                        
                        this.reset();
                        
                        formInputs.forEach(input => {
                            input.parentElement.classList.remove('active');
                        });
                        
                        setTimeout(() => {
                            formButton.textContent = originalButtonText;
                            formButton.disabled = false;
                            formButton.classList.remove('success');
                        }, 3000);
                    }, 1500);
                } else {
                    const invalidFields = this.querySelectorAll(':invalid');
                    if (invalidFields.length > 0) {
                        invalidFields[0].focus();
                    }
                }
            });
        }
    }
    
    function setupParallaxEffect() {
        const projectImages = document.querySelectorAll('.project-image');
        
        if (projectImages.length > 0 && window.innerWidth > 768) {
            window.addEventListener('mousemove', function(e) {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                projectImages.forEach(image => {
                    const rect = image.getBoundingClientRect();
                    const imageCenter = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };
                    
                    if (
                        rect.top < window.innerHeight &&
                        rect.bottom > 0 &&
                        rect.left < window.innerWidth &&
                        rect.right > 0
                    ) {
                        const offsetX = (mouseX - 0.5) * 10;
                        const offsetY = (mouseY - 0.5) * 10;
                        
                        image.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                    }
                });
            });
        }
    }
    
    function setupSkillTabs() {
        const skillTabs = document.querySelectorAll('.skill-tab');
        const skillCategories = document.querySelectorAll('.skill-category');
        
        if (skillTabs.length > 0) {
            skillTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    skillTabs.forEach(t => t.classList.remove('active'));
                    
                    tab.classList.add('active');
                    
                    const targetCategory = tab.getAttribute('data-target');
                    
                    skillCategories.forEach(category => {
                        category.classList.remove('active');
                    });
                    
                    document.getElementById(targetCategory).classList.add('active');
                });
            });
        }
    }
    
    function init() {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleReveal);
        
        setupSmoothScroll();
        
        setupFormInteraction();
        setupFormSubmission();
        
        setupParallaxEffect();
                
        setupSkillTabs();
                
        handleMissingImages();
        
        handleScroll();
        handleReveal();
        
        
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 300);
        
        const imagesToPreload = document.querySelectorAll('img');
        imagesToPreload.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            }
        });
    }
    
    init();
});

function handleMissingImages() {
    // Профиль фото
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.onerror = function() {
            this.src = 'https://via.placeholder.com/240x240/3498db/ffffff?text=Фото+профиля';
            this.onerror = null; 
        };
        
        profilePhoto.src = profilePhoto.src;
    }
    
    // Изображения проектов
    const projectImages = document.querySelectorAll('.device-mockup');
    const placeholderColors = ['3498db', 'e74c3c', '2ecc71', 'f39c12'];
    
    projectImages.forEach((img, index) => {
        img.onerror = function() {
            const colorIndex = index % placeholderColors.length;
            const color = placeholderColors[colorIndex];
            this.src = `https://via.placeholder.com/800x500/${color}/ffffff?text=Проект+${index+1}`;
            this.onerror = null;
        };
        

        img.src = img.src;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });


    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// Переключение темной/светлой темы (если нужно)
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDarkTheme);
    });
    
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
    }
} 