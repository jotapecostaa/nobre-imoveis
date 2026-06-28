// Initialize Lenis smooth scrolling and integrate with GSAP
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Sync ScrollTrigger and custom scroll updates with Lenis
lenis.on('scroll', (e) => {
  ScrollTrigger.update();
  if (typeof window.onLenisScroll === 'function') {
    window.onLenisScroll(e.scroll);
  }
});

// Link Lenis to GSAP's ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable lag smoothing to ensure smooth updates
gsap.ticker.lagSmoothing(0);
