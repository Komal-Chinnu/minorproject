document.addEventListener('DOMContentLoaded', function() {
  const resort = JSON.parse(localStorage.getItem('selectedResort'));

  if (!resort) {
    alert('No resort data found!');
    window.location.href = 'search.html';
    return;
  }

  const mainPhoto =  resort.imgSrc || "default.jpg";
  document.querySelector('.hero-section').style.backgroundImage = `
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('../src/${mainPhoto}')
  `;

  document.getElementById('resort-name').innerHTML = `${resort.title} <span class="stars"></span>`;
  document.getElementById('resort-location').textContent = resort.location || "Location not available";
  document.getElementById('resort-price').textContent = `₹${resort.price}`;
  document.getElementById('resort-rating').textContent = `⭐ ${resort.rating}`;

  const descriptionEl = document.getElementById('resort-description');
  if (Array.isArray(resort.description)) {
    descriptionEl.innerHTML = resort.description.map(p => `<p>${p}</p>`).join('');
  } else {
    descriptionEl.innerHTML = `<p>${resort.description || resort.shortDescription || 'No description available.'}</p>`;
  }

  //gallery section nothing but photos of array
  const gallerySection = document.getElementById('gallery-section');

if (gallerySection) {
  // Ensure photos is an array with at least one item
  const photosArray = Array.isArray(resort.photos) && resort.photos.length >= 0
    ? resort.photos
    : resort.imgSrc ? [resort.imgSrc] : []; // Use resort.imgSrc as a fallback if no photos are provided

  // Check if photosArray is still empty and handle the case
  if (photosArray.length === 0) {
    console.error("No images available for this resort.");
    return; // Exit if no images are available
  }

  // Update the gallery section with the main image and thumbnails
  gallerySection.innerHTML = `
    <div class="main-image">
      <img src="../src/${photosArray[0]}" id="main-image" alt="Resort Main Image">
    </div>
    <div class="thumbnail-gallery">
      ${photosArray.map(photos => `<img src="../src/${photos}" class="thumbnail" alt="Resort Thumbnail">`).join('')}
    </div>
  `;

  // Add event listeners to each thumbnail
  document.querySelectorAll('.thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
      document.getElementById('main-image').src = this.src; // Update main image on thumbnail click
    });
  });
} else {
  console.error('Gallery section not found.');
}

//

  const amenityIcons = document.getElementById('amenity-icons');
  resort.amenities.forEach(amenity => {
    const div = document.createElement('div');
    div.className = 'amenity';
    div.innerHTML = `<span>${amenity}</span>`;
    amenityIcons.appendChild(div);
  });

  const mapLink = document.getElementById('map-link');
  if (resort.mapLink) {
    mapLink.href = resort.mapLink;
    mapLink.style.display = 'inline-block';
  } else {
    mapLink.style.display = 'none';
  }

  const vlogLink = document.getElementById('vlog-link');
  if (resort.VlogLink) {
    vlogLink.href = resort.VlogLink;
    vlogLink.style.display = 'inline-block';
  } else {
    vlogLink.style.display = 'none';
  }

  const bookNowButton = document.querySelector('.book-now');
  if (bookNowButton) {
    bookNowButton.addEventListener('click', () => {
      window.location.href = 'booking.html';
    });
  }
});
// Add this function at the global scope
function updateMainImage(src) {
  const mainImage = document.getElementById('main-image');
  if (mainImage) {
      mainImage.src = src;
  }
}