import { tns } from "tiny-slider/src/tiny-slider";
class AssetBannerCarousal {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".vida-asset-banner-carousal__slider")
    };
    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      tns({
        container: ".vida-asset-banner-carousal__slider",
        items: 1,
        loop: false,
        slideBy: 1,
        controls: false,
        nav: true,
        gutter: 20,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        navPosition: "bottom",
        navContainer: ".vida-asset-banner-carousal__nav-container"
      });
    }
  }
  static init(el) {
    return new AssetBannerCarousal(el);
  }
}

export default AssetBannerCarousal;
