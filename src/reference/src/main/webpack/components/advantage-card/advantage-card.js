class AdvantageCard {
  constructor(el) {
    this.el = el;
  }

  static init(el) {
    return new AdvantageCard(el);
  }
}

export default AdvantageCard;
