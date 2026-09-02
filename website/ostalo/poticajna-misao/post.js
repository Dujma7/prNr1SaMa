import { client } from "../../blog/sanity.js";
import "../../../sponsor.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const query = `
*[_type == "Poticajna-misao" && slug.current == $slug][0]{
  title,
  slug,
  publishedAt,
  _createdAt,
  misao,
  content
}
`;

function renderPortableText(blocks) {
    if (!blocks || !Array.isArray(blocks)) return "";

    return blocks.map(block => {
        if (block._type !== "block" || !block.children) return "";

        let children = block.children.map(child => {
            let text = child.text || "";

            if (child.marks && Array.isArray(child.marks)) {
                if (child.marks.includes("strong")) {
                    text = `<strong>${text}</strong>`;
                }
                if (child.marks.includes("em")) {
                    text = `<em>${text}</em>`;
                }
            }

            return text;
        }).join("");

        switch (block.style) {
            case "h1":
                return `<h1>${children}</h1>`;
            case "h2":
                return `<h2>${children}</h2>`;
            case "h3":
                return `<h3>${children}</h3>`;
            case "h4":
                return `<h4>${children}</h4>`;
            case "h5":
                return `<h5>${children}</h5>`;
            case "h6":
                return `<h6>${children}</h6>`;
            case "blockquote":
                return `<blockquote>${children}</blockquote>`;
            default:
                return `<p>${children}</p>`;
        }
    }).join("");
}

function setupShareButtons(title) {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    // Facebook
    const fbBtn = document.getElementById("share-facebook");
    if (fbBtn) {
        fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    // Twitter / X
    const twBtn = document.getElementById("share-twitter");
    if (twBtn) {
        twBtn.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    }

    // WhatsApp
    const waBtn = document.getElementById("share-whatsapp");
    if (waBtn) {
        waBtn.href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }

    // Instagram / Native Share
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

function updateMetadata(post) {
    const baseUrl = "https://sanijelamatkovic.ba";
    const postSlug = post.slug?.current || slug || "";
    const currentUrl = `${baseUrl}/website/ostalo/poticajna-misao/post.html?slug=${postSlug}`;

    let descriptionSnippet = post.misao || "Poticajna misao autorice Sanijele Matković.";
    if (!post.misao && Array.isArray(post.content) && post.content.length > 0 && post.content[0].children) {
        descriptionSnippet = post.content[0].children
            .map(child => child.text || "")
            .join(' ')
            .trim()
            .substring(0, 155) + "...";
    }

    const pageTitle = `${post.title} | Poticajna misao | Sanijela Matković`;
    const fallbackImage = `${baseUrl}/website/images/promocija5.jpg`;

    document.title = pageTitle;

    const pageTitleEl = document.getElementById('page-title');
    if (pageTitleEl) pageTitleEl.innerText = pageTitle;

    const setAttr = (id, attr, val) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, val);
    };

    setAttr('dynamic-desc', 'content', descriptionSnippet);
    setAttr('dynamic-canonical', 'href', currentUrl);

    setAttr('dynamic-og-url', 'content', currentUrl);
    setAttr('dynamic-og-title', 'content', pageTitle);
    setAttr('dynamic-og-desc', 'content', descriptionSnippet);
    setAttr('dynamic-og-image', 'content', fallbackImage);

    setAttr('dynamic-twitter-url', 'content', currentUrl);
    setAttr('dynamic-twitter-title', 'content', pageTitle);
    setAttr('dynamic-twitter-desc', 'content', descriptionSnippet);
    setAttr('dynamic-twitter-image', 'content', fallbackImage);

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "datePublished": post.publishedAt || post._createdAt,
        "author": {
            "@type": "Person",
            "name": "Sanijela Matković",
            "url": baseUrl
        },
        "description": descriptionSnippet,
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

async function loadPost() {
    const titleEl = document.getElementById("title");

    if (!slug) {
        if (titleEl) titleEl.textContent = "Objava nije pronađena";
        return;
    }

    try {
        const post = await client.fetch(query, { slug });

        if (!post) {
            if (titleEl) titleEl.textContent = "Objava nije pronađena";
            return;
        }

        if (titleEl) titleEl.textContent = post.title;

        const dateEl = document.getElementById("post-date");
        if (dateEl && post.publishedAt) {
            const date = new Date(post.publishedAt);
            dateEl.textContent = date.toLocaleDateString("hr-HR", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }

        const contentEl = document.getElementById("post-content");
        if (contentEl) {
            contentEl.innerHTML = renderPortableText(post.content);
        }

        setupShareButtons(post.title);
        updateMetadata(post);

    } catch (err) {
        console.error("Greška pri učitavanju objave:", err);
        if (titleEl) titleEl.textContent = "Greška pri učitavanju objave";
    }
}

document.addEventListener("DOMContentLoaded", loadPost);