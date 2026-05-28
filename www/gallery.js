document.addEventListener('DOMContentLoaded', () => {
    const animals = [
        'Walk', 'Karel', 'Yakul', 'Avala', 'Princezna', 'Květa', 'Riky', 'Flíček', 'List', 
        'Atila', 'Kesy', 'Pogo', 'Kulich', 'Eduard', 'Emil', 'Amálka', 'Končí', 
        'Lucinka', 'Anaya', 'Roman', 'Máša', 'Lotka', 'Denis', 'Hanička', 'Patricie', 'Safír', 'Holoubci', 'Králíci', 'Kachny', 'Husy', 'Pipinky'
    ];

    const galleryData = [];
    let idCounter = 1;

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    animals.forEach(animal => {
        const fileNameBase = removeAccents(animal.toLowerCase());
        for (let i = 1; i <= 8; i++) {
            galleryData.push({
                id: idCounter++,
                name: animal,
                category: animal,
                img: `assets/${fileNameBase}${i}.webp`,
                desc: `${animal} - Fotografie ${i}`
            });
        }
    });

    const galleryGrid = document.getElementById('gallery-grid');
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const searchInput = document.getElementById('animal-search');

    const categories = ['all', ...new Set(galleryData.map(item => item.category))];
    categories.forEach(cat => {
        if (cat !== 'all') {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.filter = cat;
            btn.textContent = cat;
            filterButtonsContainer.appendChild(btn);
        }
    });

    function renderGallery(filter = 'all', search = '') {
        galleryGrid.innerHTML = '';
        const filteredData = galleryData.filter(item => {
            const matchesFilter = filter === 'all' || item.category === filter;
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (filteredData.length === 0) {
            galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Žádné obrázky nebyly nalezeny.</p>';
            return;
        }

        filteredData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            // Skryto ve výchozím stavu
            div.style.display = 'none'; 
            
            // loading="lazy" pro líné načítání
            // onload zobrazí prvek, onerror ho odstraní
            div.innerHTML = `
                <img src="${item.img}" 
                     alt="${item.name}" 
                     loading="lazy"
                     onload="this.closest('.gallery-item').style.display='block'"
                     onerror="this.closest('.gallery-item').remove()">
                <div class="gallery-item-info">
                    <h4>${item.name}</h4>
                </div>
            `;
            galleryGrid.appendChild(div);
        });
    }

    // Lightbox — native <dialog>
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    let currentImages = [];
    let currentIndex = 0;

    const openLightbox = () => {
        if (!lightbox || !currentImages.length) return;
        const cur = currentImages[currentIndex];
        lightboxImg.src = cur.src;
        lightboxImg.alt = cur.alt || '';
        if (lightboxCaption) lightboxCaption.textContent = cur.alt || '';
        if (typeof lightbox.showModal === 'function' && !lightbox.open) {
            lightbox.showModal();
        } else {
            lightbox.setAttribute('open', '');
        }
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        if (typeof lightbox.close === 'function') lightbox.close();
        else lightbox.removeAttribute('open');
        document.body.style.overflow = '';
    };

    const nextImg = () => {
        if (!currentImages.length) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        openLightbox();
    };
    const prevImg = () => {
        if (!currentImages.length) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        openLightbox();
    };

    galleryGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item || item.style.display === 'none') return;
        const visibleItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'))
            .filter(el => el.style.display !== 'none');
        currentImages = visibleItems.map(el => {
            const img = el.querySelector('img');
            return { src: img.src, alt: img.alt };
        });
        const clicked = item.querySelector('img');
        currentIndex = currentImages.findIndex(i => i.src === clicked.src);
        if (currentIndex < 0) currentIndex = 0;
        openLightbox();
    });

    if (lightbox) {
        const btnClose = lightbox.querySelector('.lightbox__close');
        const btnNext = lightbox.querySelector('.lightbox__next');
        const btnPrev = lightbox.querySelector('.lightbox__prev');
        if (btnClose) btnClose.addEventListener('click', closeLightbox);
        if (btnNext) btnNext.addEventListener('click', nextImg);
        if (btnPrev) btnPrev.addEventListener('click', prevImg);
        // Click on backdrop closes
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        lightbox.addEventListener('close', () => { document.body.style.overflow = ''; });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.open) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImg();
        if (e.key === 'ArrowLeft') prevImg();
    });

    filterButtonsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderGallery(e.target.dataset.filter, searchInput.value);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const activeBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
        renderGallery(activeFilter, e.target.value);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const animalParam = urlParams.get('animal');
    if (animalParam) {
        const targetBtn = Array.from(document.querySelectorAll('.filter-btn'))
            .find(btn => btn.dataset.filter.toLowerCase() === animalParam.toLowerCase());
        if (targetBtn) {
            targetBtn.click();
        } else {
            renderGallery();
        }
    } else {
        const allBtn = Array.from(document.querySelectorAll('.filter-btn')).find(btn => btn.dataset.filter === 'all');
        if (allBtn) allBtn.classList.add('active');
        renderGallery();
    }
});