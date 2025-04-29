import { tns } from "tiny-slider";
class NewsCards {
  constructor(el) {
    this.el = el;
    this.initSlider();
  }

  initSlider() {
    if (this.el.querySelector(".vida-news-cards__item-wrapper")) {
      tns({
        container: ".vida-news-cards__item-wrapper",
        items: 1,
        slideBy: "page",
        mouseDrag: true,
        controls: false,
        nav: false,
        loop: false,
        fixedWidth: 328,
        gutter: 16,
        responsive: {
          1024: {
            fixedWidth: 388,
            gutter: 23
          }
        }
      });
    }
  }

  static init(el) {
    return new NewsCards(el);
  }
}
export default NewsCards;
