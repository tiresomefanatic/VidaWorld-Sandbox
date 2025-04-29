class PriceComponent {
  constructor(el) {
    this.el = el;
    const option = this.el.querySelector(".city-option-container");
    const input = this.el.querySelector(".input-city");
    const vProButton = this.el.querySelector(".variant-buttons .button .vPro");
    const vPlusButton = this.el.querySelector(
      ".variant-buttons .button .vPlus"
    );
    const priceVal = this.el.querySelector(".price-container__price-value p");
    // const productVal = this.el.querySelector(
    //   ".price-container__price-value h2"
    // );
    const arrow = this.el.querySelector(".input-search .arr-image");
    const rupees = this.el.querySelector(
      ".price-container__price-value .rupees"
    );
    this.selector = {
      wrapper: this.el.querySelector(".price-container")
    };
    try {
      if (this.selector.wrapper) {
        const cities = option.querySelectorAll(".city-option");
        // if (vProButton.classList.contains("checked")) {
        //   vProButton.checked = true;
        // } else {
        //   vPlusButton.checked = true;
        // }

        // function toggleCity(cities) {
        //   cities.forEach((city) => {
        //     if (vProButton.checked) {
        //       if (city.dataset.sku === vProButton.dataset.sku) {
        //         city.classList.remove("d-none");
        //       } else {
        //         city.classList.add("d-none");
        //       }
        //     } else {
        //       if (city.dataset.sku === vPlusButton.dataset.sku) {
        //         city.classList.remove("d-none");
        //       } else {
        //         city.classList.add("d-none");
        //       }
        //     }
        //   });
        // }
        function updatePrice(variant) {
          cities.forEach((city) => {
            if (
              input.innerText == city.innerText.trim() &&
              variant.dataset.sku === city.dataset.sku
            ) {
              const priceText = city.dataset.price;
              priceVal.innerHTML = priceText;
              // productVal.innerText = vProButton.checked
              //   ? vProButton.value
              //   : vPlusButton.value;
            }
          });
        }
        function toggleInput() {
          option.classList.toggle("d-none");
          arrow.classList.toggle("rotated-image");
        }
        // toggleCity(cities);
        if (window.innerWidth >= 1250) {
          rupees.classList.add("active");
        }
        window.addEventListener("resize", (e) => {
          if (window.innerWidth >= 1250) {
            rupees.classList.add("active");
          } else {
            rupees.classList.remove("active");
          }
        });
        // vPlusButton.addEventListener("click", () => {
        //   toggleCity(cities);
        //   updatePrice(vPlusButton);
        // });
        // vProButton.addEventListener("click", () => {
        //   toggleCity(cities);
        //   updatePrice(vProButton);
        // });
        input.addEventListener("click", () => {
          toggleInput();
        });
        arrow.addEventListener("click", () => {
          toggleInput();
        });
        cities.forEach((element) => {
          element.addEventListener("click", () => {
            const index = element.dataset.price.indexOf(".");
            const priceText = element.dataset.price;
            priceVal.innerHTML = priceText;
            // productVal.innerText = vProButton?.checked
            //   ? vProButton.value
            //   : vPlusButton.value;
            input.innerText = element.dataset.city;
            option.classList.add("d-none");
            arrow.classList.toggle("rotated-image");
          });
        });
        window.addEventListener("click", (e) => {
          const tar = e.target;
          if (!tar.closest(".input-search")) {
            option.classList.add("d-none");
          }
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  static init(el) {
    return new PriceComponent(el);
  }
}

export default PriceComponent;
