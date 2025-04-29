import { tns } from "tiny-slider/src/tiny-slider";
import animation from "../../site/scripts/animation";
class BannerCarousel {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".vida-banner-carousel__slider-slides"),
      index: this.el.querySelector(
        ".vida-banner-carousel__slider-controls-index"
      ),
      next: this.el.querySelector(
        ".vida-banner-carousel__slider-controls-next"
      ),
      prev: this.el.querySelector(".vida-banner-carousel__slider-controls-prev")
    };
    this.initSlider();
    animation.animate(this.el);
  }

  initSlider() {
    if (this.selector.slider) {
      const slider = tns({
        container: ".vida-banner-carousel__slider-slides",
        loop: true,
        items: 1,
        mode: "gallery",
        slideBy: "page",
        nav: false,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        controlsContainer: "#customize-controls"
      });
      var info = slider.getInfo(),
        indexCurrent = info.displayIndex;
      this.selector.index.innerHTML = indexCurrent + "/" + info.slideCount;
      this.selector.next.addEventListener("click", () => {
        if (indexCurrent !== info.slideCount) {
          indexCurrent = indexCurrent + 1;
        } else {
          indexCurrent = 1;
        }
        document.querySelector(
          ".vida-banner-carousel__slider-controls-index"
        ).innerHTML = indexCurrent + "/" + info.slideCount;
        animation.animate(this.selector.slider);
      });

      this.selector.prev.addEventListener("click", () => {
        if (indexCurrent !== 1) {
          indexCurrent = indexCurrent - 1;
        } else {
          indexCurrent = info.slideCount;
        }
        document.querySelector(
          ".vida-banner-carousel__slider-controls-index"
        ).innerHTML = indexCurrent + "/" + info.slideCount;
        animation.animate(this.selector.slider);
      });
    }
  }

  static init(el) {
    return new BannerCarousel(el);
  }
}

export default BannerCarousel;
