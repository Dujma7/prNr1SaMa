import { client } from "./website/blog/sanity.js" // Provjeri putanju do sanity.js

export async function initSponsors() {
  const topSlot = document.querySelector('.sponsor-top');
  const middleSlot = document.querySelector('.sponsor-middle');
  const bottomSlot = document.querySelector('.sponsor-bottom');

  if (!topSlot && !middleSlot && !bottomSlot) return;

  const query = `*[_type == "sponsorAd" && isActive == true]{
    sponsorName,
    "desktopUrl": desktopImage.asset->url,
    "mobileUrl": mobileImage.asset->url,
    destinationUrl
  }`;

  try {
    const sponsors = await client.fetch(query);
    if (!sponsors || sponsors.length === 0) return;

    const createAdHTML = (sponsor) => {
      if (!sponsor) return '';
      const imageHTML = sponsor.mobileUrl ? `
        <picture>
          <source media="(max-width: 576px)" srcset="${sponsor.mobileUrl}">
          <img src="${sponsor.desktopUrl}" alt="${sponsor.sponsorName}">
        </picture>
      ` : `
        <img src="${sponsor.desktopUrl}" alt="${sponsor.sponsorName}">
      `;

      return `
        <a href="${sponsor.destinationUrl}" target="_blank" rel="noopener noreferrer" class="sponsor-card" title="${sponsor.sponsorName}">
          ${imageHTML}
        </a>
      `;
    };

    // Shuffle active ads
    const shuffledSponsors = [...sponsors].sort(() => 0.5 - Math.random());

    // Render each ad once if available; empty slots remain untouched
    if (topSlot && shuffledSponsors[0]) {
      topSlot.innerHTML = createAdHTML(shuffledSponsors[0]);
    }

    if (middleSlot && shuffledSponsors[1]) {
      middleSlot.innerHTML = createAdHTML(shuffledSponsors[1]);
    }

    if (bottomSlot && shuffledSponsors[2]) {
      bottomSlot.innerHTML = createAdHTML(shuffledSponsors[2]);
    }

  } catch (error) {
    console.error("Greška pri učitavanju sponzora:", error);
  }
}

document.addEventListener('DOMContentLoaded', initSponsors);