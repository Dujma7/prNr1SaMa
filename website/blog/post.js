import { client } from "./sanity.js";
import "../../sponsor.js"

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const query = `
*[_type == "BlogPost" && slug.current == $slug][0]{
  title,
  publishedAt,
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

        // Skip completely empty blocks to prevent unexpected gaps
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

async function loadPost() {
    if (!slug) {
        document.getElementById("title").textContent = "Objava nije pronađena";
        return;
    }

    try {
        const post = await client.fetch(query, { slug }, { cache: "no-store" });

        if (!post) {
            document.getElementById("title").textContent = "Objava nije pronađena";
            return;
        }

        document.getElementById("title").textContent = post.title;

        if (post.publishedAt) {
            const date = new Date(post.publishedAt);
            document.getElementById("post-date").textContent = date.toLocaleDateString("hr-HR", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }

        const contentData = post.content || post.body || [];
        
        // Target #post-content specifically instead of wiping out outer container
        const contentEl = document.getElementById("post-content") || document.getElementById("content");
        contentEl.innerHTML = renderPortableText(contentData);

    } catch (err) {
        console.error("Error fetching post:", err);
    }
}

loadPost();