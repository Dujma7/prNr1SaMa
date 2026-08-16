import { client } from "../blog/sanity.js";
import "../../sponsor.js"

const query = `*[_type == "aboutPage"][0]{
  quote,
  "imageUrl": profileImage.asset->url,
  paragraphs
}`;

async function loadAboutPage() {
  try {
    const data = await client.fetch(query);

    if (!data) return;

    if (data.quote) {
      document.getElementById('about-quote').innerHTML = data.quote.replace(/\n/g, '<br>');
    }

    if (data.imageUrl) {
      document.getElementById('about-img').src = data.imageUrl;
    }

    if (data.paragraphs && data.paragraphs.length > 0) {
      const container = document.getElementById('about-paragraphs');
      container.innerHTML = ''; 

      data.paragraphs.forEach((text) => {
        const p = document.createElement('p');
        p.className = 'fade-in';
        p.innerText = text;
        container.appendChild(p);
      });
    }

    // Reveal everything together smoothly
    document.getElementById('about-content').classList.add('content-visible');

  } catch (error) {
    console.error('Greška pri dohvaćanju podataka iz Sanityja:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadAboutPage);