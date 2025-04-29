// Granite.I18n.get(key);
window.Granite = {
  I18n: {
    key: "value",
    get(key) {
      return this[key];
    }
  }
};
