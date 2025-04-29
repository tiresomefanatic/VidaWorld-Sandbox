class InfoBanner {
  constructor(el) {
    this.el = el;
    this.selector = {
      indicationBtn: this.el.querySelectorAll(
        ".vida-info-banner__accordion-indicator"
      ),
      accordions: this.el.querySelectorAll(".vida-info-banner__accordion")
    };
    this.initAccordion();
  }
  initAccordion() {
    const self = this;
    var acc = this.selector.indicationBtn;
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function (vt) {
        console.log(vt);
        const accordionList = self.selector.accordions;
        accordionList.forEach((accordion) => {
          accordion.classList.remove("vida-info-banner__accordion--active");
        });
        // self.closeOtherAccordion();
        this.closest(".vida-info-banner__accordion").classList.toggle(
          "vida-info-banner__accordion--active"
        );
      });
    }
  }
  // closeOtherAccordion() {
  //   const accordionList = this.selector.accordions;
  //   accordionList.forEach((accordion) => {
  //     accordion.classList.remove("vida-advanced-accordion__item--active");
  //   });
  // }
  static init(el) {
    return new InfoBanner(el);
  }
}

export default InfoBanner;
