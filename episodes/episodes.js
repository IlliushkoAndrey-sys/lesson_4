import Slider from './slider.js';

let episodes = [];

async function fetchAllEpisodes() {
    let url = 'https://rickandmortyapi.com/api/episode';

    while (url) {
        const res = await fetch(url);
        const data = await res.json();
        episodes.push(...data.results);
        url = data.info.next;
    }
}

function getSeasonNumber(code) {
    return code.match(/S(\d+)/)[1];
}

function splitBySeasons(episodes) {
    return episodes.reduce((acc, ep) => {
        const season = getSeasonNumber(ep.episode);
        if (!acc[season]) acc[season] = [];
        acc[season].push(ep);
        return acc;
    }, {});
}

function createEpisodeCard(episode) {
    const card = document.createElement('div');
    card.className = 'season_smallcard';

    card.innerHTML = `
        <div class="smallcard_image">
            <img src="../design/1.png" alt="${episode.name}">
        </div>
        <div class="smallcard_title">${episode.name}</div>
        <div class="smallcard_text">${episode.air_date}</div>
    `;

    return card;
}

function renderSeasons(seasons) {
    const root = document.querySelector('#seasons');

    Object.entries(seasons).forEach(([season, episodes]) => {
        const section = document.createElement('section');
        section.className = 'season';

        section.innerHTML = `
            <h2 class="season-number-title">скуSeason ${season}</h2>
            <div class="season-slider"></div>
        `;

        root.appendChild(section);

        new Slider({
            container: section.querySelector('.season-slider'),
            items: episodes,
            perView: 5,
            renderItem: createEpisodeCard
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchAllEpisodes();
    const seasons = splitBySeasons(episodes);
    renderSeasons(seasons);
});