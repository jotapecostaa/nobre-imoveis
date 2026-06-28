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

  return {
    onScroll: updateNavState
  };
}
