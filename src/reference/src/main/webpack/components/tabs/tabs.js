import { tns } from "tiny-slider/src/tiny-slider";

class Tabs {
  constructor(el) {
    this.el = el;

    this.initSlider();

    this.selector = {
      tabItems: el.querySelectorAll(".vida-tabs__tab-item"),
      tabPanels: el.querySelectorAll(".vida-tabs__tab-panel")
    };
    this.addEvents();
  }

  addEvents() {
    const self = this;
    this.selector.tabItems.forEach((tabElement) => {
      tabElement.addEventListener("click", () => {
        this.addtabEvents(self, tabElement);
      });

      tabElement.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) {
          this.addtabEvents(self, tabElement);
        }
      });
    });
  }

  addtabEvents(self, tabElement) {
    if (!tabElement.classList.contains("vida-tabs__tab-item--active")) {
      self.selector.tabItems.forEach((tabItem) => {
        tabItem.classList.remove("vida-tabs__tab-item--active");
      });
      self.selector.tabPanels.forEach((tabPanel) => {
        tabPanel.classList.remove("vida-tabs__tab-panel--active");
      });
      tabElement.classList.add("vida-tabs__tab-item--active");
      const panelId = tabElement.getAttribute("data-rel");

      this.el
        .querySelector("#" + panelId)
        .classList.add("vida-tabs__tab-panel--active");
    }
  }

  initSlider() {
    if (this.el.querySelector(".vida-tabs__tab-list")) {
      tns({
        container: ".vida-tabs__tab-list",
        items: 2,
        slideBy: "page",
        mouseDrag: true,
        controls: false,
        nav: false,
        loop: false,
        fixedWidth: 102,
        gutter: 8,
        responsive: {
          1024: {
            fixedWidth: 191,
            gutter: 40
          }
        }
      });
    }
  }

  static init(el) {
    return new Tabs(el);
  }
}

export default Tabs;
