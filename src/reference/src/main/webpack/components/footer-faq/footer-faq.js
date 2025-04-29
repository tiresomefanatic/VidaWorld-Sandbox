class FooterFaqCard {
  constructor(el) {
    this.el = el;
    this.selector = {
      icon: this.el.querySelector(".accordian-container__header"),
      content: this.el.querySelector(".accordian-container__content"),
      wrapper: this.el.querySelector(".accordian-container__wrapper")
    };
    this.initAccordion();
  }
  initAccordion() {
    var selector = this.selector;
    selector.icon.addEventListener("click", function () {
      selector.icon.classList.toggle("open");
      selector.wrapper.classList.toggle("active");
      selector.content.classList.toggle("accordian-container__expand");
    });
  }
  static init(el) {
    return new FooterFaqCard(el);
  }
}
export default FooterFaqCard;
