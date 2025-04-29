import { tns } from "tiny-slider/src/tiny-slider";
class LeadershipCards {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".vida-leadership-cards__slider-slides")
    };
    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      tns({
        container: this.selector.slider,
        loop: true,
        items: 5,
        page: 1,
        slideBy: 1,
        nav: true,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        controls: false,
        autoWidth: true,
        navPosition: "bottom",
        gutter: 14,
        responsive: {
          360: {
            items: 1,
            startIndex: 2,
            center: true
          },
          1024: {
            startIndex: 0,
            items: 5,
            center: false
          }
        }
      });
    }
  }

  static init(el) {
    return new LeadershipCards(el);
  }
}
export default LeadershipCards;
