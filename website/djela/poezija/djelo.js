import { client } from "../../blog/sanity.js"
import "../../../sponsor.js"

async function renderPoem() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const titleElement = document.getElementById('poem-title');
  const container = document.getElementById('poem-stanzas-container');

  // Ako u URL-u nema slug-a (npr. netko samo otvori djelo.html)
  if (!slug) {
    titleElement.innerText = 'Odaberite pjesmu';
    container.innerHTML = '<p class="poetryFullP fade-in" style="text-align:center;"><a href="../poezija/" style="color: black;">Vratite se na popis djela</a></p>';
    return;
  }

  try {
    // Tražimo dokument tipa "poezijaDetail" čiji se slug podudara
    const query = `*[_type == "poezijaWork" && slug.current == $slug][0]{ title, stanzas }`;
    const poem = await client.fetch(query, { slug });

    // Ako Sanity ne vrati ništa
    if (!poem) {
      titleElement.innerText = 'Pjesma nije pronađena';
      container.innerHTML = `<p class="poetryFullP fade-in" style="text-align:center;">Provjerite je li pjesma sa slugom "<strong>${slug}</strong>" objavljena u Sanityju.</p>`;
      return;
    }
    // Inside djelo.js, after fetching poem data (e.g., 'poem')
if (poem) {
    const baseUrl = "https://sanijelamatkovic.ba";
    const currentUrl = `${baseUrl}/website/umjetnost/poezija/djelo.html?slug=${poem.slug.current}`;
    
    // Extract a 150-character excerpt from stanzas for the meta description
    let poemExcerpt = "Poezija i pjesnička djela književnice Sanijele Matković.";
    if (poem.stanzas && poem.stanzas.length > 0) {
        poemExcerpt = poem.stanzas.join(' ').substring(0, 155) + "...";
    }

    const pageTitle = `${poem.title} (Pjesma) | Sanijela Matković`;
    const fallbackImage = `${baseUrl}/website/images/promocija5.jpg`;

    // 1. Update document and standard meta tags
    document.title = pageTitle;
    document.getElementById('page-title').innerText = pageTitle;
    document.getElementById('dynamic-desc').setAttribute('content', poemExcerpt);
    document.getElementById('dynamic-canonical').setAttribute('href', currentUrl);

    // 2. Update Open Graph (Facebook/WhatsApp)
    document.getElementById('dynamic-og-url').setAttribute('content', currentUrl);
    document.getElementById('dynamic-og-title').setAttribute('content', pageTitle);
    document.getElementById('dynamic-og-desc').setAttribute('content', poemExcerpt);
    document.getElementById('dynamic-og-image').setAttribute('content', fallbackImage);

    // 3. Update Twitter tags
    document.getElementById('dynamic-twitter-url').setAttribute('content', currentUrl);
    document.getElementById('dynamic-twitter-title').setAttribute('content', pageTitle);
    document.getElementById('dynamic-twitter-desc').setAttribute('content', poemExcerpt);
    document.getElementById('dynamic-twitter-image').setAttribute('content', fallbackImage);

    // 4. Inject Dynamic Schema.org JSON-LD structured data for Google
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": poem.title,
        "author": {
            "@type": "Person",
            "name": "Sanijela Matković",
            "url": baseUrl
        },
        "genre": "Poezija",
        "description": poemExcerpt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

    document.title = `Sanijela Matković - ${poem.title}`;
    titleElement.innerText = poem.title.toUpperCase();
    container.innerHTML = '';

    if (poem.stanzas && Array.isArray(poem.stanzas)) {
      poem.stanzas.forEach((stanzaText) => {
        const em = document.createElement('em');
        const p = document.createElement('p');
        p.className = 'poetryFullP fade-in';
        p.innerHTML = stanzaText.replace(/\n/g, '<br>');
        
        em.appendChild(p);
        container.appendChild(em);
      });
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju pjesme:', error);
    titleElement.innerText = 'Greška pri učitavanju';
  }
}

document.addEventListener('DOMContentLoaded', renderPoem);