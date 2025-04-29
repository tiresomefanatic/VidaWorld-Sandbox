class AboutUsDetails {
  constructor(el) {
    this.el = el;
    const content = this.el.querySelector(
      ".vida-aboutus-details__container__content"
    );
    const readButton = this.el.querySelector(
      ".vida-aboutus-details__container__read__hidden"
    );
    try {
      const handleRead = () => {
        if (window.innerWidth <= 768) {
          readButton.style.display = "block";
          content.style.height = "194px";
          readButton.textContent = "Read More";
        } else {
          readButton.style.display = "none";
          content.style.height = "auto";
        }
      };
      handleRead();
      window.addEventListener("resize", handleRead);
      readButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (readButton.textContent === "Read More") {
          content.style.height = "auto";
          readButton.textContent = "Show Less";
        } else {
          handleRead();
          readButton.textContent = "Read More";
        }
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  static init(el) {
    return new AboutUsDetails(el);
  }
}

export default AboutUsDetails;
