class CollapsibleInfo {
  constructor(el) {
    this.el = el;
    this.selector = {
      indicationBtn: this.el.getElementsByClassName(
        "accordian-container__header-wrapper"
      )
    };
    this.initCollapsibleInfo();
  }
  initCollapsibleInfo() {
    var acc = this.selector.indicationBtn;
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.closest(".accordian-container__wrapper").classList.toggle(
          "active"
        );
        this.closest(".accordian-container__wrapper")
          .querySelector(".accordian-container__content")
          .classList.toggle("accordian-container__expand");
        if (
          this.closest(".accordian-container__wrapper")
            .querySelector(".accordian-container__close-icon-opacity")
            .src.includes("minus")
        ) {
          this.closest(".accordian-container__wrapper").querySelector(
            ".accordian-container__close-icon-opacity"
          ).src = "/content/dam/vida2-0/charging-infra/add-icon.svg";
        } else {
          this.closest(".accordian-container__wrapper").querySelector(
            ".accordian-container__close-icon-opacity"
          ).src = "/content/dam/vida2-0/charging-infra/minus-icon.svg";
        }
      });
    }
  }
  static init(el) {
    return new CollapsibleInfo(el);
  }
}

export default CollapsibleInfo;
