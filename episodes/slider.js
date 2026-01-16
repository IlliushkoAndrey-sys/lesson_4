export default class Slider {
    constructor({ container, items, perView = 5, renderItem }) {
        this.container = container;
        this.items = items;
        this.perView = perView;
        this.renderItem = renderItem;

        this.currentIndex = 0;

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="slider-wrapper">
                <button class="slider-prev">←</button>

                <div class="slider">
                    <div class="slider-inner"></div>
                </div>

                <button class="slider-next">→</button>
            </div>
        `;

        this.inner = this.container.querySelector('.slider-inner');

        this.items.forEach(item => {
            this.inner.appendChild(this.renderItem(item));
        });

        this.setPerViewByScreen();
        this.setCardWidth();

        this.container
            .querySelector('.slider-prev')
            .addEventListener('click', () => this.prev());

        this.container
            .querySelector('.slider-next')
            .addEventListener('click', () => this.next());

        window.addEventListener('resize', () => {
            this.setPerViewByScreen();
            this.setCardWidth();
            this.updatePosition();
        });
    }

    setPerViewByScreen() {
        const width = window.innerWidth;

        if (width <= 600) {
            this.perView = 2;
        } else if (width <= 1000) {
            this.perView = 3;
        } else {
            this.perView = 5;
        }
    }

    setCardWidth() {
        const slider = this.container.querySelector('.slider');
        const sliderWidth = slider.offsetWidth;
        const gap = 15;

        const cardWidth = (sliderWidth - gap * (this.perView - 1)) / this.perView;

        [...this.inner.children].forEach(card => {
            card.style.flex = `0 0 ${cardWidth}px`;
        });

        this.cardWidth = cardWidth + gap;
    }

    updatePosition() {
        this.inner.style.transform =
            `translateX(-${this.currentIndex * this.cardWidth}px)`;
    }

    next() {
        if (this.currentIndex < this.items.length - this.perView) {
            this.currentIndex++;
            this.updatePosition();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updatePosition();
        }
    }
}