import { tns } from "tiny-slider/src/tiny-slider";
class VideoCarosuel {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".vida-video-carosuel__slider")
    };
    this.initSlider();
  }
  initSlider() {
    if (this.selector.slider) {
      tns({
        container: this.selector.slider,
        center: false,
        page: 1,
        slideBy: 1,
        nav: false,
        controls: true,
        prevButton: ".prev",
        nextButton: ".next",
        autoplay: false,
        speed: 800,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: false,
        gutter: 16,
        edgePadding: 50,
        loop: true,
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
    return new VideoCarosuel(el);
  }
}
export default VideoCarosuel;
