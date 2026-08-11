import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// How far below the top of the viewport the pinned stage sticks.
const PHONE_ACCENT_OFFSET = 80;
const PHONE_CARDS_OFFSET = 140;
const TABLET_PIN_OFFSET = 40;
// Shortest a card stage may get, so the stack still reads on very low viewports.
const MIN_STEP = 320;
const MIN_CARDS_HEIGHT = 280;

const initFeaturesStatsAnim = () => {
  const section = document.querySelector('.features-stats');
  if (!section) return;

  const innerCardsWrap = section.querySelector('.features-stats__cards');
  const cards = gsap.utils.toArray(section.querySelectorAll('.features-stats-card'));
  if (!cards.length) return;

  const side = section.querySelector('.features-stats__side');
  const accent = section.querySelector('.features-stats__accent');

  const mm = gsap.matchMedia();

  // Desktop (> 1024px): Slide from right to left.
  // The boundary matches the `tablet` SCSS mixin ($sm: 1024px → max-width: 1024px),
  // which lays the cards out absolutely stacked — at exactly 1024px this branch
  // used to run instead, leaving all three cards piled on top of each other.
  mm.add('(min-width: 1025px)', () => {
    const context = gsap.context(() => {
      gsap.set(cards, {
        x: 100,
        opacity: 0,
        filter: 'blur(8px)',
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.to(cards, {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.8,
            ease: 'power2.out',
            stagger: {
              each: 0.15,
              from: 'start',
            },
            clearProps: 'filter,transform',
          });
        },
        once: true,
      });
    }, section);

    return () => context.revert();
  });

  // Shared by both stacking branches below: every card but the first waits below
  // the wrap, then slides up over its predecessor.
  const setStackInitialState = () => {
    cards.forEach((card, index) => {
      gsap.set(card, {
        zIndex: index + 1,
        transformOrigin: 'center top',
        yPercent: index === 0 ? 0 : 110,
        scale: 1,
        opacity: 1,
        autoAlpha: index === 0 ? 1 : 0,
        force3D: true,
      });
    });
  };

  const buildStackSequence = (timeline) => {
    for (let index = 1; index < cards.length; index += 1) {
      const previousCard = cards[index - 1];
      const currentCard = cards[index];
      const position = index - 1;

      timeline
        .set(currentCard, { autoAlpha: 1 }, position)
        .to(currentCard, { yPercent: 0 }, position)
        .to(
          previousCard,
          {
            scale: 0.96,
            opacity: 0,
            ease: 'none',
          },
          position,
        );
    }
  };

  // Phone (<= 767px): the cards wrap is pinned on its own and only the accent
  // line sticks above it.
  mm.add('(max-width: 767px)', () => {
    const context = gsap.context(() => {
      if (!innerCardsWrap || cards.length < 2) return;

      setStackInitialState();

      const step = Math.max(window.innerHeight * 0.9, 500);
      const totalDistance = (cards.length - 1) * step;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: `stats-stack-stage`,
          trigger: innerCardsWrap,
          start: `top top+=${PHONE_CARDS_OFFSET}`, // keeps the sticky accent title visible
          end: `+=${totalDistance}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none', duration: 1 },
      });

      buildStackSequence(tl);

      if (accent) {
        ScrollTrigger.create({
          id: `stats-stack-accent`,
          // Trigger off the accent itself so it sticks exactly 80px from the
          // top (not wherever it happens to sit when the cards wrap hits its
          // own start). Runs for the same distance as the cards stage.
          trigger: accent,
          start: `top top+=${PHONE_ACCENT_OFFSET}`,
          end: `+=${totalDistance}`,
          pin: accent,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }
    }, section);

    return () => context.revert();
  });

  // Tablet (768–1024px): the whole section is pinned as one piece, so all of
  // `__side` stops together with the cards and the copy can never be overlapped
  // by a card travelling past it. Pinning the two separately left the accent
  // only 60px of room (80px sticky offset vs the cards' 140px), which a
  // paragraph that wraps onto two lines does not fit into.
  mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
    const context = gsap.context(() => {
      if (!innerCardsWrap || cards.length < 2) return;

      setStackInitialState();

      // A shorter stage per card than on the phone, so the sequence finishes
      // earlier in the scroll.
      const step = Math.max(window.innerHeight * 0.55, MIN_STEP);
      const totalDistance = (cards.length - 1) * step;

      // The whole pinned section has to fit the viewport, so the cards wrap gets
      // whatever height is left under the copy instead of the phone's 117vw.
      // Measured on every refresh — the copy reflows with the viewport width.
      const fitCardsToViewport = () => {
        const rowGap = parseFloat(window.getComputedStyle(section).rowGap) || 0;
        const sideHeight = side ? side.offsetHeight : 0;
        const available = window.innerHeight - TABLET_PIN_OFFSET * 2 - sideHeight - rowGap;

        section.style.setProperty(
          '--stats-cards-h',
          `${Math.round(Math.max(available, MIN_CARDS_HEIGHT))}px`,
        );
      };

      fitCardsToViewport();
      ScrollTrigger.addEventListener('refreshInit', fitCardsToViewport);

      const tl = gsap.timeline({
        scrollTrigger: {
          id: `stats-stack-stage`,
          trigger: section,
          start: `top top+=${TABLET_PIN_OFFSET}`,
          end: `+=${totalDistance}`,
          scrub: 1,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none', duration: 1 },
      });

      buildStackSequence(tl);

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', fitCardsToViewport);
        section.style.removeProperty('--stats-cards-h');
      };
    }, section);

    return () => context.revert();
  });
};

initFeaturesStatsAnim();
