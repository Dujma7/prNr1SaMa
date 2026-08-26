import { client } from "../../blog/sanity.js";
import "../../../sponsor.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const query = `
*[_type == "Poticajna-misao" && slug.current == $slug][0]{
  title,
  publishedAt,
  content
}
`;

function renderPortableText(blocks) {
    if (!blocks) return "";
    return blocks.map(block => {
        if (block._type !== "block") return "";

        let children = block.children.map(child => {
            let text = child.text;

            // Bold
            if (child.marks && child.marks.includes("strong")) {
                text = `<strong>${text}</strong>`;
            }

            // Italic
            if (child.marks && child.marks.includes("em")) {
                text = `<em>${text}</em>`;
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

// Helper to safely set meta tags
function setMetaTag(nameOrProperty, value, isProperty = false) {
    const attribute = isProperty ? "property" : "name";
    let element = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
    
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(element);
    }
    
    element.setAttribute("content", value);
}

// Helper to extract clean plain text excerpt for Meta Description
function extractPlainText(blocks) {
    if (!blocks || !Array.isArray(blocks)) return "";
    return blocks
        .filter(block => block._type === "block")
        .map(block => block.children.map(c => c.text).join(""))
        .join(" ")
        .slice(0, 155);
}

// Helper to inject JSON-LD Schema.org
function setStructuredData(post) {
    let scriptTag = document.getElementById("dynamic-schema");
    if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "dynamic-schema";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "datePublished": post.publishedAt || new Date().toISOString(),
        "author": {
            "@type": "Person",
            "name": "Sanijela Matković"
        },
        "publisher": {
            "@type": "Person",
            "name": "Sanijela Matković"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };

    scriptTag.textContent = JSON.stringify(schemaData);
}

async function loadPost() {
    const post = await client.fetch(query, { slug });

    if (!post) {
        document.getElementById("title").textContent = "Objava nije pronađena";
        return;
    }

    // 1. Render DOM Elements
    document.getElementById("title").textContent = post.title;
    document.getElementById("post-content").innerHTML = renderPortableText(post.content);

    // Format & Render Date if element exists
    if (post.publishedAt) {
        const dateElement = document.getElementById("post-datetime");
        if (dateElement) {
            const formattedDate = new Date(post.publishedAt).toLocaleDateString("hr-HR", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
            dateElement.textContent = formattedDate;
            dateElement.setAttribute("datetime", post.publishedAt);
        }
    }

    // 2. Dynamic SEO Injection
    const plainExcerpt = extractPlainText(post.content) || `${post.title} - Poticajna misao autorice Sanijele Matković.`;

    document.title = `${post.title} | Sanijela Matković`;
    
    setMetaTag("description", plainExcerpt);
    setMetaTag("og:title", `${post.title} | Sanijela Matković`, true);
    setMetaTag("og:description", plainExcerpt, true);
    setMetaTag("og:url", window.location.href, true);

    // 3. Dynamic Structured Data Schema
    setStructuredData(post);
}

loadPost();