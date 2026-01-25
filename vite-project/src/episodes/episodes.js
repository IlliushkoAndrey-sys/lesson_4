import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import dayjs from 'dayjs';

let episodes = [];

// --- 1. Fetch all episodes ---
async function fetchAllEpisodes() {
    let url = 'https://rickandmortyapi.com/api/episode';
    while (url) {
        const res = await fetch(url);
        const data = await res.json();
        episodes.push(...data.results);
        url = data.info.next;
    }
}

// --- 2. Helpers ---
function getSeasonNumber(code) {
    return code.match(/S(\d+)/)[1];
}

function splitBySeasons(episodes) {
    return episodes.reduce((acc, ep) => {
        const season = getSeasonNumber(ep.episode);
        acc[season] ??= [];
        acc[season].push(ep);
        return acc;
    }, {});
}

function createEpisodeCard(ep) {
    const card = document.createElement('div');
    card.className = 'season_smallcard';
    card.innerHTML = `
        <div class="smallcard_image">
            <img src="../../../design/1.png" alt="${ep.name}">
        </div>
        <div class="smallcard_title">${ep.name}</div>
        <div class="smallcard_text">
            ${dayjs(ep.air_date).format('DD MMMM YYYY').toLowerCase()}
        </div>
    `;
    return card;
}

// --- 3. Render seasons ---
function renderSeasons(seasons) {
    const root = document.querySelector('#seasons');
    root.innerHTML = ''; // на всякий випадок очистимо

    Object.entries(seasons).forEach(([season, episodes]) => {
        const section = document.createElement('section');
        section.className = 'season';

        // структура: кнопки поза overflow
        section.innerHTML = `
            <h2 class="season-number-title">Season ${season}</h2>

            <div class="season-slider">
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>

                <div class="season-swiper-outer">
                    <div class="swiper season-swiper">
                        <div class="swiper-wrapper"></div>
                    </div>
                </div>
            </div>
        `;
        root.appendChild(section);

        const wrapper = section.querySelector('.swiper-wrapper');

        episodes.forEach(ep => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.appendChild(createEpisodeCard(ep));
            wrapper.appendChild(slide);
        });

        // --- 4. Ініціалізація Swiper для цієї секції ---
        new Swiper(section.querySelector('.season-swiper'), {
            modules: [Navigation],
            spaceBetween: 12,
            slidesPerView: 5,
            navigation: {
                prevEl: section.querySelector('.swiper-button-prev'),
                nextEl: section.querySelector('.swiper-button-next'),
            },
            breakpoints: {
                0: { slidesPerView: 2 },
                600: { slidesPerView: 3 },
                1000: { slidesPerView: 5 },
            },
        });
    });
}

// --- 5. Run ---
document.addEventListener('DOMContentLoaded', async () => {
    await fetchAllEpisodes();
    const seasons = splitBySeasons(episodes);
    renderSeasons(seasons);
});
