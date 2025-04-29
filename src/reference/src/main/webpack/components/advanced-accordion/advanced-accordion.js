class AdvancedAccordion {
  constructor(el) {
    this.el = el;
    this.selector = {
      indicationBtn: this.el.getElementsByClassName(
        "vida-advanced-accordion__indicator"
      )
    };
    this.initAccordion();
  }
  initAccordion() {
    var acc = this.selector.indicationBtn;
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.closest(".vida-advanced-accordion__item").classList.toggle(
          "vida-advanced-accordion__item--active"
        );
      });
    }
  }
  static init(el) {
    return new AdvancedAccordion(el);
  }
}

export default AdvancedAccordion;
