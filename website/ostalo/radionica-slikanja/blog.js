import {client} from "../../blog/sanity.js";


const query = `
*[_type == "blogPost"] | order(publishedAt desc){
  title,
  slug,
  publishedAt
}
`;

async function loadPosts() {
  const posts = await client.fetch(query);

  const container = document.getElementById("blog-list");

  container.innerHTML = "";

  posts.forEach((post) => {
    const article = document.createElement("a");

    article.className =
      "list-group-item list-group-item-action";

    article.href = `post.html?slug=${post.slug.current}`;

    article.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${post.title}</h5>
        <small>${new Date(post.publishedAt).toLocaleDateString("hr-HR")}</small>
      </div>
    `;

    container.appendChild(article);
  });
}

loadPosts();