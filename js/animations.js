// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

function initAnimations() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. HEADER / NAV SCROLL STATES ──
  const mainNav = document.getElementById('main-nav');
  let lastScrollY = 0;

  // Triggered on scroll by smooth-scroll Lenis sync
  function updateNavState(scrollY) {
    // 80px scrolled styling
    if (scrollY > 80) {
      mainNav.classList.add('c-nav--scrolled');
    } else {
      mainNav.classList.remove('c-nav--scrolled');
    }

    // Show/Hide header on scroll down/up
    if (scrollY > 150) {
      if (scrollY > lastScrollY) {
        // Scrolling down
        mainNav.classList.add('c-header--hidden');
        mainNav.classList.remove('c-header--revealed');
      } else {
        // Scrolling up
        mainNav.classList.add('c-header--revealed');
        mainNav.classList.remove('c-header--hidden');
      }
    } else {
      mainNav.classList.remove('c-header--hidden');
      mainNav.classList.remove('c-header--revealed');
    }

    lastScrollY = scrollY;
  }

  // ── 2. MEGA MENU (Desktop Only) ──
  const megaMenuTrigger = document.getElementById('nav-link-imoveis');
  const megaMenuPanel = document.getElementById('mega-menu-panel');
  const megaMenuBackdrop = document.getElementById('megamenu-backdrop');
  let megaMenuTimeline = null;
  let isMegaMenuOpen = false;

  if (megaMenuTrigger && megaMenuPanel && megaMenuBackdrop) {
    const isDesktop = () => window.innerWidth > 768;
    const megaMenuLi = megaMenuTrigger.closest('.c-nav__link-item--has-menu');
    let closeTimeout = null;

    function cancelClose() {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
    }

    function openMegaMenu() {
      if (!isDesktop()) return;
      cancelClose();
      if (isMegaMenuOpen) return;
      isMegaMenuOpen = true;

      if (megaMenuTimeline) megaMenuTimeline.kill();

      megaMenuPanel.style.display = 'block';
      megaMenuPanel.setAttribute('aria-hidden', 'false');
      megaMenuBackdrop.classList.add('is-active');

      megaMenuTimeline = gsap.timeline();
      megaMenuTimeline.fromTo(megaMenuPanel, 
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }

    function closeMegaMenu() {
      if (!isMegaMenuOpen) return;
      isMegaMenuOpen = false;

      if (megaMenuTimeline) megaMenuTimeline.kill();

      megaMenuBackdrop.classList.remove('is-active');
      megaMenuPanel.setAttribute('aria-hidden', 'true');

      megaMenuTimeline = gsap.timeline({
        onComplete: () => {
          if (!isMegaMenuOpen) megaMenuPanel.style.display = 'none';
        }
      });
      megaMenuTimeline.fromTo(megaMenuPanel,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -8, duration: 0.25, ease: 'power2.in' }
      );
    }

    function scheduleClose() {
      cancelClose();
      closeTimeout = setTimeout(closeMegaMenu, 120);
    }

    // Hover on the parent <li> opens the menu
    if (megaMenuLi) {
      megaMenuLi.addEventListener('mouseenter', openMegaMenu);
      megaMenuLi.addEventListener('mouseleave', scheduleClose);
    }

    // Keep menu open while hovering the panel itself
    megaMenuPanel.addEventListener('mouseenter', cancelClose);
    megaMenuPanel.addEventListener('mouseleave', scheduleClose);
    
    // Close menu when cursor moves to logo or non-dropdown nav links
    const logoEl = document.querySelector('.c-nav__logo');
    if (logoEl) logoEl.addEventListener('mouseenter', closeMegaMenu);

    document.querySelectorAll('.c-nav__links > li > a').forEach(link => {
      if (link !== megaMenuTrigger) {
        link.addEventListener('mouseenter', closeMegaMenu);
      }
    });

    megaMenuBackdrop.addEventListener('click', closeMegaMenu);
  }

  // ── 3. MOBILE MENU (Below 768px) ──
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.c-mobile-menu__link');
  let isMobileMenuOpen = false;

  if (hamburgerBtn && mobileMenu) {
    function toggleMobileMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;
      hamburgerBtn.setAttribute('aria-expanded', String(isMobileMenuOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isMobileMenuOpen));

      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
        mobileMenu.style.display = 'flex';
        
        gsap.killTweensOf([mobileMenu, mobileLinks]);
        
        const tl = gsap.timeline();
        tl.fromTo(mobileMenu,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
        
        if (!isReducedMotion) {
          tl.fromTo(mobileLinks,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
            '-=0.2'
          );
        } else {
          tl.set(mobileLinks, { y: 0, opacity: 1 });
        }
      } else {
        document.body.style.overflow = '';
        gsap.killTweensOf([mobileMenu, mobileLinks]);
        gsap.to(mobileMenu, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            if (!isMobileMenuOpen) mobileMenu.style.display = 'none';
          }
        });
      }
    }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Auto-close on link selection
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMobileMenuOpen) toggleMobileMenu();
      });
    });

    // Close on Escape keyboard trigger
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        toggleMobileMenu();
      }
    });
  }

  // ── 4. HERO ENTRANCE ANIMATION ──
  const heroEyebrow = document.getElementById('hero-eyebrow');
  const heroHeadline = document.getElementById('hero-headline');
  const heroSubline = document.getElementById('hero-subline');
  const heroActions = document.getElementById('hero-actions');
  const heroScroll = document.getElementById('hero-scroll');

  if (heroHeadline) {
    if (!isReducedMotion) {
      const splitText = new SplitText(heroHeadline, { type: 'words,lines', linesClass: 'line' });
      const words = splitText.words;

      const entryTimeline = gsap.timeline({ delay: 0.2 });

      entryTimeline.fromTo(heroEyebrow,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      entryTimeline.fromTo(words,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' },
        '-=0.4'
      );

      entryTimeline.fromTo(heroSubline,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      );

      entryTimeline.fromTo(heroActions,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );

      entryTimeline.fromTo(heroScroll,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );
    } else {
      gsap.set([heroEyebrow, heroHeadline, heroSubline, heroActions], { opacity: 1, y: 0 });
      gsap.set(heroScroll, { opacity: 0.6 });
    }
  }

  // ── 5. SCROLL PARALLAX ──
  if (!isReducedMotion) {
    const heroContent = document.getElementById('hero-content');
    const heroVideo = document.getElementById('hero-video');

    if (heroContent) {
      gsap.to(heroContent, {
        yPercent: -20,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom 40%',
          scrub: true
        }
      });
    }

    if (heroVideo) {
      gsap.to(heroVideo, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  } else {
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) gsap.set(heroVideo, { scale: 1 });
  }

  // ── 6. HORIZONTAL SCROLL — FEATURED PROPERTIES ──
  const hscrollSection = document.querySelector('.c-hscroll');
  const hscrollTrack = document.getElementById('hscroll-track');
  const hscrollCounter = document.getElementById('hscroll-current');
  const hscrollProgress = document.getElementById('hscroll-progress');

  if (hscrollSection && hscrollTrack && !isReducedMotion) {
    // ponytail: only init on desktop
    const mmHscroll = gsap.matchMedia();

    mmHscroll.add('(min-width: 769px)', () => {
      const cards = hscrollTrack.querySelectorAll('.c-hscroll-card');
      const totalCards = cards.length;

      // Calculate how far we need to scroll horizontally
      function getScrollDistance() {
        const trackWidth = hscrollTrack.scrollWidth;
        const introWidth = document.querySelector('.c-hscroll__intro').offsetWidth;
        return trackWidth - (window.innerWidth - introWidth);
      }

      const scrollTween = gsap.to(hscrollTrack, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: hscrollSection,
          pin: true,
          anticipatePin: 1,
          scrub: 1.2,
          start: 'top top',
          end: () => '+=' + getScrollDistance(),
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // Update progress bar
            if (hscrollProgress) {
              hscrollProgress.style.width = (progress * 100) + '%';
            }

            // Update counter: 01–05
            if (hscrollCounter) {
              const currentCard = Math.min(
                totalCards,
                Math.floor(progress * totalCards) + 1
              );
              hscrollCounter.textContent = String(currentCard).padStart(2, '0');
            }
          }
        }
      });

      // Cards entrance: opacity 0.4→1, x: 40→0 as each enters viewport
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0.4, x: 40 },
          {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left 85%',
              end: 'left 50%',
              scrub: true
            }
          }
        );
      });

      // Return cleanup for matchMedia
      return () => {
        // GSAP matchMedia handles cleanup automatically
      };
    });
  }

  // ── 7. BRAND STATEMENT ANIMATIONS ──
  const brandSection = document.querySelector('.c-brand-statement');
  const brandQuote = document.getElementById('brand-quote');
  const brandSubtext = document.getElementById('brand-subtext');

  if (brandSection && brandQuote && !isReducedMotion) {
    // Transition clip-path reveal coordinated with horizontal-scroll trigger exits
    // Pinned exit phase: clip-path inset(100% 0 0 0) -> inset(0 0 0 0)
    gsap.fromTo(brandSection,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: {
          trigger: hscrollSection,
          start: 'bottom 100%',
          end: 'bottom 90%',
          scrub: true
        }
      }
    );

    // Split text into words
    const splitQuote = new SplitText(brandQuote, { type: 'words', wordsClass: 'word' });
    const words = splitQuote.words;

    // Word by word scroll-driven reveal (scrub: 2)
    const quoteTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: brandSection,
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 2
      }
    });

    quoteTimeline.to(words, {
      opacity: 1,
      stagger: 0.1,
      ease: 'power1.out'
    });

    // Subtext fades in once when the quote is completed
    gsap.fromTo(brandSubtext,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: brandSection,
          start: 'top 30%',
          toggleActions: 'play none none none'
        }
      }
    );
  } else if (brandSection && isReducedMotion) {
    // Direct fallbacks for reduced-motion users
    gsap.set(brandSection, { clipPath: 'inset(0% 0% 0% 0%)' });
    const splitQuote = new SplitText(brandQuote, { type: 'words', wordsClass: 'word' });
    gsap.set(splitQuote.words, { opacity: 1 });
    gsap.set(brandSubtext, { opacity: 1, y: 0 });
  }

  // ── 8. ABOUT SECTION ANIMATIONS ──
  const aboutSection = document.querySelector('.c-about');
  const aboutText = document.querySelector('.c-about__text');
  const aboutVisual = document.querySelector('.c-about__visual');
  const aboutImg = document.querySelector('.c-about__img');

  if (aboutSection && !isReducedMotion) {
    // Left column staggers
    gsap.to(aboutText, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 80%',
        once: true
      }
    });

    // Right column visual entry
    if (aboutVisual) {
      gsap.to(aboutVisual, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 80%',
          once: true
        }
      });
    }

    // Parallax scroll on image (yPercent: 0 -> -10)
    if (aboutImg) {
      gsap.to(aboutImg, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Ken burns subtle scale
      gsap.to(aboutImg, {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Numbers counters anim
    const counterItems = document.querySelectorAll('.c-about__counter-item');
    counterItems.forEach(item => {
      const targetVal = parseFloat(item.getAttribute('data-target'));
      const numSpan = item.querySelector('.c-about__counter-num');
      
      const counterObj = { val: 0 };
      
      gsap.to(counterObj, {
        val: targetVal,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          once: true
        },
        onUpdate: () => {
          // Format decimals if needed (for R$ 2B+)
          if (targetVal % 1 !== 0) {
            numSpan.textContent = counterObj.val.toFixed(0);
          } else {
            numSpan.textContent = Math.floor(counterObj.val);
          }
        }
      });
    });

  } else if (aboutSection && isReducedMotion) {
    // Reduced motion fallbacks
    gsap.set([aboutText, aboutVisual], { opacity: 1, x: 0 });
    if (aboutImg) gsap.set(aboutImg, { scale: 1, yPercent: 0 });
    const counterItems = document.querySelectorAll('.c-about__counter-item');
    counterItems.forEach(item => {
      const numSpan = item.querySelector('.c-about__counter-num');
      numSpan.textContent = item.getAttribute('data-target');
    });
  }

  // ── 9. HOW IT WORKS ANIMATIONS ──
  const howSection = document.querySelector('.c-how');
  const howHeader = document.querySelector('.c-how__header');
  const howSteps = document.querySelectorAll('.c-how__step');
  const howSvgPath = document.getElementById('how-svg-path');

  if (howSection && !isReducedMotion) {
    // Header entry
    gsap.to(howHeader, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: howSection,
        start: 'top 82%',
        once: true
      }
    });

    // Steps staggered entry
    gsap.to(howSteps, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: howSection,
        start: 'top 82%',
        once: true
      }
    });

    // SVG Connecting Line dashoffset scrub drawing
    if (howSvgPath) {
      // Get length
      const pathLength = howSvgPath.getTotalLength();
      // Set properties
      gsap.set(howSvgPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      gsap.to(howSvgPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.c-how__steps-wrapper',
          start: 'top 70%',
          end: 'top 30%',
          scrub: true
        }
      });
    }
  } else if (howSection && isReducedMotion) {
    // Fallback
    gsap.set([howHeader, ...howSteps], { opacity: 1, y: 0 });
    if (howSvgPath) gsap.set(howSvgPath, { strokeDashoffset: 0 });
  }

  return {
    onScroll: updateNavState
  };
}
