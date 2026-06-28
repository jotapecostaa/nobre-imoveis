document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP animations and ScrollTriggers
  const animations = initAnimations();
  
  // Bind the scroll event handler to the Lenis ticker hook
  window.onLenisScroll = (scrollY) => {
    animations.onScroll(scrollY);
  };
});
