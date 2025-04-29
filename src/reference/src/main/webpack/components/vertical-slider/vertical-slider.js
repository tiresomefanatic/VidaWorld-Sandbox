class VerticalSlider {
  constructor(el) {
    this.el = el;
    this.initSlider();
  }
  initSlider() {
    const self = this;
    this.el.querySelectorAll(".vida-vertical-slider__link").forEach((ele) => {
      ele.addEventListener("click", function (e) {
        var tabName = ele.getAttribute("data-rel");
        e.preventDefault();
        var i, tabcontent, tablinks;
        tabcontent = self.el.querySelectorAll(
          ".vida-vertical-slider__tabcontent-asset"
        );
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = self.el.querySelectorAll(".vida-vertical-slider__link");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].classList.remove("vida-vertical-slider__link--active");
        }
        self.el.querySelector("#" + tabName).style.display = "flex";
        e.currentTarget.classList.add("vida-vertical-slider__link--active");
      });
    });
    this.el.querySelectorAll(".vida-vertical-slider__link")[0].click();
  }

  static init(el) {
    return new VerticalSlider(el);
  }
}

export default VerticalSlider;
