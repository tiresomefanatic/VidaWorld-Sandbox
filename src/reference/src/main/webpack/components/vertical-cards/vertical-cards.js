import { tns } from "tiny-slider/src/tiny-slider";
class VerticalCards {
  constructor(el) {
    this.el = el;

    this.selector = {
      slider: this.el.querySelector(".vida-vertical-cards__slider")
    };

    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      tns({
        container: this.selector.slider,
        loop: false,
        center: false,
        page: 1,
        slideBy: 1,
        nav: false,
        controls: false,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: true,
        gutter: 16,
        responsive: {
          1024: {
            items: 4
          },
          360: {
            items: 1
          }
        }
      });
    }
  }
  static init(el) {
    return new VerticalCards(el);
  }
}

export default VerticalCards;
