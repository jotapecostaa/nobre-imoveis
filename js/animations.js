// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

function initAnimations() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. HEADER / NAV SCROLL STATES ──
  const mainNav = document.getElementById('main-nav');
  let lastScrollY = 0;

  function updateNavState(scrollY) {
    if (scrollY > 80) {
      mainNav.classList.add('c-nav--scrolled');
    } else {
      mainNav.classList.remove('c-nav--scrolled');
    }

    if (scrollY > 150) {
      if (scrollY > lastScrollY) {
        mainNav.classList.add('c-header--hidden');
        mainNav.classList.remove('c-header--revealed');
      } else {
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

    if (megaMenuLi) {
      megaMenuLi.addEventListener('mouseenter', openMegaMenu);
      megaMenuLi.addEventListener('mouseleave', scheduleClose);
    }

    megaMenuPanel.addEventListener('mouseenter', cancelClose);
    megaMenuPanel.addEventListener('mouseleave', scheduleClose);
    
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

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMobileMenuOpen) toggleMobileMenu();
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        toggleMobileMenu();
      }
    });
  }

  // ── WHATSAPP BUTTON ANIMATION ──
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn && !isReducedMotion) {
    gsap.fromTo(whatsappBtn, 
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 2.5,
        onComplete: () => {
          gsap.to(whatsappBtn, {
            boxShadow: '0 12px 40px rgba(37,211,102,0.5)',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      }
    );
  } else if (whatsappBtn) {
    gsap.set(whatsappBtn, { autoAlpha: 1, y: 0 });
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
    const mmHscroll = gsap.matchMedia();

    mmHscroll.add('(min-width: 769px)', () => {
      const cards = hscrollTrack.querySelectorAll('.c-hscroll-card');
      const totalCards = cards.length;

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

            if (hscrollProgress) {
              hscrollProgress.style.width = (progress * 100) + '%';
            }

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

      cards.forEach((card) => {
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

      return () => {};
    });
  }

  // ── 7. BRAND STATEMENT ANIMATIONS ──
  const brandSection = document.querySelector('.c-brand-statement');
  const brandQuote = document.getElementById('brand-quote');
  const brandSubtext = document.getElementById('brand-subtext');

  if (brandSection && brandQuote && !isReducedMotion) {
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

    const splitQuote = new SplitText(brandQuote, { type: 'words', wordsClass: 'word' });
    const words = splitQuote.words;

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
    gsap.set(brandSection, { clipPath: 'inset(0% 0% 0% 0%)' });
    const splitQuote = new SplitText(brandQuote, { type: 'words', wordsClass: 'word' });
    gsap.set(splitQuote.words, { opacity: 1 });
    gsap.set(brandSubtext, { opacity: 1, y: 0 });
  }

  // ── SECTION TRANSITION: SOBRE ──
  const aboutSection = document.querySelector('.c-about');
  const aboutInner = document.querySelector('.c-about__inner');
  if (aboutSection && aboutInner && !isReducedMotion) {
    gsap.fromTo(aboutInner, 
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 90%',
          end: 'top 20%',
          scrub: 1
        }
      }
    );
  }

  // ── 8. ABOUT SECTION ANIMATIONS (UPGRADED) ──
  const aboutEyebrow = document.querySelector('.c-about__eyebrow');
  const aboutHeadline = document.querySelector('.c-about__headline');
  const aboutBody = document.querySelectorAll('.c-about__body');
  const aboutImageFrame = document.querySelector('.c-about__image-frame');

  if (aboutSection && !isReducedMotion) {
    const aboutSplit = new SplitText([aboutEyebrow, aboutHeadline], { type: 'words', wordsClass: 'word' });
    gsap.fromTo(aboutSplit.words,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 75%',
          once: true
        }
      }
    );

    gsap.fromTo(aboutBody,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 75%',
          once: true
        }
      }
    );

    if (aboutImageFrame) {
      gsap.fromTo(aboutImageFrame,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 75%',
            once: true
          }
        }
      );
    }

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
          if (targetVal % 1 !== 0) {
            numSpan.textContent = counterObj.val.toFixed(0);
          } else {
            numSpan.textContent = Math.floor(counterObj.val);
          }
        }
      });
    });
  } else if (aboutSection && isReducedMotion) {
    gsap.set(aboutInner, { clipPath: 'inset(0% 0% 0% 0%)' });
    gsap.set([aboutEyebrow, aboutHeadline, aboutBody, aboutImageFrame], { opacity: 1, x: 0, y: 0 });
    const counterItems = document.querySelectorAll('.c-about__counter-item');
    counterItems.forEach(item => {
      const numSpan = item.querySelector('.c-about__counter-num');
      numSpan.textContent = item.getAttribute('data-target');
    });
  }

  // ── SECTION TRANSITION: PROCESSO ──
  const howSection = document.querySelector('.c-how');
  const howInner = document.querySelector('.c-how__inner');
  
  if (howSection && howInner && !isReducedMotion) {
    gsap.fromTo(aboutSection,
      { scale: 1, opacity: 1 },
      {
        scale: 0.97, opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: howSection,
          start: 'top 85%',
          end: 'top top',
          scrub: 1
        }
      }
    );
    gsap.fromTo(howInner,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: howSection,
          start: 'top 85%',
          end: 'top top',
          scrub: 1
        }
      }
    );
  }

  // ── 9. HOW IT WORKS ANIMATIONS (UPGRADED) ──
  const howSteps = document.querySelectorAll('.c-how__step');
  const howIcons = document.querySelectorAll('.c-how__icon-container');
  const howSvgPath = document.getElementById('how-svg-path');

  if (howSection && !isReducedMotion) {
    gsap.fromTo(howSteps,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.18,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: howSection,
          start: 'top 78%',
          once: true
        }
      }
    );

    gsap.fromTo(howIcons,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.18,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: howSection,
          start: 'top 78%',
          once: true
        }
      }
    );

    if (howSvgPath) {
      const pathLength = howSvgPath.getTotalLength();
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
    gsap.set(howInner, { y: 0, opacity: 1 });
    gsap.set([howSteps, howIcons], { opacity: 1, y: 0, scale: 1 });
    if (howSvgPath) gsap.set(howSvgPath, { strokeDashoffset: 0 });
  }

  // ── SECTION TRANSITION: DEPOIMENTOS ──
  const testSection = document.querySelector('.c-testimonials');
  const testInner = document.querySelector('.c-testimonials__inner');
  
  // Removed scrubbed opacity/clip-path for testimonials section because it conflicted 
  // with inner elements triggering independently, causing it to appear broken and slow.

  // ── 10. TESTIMONIALS ANIMATIONS (UPGRADED) ──
  const testEyebrow = document.querySelector('.c-testimonials__eyebrow');
  const testItems = document.querySelectorAll('.c-testimonials__item');

  if (testSection && !isReducedMotion) {
    gsap.to(testEyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: testSection,
        start: 'top 75%',
        once: true
      }
    });

    testItems.forEach((item, index) => {
      const quoteMark = item.querySelector('.c-testimonials__quote-mark');
      const decNumber = item.querySelector('.c-testimonials__right');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true
        }
      });

      tl.fromTo(item,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', clearProps: 'willChange' }
      );

      if (quoteMark) {
        tl.fromTo(quoteMark,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', clearProps: 'willChange' },
          '-=0.7'
        );
      }

      if (decNumber) {
        tl.fromTo(decNumber,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 0.05, duration: 0.8, ease: 'power3.out', clearProps: 'willChange' },
          '-=0.7'
        );
      }
    });
  } else if (testSection && isReducedMotion) {
    gsap.set([testEyebrow, ...testItems], { opacity: 1, y: 0 });
    testItems.forEach(item => {
      const q = item.querySelector('.c-testimonials__quote-mark');
      const n = item.querySelector('.c-testimonials__right');
      if (q) gsap.set(q, { opacity: 1, scale: 1 });
      if (n) gsap.set(n, { opacity: 0.05, x: 0 });
    });
  }

  // ── 11. LOCATIONS GRID ANIMATIONS (UPGRADED) ──
  const locSection = document.querySelector('.c-locations');
  const locHeader = document.querySelector('.c-locations__header');
  const locCards = document.querySelectorAll('.c-locations-card');

  if (locSection && !isReducedMotion) {
    gsap.to(locHeader, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: locSection,
        start: 'top 82%',
        once: true
      }
    });

    locCards.forEach((card, index) => {
      gsap.fromTo(card,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.08,
          scrollTrigger: {
            trigger: '.c-locations__grid',
            start: 'top 80%',
            once: true
          },
          onComplete: () => {
            gsap.set(card, { clearProps: 'clipPath' });
          }
        }
      );
    });

    const mmLoc = gsap.matchMedia();
    mmLoc.add('(min-width: 769px)', () => {
      locCards.forEach(card => {
        const bgImg = card.querySelector('.c-locations-card__bg');
        const speed = parseFloat(card.getAttribute('data-speed')) || -5;
        
        if (bgImg) {
          gsap.to(bgImg, {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      });
    });
  } else if (locSection && isReducedMotion) {
    gsap.set([locHeader, ...locCards], { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' });
    locCards.forEach(card => {
      const img = card.querySelector('.c-locations-card__bg');
      if (img) gsap.set(img, { yPercent: 0 });
    });
  }

  // ── 12. CTA FINAL ANIMATIONS ──
  const ctaSection = document.querySelector('.c-cta-final');
  const ctaBgLetter = document.querySelector('.c-cta-final__bg-letter');
  const ctaHeadline = document.getElementById('cta-headline');
  const ctaSubtext = document.getElementById('cta-subtext');
  const ctaButton = document.getElementById('cta-button');
  const ctaEmail = document.getElementById('cta-email');

  if (ctaSection && !isReducedMotion) {
    gsap.fromTo(ctaSection,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: {
          trigger: ctaSection,
          start: 'top bottom',
          end: 'top top',
          scrub: 1
        }
      }
    );

    const splitCta = new SplitText(ctaHeadline, { type: 'words', wordsClass: 'word' });
    const ctaWords = splitCta.words;

    ScrollTrigger.create({
      trigger: ctaSection,
      start: 'top 40%',
      once: true,
      onEnter: () => {
        gsap.to(ctaWords, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out',
          clearProps: 'willChange'
        });

        gsap.to(ctaSubtext, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: 0.6,
          clearProps: 'willChange'
        });

        gsap.to(ctaButton, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.8,
          clearProps: 'willChange',
          onComplete: () => {
            gsap.to(ctaButton, {
              scale: 1.02,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        });

        gsap.to(ctaEmail, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 1.0,
          clearProps: 'willChange'
        });

        if (ctaBgLetter) {
          gsap.to(ctaBgLetter, {
            opacity: 0.04,
            scale: 1,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.2,
            clearProps: 'willChange'
          });
        }
      }
    });
  } else if (ctaSection && isReducedMotion) {
    gsap.set(ctaSection, { clipPath: 'inset(0% 0% 0% 0%)' });
    if (ctaHeadline) {
      const splitCta = new SplitText(ctaHeadline, { type: 'words', wordsClass: 'word' });
      gsap.set(splitCta.words, { opacity: 1, y: 0 });
    }
    gsap.set([ctaSubtext, ctaButton, ctaEmail, ctaBgLetter], { opacity: 1, y: 0, scale: 1 });
  }

  // ── 13. FOOTER ANIMATIONS ──
  const footerSection = document.querySelector('.c-footer');
  const footerGrid = document.getElementById('footer-grid');
  const footerCols = document.querySelectorAll('.c-footer__col');
  const footerBottom = document.getElementById('footer-bottom');

  if (footerSection && !isReducedMotion) {
    // Top grid column staggers
    gsap.to(footerGrid, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: footerSection,
        start: 'top 92%',
        once: true
      }
    });

    gsap.to(footerCols, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: footerSection,
        start: 'top 90%',
        once: true
      }
    });

    // Bottom copyright row fade
    gsap.to(footerBottom, {
      opacity: 1,
      duration: 0.6,
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: footerSection,
        start: 'top 95%',
        once: true
      }
    });
  } else if (footerSection && isReducedMotion) {
    gsap.set([footerGrid, footerBottom], { opacity: 1, y: 0 });
    gsap.set(footerCols, { opacity: 1, y: 0 });
  }

  return {
    onScroll: updateNavState
  };
}
