import breakpoints from "../../site/scripts/media-breakpoints";

export default class VideoPlayer {
  constructor(el) {
    this.el = el;
    this.selector = {
      player: ".vida-video-player__playback",
      muteIcon: ".vida-video-player__mute-icon",
      unmuteIcon: ".vida-video-player__unmute-icon"
    };
    this.player = this.el.querySelector(this.selector.player);
    this.muteIcon = this.el.querySelector(this.selector.muteIcon);
    this.unmuteIcon = this.el.querySelector(this.selector.unmuteIcon);
    this.muteAndUnmute = document.querySelector(
      `[data-section-id=vida-video-player__audio-control]`
    );

    this.mobileSrc = this.player.getAttribute("data-src-mobile");
    this.desktopSrc = this.player.getAttribute("data-src-desktop");

    if (this.desktopSrc && this.mobileSrc) {
      this.updateVideoSrc();
      window.addEventListener("resize", () => {
        this.updateVideoSrc();
      });
    }

    if (this.muteAndUnmute) {
      this.muteAndUnmute.onclick = () => {
        if (this.player.muted) {
          this.player.muted = false;
          this.muteIcon.classList.add("vida-video-player__icon--active");
          this.unmuteIcon.classList.remove("vida-video-player__icon--active");
        } else {
          this.player.muted = true;
          this.muteIcon.classList.remove("vida-video-player__icon--active");
          this.unmuteIcon.classList.add("vida-video-player__icon--active");
        }
      };
    }
    this.initAutoplay();
  }

  initAutoplay() {
    if (!!window.IntersectionObserver) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio < 0.7 && !this.player.paused) {
              this.pauseVideo();
            } else if (entry.intersectionRatio > 0.7) {
              this.playVideo();
            }
          });
        },
        { threshold: [0.7, 1] }
      );

      observer.observe(this.player);
    }
  }

  updateVideoSrc() {
    const isDesktop = window.matchMedia(
      breakpoints.mediaExpression.desktop
    ).matches;
    if (isDesktop) {
      if (this.player.getAttribute("src") !== this.desktopSrc) {
        this.player.setAttribute("src", this.desktopSrc);
      }
    } else {
      if (this.player.getAttribute("src") !== this.mobileSrc) {
        this.player.setAttribute("src", this.mobileSrc);
      }
    }
  }

  playVideo() {
    this.player.play();
  }

  pauseVideo() {
    this.player.pause();
  }

  static init(el) {
    return new VideoPlayer(el);
  }
}
