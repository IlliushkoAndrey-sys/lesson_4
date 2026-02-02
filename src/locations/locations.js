const state = {
    search: "",
    currentPage: 1,
    perPage: 10,
    cache: new Map(),
    totalLocations: 0,
    apiPage: 0,
    apiPerPage: 20
}
const loader = document.getElementById('loader');

function showLoader() {
    loader.classList.remove("hide");
}

function hideLoader() {
    loader.classList.add("hide");
}

const messageBoxFinder = document.querySelector(".locations_message");

function showMessageBox(text) {
    messageBoxFinder.textContent = text;
    messageBoxFinder.classList.remove("hide");
}

function hideMessageBox() {
    messageBoxFinder.classList.add("hide");
}

async function fetchLocationsByApiPage (page = 1) {
    let searchQuery = state.search ;
    searchQuery = `&name=${state.search}`;

    const url = `https://rickandmortyapi.com/api/location?page=${page}${searchQuery}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        state.totalLocations = data.info.count;
        return data.results || [];
    } catch {
        return [];
    }
}

async function fetchResidentImage (url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status} for ${url}`);
        const data = await res.json();
        return data.image || "https://placehold.co/200x200";
    } catch (e) {
        console.error("location without image:", url, e);
        return "https://placehold.co/200x200";
    }

}

async function loadPageLocations() {
    let neededApiPage = Math.ceil(state.currentPage/2);

    if(!state.cache.has(neededApiPage)) {
        const data = await fetchLocationsByApiPage(neededApiPage);
        state.cache.set(neededApiPage, data);
    }

    const apiData = state.cache.get(neededApiPage);


    let from = state.currentPage %2 === 1 ? 0 : 10;
    let to = from + 10;

    return apiData.slice(from, to);
}

async function createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location_card';

    let img = "https://placehold.co/200x200";
    if(location.residents[0]) {
        img = await fetchResidentImage(location.residents[0]);
    }

    card.innerHTML = `
    <div class="location_image">
        <img src="${img}" alt="${location.name}">
    </div>
    <div class="location_name">${location.name}</div>
    <div class="location_type">${location.type}</div>
    `;
    return card;
}

async function renderLocations() {
    showLoader();

    const container = document.querySelector('.locations_inner');
    container.innerHTML = '';


    const pageItems = await loadPageLocations();

    if(pageItems.length === 0) {
        hideLoader();
        showMessageBox("Нічого не знайдено");
        return;
    }
    hideMessageBox();

    for (const location of pageItems) {
        const card = await createLocationCard(location);
        container.appendChild(card);
    }
    hideLoader();
}

function renderPagination() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(state.totalLocations / state.perPage);
    const current = state.currentPage;


    const createBtn = (page, text = page) => {
        const btn = document.createElement('button');
        btn.textContent = text;

        if(page===current) btn.classList.add('active');

        btn.addEventListener('click', () => {
            if (page < 1 || page > totalPages) return;
            state.currentPage = page;
            render();
        });
        return btn;
    };

    const prev = createBtn(current - 1, "Prev");
    prev.disabled = current === 1;
    pagination.appendChild(prev);

    pagination.appendChild(createBtn(1));

    if (current > 3) {
        pagination.appendChild(document.createTextNode(" ... "));
    }

    for (let i = current - 1; i <= current + 1; i++) {
        if (i > 1 && i < totalPages) pagination.appendChild(createBtn(i));
    }

    if (current < totalPages -2) {
        pagination.appendChild(document.createTextNode(" ... "));
    }

    if (totalPages > 1) pagination.appendChild(createBtn(totalPages));

    const next = createBtn(current + 1, "Next");
    next.disabled = current === totalPages;
    pagination.appendChild(next);

    const jumpWrapper = document.createElement('div');
    jumpWrapper.className = 'pagination_jump';

    const jumpInput = document.createElement('input');
    jumpInput.type = 'number';
    jumpInput.min = 1;
    jumpInput.max = totalPages;
    jumpInput.placeholder = current;

    jumpInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') jump();
    });

    const jumpBtn = document.createElement('button');
    jumpBtn.textContent = 'Go';

    function jump() {
        const page = Number(jumpInput.value);
        if (!page || page < 1 || page > totalPages) return;

        state.currentPage = page;
        render();


    }

    jumpBtn.addEventListener('click', jump);

    jumpWrapper.appendChild(jumpInput);
    jumpWrapper.appendChild(jumpBtn);
    pagination.appendChild(jumpWrapper);
}


export async function render() {
    await renderLocations();
    renderPagination();
}

document.addEventListener('DOMContentLoaded', () => {
    render();

    document.querySelector(".locations-finder")
        .addEventListener("input", (e) => {
            clearTimeout(searchTimer);

            searchTimer = setTimeout(() => {
                state.search = e.target.value.toLowerCase().trim();
                state.currentPage = 1;
                state.cache.clear();
                render();

            }, 500);
        });
});