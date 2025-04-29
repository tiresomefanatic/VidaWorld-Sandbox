import { useState, useEffect, useRef } from "react";

export function useIntersectionObserver(eleVisiblePercentage = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(false);
  const ref = useRef(null);
  // const viewportHeight = window.innerHeight;
  // const visiblePixels = 100 / viewportHeight; // 300 is pixel after which the element is visible

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting || isAtTop);
      },
      { threshold: eleVisiblePercentage }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isAtTop]);

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) {
        return;
      }

      const { top } = ref.current.getBoundingClientRect();
      const atTop = top <= 0;
      setIsAtTop(atTop);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { ref, isVisible };
}
