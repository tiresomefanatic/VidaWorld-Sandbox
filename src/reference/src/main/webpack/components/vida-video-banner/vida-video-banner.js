import { tns } from "tiny-slider/src/tiny-slider";
class VideoBanner {
  constructor(el) {
    this.el = el;
    this.selector = {
      slider: this.el.querySelector(".cmp-video-banner__slides-container"),
      play: this.el.querySelectorAll(".cmp-video-banner__play-btn"),
      nav: this.el.querySelectorAll(".carousel-btn")
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
        controls: true,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: false,
        gutter: 5,
        controlsContainer: ".cmp-video-banner__control-btn",
        768: {
          autoWidth: false,
          controls: false
        }
      });
      this.selector.play.forEach(function (element) {
        const videoEle = element
          .closest(".cmp-video-banner__slide")
          .querySelector("video");
        element.addEventListener("click", function () {
          if (
            videoEle.currentTime > 0 &&
            !videoEle.paused &&
            videoEle.readyState > 2
          ) {
            videoEle.pause();
            element.style.display = "block";
          } else {
            videoEle.play();
            element.style.display = "none";
          }
        });
      });
      this.selector.nav.forEach(function (ele) {
        ele.addEventListener("click", function () {
          ele
            .closest(".cmp-video-banner__slides-wrapper")
            .querySelectorAll("video")
            .forEach(function (video) {
              video.pause();
              video.currentTime = 0;
              video
                .closest(".cmp-video-banner__slide")
                .querySelector(".cmp-video-banner__play-btn").style.display =
                "block";
            });
        });
      });
    }
  }
  static init(el) {
    return new VideoBanner(el);
  }
}
export default VideoBanner;
