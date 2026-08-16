import { client } from "../../blog/sanity.js";
import "../../../sponsor.js"

async function renderDynamicContent() {
  try {
    // Single query to fetch page metadata and all works ordered by 'order'
    const query = `{
      "page": *[_type == "poezijaPage"][0]{ quote, quoteAuthor, sectionTitle, paragraphs },
      "works": *[_type == "poezijaWork"] | order(order asc){ title, slug }
    }`;

    const { page, works } = await client.fetch(query);

    // 1. Render Hero Section
    if (page?.quote) {
      document.getElementById('poezija-quote').innerText = page.quote;
      document.getElementById('poezija-author').innerText = page.quoteAuthor || '';
      document.getElementById('hero-quote-content').classList.add('content-visible');
    }

    // 2. Render Description Paragraphs
    if (page) {
      if (page.sectionTitle) {
        document.getElementById('poetry-main-title').innerText = page.sectionTitle;
      }

      const descContainer = document.getElementById('poetry-description-container');
      if (page.paragraphs && Array.isArray(page.paragraphs)) {
        descContainer.innerHTML = ''; // Clear default
        page.paragraphs.forEach((paragraph, index) => {
          const p = document.createElement('p');
          p.className = 'poetryP fade-in';
          p.innerText = paragraph;

          // Add bottom padding to final item
          if (index === page.paragraphs.length - 1) {
            p.style.paddingBottom = '10%';
            p.style.marginBottom = '0';
          }

          descContainer.appendChild(p);
        });
      }
    }

    // 3. Render Works List
    // Render Works List
if (works && works.length > 0) {
  const worksContainer = document.getElementById('works-list');
  worksContainer.innerHTML = '';

  works.forEach((work) => {
    const a = document.createElement('a');
    a.className = 'list-group-item list-group-item-action';
    
    // Route all items to djelo.html with the slug parameter
    const slug = work.slug?.current || '';
    a.href = `../../djela/poezija/djelo.html?slug=${slug}`;
    
    a.innerText = work.title;
    worksContainer.appendChild(a);
  });
}

  } catch (error) {
    console.error('Error fetching dynamic content from Sanity:', error);
  }
}

document.addEventListener('DOMContentLoaded', renderDynamicContent);

