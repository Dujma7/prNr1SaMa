const fs = require("fs");
const path = require("path");

const PROJECT_ID = "w4tsuhea";
const DATASET = "production";
const API_VERSION = "2026-01-01";

const BLOG_DIR = path.join(process.cwd(), "website", "blog");
const TEMPLATE_PATH = path.join(BLOG_DIR, "post.html");

const query = `*[_type == "BlogPost"]{
  title,
  slug,
  publishedAt,
  _createdAt,
  "imageUrl": image.asset->url
}`;

async function fetchPosts() {
    const url =
        `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
        `?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Sanity request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.result || [];
}

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function generate() {
    const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
    const posts = await fetchPosts();

    console.log(`Found ${posts.length} blog posts.`);

    for (const post of posts) {
        const slug = post.slug?.current;

        if (!slug) {
            console.log("Skipping post without slug:", post.title);
            continue;
        }

        const title = post.title || "Sanijela Matković";
        const image =
            post.imageUrl ||
            "https://sanijelamatkovic.ba/website/images/promocija5.jpg";

        const description = `Pročitajte objavu na blogu Sanijele Matković.`;

        const postUrl =
            `https://sanijelamatkovic.ba/website/blog/post-${slug}.html`;

        let html = template;

        // Replace the initial title
        html = html.replace(
            /<title id="dynamic-title">[\s\S]*?<\/title>/,
            `<title id="dynamic-title">${escapeHtml(title)} | Blog Sanijele Matković</title>`
        );

        // Description
        html = html.replace(
            /(<meta name="description" id="dynamic-desc" content=")[^"]*(")/,
            `$1${escapeHtml(description)}$2`
        );

        // Canonical
        html = html.replace(
            /(<link rel="canonical" id="dynamic-canonical" href=")[^"]*(")/,
            `$1${postUrl}$2`
        );

        // Open Graph URL
        html = html.replace(
            /(<meta property="og:url" id="dynamic-og-url" content=")[^"]*(")/,
            `$1${postUrl}$2`
        );

        // Open Graph title
        html = html.replace(
            /(<meta property="og:title" id="dynamic-og-title" content=")[^"]*(")/,
            `$1${escapeHtml(title)}$2`
        );

        // Open Graph description
        html = html.replace(
            /(<meta property="og:description" id="dynamic-og-desc" content=")[^"]*(")/,
            `$1${escapeHtml(description)}$2`
        );

        // THIS IS THE IMPORTANT PART
        // Put the actual Sanity image directly into the HTML.
        html = html.replace(
            /(<meta property="og:image" id="dynamic-og-image" content=")[^"]*(")/,
            `$1${escapeHtml(image)}$2`
        );

        // Twitter metadata
        html = html.replace(
            /(<meta property="twitter:url" id="dynamic-twitter-url" content=")[^"]*(")/,
            `$1${postUrl}$2`
        );

        html = html.replace(
            /(<meta property="twitter:title" id="dynamic-twitter-title" content=")[^"]*(")/,
            `$1${escapeHtml(title)}$2`
        );

        html = html.replace(
            /(<meta property="twitter:description" id="dynamic-twitter-desc" content=")[^"]*(")/,
            `$1${escapeHtml(description)}$2`
        );

        html = html.replace(
            /(<meta property="twitter:image" id="dynamic-twitter-image" content=")[^"]*(")/,
            `$1${escapeHtml(image)}$2`
        );

        const outputPath = path.join(
            BLOG_DIR,
            `post-${slug}.html`
        );

        fs.writeFileSync(outputPath, html, "utf8");

        console.log(`Generated: post-${slug}.html`);
    }
}

generate().catch(error => {
    console.error(error);
    process.exit(1);
});

