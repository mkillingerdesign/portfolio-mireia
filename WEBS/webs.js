// Inicializar AOS
AOS.init({
    once: true,
    duration: 800,
});

// Toggle tema claro/oscuro
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('light-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Lightbox para imágenes de Wireframes
const galleryImages = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.classList.add('wireframe-img');
        lightbox.classList.add('active');
        console.log(`Abriendo lightbox con: ${img.src}`);
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightboxImg.classList.remove('wireframe-img');
    console.log('Cerrando lightbox');
});

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxImg.classList.remove('wireframe-img');
        console.log('Cerrando lightbox por clic fuera');
    }
});

// Verificar rutas de imágenes
const images = document.querySelectorAll('img');
console.log(`Imágenes encontradas: ${images.length}`);
images.forEach(img => console.log(`Imagen: ${img.src}`));