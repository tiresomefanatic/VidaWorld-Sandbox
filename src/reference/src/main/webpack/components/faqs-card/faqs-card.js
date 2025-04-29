class FaqCard {
  constructor(el) {
    this.el = el;
    this.selector = {
      icon: this.el.querySelector(".faqs-card__header-container"),
      content: this.el.querySelector(".faqs-card__content-container")
    };
    this.initAccordion();
  }
  initAccordion() {
    var selector = this.selector;
    selector.icon.addEventListener("click", function () {
      selector.icon.classList.toggle("open");
      selector.content.classList.toggle("display-none");
    });
  }
  static init(el) {
    return new FaqCard(el);
  }
}
export default FaqCard;
