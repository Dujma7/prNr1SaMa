import {client} from "./sanity.js";


const params = new URLSearchParams(window.location.search);

const slug = params.get("slug");


const post = await client.fetch(`
*[_type == "Blog" && slug.current == $slug][0]{
    title,
    date,
    image1,
    image2,
    paragraph1,
    paragraph2,
    paragraph3,
    paragraph4
}
`, 
{
    slug: slug
});


document.querySelector("#post-title").textContent = post.title;


const date = new Date(post.date);

document.querySelector("#post-date").textContent =
date.toLocaleDateString("hr-HR", {
    day:"numeric",
    month:"long",
    year:"numeric"
});


document.querySelector("#paragraph1").textContent = post.paragraph1;
document.querySelector("#paragraph2").textContent = post.paragraph2;
document.querySelector("#paragraph3").textContent = post.paragraph3;
document.querySelector("#paragraph4").textContent = post.paragraph4;