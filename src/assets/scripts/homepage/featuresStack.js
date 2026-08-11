import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const initFeaturesStack = () => {
  const featuresShell = document.querySelector('.features__shell');
  if (!featuresShell) return;

  const stacks = featuresShell.querySelectorAll('.features-stack');
  if (!stacks.length) return;

  const mm = gsap.matchMedia();

  // Desktop (> 1024px). The boundary matches the `tablet` SCSS mixin
  // ($sm: 1024px → max-width: 1024px): at exactly 1024 the stylesheet already
  // hands out the tablet layout, so the desktop stage must not run there.
  mm.add('(min-width: 1025px)', () => {
    const context = gsap.context(() => {
      stacks.forEach((stack, stackIndex) => {
        const cardsWrap = stack.querySelector('.features-stack__cards');
        const cards = cardsWrap
          ? gsap.utils.toArray(cardsWrap.querySelectorAll('.features-card'))
          : [];

        if (!cardsWrap || cards.length < 2) return;

        const vh = window.innerHeight;

        // Last card has highest z-index — slides on top of all previous
        cards.forEach((card, index) => {
          gsap.set(card, {
            zIndex: index + 1,
            transformOrigin: 'center top',
          });
        });

        const totalDistance = (cards.length - 1) * vh + 300;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stack,
            start: 'top top+=80',
            end: `+=${totalDistance}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, index) => {
          if (index === 0) return;

          const prevCard = cards[index - 1];
          const at = index - 1;

          tl.to(card, { y: 0, duration: 1, ease: 'power2.inOut' }, at).to(
            prevCard,
            {
              scale: 0.95,
              opacity: 0.5,
              duration: 1,
              ease: 'power2.inOut',
            },
            at,
          );
        });

        tl.to({}, { duration: 0.4 });
      });
    }, featuresShell);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => context.revert();
  });

  // Mobile/tablet (<= 1024px): same idea as desktop, adapted for touch. Pin the
  // whole stack (so its title stays put) and float each card up from below to
  // land on top of the previous one. The initial offset is set here in JS
  // (not via the desktop-only CSS translateY) so the cards start stacked below
  // instead of piling on top of each other statically.
  mm.add('(max-width: 1024px)', () => {
    const context = gsap.context(() => {
      stacks.forEach((stack) => {
        const cardsWrap = stack.querySelector('.features-stack__cards');
        const cards = cardsWrap
          ? gsap.utils.toArray(cardsWrap.querySelectorAll('.features-card'))
          : [];

        if (!cardsWrap || cards.length < 2) return;

        cards.forEach((card, index) => {
          gsap.set(card, {
            zIndex: index + 1,
            transformOrigin: 'center top',
            yPercent: index === 0 ? 0 : 110,
            autoAlpha: index === 0 ? 1 : 0,
            force3D: true,
          });
        });

        const step = Math.max(window.innerHeight * 0.9, 500);
        const totalDistance = (cards.length - 2) * step;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stack,
            start: 'top top+=80',
            end: `+=${totalDistance}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'none', duration: 1 },
        });

        for (let index = 1; index < cards.length; index += 1) {
          const prevCard = cards[index - 1];
          const currentCard = cards[index];
          const position = index - 1;

          tl.set(currentCard, { autoAlpha: 1 }, position)
            .to(currentCard, { yPercent: 0 }, position)
            .to(prevCard, { scale: 0.96, opacity: 0.5, ease: 'none' }, position);
        }

        // Trailing hold, same as the desktop branch. Without it the last card
        // lands exactly on the pin's end, and `scrub: 1` means the playhead is
        // still catching up at that point — the stack unpins mid-move and the
        // next section rides over the card. The empty tween buys scroll distance
        // where the card just sits, landed, before the pin releases.
        tl.to({}, { duration: 0.4 });
      });
    }, featuresShell);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => context.revert();
  });

  // Phone + tablet (<= 1024px): the cards are `position: absolute` and sized by
  // their own content (`height: fit-content`), so they give the wrap no height of
  // its own. CSS falls back to a hardcoded `vw(440, 375)` — 440px on a 375 phone,
  // but 1201px at 1024 — and everything the card doesn't fill shows up as an
  // empty run under the stack. Measure the tallest card instead: the text length
  // differs per card and reflows with the width, so no fixed value can be right.
  //
  // Deliberately its own breakpoint rather than part of an animation branch, so
  // it covers the whole range the tablet CSS does, including 1024 exactly.
  mm.add('(max-width: 1024px)', () => {
    const wraps = Array.from(stacks)
      .map((stack) => stack.querySelector('.features-stack__cards'))
      .filter(Boolean);

    if (!wraps.length) return undefined;

    const fitWrapsToCards = () => {
      wraps.forEach((wrap) => {
        const cards = wrap.querySelectorAll('.features-card');
        if (!cards.length) return;

        // Drop our own value first so the cards are measured against the
        // stylesheet, never against the height we set on the previous refresh.
        wrap.style.removeProperty('height');

        const tallest = Array.from(cards).reduce(
          (max, card) => Math.max(max, card.offsetHeight),
          0,
        );

        if (tallest) wrap.style.height = `${Math.ceil(tallest)}px`;
      });
    };

    fitWrapsToCards();
    ScrollTrigger.addEventListener('refreshInit', fitWrapsToCards);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', fitWrapsToCards);
      wraps.forEach((wrap) => wrap.style.removeProperty('height'));
    };
  });
};

initFeaturesStack();
