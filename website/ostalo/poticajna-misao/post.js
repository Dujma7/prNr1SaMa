import {client} from "../../blog/sanity.js";


const params = new URLSearchParams(window.location.search);

const slug = params.get("slug");


const post = await client.fetch(`
*[_type == "Poticajna-misao" && slug.current == $slug][0]{
    title,
    date,
    image,
    misao,
    paragraph1,
    paragraph2,
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

document.querySelector("#misao").textContent = post.misao;
document.querySelector("#paragraph1").textContent = post.paragraph1;
document.querySelector("#paragraph2").textContent = post.paragraph2;
