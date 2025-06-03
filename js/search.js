document.addEventListener('DOMContentLoaded', function () {
  let resorts = [];

  // Fetch resorts from backend API
  async function fetchResorts(query = {}) {
    let url = 'http://localhost:5000/api/resorts/search';
    const params = new URLSearchParams(query).toString();
    if (params) url += `?${params}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch resorts');
      resorts = await response.json();
      displayResorts(resorts);
    } catch (error) {
      document.getElementById('results').innerHTML = '<div class="no-results">Error fetching resorts.</div>';
      document.getElementById('results-count').textContent = '0 results found';
    }
  }

  function displayResorts(data) {
    const resultsContainer = document.getElementById('results');
    const resultsCount = document.getElementById('results-count');
    resultsContainer.innerHTML = '';

    if (!data || data.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No resorts match your search. Try different filters!</div>';
      resultsCount.textContent = '0 results found';
      return;
    }

    data.forEach((resort, index) => {
      const card = document.createElement('div');
      card.className = 'destination-card';

      const stars = Array(5).fill('').map((_, i) =>
        i < Math.floor(resort.rating) ? '<span class="star">★</span>' : '<span class="star">☆</span>'
      ).join('');

      card.innerHTML = `
        <div class="destination-image">
          <img src="../src/${resort.imgSrc || ''}" alt="${resort.title}">
          <span class="destination-type">Resort</span>
        </div>
        <div class="card-info">
          <h3>${resort.title}</h3>
          <div class="destination-location">
            <span class="location-icon">📍</span> ${resort.location}
          </div>
          <p class="destination-description">${resort.shortDescription || ''}</p>
          <div class="card-details">
            <div class="rating">
              <div class="stars">${stars}</div>
              <span>${resort.rating}</span>
            </div>
            <div class="amenities">${(resort.amenities || []).join(', ')}</div>
          </div>
          <div class="destination-footer">
            <div class="destination-price">₹${resort.price} <span class="price-per-night">/ night</span></div>
            <button class="book-now-btn" data-index="${index}">View Resort</button>
          </div>
        </div>
      `;
      resultsContainer.appendChild(card);
    });

    resultsCount.textContent = `${data.length} destinations found`;

    document.querySelectorAll('.book-now-btn').forEach(button => {
      button.addEventListener('click', function () {
        const selectedResort = data[this.dataset.index];
        localStorage.setItem('selectedResort', JSON.stringify(selectedResort));
        window.location.href = 'resort.html';
      });
    });
  }

  function applyFilters() {
    const destinationValue = document.getElementById('destination').value.trim();
    const selectedRating = document.querySelector('.chip-filter[data-filter="rating"].selected')?.dataset.value;
    // Add more filters as needed

    const query = {};
    if (destinationValue) query.destination = destinationValue;
    if (selectedRating) query.rating = selectedRating;

    fetchResorts(query);
  }

  // Autocomplete and filter logic
  const destinationInput = document.getElementById('destination');
  const suggestionsList = document.getElementById('destination-suggestions');

  destinationInput.addEventListener('input', function () {
    // Optionally, fetch suggestions from backend
    // For now, just hide suggestions if input is too short
    if (this.value.length < 2) {
      suggestionsList.style.display = 'none';
      return;
    }
    suggestionsList.style.display = 'none';
  });

  document.addEventListener('click', function (event) {
    if (!destinationInput.contains(event.target) && !suggestionsList.contains(event.target)) {
      suggestionsList.style.display = 'none';
    }
  });

  document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    applyFilters();
  });

  document.querySelectorAll('.chip-filter').forEach(chip => {
    chip.addEventListener('click', function () {
      if (this.dataset.filter === 'rating') {
        document.querySelectorAll('.chip-filter[data-filter="rating"]').forEach(c => c.classList.remove('selected'));
      }
      this.classList.toggle('selected');
    });
  });

  document.getElementById('price-range').addEventListener('input', function () {
    document.getElementById('price-display').textContent = `₹${this.value}`;
  });

  document.getElementById('filter-toggle').addEventListener('click', function () {
    document.getElementById('filter-panel').classList.toggle('active');
  });

  // Guest & Room Dropdown
  const guestsDropdownToggle = document.getElementById('guests-dropdown-toggle');
  const guestsDropdown = document.getElementById('guests-dropdown');
  const applyGuestsButton = document.getElementById('apply-guests');
  const guestsDisplay = document.getElementById('guests-display');

  const counts = { adults: 2, children: 0, rooms: 1 };

  guestsDropdownToggle.addEventListener('click', function (event) {
    guestsDropdown.classList.toggle('show');
    event.stopPropagation();
  });

  document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', function () {
      const target = this.dataset.target;
      if (this.classList.contains('plus')) counts[target]++;
      else if (this.classList.contains('minus') && counts[target] > 0) counts[target]--;
      document.getElementById(`${target}-count`).textContent = counts[target];
    });
  });

  applyGuestsButton.addEventListener('click', function () {
    const totalGuests = counts.adults + counts.children;
    guestsDisplay.textContent = `${totalGuests} Guests, ${counts.rooms} Room${counts.rooms > 1 ? 's' : ''}`;
    guestsDropdown.classList.remove('show');
  });

  document.addEventListener('click', function (event) {
    if (!guestsDropdown.contains(event.target) && !guestsDropdownToggle.contains(event.target)) {
      guestsDropdown.classList.remove('show');
    }
  });

  // Initial load
  fetchResorts();

  // --- Sign In/Logout button logic (like index2.html) ---
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const signinBtn = document.getElementById('signin-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (signinBtn && logoutBtn) {
    signinBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
    logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';

    signinBtn.addEventListener('click', () => {
      window.location.href = '/frontend/html/signup.html';
    });

    logoutBtn.addEventListener('click', () => {
      const confirmLogout = confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        localStorage.removeItem('isLoggedIn');
        signinBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        window.location.href = '/frontend/html/login.html';
      }
    });
  }
});
const imageGallery = document.getElementById("image-gallery");

// Get resortId from query string
const urlParams = new URLSearchParams(window.location.search);
const resortId = parseInt(urlParams.get("resortId"));
const resort = resorts && Array.isArray(resorts) ? resorts.find(r => r.id === resortId) : null;

if (resort && resort.photos && imageGallery) {
  resort.photos.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo; // already includes "images/"
    img.alt = resort.title + " Photo";
    imageGallery.appendChild(img);
  });
} else {
  // Only log if imageGallery exists and resortId is present
  if (imageGallery && resortId) {
    console.log("Resort not found or no photos.");
  }
}

// Hamburger menu for responsive navbar
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // Handle dropdown menus for mobile
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('a');
    const dropdown = item.querySelector('.dropdown-menu');
    if (dropdown && link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });
    }
  });
}
// Navbar scroll effect
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});
// Responsive dropdown close on resize
window.addEventListener('resize', function () {
  if (window.innerWidth > 767) {
    guestsDropdown.classList.remove('show');
    navLinks && navLinks.classList.remove('active');
    hamburger && hamburger.classList.remove('active');
  }
});
