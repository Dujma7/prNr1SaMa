import { client } from "../../blog/sanity.js";

async function loadProzaContent() {
  try {
    // 1. Fetch Prose Features
    const featuresQuery = `*[_type == "prozaFeature"] | order(order asc){ title, description }`;
    const features = await client.fetch(featuresQuery);

    // 2. Fetch Book Reviews
    const reviewsQuery = `*[_type == "prozaReview"] | order(order asc){ bookTitle, reviewText }`;
    const reviews = await client.fetch(reviewsQuery);

    renderFeatures(features);
    renderReviews(reviews);
  } catch (error) {
    console.error('Greška pri učitavanju sadržaja sa Sanityja:', error);
  }
}

function renderFeatures(features) {
  const container = document.getElementById('features-carousel-inner');
  if (!container || !features || features.length === 0) return;

  container.innerHTML = '';

  features.forEach((feature, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    itemDiv.style.cssText = 'height: 100%; text-align: center;';

    itemDiv.innerHTML = `
      <div style="width: 50%; margin: 0 auto;">
        <h2 class="carouselH2">${escapeHtml(feature.title)}</h2>
        <p style="margin: 0; padding-top: 10%; text-align: center;">${escapeHtml(feature.description)}</p>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

function renderReviews(reviews) {
  const container = document.getElementById('reviews-carousel-inner');
  if (!container || !reviews || reviews.length === 0) return;

  container.innerHTML = '';

  reviews.forEach((review, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    itemDiv.style.cssText = 'height: 100%; text-align: center;';

    itemDiv.innerHTML = `
      <div style="width: 50%; margin: 0 auto;">
        <h2 class="carouselH2" style="color: #ffffff;">${escapeHtml(review.bookTitle)}</h2>
        <p style="margin: 0; padding-top: 10%; text-align: center; position: relative; z-index: 2; color: #ffffff;">
          ${escapeHtml(review.reviewText)}
        </p>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', loadProzaContent);