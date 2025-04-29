import analyticsUtils from "../../site/scripts/utils/analyticsUtils";
import loginUtils from "../../site/scripts/utils/loginUtils";
import CONSTANT from "../../site/scripts/constant";
import Cookies from "js-cookie";
import API from "../../services/rest.service";
import appUtils from "../../site/scripts/utils/appUtils";

class AccessoriesMerchandise {
  constructor(el) {
    this.el = el;

    this.selector = {
      scrollableElement: this.el.querySelector(
        ".accessories-merchandise__details"
      ),
      leftBtn: document.querySelector(".accessories-left-arrow"),
      rightBtn: document.querySelector(".accessories-right-arrow")
    };
    const isLoggedIn = loginUtils.isSessionActive();
    const scrollContainer = this.selector.scrollableElement;
    const leftBtn = document.querySelector(".accessories-left-arrow");
    const rightBtn = document.querySelector(".accessories-right-arrow");
    const downloadButton = document.querySelector(
      ".accessories-merchandise__download-action"
    );
    const viewPriceAll = document.querySelector(
      ".accessories-merchandise__details .view-all-container .view-price-link"
    );
    const viewPrice = document.querySelectorAll(
      ".accessories-merchandise__details__item .view-price-link"
    );
    const imageElement = document.querySelectorAll(
      ".accessories-merchandise__details__item .accessories-merchandise-imagebox"
    );

    viewPrice.forEach((priceLink) => {
      priceLink.addEventListener("click", (e) => {
        if (isLoggedIn) {
          e.preventDefault();
          this.getUserInfo(e.target);
        }
        const ctaText =
          priceLink?.innerText +
            " - " +
            priceLink.parentElement.getElementsByClassName(
              "accessories-merchandise__details__item__name"
            )[0].innerText ||
          priceLink?.alt +
            " - " +
            priceLink.parentElement.getElementsByClassName(
              "accessories-merchandise__details__item__name"
            )[0].innerText;
        const ctaLocation = priceLink?.getAttribute("data-position");
        const clickURL = priceLink?.getAttribute("href");
        if (clickURL?.endsWith(".pdf")) {
          this.ctaPdfLinks(clickURL);
        } else {
          this.ctaRedirectLinks(ctaText, ctaLocation, clickURL);
        }
      });
    });

    viewPriceAll.addEventListener("click", (e) => {
      if (isLoggedIn) {
        e.preventDefault();
        this.getUserInfo(e.target);
      }
      const ctaText = viewPriceAll.alt || viewPriceAll.innerText;
      const ctaLocation = viewPriceAll?.getAttribute("data-position");
      const clickURL = viewPriceAll?.getAttribute("href");
      if (clickURL?.endsWith(".pdf")) {
        this.ctaPdfLinks(clickURL);
      } else {
        this.ctaRedirectLinks(ctaText, ctaLocation, clickURL);
      }
    });

    downloadButton?.addEventListener("click", (e) => {
      const closestLink = e?.target?.closest("a");
      const ctaText = e?.target?.alt || e?.target?.innerText;
      const ctaLocation = closestLink?.getAttribute("data-position");
      const clickURL = closestLink?.getAttribute("href");
      if (clickURL?.endsWith(".pdf")) {
        this.ctaPdfLinks(clickURL);
      } else {
        this.ctaRedirectLinks(ctaText, ctaLocation, clickURL);
      }
    });

    imageElement.forEach((imageItem) => {
      imageItem?.addEventListener("click", (e) => {
        e.preventDefault();
        this.imageClickHandler(e.target, isLoggedIn);
      });
    });

    scrollContainer.addEventListener("scroll", () => {
      this.updateArrows(this.selector);
    });

    window.addEventListener("resize", () => {
      this.updateArrows(this.selector);
    });

    leftBtn.addEventListener("click", () => {
      scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      scrollContainer.scrollTo({
        left: scrollContainer.scrollWidth,
        behavior: "smooth"
      });
    });
  }

  ctaPdfLinks(clickURL) {
    const documentName = decodeURIComponent(
      clickURL
        .split("/")
        .pop()
        .replace(/\.pdf$/, "")
    );
    analyticsUtils.trackDocumentDetailsClick({
      documentName
    });
  }

  ctaRedirectLinks(ctaText, ctaLocation, clickURL) {
    analyticsUtils.trackCTAClicksVida2(
      { ctaText, ctaLocation, clickURL },
      "ctaButtonClick"
    );
  }

  getUserInfo(element) {
    const userInfo = Cookies.get(CONSTANT.COOKIE_ACCESSORIES_DATA);
    const href = element.closest("a").href;
    const servletPath = appUtils.getAPIUrl("eshopRedirectionAPIUrl");
    const redirectionURL =
      servletPath + "?encypVal=" + userInfo + "&redirectUrl=" + href;
    API.getData(redirectionURL)
      .then((response) => {
        window.open(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  imageClickHandler(element, isLogin) {
    const selectedProduct = element.closest(
      ".accessories-merchandise__details__item"
    );
    const priceHref = selectedProduct
      ?.querySelector(".view-price-link")
      ?.getAttribute("href");
    if (isLogin) {
      const userInfo = Cookies.get(CONSTANT.COOKIE_ACCESSORIES_DATA);
      const servletPath = appUtils.getAPIUrl("eshopRedirectionAPIUrl");
      const redirectionURL =
        servletPath + "?encypVal=" + userInfo + "&redirectUrl=" + priceHref;
      API.getData(redirectionURL)
        .then((response) => {
          window.open(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      window.open(priceHref);
    }
  }

  updateArrows(element) {
    element.leftBtn.style.display =
      element.scrollableElement.scrollLeft > 0 ? "block" : "none";
    element.rightBtn.style.display =
      element.scrollableElement.scrollLeft +
        element.scrollableElement.clientWidth <
      element.scrollableElement.scrollWidth
        ? "block"
        : "none";
  }

  static init(el) {
    return new AccessoriesMerchandise(el);
  }
}
export default AccessoriesMerchandise;
