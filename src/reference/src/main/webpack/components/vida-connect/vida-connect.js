import { tns } from "tiny-slider/src/tiny-slider";
class ConnectCards {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".cmp-vida-connect__card-cont")
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
        navPosition: "bottom",
        controls: false,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: false,
        gutter: 0,
        responsive: {
          1280: {
            items: 4,
            autoWidth: false,
            disable: true
          },
          1024: {
            items: 4,
            autoWidth: false,
            disable: true
          },
          768: {
            items: 4,
            autoWidth: false,
            disable: true
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
    return new ConnectCards(el);
  }
}
export default ConnectCards;
