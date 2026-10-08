
import { client } from "./sanity.js";
import "../../sponsor.js";

const params = new URLSearchParams(window.location.search);

const pathSlug =
    window.location.pathname.match(/post-(.+)\.html$/)?.[1];

const slug =
    params.get("slug") || pathSlug;

const query = `
*[_type == "BlogPost" && slug.current == $slug][0]{
  title,
  slug,
  publishedAt,
  _createdAt,
  content,
  "imageUrl": image.asset->url
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

        if (!children.trim() && block.style === "normal") return "";

        switch (block.style) {
            case "h1":
                return `<h1 class="post-heading h1">${children}</h1>`;
            case "h2":
                return `<h2 class="post-heading h2">${children}</h2>`;
            case "h3":
                return `<h3 class="post-heading h3">${children}</h3>`;
            case "h4":
                return `<h4 class="post-heading h4">${children}</h4>`;
            case "h5":
                return `<h5 class="post-heading h5">${children}</h5>`;
            case "h6":
                return `<h6 class="post-heading h6">${children}</h6>`;
            case "blockquote":
                return `<blockquote class="post-blockquote">${children}</blockquote>`;
            default:
                return `<p class="post-paragraph">${children}</p>`;
        }
    }).join("");
}

function setElementAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
}

function setupShareButtons(postTitle) {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(postTitle);

    // Facebook Share
    const fbBtn = document.getElementById("share-facebook");

    if (fbBtn) {
        fbBtn.href =
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    // Twitter / X Share
    const twBtn = document.getElementById("share-twitter");

    if (twBtn) {
        twBtn.href =
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    }

    // WhatsApp Share
    const waBtn = document.getElementById("share-whatsapp");

    if (waBtn) {
        waBtn.href =
            `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }

    // Instagram Share Handler
    const igBtn = document.getElementById("share-instagram");

    if (igBtn) {
        igBtn.addEventListener("click", () => {
            if (navigator.share) {
                navigator.share({
                    title: postTitle,
                    url: currentUrl
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    alert(
                        "Poveznica je kopirana! Otvorite Instagram i zalijepite poveznicu u svoju objavu ili poruku."
                    );
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

function updateDynamicMetadata(post) {
    const baseUrl = "https://sanijelamatkovic.ba";

    const postSlug = post.slug?.current || slug || "";

    const postUrl =
        `${baseUrl}/website/blog/post.html?slug=${encodeURIComponent(postSlug)}`;

    // USE THE IMAGE FROM SANITY
    const imageUrl =
        post.imageUrl ||
        `${baseUrl}/website/images/promocija5.jpg`;

    let descriptionSnippet =
        "Pročitajte novu objavu na blogu Sanijele Matković.";

    const contentBlocks = post.content || post.body || [];

    if (
        Array.isArray(contentBlocks) &&
        contentBlocks.length > 0 &&
        contentBlocks[0].children
    ) {
        descriptionSnippet = contentBlocks[0].children
            .map(child => child.text || "")
            .join(" ")
            .trim();

        if (descriptionSnippet.length > 160) {
            descriptionSnippet =
                descriptionSnippet.substring(0, 160) + "...";
        }
    }

    const formattedTitle =
        `${post.title} | Blog Sanijele Matković`;

    // Page title
    document.title = formattedTitle;

    setElementAttr(
        "dynamic-title",
        "innerText",
        formattedTitle
    );

    setElementAttr(
        "dynamic-desc",
        "content",
        descriptionSnippet
    );

    setElementAttr(
        "dynamic-canonical",
        "href",
        postUrl
    );

    // Open Graph
    setElementAttr(
        "dynamic-og-url",
        "content",
        postUrl
    );

    setElementAttr(
        "dynamic-og-title",
        "content",
        post.title
    );

    setElementAttr(
        "dynamic-og-desc",
        "content",
        descriptionSnippet
    );

    setElementAttr(
        "dynamic-og-image",
        "content",
        imageUrl
    );

    // Twitter / X
    setElementAttr(
        "dynamic-twitter-url",
        "content",
        postUrl
    );

    setElementAttr(
        "dynamic-twitter-title",
        "content",
        post.title
    );

    setElementAttr(
        "dynamic-twitter-desc",
        "content",
        descriptionSnippet
    );

    setElementAttr(
        "dynamic-twitter-image",
        "content",
        imageUrl
    );

    // Schema.org
    const oldSchema =
        document.getElementById("dynamic-schema");

    if (oldSchema) {
        oldSchema.remove();
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": imageUrl,
        "datePublished":
            post.publishedAt || post._createdAt,
        "author": {
            "@type": "Person",
            "name": "Sanijela Matković",
            "url": baseUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "Sanijela Matković",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/website/images/promocija5.jpg`
            }
        },
        "description": descriptionSnippet,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
        }
    };

    const script =
        document.createElement("script");

    script.id = "dynamic-schema";
    script.type = "application/ld+json";
    script.text =
        JSON.stringify(schemaData);

    document.head.appendChild(script);
}

async function loadPost() {
    const titleEl =
        document.getElementById("title");

    if (!slug) {
        if (titleEl) {
            titleEl.textContent =
                "Objava nije pronađena";
        }

        return;
    }

    try {
        const post =
            await client.fetch(
                query,
                { slug },
                { cache: "no-store" }
            );

        if (!post) {
            if (titleEl) {
                titleEl.textContent =
                    "Objava nije pronađena";
            }

            return;
        }

        // Render Title
        if (titleEl) {
            titleEl.textContent =
                post.title;
        }

        // Render Date
        const dateEl =
            document.getElementById("post-date");

        if (dateEl && post.publishedAt) {
            const date =
                new Date(post.publishedAt);

            dateEl.textContent =
                date.toLocaleDateString(
                    "hr-HR",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );
        }

        // Render Main Featured Image
        const imageWrapper =
            document.getElementById(
                "post-image-wrapper"
            );

        const mainImage =
            document.getElementById(
                "post-main-image"
            );

        if (
            post.imageUrl &&
            imageWrapper &&
            mainImage
        ) {
            mainImage.src =
                post.imageUrl;

            mainImage.alt =
                post.title;

            imageWrapper.style.display =
                "block";
        }

        // Render Portable Content
        const contentData =
            post.content ||
            post.body ||
            [];

        const contentEl =
            document.getElementById(
                "post-content"
            ) ||
            document.getElementById(
                "content"
            );

        if (contentEl) {
            contentEl.innerHTML =
                renderPortableText(
                    contentData
                );
        }

        // Initialize Share Buttons
        setupShareButtons(
            post.title
        );

        // Update Metadata
        updateDynamicMetadata(
            post
        );

    } catch (err) {
        console.error(
            "Error fetching post:",
            err
        );

        if (titleEl) {
            titleEl.textContent =
                "Greška pri učitavanju objave";
        }
    }
}

loadPost();
