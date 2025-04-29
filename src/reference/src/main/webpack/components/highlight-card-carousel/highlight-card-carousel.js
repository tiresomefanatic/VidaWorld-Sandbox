import { tns } from "tiny-slider/src/tiny-slider";
class HighlightCardCarousel {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".vida-highlight-card-carousel__slides")
    };
    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      tns({
        container: ".vida-highlight-card-carousel__slides",
        loop: true,
        center: false,
        items: 1,
        page: 1,
        slideBy: 1,
        nav: true,
        controls: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: true,
        freezable: false
      });
    }
  }
  static init(el) {
    return new HighlightCardCarousel(el);
  }
}

export default HighlightCardCarousel;
