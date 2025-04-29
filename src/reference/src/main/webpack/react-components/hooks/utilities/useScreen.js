import React, { useEffect, useState } from "react";
import breakpoints from "../../../site/scripts/media-breakpoints";

const useScreen = () => {
  const [isDesktop, setDesktop] = useState(
    window.matchMedia(breakpoints.mediaExpression.desktop).matches
  );
  useEffect(() => {
    const resize = () => {
      setDesktop(
        window.matchMedia(breakpoints.mediaExpression.desktop).matches
      );
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return { isDesktop };
};

export default useScreen;
