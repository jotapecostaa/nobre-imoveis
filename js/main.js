document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP animations and ScrollTriggers
  const animations = initAnimations();
  
  // Bind the scroll event handler to the Lenis ticker hook
  window.onLenisScroll = (scrollY) => {
    animations.onScroll(scrollY);
  };

  // ── CUSTOM CURSOR ──
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      gsap.set(cursorDot, { x: mouseX, y: mouseY });
      gsap.to(cursorRing, { x: mouseX, y: mouseY, duration: 0.45, ease: 'power2.out' });
    });

    window.addEventListener('mousedown', () => {
      gsap.to(cursorDot, { scale: 0.7, duration: 0.2 });
    });

    window.addEventListener('mouseup', () => {
      gsap.to(cursorDot, { scale: 1, duration: 0.2 });
    });

    const interactiveSelectors = 'a[href], button, .c-hscroll-card, .c-locations-card';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorRing, { width: 56, height: 56, borderColor: 'rgba(184, 92, 66, 1)', duration: 0.3 });
        gsap.to(cursorDot, { scale: 0, duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorRing, { width: 36, height: 36, borderColor: 'var(--color-terracotta)', duration: 0.3 });
        gsap.to(cursorDot, { scale: 1, duration: 0.2 });
      });
    });
  }
});
