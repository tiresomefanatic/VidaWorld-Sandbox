import { tns } from "tiny-slider/src/tiny-slider";
import analyticsUtils from "../../site/scripts/utils/analyticsUtils";
import Logger from "../../services/logger.service";

class ProductInfo {
  constructor(el) {
    this.el = el;

    this.selector = {
      slider: this.el.querySelector(".vida-product-info__slider-slides")
    };
    this.initSlider();

    document.addEventListener("click", (e) => {
      if (
        e.target &&
        e.target.classList.contains("vida-product-info__color-list-item")
      ) {
        const selectionParent = e.target.closest(
          ".vida-product-info__selection"
        );
        if (
          e.target &&
          !e.target.classList.contains(
            "vida-product-info__color-list-item--active"
          )
        ) {
          selectionParent
            .querySelectorAll(".vida-product-info__color-list-item")
            .forEach((colorListItem) => {
              colorListItem.classList.remove(
                "vida-product-info__color-list-item--active"
              );
            });

          selectionParent
            .querySelectorAll(".vida-product-info__selection-price-item")
            .forEach((priceItem) => {
              priceItem.classList.remove(
                "vida-product-info__selection-price-item--active"
              );
            });

          e.target.classList.add("vida-product-info__color-list-item--active");
          const panelId = e.target.getAttribute("data-rel");

          selectionParent
            .querySelector(`[data-section-id=${panelId}]`)
            .classList.add("vida-product-info__selection-price-item--active");
        }
      }
    });
  }

  initSlider() {
    if (this.selector.slider) {
      const autoplayValue =
        this.selector.slider.getAttribute("data-autoplay") &&
        this.selector.slider.getAttribute("data-autoplay") === "true"
          ? true
          : false;
      const autoplaySpeed = this.selector.slider.getAttribute(
        "data-autoplay-speed"
      )
        ? parseInt(this.selector.slider.getAttribute("data-autoplay-speed"))
        : 400;
      const productSlider = tns({
        container: ".vida-product-info__slider-slides",
        loop: true,
        items: 2,
        center: true,
        slideBy: 1,
        nav: false,
        controls: false,
        autoplay: false,
        speed: autoplaySpeed,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: true,
        autoplay: autoplayValue,
        autoplayHoverPause: autoplayValue
      });

      const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
      if (productSlider && isAnalyticsEnabled) {
        this.productDetails();
      }
    }
  }

  productDetails() {
    const productDetails = document.querySelectorAll("[data-product-details]");
    for (let i = 0; i < productDetails.length; i++) {
      productDetails[i].addEventListener("click", function (event) {
        event.preventDefault();
        let modalColor = "",
          modalPrice = "",
          modelVariant = "";
        try {
          const currentElement = event.target.closest(
            ".vida-product-info__card"
          );
          const selectedVariation = currentElement.querySelector(
            ".vida-product-info__selection"
          );

          const isPriceAvailable = currentElement.querySelector(
            ".vida-product-info__selection .vida-product-info__selection-price-item"
          );

          if (selectedVariation && isPriceAvailable) {
            modelVariant =
              selectedVariation.querySelector(
                ".vida-product-info__selection-heading"
              ).innerText || "";
            modalColor = selectedVariation.querySelector(
              ".vida-product-info__color-list-item--active"
            )
              ? selectedVariation
                  .querySelector(".vida-product-info__color-list-item--active")
                  .getAttribute("data-rel")
              : "";
            modalPrice =
              modalColor !== ""
                ? analyticsUtils.priceConversion(
                    selectedVariation.querySelector(
                      `[data-section-id='${modalColor}'] .vida-product-info__price-amount`
                    ).innerText
                  )
                : "";
          } else {
            modelVariant = event.target.offsetParent.querySelector(
              ".vida-product-info__card-heading"
            )
              ? event.target.offsetParent.querySelector(
                  ".vida-product-info__card-heading"
                ).innerText
              : "";
          }
          const customLink = {
            name: event.target.innerText,
            position: "Bottom",
            type: "Link",
            clickType: "other"
          };
          const location = {
            state: "",
            city: "",
            pinCode: "",
            country: ""
          };
          const productDetails = {
            modelVariant: modelVariant,
            modelColor: modalColor,
            productID: "",
            startingPrice: modalPrice
          };

          const additionalPageName = "";
          const additionalJourneyName = "";

          analyticsUtils.trackCustomButtonClick(
            customLink,
            location,
            productDetails,
            additionalPageName,
            additionalJourneyName,
            function () {
              window.location.href = event.currentTarget.href;
            }
          );
        } catch (error) {
          Logger.error(error);
        }
      });
    }
  }

  static init(el) {
    return new ProductInfo(el);
  }
}

export default ProductInfo;
