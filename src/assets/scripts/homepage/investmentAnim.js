import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const initInvestmentAnim = () => {
  const sec = document.querySelector('.investment');
  if (!sec) return;

  const bgImg = sec.querySelector('.investment__bg-img');
  if (bgImg) {
    // Scroll Parallax (slight y-axis shift as we scroll past)
    gsap.set(bgImg, { scale: 1.15, transformOrigin: 'center center' });

    gsap.fromTo(
      bgImg,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );

    // Mouse Move Parallax
    let xTo = gsap.quickTo(bgImg, 'x', { duration: 1, ease: 'power3.out' });
    let yTo = gsap.quickTo(bgImg, 'y', { duration: 1, ease: 'power3.out' });

    sec.addEventListener('mousemove', (e) => {
      const rect = sec.getBoundingClientRect();
      // Center coordinates
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Mouse position relative to center (-1 to 1)
      const moveX = (e.clientX - rect.left - centerX) / centerX;
      const moveY = (e.clientY - rect.top - centerY) / centerY;

      // Parallax image
      xTo(-moveX * 30);
      yTo(-moveY * 30);
    });

    sec.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  }

  // Logo split-reveal: pin the block, crack the image open, then grow the video to fill the screen
  const logo = sec.querySelector('.investment__shell-logo');
  const frame = logo?.querySelector('.investment__shell-logo-frame');
  const logoTop = logo?.querySelector('.investment__shell-logo-half--top');
  const logoBottom = logo?.querySelector('.investment__shell-logo-half--bottom');

  if (logo && frame && logoTop && logoBottom) {
    // Runs on every screen size. matchMedia is still used so GSAP cleanly
    // reverts (pin, inline styles, the reveal class) whenever the breakpoint
    // context is rebuilt on resize.
    const mm = gsap.matchMedia();

    // Real viewport height — the JS-computed `--app-height` (falls back to
    // window.innerHeight). Used instead of `100vh` because on mobile `100vh`
    // includes the address-bar strip, so the video grew taller than the screen
    // and spilled onto the next block.
    const appHeight = () =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-height')) ||
      window.innerHeight;

    mm.add('(min-width: 320px)', () => {
      // How it works: GSAP pins `logo` (so it's fixed to the viewport centre
      // for the whole effect). `frame` is absolutely centred inside it (see
      // SCSS), so growing its width/height to the full viewport keeps it
      // anchored on the strip's centre — which, being pinned at the viewport
      // centre, IS the viewport centre. The `investment--logo-reveal` class
      // opens up `overflow` on the strip so the growing frame isn't clipped,
      // and lifts it above the page. No `position: fixed`, no rect capture —
      // that's exactly what fought the pin and clipped / dropped the video.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: logo,
            start: 'center center',
            end: '+=200%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,

            // Add the reveal state on the way in, but DON'T strip it when we
            // leave forward — that instant `overflow: hidden` is what made the
            // fullscreen video snap shut. Left on, the video simply stays
            // fullscreen and scrolls away with the pin. Only a scroll back up
            // past the start resets it.
            onEnter: () => sec.classList.add('investment--logo-reveal'),
            onEnterBack: () => sec.classList.add('investment--logo-reveal'),
            onLeaveBack: () => sec.classList.remove('investment--logo-reveal'),
          },
        })

        .to(logoTop, { yPercent: -100, duration: 1, ease: 'power2.inOut' }, 0)
        .to(logoBottom, { yPercent: 100, duration: 1, ease: 'power2.inOut' }, 0)

        .to(
          frame,
          {
            width: () => window.innerWidth,
            height: () => appHeight(),
            duration: 1,
            ease: 'power2.inOut',
          },
          1,
        )

        .to({}, { duration: 2 });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // Runs when leaving the desktop breakpoint: matchMedia reverts the GSAP
      // tweens/pin automatically, but the class we toggled by hand isn't its
      // to clean up, so drop it here.
      return () => sec.classList.remove('investment--logo-reveal');
    });
  }

  // Cards cascade reveal on scroll
  const cardsWrap = sec.querySelector('.investment__proposals');
  const cards = gsap.utils.toArray(sec.querySelectorAll('.investment-proposal-card'));

  if (cardsWrap && cards.length) {
    gsap.fromTo(
      cards,
      {
        y: 80,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsWrap,
          start: 'top bottom-=150', // Trigger when container enters viewport
          once: true,
        },
      },
    );
  }
};

initInvestmentAnim();
