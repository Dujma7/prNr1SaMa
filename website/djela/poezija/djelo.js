import { client } from "../../blog/sanity.js"


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