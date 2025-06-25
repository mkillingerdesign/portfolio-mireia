// Carousel Functionality
const carousel = document.querySelector('.carousel');
const carouselImages = document.querySelectorAll('.carousel-img');
const prevButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');
let currentIndex = 0;

if (!carousel || !carouselImages.length || !prevButton || !nextButton) {
    console.error('Error: No se encontraron los elementos del carrusel. Verifica los selectores.');
} else {
    console.log(`Carrusel inicializado con ${carouselImages.length} imágenes`);

    // Verificar que las imágenes se carguen
    carouselImages.forEach((img, index) => {
        img.addEventListener('error', () => {
            console.error(`Error al cargar la imagen ${index + 1}: ${img.src}`);
        });
        img.addEventListener('load', () => {
            console.log(`Imagen ${index + 1} cargada correctamente: ${img.src}`);
        });
    });

    function showImage(index) {
        currentIndex = (index + carouselImages.length) % carouselImages.length;
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        console.log(`Mostrando imagen ${currentIndex + 1} de ${carouselImages.length} con desplazamiento ${offset}%`);
    }

    prevButton.addEventListener('click', () => {
        showImage(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        showImage(currentIndex + 1);
    });

    showImage(0);

    carouselImages.forEach(img => {
        img.addEventListener('click', () => {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            console.log(`Abriendo lightbox con: ${img.src}`);
        });
    });
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (!themeToggle) {
    console.error('Error: No se encontró el botón de cambio de tema. Verifica el selector #theme-toggle.');
} else {
    console.log('Botón de cambio de tema encontrado correctamente.');
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('light-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            console.log('Cambiado a modo claro: fondo blanco activado.');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            console.log('Cambiado a modo oscuro: fondo oscuro activado.');
        }
    });
}