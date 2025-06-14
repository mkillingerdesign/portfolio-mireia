document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Theme Toggle
    const themeToggle = document.querySelector('#theme-toggle');
    const body = document.body;

    if (themeToggle) {
        // Verificar estado inicial
        if (body.classList.contains('light-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            themeToggle.innerHTML = body.classList.contains('light-mode')
                ? '<i class="fas fa-moon"></i>'
                : '<i class="fas fa-sun"></i>';
        });
    }

    // Lightbox
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.querySelector('#lightbox');
    const lightboxImg = document.querySelector('#lightbox-img');
    const lightboxClose = document.querySelector('#lightbox-close');

    if (galleryImages && lightbox && lightboxImg && lightboxClose) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.classList.add('wireframe-img');
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            lightboxImg.classList.remove('wireframe-img');
            lightboxImg.src = '';
            document.body.style.overflow = 'auto';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                lightboxImg.classList.remove('wireframe-img');
                lightboxImg.src = '';
                document.body.style.overflow = 'auto';
            }
        });
    }
});