var async = require('async');
const apiKey = 'f3718a4d1a5c4d059d5b955713de5a5f';
const main = document.querySelector('main');
window.addEventListener('load', e => {
    updateNews();
});

async function updateNews() {
    const res = await fetch(`https://newsapi.org/v2/everything? q = bitcoin & from = 2018-09-30 & sortBy = publishedAt & apiKey = ${apiKey}`);
    const json = await res.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article){
    return `
        <div class = "article">
            <a href="${article.url}">
                <h2>${article.title}</h2>
                <img src="${article.urlToImage}">
                <p>${article.description}</p>
            </a>
        </div>
    `;
}