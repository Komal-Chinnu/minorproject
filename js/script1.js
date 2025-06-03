// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
  } else {
      navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
  }
});

// Handle dropdown menus
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  const link = item.querySelector('a');
  const dropdown = item.querySelector('.dropdown-menu');
  
  if (dropdown) {
      link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
              e.preventDefault();
              dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
          }
      });
  }
});

// Slider functionality
const sliderWrapper = document.querySelector('.slider-wrapper');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const cards = document.querySelectorAll('.destination-card');
let currentIndex = 0;
let isAnimating = false;

function getCardsPerView() {
  const containerWidth = sliderWrapper.offsetWidth;
  const cardWidth = cards[0].offsetWidth;
  const gap = 20;
  return Math.floor(containerWidth / (cardWidth + gap));
}

function updateSlider() {
  if (isAnimating) return;
  isAnimating = true;

  const cardsPerView = getCardsPerView();
  const maxIndex = Math.max(0, cards.length - cardsPerView);
  currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);

  const offset = currentIndex * (cards[0].offsetWidth + 20);
  sliderWrapper.style.transform = `translateX(-${offset}px)`;

  setTimeout(() => {
      isAnimating = false;
  }, 500);
}

function handleResize() {
  currentIndex = 0;
  updateSlider();
}

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
  }
});

nextBtn.addEventListener('click', () => {
  const cardsPerView = getCardsPerView();
  if (currentIndex < cards.length - cardsPerView) {
      currentIndex++;
      updateSlider();
  }
});

window.addEventListener('load', () => {
  updateSlider();
});
window.addEventListener('resize', () => {
  handleResize();
});

// Touch support
let touchStartX = 0;
let touchEndX = 0;

sliderWrapper.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

sliderWrapper.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0 && currentIndex > 0) {
          currentIndex--;
          updateSlider();
      } else if (swipeDistance < 0) {
          const cardsPerView = getCardsPerView();
          if (currentIndex < cards.length - cardsPerView) {
              currentIndex++;
              updateSlider();
          }
      }
  }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
          });
      }
  });
});

// Scroll progress bar
const addScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
  });
};
addScrollProgress();

// Scroll reveal effect
const scrollReveal = () => {
  const elements = document.querySelectorAll('.destination-card, .viewed-card, .offer-card');
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('reveal');
              observer.unobserve(entry.target);
          }
      });
  }, {
      threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
};
scrollReveal();

// Recently Viewed functionality
const destinationCards = document.querySelectorAll('.destination-card');

destinationCards.forEach(card => {
  card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent;
      const description = card.querySelector('p').textContent;
      const rating = card.querySelector('.rating').textContent;
      const image = card.querySelector('img').getAttribute('src');

      const viewedResort = { title, description, rating, image };

      let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

      // Remove if already exists (to avoid duplicates)
      recentlyViewed = recentlyViewed.filter(item => item.title !== viewedResort.title);

      // Add to beginning
      recentlyViewed.unshift(viewedResort);

      // Limit to latest 5
      recentlyViewed = recentlyViewed.slice(0, 5);

      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));

      renderRecentlyViewed();
  });
});

function renderRecentlyViewed() {
  const container = document.querySelector('.viewed-container');
  container.innerHTML = '';

  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

  if (recentlyViewed.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: gray;">No resorts viewed yet.</p>`;
      return;
  }

  recentlyViewed.forEach(resort => {
      const card = document.createElement('div');
      card.className = 'viewed-card reveal';
      card.innerHTML = `
          <img src="/frontend${resort.image}" alt="${resort.title}">
          <div class="card-info">
              <h3>${resort.title}</h3>
              <p>${resort.description}</p>
              <div class="card-details">
                  <span class="rating">${resort.rating}</span>
                  <span class="amenities">Recently Viewed</span>
              </div>
          </div>
      `;
      container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', renderRecentlyViewed);
