// Inicializar AOS
AOS.init({
    duration: 800,
    once: true
});

// Toggle tema claro/oscuro
const themeToggle = document.querySelector('.theme-toggle');
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

// Lightbox para imágenes
const galleryImages = document.querySelectorAll('.gallery-img');
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        console.log(`Abriendo lightbox con: ${img.src}`);
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    console.log('Cerrando lightbox');
});

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        console.log('Cerrando lightbox por clic fuera');
    }
});

// Verificar rutas de imágenes y videos
const images = document.querySelectorAll('.gallery-img');
const videos = document.querySelectorAll('.video-player source');
console.log(`Imágenes encontradas: ${images.length}`); // Debería ser 25
console.log(`Videos encontrados: ${videos.length}`); // Debería ser 6
images.forEach(img => console.log(`Imagen: ${img.src}`));
videos.forEach(video => console.log(`Video: ${video.src}`));