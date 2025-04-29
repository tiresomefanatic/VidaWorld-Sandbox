import { tns } from "tiny-slider/src/tiny-slider";
class AwardsCarousel {
  constructor(el) {
    this.el = el;

    this.selector = {
      slider: this.el.querySelector(".vida-awards-carousel__slider-slides")
    };
    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      tns({
        container: this.selector.slider,
        loop: true,
        items: 3,
        page: 1,
        slideBy: 1,
        nav: true,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        controls: false,
        navPosition: "bottom",
        responsive: {
          360: {
            items: 1
          },
          1024: {
            items: 3
          }
        }
      });
    }
  }
  static init(el) {
    return new AwardsCarousel(el);
  }
}

export default AwardsCarousel;
