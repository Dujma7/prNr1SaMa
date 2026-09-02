import { client } from "../../blog/sanity.js";
import "../../../sponsor.js";

function setupShareButtons(title) {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    // Facebook Share
    const fbBtn = document.getElementById("share-facebook");
    if (fbBtn) {
        fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    // Twitter / X Share
    const twBtn = document.getElementById("share-twitter");
    if (twBtn) {
        twBtn.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    }

    // WhatsApp Share
    const waBtn = document.getElementById("share-whatsapp");
    if (waBtn) {
        waBtn.href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }

    // Instagram Share
    const igBtn = document.getElementById("share-instagram");
    if (igBtn) {
        igBtn.addEventListener("click", () => {
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: currentUrl
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    alert("Poveznica je kopirana! Otvorite Instagram i zalijepite poveznicu u svoju objavu ili poruku.");
                });
            }
        });
    }

    // Copy Link
    const copyBtn = document.getElementById("copy-link-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(currentUrl).then(() => {
                alert("Poveznica je kopirana u međuspremnik!");
            });
        });
    }
}

async function renderPoem() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    const titleElement = document.getElementById('poem-title');
    const container = document.getElementById('poem-stanzas-container');

    if (!slug) {
        if (titleElement) titleElement.innerText = 'Odaberite pjesmu';
        if (container) container.innerHTML = '<p class="poetryFullP fade-in" style="text-align:center;"><a href="../poezija/" style="color: black;">Vratite se na popis djela</a></p>';
        return;
    }

    try {
        const query = `*[_type == "poezijaWork" && slug.current == $slug][0]{ title, slug, stanzas }`;
        const poem = await client.fetch(query, { slug });

        if (!poem) {
            if (titleElement) titleElement.innerText = 'Pjesma nije pronađena';
            if (container) container.innerHTML = `<p class="poetryFullP fade-in" style="text-align:center;">Provjerite je li pjesma sa slugom "<strong>${slug}</strong>" objavljena u Sanityju.</p>`;
            return;
        }

        const baseUrl = "https://sanijelamatkovic.ba";
        const postSlug = poem.slug?.current || slug;
        const currentUrl = `${baseUrl}/website/umjetnost/poezija/djelo.html?slug=${postSlug}`;

        let poemExcerpt = "Poezija i pjesnička djela književnice Sanijele Matković.";
        if (poem.stanzas && poem.stanzas.length > 0) {
            poemExcerpt = poem.stanzas.join(' ').substring(0, 155) + "...";
        }

        const pageTitle = `${poem.title} (Pjesma) | Sanijela Matković`;
        const fallbackImage = `${baseUrl}/website/images/promocija5.jpg`;

        document.title = pageTitle;
        if (document.getElementById('page-title')) document.getElementById('page-title').innerText = pageTitle;
        if (document.getElementById('dynamic-desc')) document.getElementById('dynamic-desc').setAttribute('content', poemExcerpt);
        if (document.getElementById('dynamic-canonical')) document.getElementById('dynamic-canonical').setAttribute('href', currentUrl);

        if (document.getElementById('dynamic-og-url')) document.getElementById('dynamic-og-url').setAttribute('content', currentUrl);
        if (document.getElementById('dynamic-og-title')) document.getElementById('dynamic-og-title').setAttribute('content', pageTitle);
        if (document.getElementById('dynamic-og-desc')) document.getElementById('dynamic-og-desc').setAttribute('content', poemExcerpt);
        if (document.getElementById('dynamic-og-image')) document.getElementById('dynamic-og-image').setAttribute('content', fallbackImage);

        if (document.getElementById('dynamic-twitter-url')) document.getElementById('dynamic-twitter-url').setAttribute('content', currentUrl);
        if (document.getElementById('dynamic-twitter-title')) document.getElementById('dynamic-twitter-title').setAttribute('content', pageTitle);
        if (document.getElementById('dynamic-twitter-desc')) document.getElementById('dynamic-twitter-desc').setAttribute('content', poemExcerpt);
        if (document.getElementById('dynamic-twitter-image')) document.getElementById('dynamic-twitter-image').setAttribute('content', fallbackImage);

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

        if (titleElement) titleElement.innerText = poem.title.toUpperCase();
        if (container) container.innerHTML = '';

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

        setupShareButtons(poem.title);

    } catch (error) {
        console.error('Greška pri dohvaćanju pjesme:', error);
        if (titleElement) titleElement.innerText = 'Greška pri učitavanju';
    }
}

document.addEventListener('DOMContentLoaded', renderPoem);