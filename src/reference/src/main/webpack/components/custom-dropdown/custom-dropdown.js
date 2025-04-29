class CustomDropdown {
  constructor(el) {
    const select = el.querySelectorAll(".custom-select__btn");
    const options = el.querySelectorAll(".custom-select__dropdown-option");
    [...options]
      .sort((a, b) => (a.innerHTML > b.innerHTML ? 1 : -1))
      .forEach((node) =>
        el.querySelector(".custom-select__dropdown").appendChild(node)
      );
    const additionalOptionContainer = document.querySelectorAll(
      "." +
        el
          .querySelector(".custom-select[data-target-class]")
          .getAttribute("data-target-class")
    );
    let index = 1;

    this.addAdditionalValueToView = (targetElement) => {
      additionalOptionContainer.forEach((elem) => {
        elem.innerHTML = targetElement.getAttribute(
          "data-option-addtional-value"
        );
      });
    };
    this.addAdditionalValueToView(select[0]);
    select.forEach((item) => {
      item.addEventListener("click", (elem) => {
        const next = elem.target.nextElementSibling;
        next.classList.toggle("custom-select__dropdown-toggle");
        next.style.zIndex = index++;
      });
    });
    options.forEach((option) => {
      option.addEventListener("click", (elem) => {
        const children = elem.target.parentElement.childNodes;
        const parent = elem.target.closest(".custom-select").children[1];
        const targetElement = elem.target;
        for (const child in children) {
          if (
            children[child].classList &&
            children[child].classList.contains("custom-select__dropdown-option")
          ) {
            children[child].classList.remove("selected");
          }
        }
        targetElement.classList.add("selected");
        targetElement.parentElement.classList.remove(
          "custom-select__dropdown-toggle"
        );
        [...targetElement.attributes].forEach((attr) => {
          if (attr.nodeName.indexOf("data-") !== -1) {
            parent.setAttribute(attr.nodeName, attr.nodeValue);
          }
        });
        parent.innerHTML = targetElement.getAttribute("data-option-label");
        this.addAdditionalValueToView(targetElement);
        [...options]
          .sort((a, b) => (a.innerHTML > b.innerHTML ? 1 : -1))
          .forEach((node) =>
            el.querySelector(".custom-select__dropdown").appendChild(node)
          );
      });
    });
  }

  static init(el) {
    return new CustomDropdown(el);
  }
}

export default CustomDropdown;
