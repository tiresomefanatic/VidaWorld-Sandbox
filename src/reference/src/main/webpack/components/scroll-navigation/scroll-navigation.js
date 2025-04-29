import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import breakpoints from "../../site/scripts/media-breakpoints";

class ScrollNavigation {
  selector;
  panelElement = [];
  constructor(el) {
    // this.initHeaderAnimation();
    this.selector = {
      tabItems: el.querySelectorAll(".vida-scroll-navigation__links"),
      app: document.querySelector("html")
    };
    this.selector.tabItems.forEach((tabElement) => {
      if (!!tabElement.getAttribute("data-navigation-id")) {
        this.panelElement.push(tabElement.getAttribute("data-navigation-id"));
      }
    });
    this.selector.app.classList.add("vida-scroll-navigation--sticky");
    this.addEvents();
    const isDesktop = window.matchMedia(
      breakpoints.mediaExpression.desktop
    ).matches;
    let topPosition = 0;
    window.addEventListener("scroll", () => {
      if (isDesktop) {
        topPosition = 140;
      } else {
        topPosition = 115;
      }
      const bodyEle = window.pageYOffset;
      this.selector.tabItems.forEach((tabItem) => {
        tabItem.classList.remove("vida-scroll-navigation__links--active");
      });
      this.panelElement.forEach((tempEle, i) => {
        const currentElement = document.querySelector(
          `[data-section-id=${tempEle}]`
        );
        const nextElement = document.querySelector(
          `[data-section-id=${this.panelElement[i + 1]}]`
        );
        this.selector.tabItems.forEach((tabElement) => {
          if (
            currentElement &&
            currentElement.getAttribute("data-section-id") ===
              tabElement.getAttribute("data-navigation-id")
          ) {
            if (nextElement) {
              if (
                bodyEle >= currentElement.offsetTop - topPosition &&
                bodyEle < nextElement.offsetTop - topPosition
              ) {
                tabElement.classList.add(
                  "vida-scroll-navigation__links--active"
                );
              }
            } else {
              if (bodyEle >= currentElement.offsetTop - topPosition) {
                tabElement.classList.add(
                  "vida-scroll-navigation__links--active"
                );
              }
            }
          }
        });
      });
    });
  }
  addEvents() {
    const self = this;
    this.selector.tabItems.forEach((tabElement) =>
      tabElement.addEventListener("click", () => {
        if (
          !tabElement.classList.contains(
            "vida-scroll-navigation__links--active"
          )
        ) {
          self.selector.tabItems.forEach((tabItem) => {
            tabItem.classList.remove("vida-scroll-navigation__links--active");
          });
          tabElement.classList.add("vida-scroll-navigation__links--active");
          const tabValue = tabElement.getAttribute("data-navigation-id");
          document
            .querySelector(`[data-section-id=${tabValue}]`)
            .scrollIntoView({ behavior: "smooth" });
        }
      })
    );
  }

  initHeaderAnimation() {
    const showAnim = gsap
      .from(".vida-scroll-navigation", {
        yPercent: -270,
        paused: true,
        duration: 0.2
      })
      .progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: (self) => {
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      }
    });
  }
  static init(el) {
    return new ScrollNavigation(el);
  }
}
export default ScrollNavigation;
