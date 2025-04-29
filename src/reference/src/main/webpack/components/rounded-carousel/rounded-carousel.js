import { tns } from "tiny-slider/src/tiny-slider";
import animation from "../../site/scripts/animation";
class RoundedCarousel {
  constructor(el) {
    this.el = el;

    this.selector = {
      title: this.el.querySelector(".vida-rounded-carousel__title-container"),
      slider: this.el.querySelector(".vida-rounded-carousel__slider-slides"),
      next: this.el.querySelector(
        ".vida-rounded-carousel__slider-controls-next"
      ),
      prev: this.el.querySelector(
        ".vida-rounded-carousel__slider-controls-prev"
      )
    };

    animation.animate(this.selector.title);

    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      const slider = tns({
        container: this.selector.slider,
        loop: true,
        items: 2,
        center: true,
        slideBy: 1,
        nav: false,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: true,
        controlsContainer: "#customize-rounded-controls"
      });

      if (slider) {
        animation.animate(this.selector.slider);
      }

      /* TODO: Add the event for swipe as well */
      this.selector.next.addEventListener("click", () => {
        animation.animate(this.selector.slider);
      });
      this.selector.prev.addEventListener("click", () => {
        animation.animate(this.selector.slider);
      });
    }
  }
  static init(el) {
    return new RoundedCarousel(el);
  }
}

export default RoundedCarousel;
