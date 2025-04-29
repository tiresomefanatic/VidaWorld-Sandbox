class ButtonTabs {
  constructor(el) {
    this.el = el;
    this.tabs = document.querySelectorAll(".vida-button-tabs__navs--tab");
    let dataUrl;

    this.contents = [];
    this.tabs.forEach((tab) => {
      if (!dataUrl) {
        dataUrl = tab.dataset.url;
      }

      if (!tab.dataset.url) {
        const content = document.getElementById(tab.dataset.id);
        content.classList.add("hidden");
        this.contents.push(content);
      }
    });
    if (!dataUrl) {
      this.tabs[0].classList.add("active");
      this.contents[0].classList.remove("hidden");
    }
    this.addEventListener();
  }

  addEventListener() {
    const self = this;
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        self.classChange(this);
      });
    });
  }

  classChange(active) {
    const dataUrl = active.dataset.url;

    if (dataUrl) {
      window.location.href = dataUrl;
    } else {
      this.tabs.forEach((tb) => {
        tb.classList.remove("active");
      });
      this.contents.forEach((tb) => {
        tb.classList.add("hidden");
      });

      active.classList.add("active");
      document.getElementById(active.dataset.id).classList.remove("hidden");
    }
  }

  static init(el) {
    return new ButtonTabs(el);
  }
}

export default ButtonTabs;
