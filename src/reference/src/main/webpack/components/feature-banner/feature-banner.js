import { tns } from "tiny-slider/src/tiny-slider";
import animation from "../../site/scripts/animation";
class FeatureBanner {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".vida-feature-banner__slider-slides"),
      index: this.el.querySelector(
        ".vida-feature-banner__slider-controls-index"
      ),
      control: this.el.querySelector(".vida-feature-banner__slider-controls"),
      next: this.el.querySelector(".vida-feature-banner__slider-controls-next"),
      prev: this.el.querySelector(".vida-feature-banner__slider-controls-prev")
    };
    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      const slider = tns({
        container: this.selector.slider,
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
        controlsContainer: this.selector.control
      });
      var info = slider.getInfo(),
        indexCurrent = info.displayIndex;
      this.selector.index.innerHTML =
        "0" + indexCurrent + "/" + "0" + info.slideCount;
      this.selector.next.addEventListener("click", () => {
        if (indexCurrent !== info.slideCount) {
          indexCurrent = indexCurrent + 1;
        } else {
          indexCurrent = 1;
        }
        this.selector.index.innerHTML =
          "0" + indexCurrent + "/" + "0" + info.slideCount;
        animation.animate(this.selector.slider);
      });
      this.selector.prev.addEventListener("click", () => {
        if (indexCurrent !== 1) {
          indexCurrent = indexCurrent - 1;
        } else {
          indexCurrent = info.slideCount;
        }
        this.selector.index.innerHTML =
          "0" + indexCurrent + "/" + "0" + info.slideCount;
        animation.animate(this.selector.slider);
      });
    }
  }
  static init(el) {
    return new FeatureBanner(el);
  }
}
export default FeatureBanner;
