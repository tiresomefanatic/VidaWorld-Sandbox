import breakpoints from "../media-breakpoints";

const getFontSizes = (inputValue, isDesktop) => {
  let fontSize = "72px";
  let fontSizeSubHeader = "48px";
  const isLargeDesktop = window.matchMedia(
    breakpoints.mediaExpression["desktop-md"]
  ).matches;

  if (inputValue.length <= 6) {
    fontSize = isDesktop ? "4.5rem" : "3rem";
    fontSizeSubHeader = isLargeDesktop ? "2.5rem" : "2rem";
  } else if (inputValue.length <= 12) {
    fontSize = isDesktop ? "3rem" : "2rem";
    fontSizeSubHeader = isLargeDesktop ? "2rem" : "1.5rem";
  } else {
    fontSize = "1.5rem";
    fontSizeSubHeader = "1rem";
  }

  return { fontSize, fontSizeSubHeader };
};

export default getFontSizes;
