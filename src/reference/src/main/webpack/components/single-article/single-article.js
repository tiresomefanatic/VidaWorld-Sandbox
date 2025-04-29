class SingleArticle {
  constructor(el) {
    this.el = el;
    this.id = this.el
      .querySelector(".vida-single-article__image--zoomin")
      .getAttribute("data-image-id");
    this.zoomInButton = this.el.querySelector(
      ".vida-single-article__image--zoomin"
    );
    this.zoomOutButton = this.el.querySelector(
      ".vida-single-article__image--zoomout"
    );

    this.zoomInButton.addEventListener("click", () => {
      this.zoomIn();
    });
    this.zoomOutButton.addEventListener("click", () => {
      this.zoomOut();
    });
  }

  zoomIn() {
    var pic = document.querySelector(this.id);
    var width = pic.clientWidth;
    pic.style.width = width + 100 + "px";
  }

  zoomOut() {
    var pic = document.querySelector(this.id);
    var width = pic.clientWidth;
    pic.style.width = width - 100 + "px";
  }

  static init(el) {
    return new SingleArticle(el);
  }
}

export default SingleArticle;
