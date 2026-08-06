import { client } from "../../blog/sanity.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const query = `
*[_type == "blogPost" && slug.current == $slug][0]{
  title,
  publishedAt,
  misao,
  content
}
`;

function renderPortableText(blocks) {
    return blocks.map(block => {

        if (block._type !== "block") return "";

        let children = block.children.map(child => {
            let text = child.text;

            // Bold
            if (child.marks.includes("strong")) {
                text = `<strong>${text}</strong>`;
            }

            // Italic
            if (child.marks.includes("em")) {
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


async function loadPost() {

    const post = await client.fetch(query, { slug });

    if (!post) {
        document.getElementById("title").textContent =
            "Objava nije pronađena";
        return;
    }

    document.getElementById("title").textContent = post.title;

    document.getElementById("post-content").innerHTML =
        renderPortableText(post.content);
}

loadPost();