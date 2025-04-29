import appUtils from "./appUtils";

const currencyUtils = {
  getCurrencySymbol() {
    return appUtils.getConfig("currencySymbol");
  },
  getCurrency() {
    return appUtils.getConfig("currency");
  },
  getCurrencyCountry() {
    return appUtils.getConfig("currencyCountry");
  },
  getCurrencyFormatValue(amount, digits = 2) {
    if (amount === null || amount === "" || amount === undefined) {
      return "";
    }
    return new Intl.NumberFormat(this.getCurrencyCountry(), {
      currency: this.getCurrency(),
      style: "currency",
      minimumFractionDigits: digits
    }).format(amount);
  }
};

export default currencyUtils;
