import { gsap, Power1 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

class Animation {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  init() {
    document
      .querySelectorAll("[data-animation-wrapper='true']")
      .forEach((elemWrapper) => {
        if (elemWrapper.dataset["animationAuto"] !== "false") {
          this.registerAnimation(elemWrapper);
        }
      });
  }

  animate(container) {
    if (container) {
      this.registerAnimation(container);
    }
  }

  registerAnimation(elem) {
    gsap.utils.toArray("[data-animate='true']", elem).forEach((element) => {
      const animationName = element.dataset["animationName"];
      const animationScrollerStart =
        element.dataset["animationScrollerStart"] || "80%";
      const animationScale = element.dataset["animationScale"];
      const animationXvalue = element.dataset["animationXvalue"];
      const decimalValue = element.dataset["decimalValue"];
      const counterValue = element.dataset["counterValue"];
      gsap.set(element, {
        ...(animationName === "slide-right" ||
          (animationName === "slide-left" && {
            xPercent: 0,
            ease: Power1.easeIn
          })),
        ...(animationName === "fade-in" && {
          opacity: 1,
          ease: Power1.easeIn
        }),
        ...(animationName === "zoom-in-txt" && {
          scale: 1
        }),
        ...(animationName === "zoom-out-txt" && {
          scale: 1
        }),
        ...(animationName === "zoom-out-img" && {
          scale: 1
        })
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          toggleActions: "restart none none none",
          start: `"20px ${animationScrollerStart}"`
        },
        duration: element.dataset["animationDuration"] || 0.2,
        delay: element.dataset["animationDelay"] || 0
      });
      if (animationName === "counter") {
        tl.to(element, {
          innerText: counterValue,
          duration: 1,
          snap: {
            innerText: decimalValue ? parseFloat(decimalValue) : 1
          }
        });
      } else {
        tl.from(element, {
          ...(animationName === "slide-right" && {
            opacity: 0,
            xPercent: animationXvalue || -100
          }),
          ...(animationName === "slide-left" && {
            opacity: 0,
            xPercent: 100
          }),
          ...(animationName === "fade-in" && {
            opacity: 0
          }),
          ...(animationName === "zoom-in-txt" && {
            scale: 0
          }),
          ...(animationName === "zoom-out-txt" && {
            scale: animationScale || 1.4
          }),
          ...(animationName === "zoom-out-img" && {
            scale: animationScale || 1.4
          })
        });
      }
    });
  }
}

const animation = new Animation();

export default Object.freeze(animation);
