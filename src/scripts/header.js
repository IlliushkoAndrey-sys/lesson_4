let firstVariant = false; // Якщо тут поміняти на false буде виконуватись друга функція
    if (firstVariant) {
        init();
    } else {
        initSecond();
    }



export function init() {
    const header = document.createElement("header");

    const divHeader = document.createElement("div");
    divHeader.className = "header";

    const container = document.createElement("div");
    container.className = "container";

    const headerInner = document.createElement("div");
    headerInner.className = "header_inner";

    const logo = document.createElement("div");
    logo.className = "header_logo";
    logo.textContent = "Rick and Morty";

    const drop = document.createElement("div");
    drop.className = "drop";

    const navBtn = document.createElement("button");
    navBtn.className = "nav-btn";
    // navBtn.innerHTML = "&#9776;";

    const nav = document.createElement("nav");
    nav.className = "nav";

    const linksData = [
        {text: "Characters", href:"/characters/characters.html"},
        {text: "Locations", href:"/locations/locations.html"},
        {text: "Episodes", href:"/episodes/episodes.html"},
    ];

    linksData.forEach(item => {
        const link = document.createElement("a");
        link.className = "nav_link";
        link.href = item.href;
        link.textContent = item.text;

        nav.appendChild(link);

    });

    drop.append(navBtn,nav);
    headerInner.append(logo,drop);
    container.appendChild(headerInner);
    divHeader.appendChild(container);
    header.appendChild(divHeader);


    document.body.prepend(header);

    const currentPath = window.location.pathname;
    console.log(currentPath);
    const navLinks = document.querySelectorAll('.nav_link');
    console.log(navLinks);

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        console.log(linkPath);
        if (('/lesson_2/'+ linkPath) === currentPath) {
            link.classList.add('active');
        }
    });

    const dropMobile = document.querySelector('.drop');
    const btn = document.querySelector('.nav-btn');
    const links = document.querySelectorAll('.nav_link');


    const closeMenu = () => {
        dropMobile.classList.remove('active');
        document.body.style.overflow = '';
    };

    btn.addEventListener('click', () => {
        dropMobile.classList.toggle('active');
        btn.classList.toggle('active');
        document.body.style.overflow =
            dropMobile.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            btn.classList.remove('active');
            closeMenu();
        }
    });
}

function initSecond() {
    const header = document.createElement('header');
    header.innerHTML = `<div class="header">
    <div class="container">
        <div class="header_inner">
            <div class="header_logo">Rick and Morty</div>
            <div class="drop">
                <button class="nav-btn"></button>
                <nav class="nav">
                    <a class="nav_link" href="/src/characters/characters.html">Characters</a>
                    <a class="nav_link" href="/src/locations/locations.html">Locations</a>
                    <a class="nav_link" href="/src/episodes/episodes.html">Episodes</a>

                </nav>
            </div>

        </div>

    </div>
</div>`;

    document.body.prepend(header);


    const currentPath = window.location.pathname;
    console.log(currentPath);
    const navLinks = document.querySelectorAll('.nav_link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        console.log(linkPath);
        if ((linkPath) === currentPath) {
            link.classList.add('active');
        }
    });

    const dropMobile = document.querySelector('.drop');
    const btn = document.querySelector('.nav-btn');
    const links = document.querySelectorAll('.nav_link');


    const closeMenu = () => {
        dropMobile.classList.remove('active');
        document.body.style.overflow = '';
    };

    btn.addEventListener('click', () => {
        dropMobile.classList.toggle('active');
        btn.classList.toggle('active');
        document.body.style.overflow =
            dropMobile.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            btn.classList.remove('active');
            closeMenu();
        }
    });

}


