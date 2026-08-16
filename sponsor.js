import { client } from "./website/blog/sanity.js" // Provjeri putanju do sanity.js

export async function initSponsors() {
  const topSlot = document.querySelector('.sponsor-top');
  const middleSlot = document.querySelector('.sponsor-middle');
  const bottomSlot = document.querySelector('.sponsor-bottom');

  // Ako na stranici nema sponzorskih utora, prekini izvođenje
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

    // Pomoćna funkcija za generiranje HTML-a pojedinačne kartice
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

    // Ako ima više reklama, možemo ih nasumično promiješati (Fisher-Yates shuffle)
    const shuffledSponsors = [...sponsors].sort(() => 0.5 - Math.random());

    // Popuni gornji slot (1. reklama)
    if (topSlot && shuffledSponsors[0]) {
      topSlot.innerHTML = createAdHTML(shuffledSponsors[0]);
    }

    // Popuni srednji slot (2. reklama)
    if (middleSlot && (shuffledSponsors[1] || shuffledSponsors[0])) {
      middleSlot.innerHTML = createAdHTML(shuffledSponsors[1] || shuffledSponsors[0]);
    }

    // Popuni donji slot (3. reklama)
    if (bottomSlot && (shuffledSponsors[2] || shuffledSponsors[0])) {
      bottomSlot.innerHTML = createAdHTML(shuffledSponsors[2] || shuffledSponsors[0]);
    }

  } catch (error) {
    console.error("Greška pri učitavanju sponzora:", error);
  }
}

document.addEventListener('DOMContentLoaded', initSponsors);