// Prilagodi relativnu putanju ovisno o tome gdje se slikarstvo.js nalazi u odnosu na sanity.js
import { client } from "../../blog/sanity.js";

const query = `*[_type == "galleryPage"]{
  albumTitle,
  galleryImages[]{
    title,
    "imageUrl": coalesce(image.asset->url, asset->url)
  }
}`;

async function loadSlikarstvoPage() {
  try {
    const albums = await client.fetch(query);

    if (!albums || albums.length === 0) {
      console.warn("Nema pronađenih albuma.");
      return;
    }

    const container = document.getElementById('albumsContainer');
    if (!container) {
      console.error("Nije pronađen element #albumsContainer");
      return;
    }

    container.innerHTML = '';

    albums.forEach((album, index) => {
      const carouselId = `carouselDisplay_${index}`;

      // 1. Glavni kontejner albuma (zadržana tvoja carouselDisplayDiv klasa)
      const albumDiv = document.createElement('div');
      albumDiv.className = 'carouselDisplayDiv';

      // Dohvaćanje prve slike iz galerije za pozadinu
      let bgImageUrl = '';
      if (album.galleryImages && album.galleryImages.length > 0) {
        const firstImg = album.galleryImages[0];
        bgImageUrl = typeof firstImg === 'string' ? firstImg : firstImg.imageUrl;
      }

      // Postavljanje dinamičkog background-image s gradijentom
      if (bgImageUrl) {
        albumDiv.style.backgroundImage = `
          linear-gradient(to left, rgba(255, 255, 255, 0.0), rgba(255, 255, 255, 0.85) 50%),
          url("${bgImageUrl}")
        `;
        albumDiv.style.backgroundSize = 'cover';
        albumDiv.style.backgroundPosition = 'center';
      }

      // Pozadinski sloj
      const bgOverlay = document.createElement('div');
      bgOverlay.style.cssText = 'position: absolute; z-index: 1; opacity: 0.7; width: 100%; height: 110vh; background-color: white;';
      albumDiv.appendChild(bgOverlay);

      // Naslov albuma
      if (album.albumTitle) {
        const titleEm = document.createElement('em');
        const titleH1 = document.createElement('h1');
        titleH1.className = 'carouselDisplayH1';
        titleH1.style.cssText = 'position: relative; z-index: 2;';
        titleH1.innerText = album.albumTitle;
        titleEm.appendChild(titleH1);
        albumDiv.appendChild(titleEm);
      }

      // 2. Carousel Kontejner
      const carouselWrapper = document.createElement('div');
      carouselWrapper.id = carouselId;
      carouselWrapper.className = 'carousel slide';
      carouselWrapper.setAttribute('data-ride', 'carousel');
      carouselWrapper.style.cssText = 'position: relative; z-index: 2;';

      // Inner dio za slike
      const carouselInner = document.createElement('div');
      carouselInner.className = 'carousel-inner';

      if (album.galleryImages && album.galleryImages.length > 0) {
        album.galleryImages.forEach((imgObj, imgIndex) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = `carousel-item ${imgIndex === 0 ? 'active' : ''}`;

          if (imgObj.title) {
            const h2 = document.createElement('h2');
            h2.className = 'carouselH2';
            h2.innerText = imgObj.title;
            itemDiv.appendChild(h2);
          }

          const imgSrc = typeof imgObj === 'string' ? imgObj : imgObj.imageUrl;
          if (imgSrc) {
            const img = document.createElement('img');
            img.className = 'd-block carouselIMG';
            img.src = imgSrc;
            img.alt = imgObj.title || 'Slika galerije';
            itemDiv.appendChild(img);
          }

          carouselInner.appendChild(itemDiv);
        });
      }

      carouselWrapper.appendChild(carouselInner);

      // Kontrole (Strelice Lijevo / Desno)
      const prevControl = document.createElement('a');
      prevControl.className = 'carousel-control-prev';
      prevControl.href = `#${carouselId}`;
      prevControl.setAttribute('role', 'button');
      prevControl.setAttribute('data-slide', 'prev');
      prevControl.innerHTML = `
        <span class="carousel-control-prev-icon" style="color: #000000" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      `;

      const nextControl = document.createElement('a');
      nextControl.className = 'carousel-control-next';
      nextControl.href = `#${carouselId}`;
      nextControl.setAttribute('role', 'button');
      nextControl.setAttribute('data-slide', 'next');
      nextControl.innerHTML = `
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      `;

      carouselWrapper.appendChild(prevControl);
      carouselWrapper.appendChild(nextControl);

      albumDiv.appendChild(carouselWrapper);
      container.appendChild(albumDiv);

      // Inicijalizacija pojedinačnog carousela putem jQuery/Bootstrapa
      if (typeof $ !== 'undefined') {
        $(`#${carouselId}`).carousel();
      }
    });

  } catch (error) {
    console.error("Greška prilikom dohvaćanja ili prikazivanja galerija:", error);
  }
}

document.addEventListener('DOMContentLoaded', loadSlikarstvoPage);