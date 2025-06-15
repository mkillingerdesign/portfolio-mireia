// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load Theme Preference
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') !== 'light') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Smooth Scroll for Navigation
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href.startsWith('../index.html#')) {
            window.location.href = href;
        } else {
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // Close the menu after clicking a link on mobile
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Lightbox Functionality
const galleryImages = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

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
        const offset = -index * 100; // 100% por imagen
        carousel.style.transform = `translateX(${offset}%)`;
        currentIndex = index;
        console.log(`Mostrando imagen ${index + 1} con desplazamiento ${offset}%`);
    }

    prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex === 0) ? carouselImages.length - 1 : currentIndex - 1;
        showImage(newIndex);
    });

    nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex === carouselImages.length - 1) ? 0 : currentIndex + 1;
        showImage(newIndex);
    });

    // Inicializar el carrusel en la primera imagen
    showImage(0);

    // Colaboraciones Gallery Functionality
const galleries = document.querySelectorAll('#colaboraciones .gallery');
const isMobile = window.innerWidth <= 768; // Alternativa a matchMedia
console.log(`Es dispositivo móvil: ${isMobile}`);

// Hover effect for desktop
if (!isMobile) {
    const galleryImages = document.querySelectorAll('#colaboraciones .gallery-img');
    console.log(`Imágenes encontradas: ${galleryImages.length}`); // Debería ser 6 (3 vinilos + 3 merchandising)
    galleryImages.forEach(img => {
        const originalSrc = img.src;
        const hoverSrc = img.dataset.hoverImg;
        console.log(`Imagen: ${originalSrc}, Hover: ${hoverSrc}`);

        img.addEventListener('mouseover', () => {
            if (hoverSrc) {
                img.src = hoverSrc;
                console.log(`Cambiando a imagen hover: ${hoverSrc}`);
            } else {
                console.log(`No hay data-hover-img para ${originalSrc}`);
            }
        });

        img.addEventListener('mouseout', () => {
            img.src = originalSrc;
            console.log(`Restaurando imagen original: ${originalSrc}`);
        });
    });
}

// Autoplay for mobile
if (isMobile) {
    galleries.forEach(gallery => {
        const items = gallery.querySelectorAll('.gallery-item');
        console.log(`Galería con ${items.length} elementos`); // 3 por galería
        let currentIndex = 0;

        // Inicializar galería
        gallery.classList.add('autoplay');
        items[currentIndex].classList.add('active');

        // Cambiar imagen cada 3 segundos
        setInterval(() => {
            items[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].classList.add('active');
            console.log(`Galería: Mostrando imagen ${currentIndex + 1}`);
        }, 3000); // 3 segundos
    });
}

// Mantener funcionalidad del lightbox
const galleryImages = document.querySelectorAll('.gallery-img');
console.log(`Total imágenes para lightbox: ${galleryImages.length}`);
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
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
}