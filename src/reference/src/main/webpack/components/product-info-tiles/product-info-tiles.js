import { tns } from "tiny-slider/src/tiny-slider";

class ProductInfoTiles {
  constructor(el) {
    this.el = el;

    this.selector = {
      slider: this.el.querySelector(".vida-product-info-tiles__slider"),
      vidaMobileClick: this.el.querySelector(
        ".vida-product-info-tiles__bootspace-button"
      ),
      vidaMobilebuttonClose: this.el.querySelector(
        ".vida-product-info-tiles__bootspace-button-close"
      ),
      vidaMobileFollowmeClick: this.el.querySelector(
        ".vida-product-info-tiles__followme-button"
      ),
      vidaMobilebuttonFollowmeClose: this.el.querySelector(
        ".vida-product-info-tiles__followme-button-close"
      ),
      vidaMobileEmergencyClick: this.el.querySelector(
        ".vida-product-info-tiles__emergency-button"
      ),
      vidaMobilebuttonEmergencyClose: this.el.querySelector(
        ".vida-product-info-tiles__emergency-button-close"
      ),
      vidaMobilePopupOpen: this.el.querySelector(
        ".vida-product-info-tiles__bootspace-cards-popup-hide"
      ),
      vidaDesktopDiv: this.el.querySelector(
        ".vida-product-info-tiles__bootspace-cards"
      ),
      vidaDesktopDivFollow: this.el.querySelector(
        ".vida-product-info-tiles__followme-cards"
      ),
      vidaDesktopDivEmergency: this.el.querySelector(
        ".vida-product-info-tiles__emergency-cards"
      ),
      vidaMobileFollowmePopupOpen: this.el.querySelector(
        ".vida-product-info-tiles__followme-cards-popup-hide"
      ),
      vidaMobileEmergencyPopupOpen: this.el.querySelector(
        ".vida-product-info-tiles__emergency-cards-popup-hide"
      )
    };
    this.initSlider();
  }

  initSlider() {
    if (this.selector.slider) {
      tns({
        container: this.selector.slider,
        loop: false,
        center: false,
        page: 1,
        slideBy: 1,
        nav: true,
        controls: false,
        autoplay: false,
        speed: 400,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        autoWidth: false,
        gutter: 16,
        responsive: {
          1024: {
            items: 4,
            autoWidth: false
          },
          768: {
            items: 2,
            autoWidth: false
          },
          360: {
            items: 1,
            autoWidth: true
          }
        }
      });
    }
    if (this.selector.vidaMobileClick) {
      this.selector.vidaMobileClick.addEventListener("click", () => {
        this.selector.vidaMobilePopupOpen.classList.add(
          "vida-product-info-tiles__bootspace-cards-popup-show"
        );
      });
    }

    this.selector.vidaMobilebuttonClose.addEventListener("click", () => {
      this.selector.vidaMobilePopupOpen.classList.remove(
        "vida-product-info-tiles__bootspace-cards-popup-show"
      );
    });
    this.selector.vidaMobileFollowmeClick.addEventListener("click", () => {
      this.selector.vidaMobileFollowmePopupOpen.classList.add(
        "vida-product-info-tiles__bootspace-cards-popup-show"
      );
    });
    this.selector.vidaMobilebuttonFollowmeClose.addEventListener(
      "click",
      () => {
        this.selector.vidaMobileFollowmePopupOpen.classList.remove(
          "vida-product-info-tiles__bootspace-cards-popup-show"
        );
      }
    );

    this.selector.vidaMobileEmergencyClick.addEventListener("click", () => {
      this.selector.vidaMobileEmergencyPopupOpen.classList.add(
        "vida-product-info-tiles__bootspace-cards-popup-show"
      );
    });

    this.selector.vidaMobilebuttonEmergencyClose.addEventListener(
      "click",
      () => {
        this.selector.vidaMobileEmergencyPopupOpen.classList.remove(
          "vida-product-info-tiles__bootspace-cards-popup-show"
        );
      }
    );
    this.selector.vidaDesktopDiv.addEventListener("mouseover", () => {
      this.selector.vidaDesktopDiv.classList.add(
        "vida-product-info-tiles__bootspace-desktop-showimage"
      );
    });
    this.selector.vidaDesktopDiv.addEventListener("mouseout", () => {
      this.selector.vidaDesktopDiv.classList.remove(
        "vida-product-info-tiles__bootspace-desktop-showimage"
      );
    });

    this.selector.vidaDesktopDivFollow.addEventListener("mouseover", () => {
      this.selector.vidaDesktopDivFollow.classList.add(
        "vida-product-info-tiles__bootspace-desktop-showimage"
      );
    });
    this.selector.vidaDesktopDivFollow.addEventListener("mouseout", () => {
      this.selector.vidaDesktopDivFollow.classList.remove(
        "vida-product-info-tiles__bootspace-desktop-showimage"
      );
    });
    this.selector.vidaDesktopDivEmergency.addEventListener("mouseover", () => {
      this.selector.vidaDesktopDivEmergency.classList.add(
        "vida-product-info-tiles__bootspace-desktop-showimage"
      );
    });
    this.selector.vidaDesktopDivEmergency.addEventListener("mouseout", () => {
      this.selector.vidaDesktopDivEmergency.classList.remove(
        "vida-product-info-tiles__bootspace-desktop-showimage"
      );
    });
  }
  static init(el) {
    return new ProductInfoTiles(el);
  }
}

export default ProductInfoTiles;
