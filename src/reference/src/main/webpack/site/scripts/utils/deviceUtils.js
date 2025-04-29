const deviceUtils = {
  detectDevice() {
    /* Storing user's device details in a variable*/
    const details = navigator.userAgent;

    /* Creating a regular expression containing some mobile devices keywords to search it in details string*/
    const regexp = /android|iphone|kindle|ipad/i;

    /* Using test() method to search regexp in details it returns boolean value*/
    const isMobileDevice = regexp.test(details);

    if (isMobileDevice) {
      return "Mobile Site";
    } else {
      return "Desktop Site";
    }
  },

  rotateDevice() {
    // Reloads the webpage if the device orientation changed.
    const portrait = window.matchMedia("(orientation: portrait)");
    portrait.addEventListener("change", function () {
      window.location.reload();
    });
  }
};

export default deviceUtils;
