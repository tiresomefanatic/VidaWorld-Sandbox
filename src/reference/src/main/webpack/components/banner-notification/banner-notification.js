import Logger from "../../services/logger.service";

class BannerNotification {
  constructor(el) {
    this.el = el;
    this.selector = {
      title: this.el.querySelector(".vida-banner-notification__title"),
      container: this.el.querySelector(".vida-banner-notification__container"),
      timer: this.el.querySelector(".vida-banner-notification__timer"),
      timerDayText: this.el.querySelector(
        ".vida-banner-notification__timer-day-text"
      ),
      timerHrsText: this.el.querySelector(
        ".vida-banner-notification__timer-hrs-text"
      ),
      timerMinsText: this.el.querySelector(
        ".vida-banner-notification__timer-mins-text"
      ),
      timerSecsText: this.el.querySelector(
        ".vida-banner-notification__timer-secs-text"
      )
    };

    this.dateTimeValue = this.selector?.timer?.dataset?.time;

    if (this.dateTimeValue) {
      try {
        this.initTimer();
      } catch (error) {
        Logger.error(error);
      }
    }
  }
  initTimer() {
    const self = this;
    const countDownDate = new Date(this.dateTimeValue).getTime();
    const countDownFunc = setInterval(function () {
      const now = new Date().getTime();
      const timeleft = countDownDate - now;
      // Calculating the days, hours, minutes and seconds left
      const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

      self.selector.timer.classList.remove(
        "vida-banner-notification__timer--hide"
      );

      self.selector.timerDayText.innerHTML =
        days > 0
          ? days.toString().split("").length > 1
            ? "<span>" +
              days.toString().split("")[0] +
              "</span><span>" +
              days.toString().split("")[1] +
              "</span>"
            : "<span>0</span><span>" + days.toString().split("")[0] + "</span>"
          : "<span>0</span><span>0</span>";
      self.selector.timerHrsText.innerHTML =
        hours > 0
          ? hours.toString().split("").length > 1
            ? "<span>" +
              hours.toString().split("")[0] +
              "</span><span>" +
              hours.toString().split("")[1] +
              "</span>"
            : "<span>0</span><span>" + hours.toString().split("")[0] + "</span>"
          : "<span>0</span><span>0</span>";
      self.selector.timerMinsText.innerHTML =
        minutes > 0
          ? minutes.toString().split("").length > 1
            ? "<span>" +
              minutes.toString().split("")[0] +
              "</span><span>" +
              minutes.toString().split("")[1] +
              "</span>"
            : "<span>0</span><span>" +
              minutes.toString().split("")[0] +
              "</span>"
          : "<span>0</span><span>0</span>";
      self.selector.timerSecsText.innerHTML =
        seconds > 0
          ? seconds.toString().split("").length > 1
            ? "<span>" +
              seconds.toString().split("")[0] +
              "</span><span>" +
              seconds.toString().split("")[1] +
              "</span>"
            : "<span>0</span><span>" +
              seconds.toString().split("")[0] +
              "</span>"
          : "<span>0</span><span>0</span>";
      // Display the message when countdown is over
      if (timeleft < 0) {
        clearInterval(countDownFunc);
        self.selector.timer.remove();
        self.selector.title.remove();
        self.selector.container.classList.add(
          "vida-banner-notification-container--active"
        );
      }
    }, 1000);
  }
  static init(el) {
    return new BannerNotification(el);
  }
}

export default BannerNotification;
