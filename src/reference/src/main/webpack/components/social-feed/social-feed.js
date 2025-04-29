import { tns } from "tiny-slider/src/tiny-slider";
import animation from "../../site/scripts/animation";
class SocialFeed {
  constructor(el) {
    this.el = el;
    this.selector = {
      tabItems: el.querySelectorAll(".vida-social-feed__tab-item"),
      tabPanels: el.querySelectorAll(".vida-social-feed__panel-item"),
      youtubeCards: el.querySelectorAll(".vida-social-feed__youtube-card"),
      iframes: el.querySelectorAll("iframe")
    };
    window.players = [];
    window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.initSlider();

    this.addEvents();
    animation.animate(this.el);
  }

  addEvents() {
    const self = this;
    this.selector.tabItems.forEach((tabElement) => {
      tabElement.addEventListener("click", () => {
        this.tabClickEvents(self, tabElement);
      });
      tabElement.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) {
          this.tabClickEvents(self, tabElement);
        }
      });
    });
  }

  tabClickEvents(self, tabElement) {
    if (!tabElement.classList.contains("vida-social-feed__tab-item--active")) {
      self.selector.tabItems.forEach((tabItem) => {
        tabItem.classList.remove("vida-social-feed__tab-item--active");
      });
      self.selector.tabPanels.forEach((tabPanel) => {
        tabPanel.classList.remove("vida-social-feed__panel-item--active");
      });
      tabElement.classList.add("vida-social-feed__tab-item--active");
      const panelId = tabElement.dataset.rel;
      const activePanel = this.el.querySelector("#" + panelId);
      activePanel.classList.add("vida-social-feed__panel-item--active");
      animation.animate(activePanel);
    }
  }

  onYouTubeIframeAPIReady() {
    const iframes = document.querySelectorAll(
      ".vida-social-feed__youtube-card iframe"
    );

    iframes.forEach(function (iframe, index) {
      if (!iframe.id) {
        iframe.id = "vida-social-feed__youtube-iframe_" + index;
      }
      if (!iframe.src.includes("?enablejsapi=1")) {
        iframe.src += "?enablejsapi=1";
      }
    });

    iframes.forEach(function (iframe) {
      players.push(
        new YT.Player(iframe.id, {
          events: {
            onStateChange: function (event) {
              if (event.data == YT.PlayerState.PLAYING) {
                players.forEach(function (playerItem) {
                  if (
                    playerItem.getPlayerState() == YT.PlayerState.PLAYING &&
                    playerItem.getIframe().id != event.target.getIframe().id
                  ) {
                    playerItem.pauseVideo();
                  }
                });
              }
            }
          },
          host: `${window.location.protocol}//www.youtube.com`,
          playerVars: {
            origin: window.location.origin
          }
        })
      );
    });
  }

  initSlider() {
    const sliderContainerList = [
      ".vida-social-feed__insta",
      ".vida-social-feed__youtube",
      ".vida-social-feed__twitter"
    ];
    sliderContainerList.forEach((sliderContainer) => {
      if (this.el.querySelector(sliderContainer)) {
        tns({
          container: sliderContainer,
          items: 1,
          slideBy: "page",
          mouseDrag: true,
          controls: false,
          nav: false,
          loop: false,
          fixedWidth: 330,
          gutter: 16,
          responsive: {
            1024: {
              fixedWidth: 395,
              gutter: 23
            }
          }
        });
      }
    });
  }

  static init(el) {
    return new SocialFeed(el);
  }
}

export default SocialFeed;
