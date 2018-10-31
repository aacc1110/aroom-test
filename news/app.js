
const apiKey = 'f3718a4d1a5c4d059d5b955713de5a5f';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';


window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource ;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value);
    });

});

async function updateSources(){
    const res = await fetch(`https://newsapi.org/v1/sources`);
    const json = await res.json();

    sourceSelector.innerHTML = json.sourcemap(src => `<option value="${src.id}">${src.name}</option>`).join('\n');

}

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