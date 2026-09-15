document.addEventListener('DOMContentLoaded', () => {
  // Animaciones de scroll para elementos con IntersectionObserver
  const elements = document.querySelectorAll('.instruccio, .qui-item, .cuadrado');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => observer.observe(element));

  // Configuración de Particles.js ajustada para el nuevo fondo
  particlesJS('particles-js', {
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } },
      color: { value: ['#ffffff', '#2595CD'] },
      shape: { type: 'circle' },
      opacity: { value: 0.4, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: false },
      move: { enable: true, speed: 1.5, direction: 'none', random: true }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } }
    }
  });

  // Ajustar la altura de #particles-js para que termine en la parte inferior de .mobile-img
  const particles = document.querySelector('#particles-js');
  const mobileMockup = document.querySelector('.mobile-mockup');
  const mobileImg = document.querySelector('.mobile-img');

  function setParticlesHeight() {
    const mobileRect = mobileMockup.getBoundingClientRect();
    const mobileImgRect = mobileImg.getBoundingClientRect();
    const heroRect = document.querySelector('.hero').getBoundingClientRect();
    const particlesHeight = mobileImgRect.bottom - heroRect.top;
    particles.style.height = `${particlesHeight}px`;
  }

  setParticlesHeight();
  window.addEventListener('resize', setParticlesHeight);

  // Efecto parallax para las imágenes de instruccions
  const parallaxImages = document.querySelectorAll('.parallax-img');
  window.addEventListener('scroll', () => {
    parallaxImages.forEach(img => {
      const rect = img.getBoundingClientRect();
      const scrollPosition = window.scrollY + window.innerHeight;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (scrollPosition - rect.top) * 0.2;
        img.style.transform = `translateY(${offset}px)`;
      }
    });
  });

  // Mostrar/ocultar botón "to-top"
  const toTop = document.querySelector('.to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      toTop.classList.add('visible');
    } else {
      toTop.classList.remove('visible');
    }
  });

  // Efecto para el texto en hero
  const heroText = document.querySelector('.hero-text');
  const quiSection = document.querySelector('.qui');

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const quiRect = quiSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 414; // Detecta pantalla móvil

    // Controlar aparición/desaparición del texto
    const threshold = isMobile ? windowHeight * 0.6 : windowHeight * 0.8; // Umbral más bajo en móvil
    if (quiRect.top < threshold) {
      // Al bajar: texto desaparece
      heroText.style.opacity = '0';
      heroText.style.filter = 'blur(8px)';
      heroText.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
      mobileMockup.classList.add('sticky');
    } else {
      // Al subir: texto reaparece
      heroText.style.opacity = '1';
      heroText.style.filter = 'none';
      heroText.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
      mobileMockup.classList.remove('sticky');
    }

    // Desactivar efecto parallax adicional en móvil para evitar conflictos
    if (!isMobile) {
      if (!mobileMockup.classList.contains('sticky')) {
        const imgOffset = scrollPosition * -0.7;
        mobileMockup.style.transform = `translateY(${imgOffset}px)`;
      }
    }
  });
});