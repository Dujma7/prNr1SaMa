import {client} from "./website/blog/sanity.js"
import "./sponsor.js"

const query = `*[_type == "homePage"][0]{
  heroTitle,
  heroSubtitle,
  aboutTitle,
  aboutText,
  "galleryImages": galleryImages[].asset->url,
  promoVideo1,
  promoVideo2
}`;

async function loadHomePage() {
  try {
    const data = await client.fetch(query);

    if (!data) return;

    // 1. Hero Section Data
    if (data.heroTitle) document.getElementById('hero-title').innerText = data.heroTitle;
    if (data.heroSubtitle) document.getElementById('hero-subtitle').innerText = data.heroSubtitle;

    // Reveal the hero text and button smoothly together
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
      heroContent.classList.add('content-visible');
    }

    const aboutBtn = document.getElementById("aboutBTN")
    if (aboutBtn) {
        aboutBtn.classList.add("content-visible")
    }

    // 2. About Section
    if (data.aboutTitle) document.getElementById('about-title').innerText = data.aboutTitle;
    if (data.aboutText) document.getElementById('about-text').innerText = data.aboutText;

    // 3. Carousel Section
    if (data.galleryImages && data.galleryImages.length > 0) {
      const carouselContainer = document.getElementById('carousel-inner');
      carouselContainer.innerHTML = '';

      data.galleryImages.forEach((imageUrl, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `carousel-item ${index === 0 ? 'active' : ''}`;

        const img = document.createElement('img');
        img.className = 'd-block carouselIMG';
        img.src = imageUrl;
        img.alt = `Slika ${index + 1}`;

        itemDiv.appendChild(img);
        carouselContainer.appendChild(itemDiv);
      });
    }

    // 4. Promo Video 1
    if (data.promoVideo1) {
      if (data.promoVideo1.title) document.getElementById('promo1-title').innerText = data.promoVideo1.title;
      if (data.promoVideo1.subtitle) document.getElementById('promo1-subtitle').innerText = `"${data.promoVideo1.subtitle}"`;
      if (data.promoVideo1.description) document.getElementById('promo1-desc').innerText = data.promoVideo1.description;
      if (data.promoVideo1.embedUrl) document.getElementById('promo1-iframe').src = data.promoVideo1.embedUrl;
    }

    // 5. Promo Video 2
    if (data.promoVideo2) {
      if (data.promoVideo2.title) document.getElementById('promo2-title').innerText = data.promoVideo2.title;
      if (data.promoVideo2.subtitle) document.getElementById('promo2-subtitle').innerText = `"${data.promoVideo2.subtitle}"`;
      if (data.promoVideo2.embedUrl) document.getElementById('promo2-iframe').src = data.promoVideo2.embedUrl;
    }

  } catch (error) {
    console.error('Greška pri dohvaćanju podataka iz Sanityja:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadHomePage);