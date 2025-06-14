// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const heroLogo = document.querySelector('.hero-logo');

if (!heroLogo) {
    console.error('Elemento .hero-logo no encontrado en el DOM');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    
    // Cambiar el logo y el ícono con transición suave
    if (heroLogo) {
        heroLogo.style.opacity = '0'; // Desvanecer el logo
        setTimeout(() => {
            if (document.body.classList.contains('dark-mode')) {
                heroLogo.src = '../img/lifty2 blanco.png'; // Logo blanco para modo oscuro
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                heroLogo.src = '../img/lifty2.png'; // Logo azul para modo claro
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            heroLogo.style.opacity = '1'; // Restaurar la opacidad
        }, 300); // Duración de la transición (300ms)
    }
    
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load Theme Preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== 'light') {
        document.body.classList.add('dark-mode');
        if (heroLogo) {
            heroLogo.src = '../img/lifty2 blanco.png'; // Logo blanco para modo oscuro
        }
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.add('light-mode');
        if (heroLogo) {
            heroLogo.src = '../img/lifty2.png'; // Logo azul para modo claro
        }
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Smooth Scroll for Navigation
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});