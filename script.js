/* Darwins Ink — interactions */

const WHATSAPP_NUMBER = "524494993540";
const MXN_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

const catalogData = window.DARWINS || { categories: [], products: [] };
const categoryData = Array.isArray(catalogData.categories) ? catalogData.categories : [];
const productData = Array.isArray(catalogData.products) ? catalogData.products : [];
const clientStories = Array.isArray(window.DARWINS_CLIENTS) ? window.DARWINS_CLIENTS : [];
const categoryOrder = new Map(categoryData.map((category, index) => [category.id, index]));
let startCarouselAutoplay = null;
let stopCarouselAutoplay = null;
let revealObserver = null;

function waUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatPrice(price) {
  return typeof price === 'number' ? MXN_FORMATTER.format(price) : 'Consultar precio';
}

function hasDiscount(product) {
  return typeof product?.price === 'number'
    && typeof product?.originalPrice === 'number'
    && product.originalPrice > product.price;
}

function discountPercent(product) {
  if (!hasDiscount(product)) return 0;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

function renderProductPrice(product) {
  if (!hasDiscount(product)) {
    return `<p class="price">${formatPrice(product?.price)}</p>`;
  }

  return `
    <div class="price-wrap">
      <p class="price">${formatPrice(product.price)}</p>
      <p class="price-old">${formatPrice(product.originalPrice)}</p>
      <span class="price-discount">-${discountPercent(product)}%</span>
    </div>
  `;
}

function productSort(a, b) {
  const aCategoryOrder = categoryOrder.get(a?.category) ?? Number.MAX_SAFE_INTEGER;
  const bCategoryOrder = categoryOrder.get(b?.category) ?? Number.MAX_SAFE_INTEGER;
  if (aCategoryOrder !== bCategoryOrder) return aCategoryOrder - bCategoryOrder;

  return String(a?.name || '').localeCompare(String(b?.name || ''), 'es');
}

function clientInitials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'DI';
}

function renderCategoryTiles() {
  const categoryGrid = document.getElementById('categoryGrid');
  if (!categoryGrid) return;

  categoryGrid.innerHTML = categoryData.map((category) => `
    <a class="cat-tile reveal" href="#catalogo" data-filter="${category.id}">
      <img src="${category.image}" alt="${category.label}" loading="lazy"/>
      <span class="cat-label">${category.label}</span>
    </a>
  `).join('');
}

function renderCatalogFilters() {
  const filtersRoot = document.getElementById('catalogFilters');
  if (!filtersRoot) return;

  const html = [
    '<button class="filter is-active" data-filter="todos" role="tab" aria-selected="true">Todos</button>',
    ...categoryData.map((category) => `<button class="filter" data-filter="${category.id}" role="tab" aria-selected="false">${category.label}</button>`),
  ].join('');

  filtersRoot.innerHTML = html;
}

function renderProductCards() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  const sortedProducts = [...productData].sort(productSort);
  productGrid.innerHTML = sortedProducts.map((product) => {
    const imageUrl = product?.image?.[0] || '';
    const name = product?.name || 'Producto';

    return `
      <article class="product reveal" data-id="${product.id}" data-type="${product.category}" data-name="${name}">
        <div class="product-img product-open-gallery" role="button" tabindex="0" aria-label="Abrir galería de ${name}"><img src="${imageUrl}" alt="${name}" loading="lazy"/></div>
        <div class="product-body">
          <h4>${name}</h4>
          ${renderProductPrice(product)}
          <a class="link-arrow wa-product" href="#">Solicitar información →</a>
        </div>
      </article>
    `;
  }).join('');
}

function initProductImageModal() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="product-modal__overlay" data-close-modal="true"></div>
    <div class="product-modal__content" role="dialog" aria-modal="true" aria-label="Galería de producto">
      <button class="product-modal__close" type="button" aria-label="Cerrar galería">×</button>
      <button class="product-modal__nav is-prev" type="button" aria-label="Imagen anterior">‹</button>
      <img class="product-modal__image" src="" alt="Imagen del producto" />
      <button class="product-modal__nav is-next" type="button" aria-label="Imagen siguiente">›</button>
      <p class="product-modal__caption"></p>
    </div>
  `;
  document.body.appendChild(modal);

  const imageEl = modal.querySelector('.product-modal__image');
  const captionEl = modal.querySelector('.product-modal__caption');
  const closeEl = modal.querySelector('.product-modal__close');
  const prevEl = modal.querySelector('.product-modal__nav.is-prev');
  const nextEl = modal.querySelector('.product-modal__nav.is-next');

  let activeImages = [];
  let activeIndex = 0;
  let activeName = '';

  function updateModalView() {
    const currentImage = activeImages[activeIndex] || '';
    imageEl.src = currentImage;
    imageEl.alt = activeName ? `${activeName} (${activeIndex + 1}/${activeImages.length})` : 'Imagen del producto';

    captionEl.textContent = activeName
      ? `${activeName} · ${activeIndex + 1}/${activeImages.length}`
      : `${activeIndex + 1}/${activeImages.length}`;

    const hasMultiple = activeImages.length > 1;
    prevEl.hidden = !hasMultiple || activeIndex === 0;
    nextEl.hidden = !hasMultiple || activeIndex === activeImages.length - 1;
  }

  function openModal(product) {
    activeImages = Array.isArray(product?.image) ? product.image.filter(Boolean) : [];
    activeName = product?.name || 'Producto';
    activeIndex = 0;

    if (!activeImages.length) return;

    updateModalView();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function goPrev() {
    if (activeIndex <= 0) return;
    activeIndex -= 1;
    updateModalView();
  }

  function goNext() {
    if (activeIndex >= activeImages.length - 1) return;
    activeIndex += 1;
    updateModalView();
  }

  productGrid.addEventListener('click', (event) => {
    const imageTrigger = event.target.closest('.product-open-gallery');
    if (!imageTrigger) return;

    const card = imageTrigger.closest('.product');
    const productId = card?.dataset.id;
    const product = productData.find((item) => item.id === productId);
    if (product) openModal(product);
  });

  productGrid.addEventListener('keydown', (event) => {
    const imageTrigger = event.target.closest('.product-open-gallery');
    if (!imageTrigger) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    const card = imageTrigger.closest('.product');
    const productId = card?.dataset.id;
    const product = productData.find((item) => item.id === productId);
    if (product) openModal(product);
  });

  modal.addEventListener('click', (event) => {
    if (event.target.matches('[data-close-modal="true"]')) closeModal();
  });

  closeEl.addEventListener('click', closeModal);
  prevEl.addEventListener('click', goPrev);
  nextEl.addEventListener('click', goNext);

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft') goPrev();
    if (event.key === 'ArrowRight') goNext();
  });
}

function wireProductWhatsappLinks() {
  document.querySelectorAll('.wa-product').forEach((el) => {
    const card = el.closest('.product');
    const name = (card?.dataset.name || card?.querySelector('h4')?.textContent || '').trim();
    el.setAttribute('href', waUrl(`Hola, me gustaría obtener información sobre ${name}`));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}

function setCatalogFilter(type) {
  document.querySelectorAll('.filter').forEach((button) => {
    const active = button.dataset.filter === type;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });

  document.querySelectorAll('#productGrid .product').forEach((card) => {
    const show = type === 'todos' || card.dataset.type === type;
    card.classList.toggle('is-hidden', !show);
  });
}

function wireCatalogEvents() {
  document.querySelectorAll('.filter').forEach((button) => {
    button.addEventListener('click', () => {
      setCatalogFilter(button.dataset.filter || 'todos');
    });
  });

  document.querySelectorAll('.cat-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      const filter = tile.dataset.filter;
      if (filter) setCatalogFilter(filter);
    });
  });
}

function initClientCarousel() {
  const carousel = document.getElementById('clientsCarousel');
  const track = document.getElementById('clientsTrack');
  const dotsRoot = document.getElementById('clientsDots');
  const prevButton = carousel?.querySelector('[data-carousel-prev]');
  const nextButton = carousel?.querySelector('[data-carousel-next]');

  if (!carousel || !track || !dotsRoot || !prevButton || !nextButton || !clientStories.length) {
    startCarouselAutoplay = null;
    stopCarouselAutoplay = null;
    return;
  }

  let activeIndex = 0;
  let autoplayId = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  track.innerHTML = clientStories.map((client, index) => {
    const initials = clientInitials(client.name);
    const hasImage = Boolean(client.image);

    return `
      <article class="clients-carousel__slide" data-index="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">
        <div class="client-card">
          <div class="client-card__media" aria-hidden="true">
            ${hasImage ? `<img src="${client.image}" alt="${client.name}" loading="lazy" />` : `<div class="client-card__placeholder">${initials}</div>`}
          </div>
          <div class="client-card__body">
            <span class="client-card__eyebrow">${client.meta || 'Cliente'}</span>
            <h3 class="client-card__name">${client.name}</h3>
            <p class="client-card__description">${client.description}</p>
          </div>
        </div>
      </article>
    `;
  }).join('');

  dotsRoot.innerHTML = clientStories.map((client, index) => `
    <button class="clients-carousel__dot ${index === 0 ? 'is-active' : ''}" type="button" data-carousel-dot="${index}" aria-label="Ir al cliente ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}"></button>
  `).join('');

  const slides = Array.from(track.querySelectorAll('.clients-carousel__slide'));
  const dots = Array.from(dotsRoot.querySelectorAll('.clients-carousel__dot'));

  function updateCarousel(nextIndex) {
    activeIndex = (nextIndex + clientStories.length) % clientStories.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  }

  function nextSlide() {
    updateCarousel(activeIndex + 1);
  }

  function prevSlide() {
    updateCarousel(activeIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  function startAutoplay() {
    if (reduceMotion || clientStories.length < 2 || autoplayId) return;
    autoplayId = window.setInterval(nextSlide, 5500);
  }

  startCarouselAutoplay = startAutoplay;
  stopCarouselAutoplay = stopAutoplay;

  prevButton.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    startAutoplay();
  });

  nextButton.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
  });

  dotsRoot.addEventListener('click', (event) => {
    const dot = event.target.closest('[data-carousel-dot]');
    if (!dot) return;

    const index = Number(dot.dataset.carouselDot);
    if (Number.isNaN(index)) return;

    updateCarousel(index);
    stopAutoplay();
    startAutoplay();
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  updateCarousel(0);
  startAutoplay();
}

function initDynamicCatalog() {
  try {
    renderCategoryTiles();
    renderCatalogFilters();
    renderProductCards();
    wireProductWhatsappLinks();
    wireCatalogEvents();
    initProductImageModal();
    initClientCarousel();
  } catch (error) {
    console.error('No se pudo inicializar el catálogo dinámico:', error);
  }
}

initDynamicCatalog();

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky header shadow on scroll
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (window.scrollY > 8) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

// ===== WhatsApp links =====
// Personalizados + CTA final: data-wa = product label or full sentence
document.querySelectorAll('.wa-link').forEach(el => {
  const raw = (el.dataset.wa || '').trim();
  const message = raw.toLowerCase().startsWith('hola')
    ? raw
    : `Hola, me gustaría obtener información sobre ${raw}`;
  el.setAttribute('href', waUrl(message));
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

// ===== Reveal on scroll =====
function initRevealObserver() {
  revealObserver?.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver?.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  document.querySelectorAll('.product, .cat-tile, .custom-card').forEach((el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

initRevealObserver();

window.addEventListener('pagehide', () => {
  stopCarouselAutoplay?.();
  revealObserver?.disconnect();
}, { passive: true });

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  onScroll();
  initRevealObserver();
  startCarouselAutoplay?.();
}, { passive: true });
