import { tns } from "tiny-slider/src/tiny-slider";
class AppCards {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".vida-app-cards__slider")
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
        nav: true,
        controls: false,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: false,
        gutter: 16,
        responsive: {
          1280: {
            items: 4,
            autoWidth: false
          },
          1024: {
            items: 3,
            autoWidth: false
          },
          768: {
            items: 2,
            autoWidth: false
          },
          360: {
            items: 1,
            autoWidth: true
          }
        }
      });
    }
  }
  static init(el) {
    return new AppCards(el);
  }
}
export default AppCards;
