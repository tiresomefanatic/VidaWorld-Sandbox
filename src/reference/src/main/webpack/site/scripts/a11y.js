/* helper which adds no-focus-outline class document to apply accesibility styles */
/* eslint-disable no-use-before-define */
export default class A11y {
  constructor() {
    window.addEventListener("keydown", this.handleFirstTab);
  }
  handleFirstTab(e) {
    if (e.keyCode === 9) {
      document.body.classList.add("user-is-tabbing");
      window.removeEventListener("keydown", this.handleFirstTab);
      window.addEventListener("mousedown", this.handleMouseDownOnce);
    }
  }
  handleMouseDownOnce() {
    document.body.classList.remove("user-is-tabbing");
    window.removeEventListener("mousedown", this.handleMouseDownOnce);
    window.addEventListener("keydown", this.handleFirstTab);
  }
}
