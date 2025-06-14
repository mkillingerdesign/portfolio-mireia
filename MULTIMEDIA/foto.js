// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeToggle.querySelector('i').classList.remove('fa-sun');
        themeToggle.querySelector('i').classList.add('fa-moon');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }
});

// Carousel
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-control.prev');
const nextBtn = document.querySelector('.carousel-control.next');
let currentIndex = 0;

function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    updateCarousel();
});

// Categories and Modal
const thumbnails = document.querySelectorAll('.thumbnails img');
const modal = document.getElementById('category-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close-modal');

// Sample content for each category (replace with your actual content)
const categoryContent = {
    portraits: [
        { type: 'image', src: '../img/portrait1.jpg', alt: 'Retrato 1' },
        { type: 'image', src: '../img/portrait2.jpg', alt: 'Retrato 2' },
        { type: 'video', src: '../videos/portrait-session.mp4', alt: 'Sesión de Retratos' }
    ],
    landscapes: [
        { type: 'image', src: '../img/landscape1.jpg', alt: 'Paisaje 1' },
        { type: 'image', src: '../img/landscape2.jpg', alt: 'Paisaje 2' }
    ],
    motos: [
        { type: 'image', src: '../img/moto1.jpg', alt: 'Moto 1' },
        { type: 'image', src: '../img/moto2.jpg', alt: 'Moto 2' },
        { type: 'video', src: '../videos/moto-shoot.mp4', alt: 'Sesión de Motos' }
    ],
    experimental: [
        { type: 'image', src: '../img/experimental1.jpg', alt: 'Larga Exposición' },
        { type: 'pdf', src: '../pdf/photography-portfolio.pdf', alt: 'Portafolio PDF' }
    ]
};

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        const categoryId = thumbnail.parentElement.getAttribute('data-category');
        modalTitle.textContent = thumbnail.parentElement.parentElement.querySelector('h3').textContent;
        modalContent.innerHTML = '';

        categoryContent[categoryId].forEach(content => {
            if (content.type === 'image') {
                const img = document.createElement('img');
                img.src = content.src;
                img.alt = content.alt;
                modalContent.appendChild(img);
            } else if (content.type === 'video') {
                const video = document.createElement('video');
                video.src = content.src;
                video.alt = content.alt;
                video.controls = true;
                modalContent.appendChild(video);
            } else if (content.type === 'pdf') {
                const viewer = document.createElement('div');
                viewer.className = 'pdf-viewer';
                viewer.setAttribute('data-pdf', content.src);
                modalContent.appendChild(viewer);

                // Initialize PDF.js for this viewer
                pdfjsLib.getDocument(content.src).promise.then(pdf => {
                    let currentPage = 1;
                    const canvas = document.createElement('canvas');
                    viewer.appendChild(canvas);
                    const context = canvas.getContext('2d');

                    const renderPage = async (pageNum) => {
                        const page = await pdf.getPage(pageNum);
                        const viewport = page.getViewport({ scale: 1.5 });
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        await page.render({ canvasContext: context, viewport }).promise;
                    };

                    renderPage(currentPage);

                    const prevButton = document.createElement('button');
                    prevButton.textContent = '◄';
                    prevButton.className = 'pdf-nav-button';
                    const nextButton = document.createElement('button');
                    nextButton.textContent = '►';
                    nextButton.className = 'pdf-nav-button';
                    viewer.appendChild(prevButton);
                    viewer.appendChild(nextButton);

                    prevButton.addEventListener('click', async () => {
                        if (currentPage > 1) {
                            currentPage--;
                            await renderPage(currentPage);
                        }
                    });

                    nextButton.addEventListener('click', async () => {
                        if (currentPage < pdf.numPages) {
                            currentPage++;
                            await renderPage(currentPage);
                        }
                    });
                }).catch(error => {
                    viewer.innerHTML = `<p style="color: red;">Error al cargar el PDF: ${content.src}</p>`;
                    console.error(`Error loading PDF ${content.src}:`, error);
                });
            }
        });

        modal.classList.add('show');
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});