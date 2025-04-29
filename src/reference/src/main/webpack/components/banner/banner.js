class Banner {
  constructor(el) {
    this.el = el;
    let lastScrollPosition = 0;
    let ticking = false;
    this.selector = {
      header: this.el.querySelector(".vida-banner__heading"),
      productImage: this.el.querySelector(".vida-banner__image")
    };

    document.addEventListener("scroll", () => {
      lastScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateBanner(lastScrollPosition);
          ticking = false;
        });

        ticking = true;
      }
    });
  }

  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  updateBanner(scrollPos) {
    const elemPos = this.getOffset(this.selector.productImage);
    if (scrollPos > elemPos.top / 1.25) {
      this.selector.header.classList.remove("vida-banner__heading--fixed");
    } else {
      this.selector.header.classList.add("vida-banner__heading--fixed");
    }
  }

  static init(el) {
    return new Banner(el);
  }
}

export default Banner;
