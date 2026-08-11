import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Phone offsets, kept exactly as they were.
const PHONE_CARDS_OFFSET = 250;
const PHONE_TITLE_OFFSET = 80;
// Tablet: how far below the top of the viewport the title sticks, and the gap
// left between it and the cards. The cards' own offset is measured from the
// title, never hardcoded — see createTabletStack.
const TABLET_TITLE_OFFSET = 40;
const TABLET_CARDS_GAP = 20;

const initInfraStack = () => {
  const section = document.querySelector('.features-infrastructure');
  if (!section) return;

  const inner = section.querySelector('.features-infrastructure-inner');
  if (!inner) return;

  const side = inner.querySelector('.features-infrastructure-title');
  const cardsWrap = inner.querySelector('.features-infrastructure-list');
  const cards = cardsWrap
    ? gsap.utils.toArray(cardsWrap.querySelectorAll('.features-infrastructure-item'))
    : [];

  if (!cardsWrap || cards.length < 2) return;

  const mm = gsap.matchMedia();

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

  const buildStackSequence = (timeline, targetOpacity) => {
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
            opacity: targetOpacity,
            ease: 'none',
          },
          position,
        );
    }
  };

  const getStepDistance = () => Math.max(window.innerHeight * 0.7, 140);

  const createStage = ({ start, targetOpacity }) => {
    const totalDistance = (cards.length - 1) * getStepDistance();

    const tl = gsap.timeline({
      scrollTrigger: {
        id: `infra-stack-stage`,
        trigger: cardsWrap,
        start,
        end: `+=${totalDistance}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      defaults: { ease: 'none', duration: 1 },
    });

    buildStackSequence(tl, targetOpacity);

    return { tl, totalDistance };
  };

  // Phone (<= 767px): the title is pinned at the very top, so the cards pin
  // lower — otherwise they'd stack right over it.
  mm.add('(max-width: 767px)', () => {
    const context = gsap.context(() => {
      setStackInitialState();

      const { totalDistance } = createStage({
        start: `top top+=${PHONE_CARDS_OFFSET}`,
        targetOpacity: 1,
      });

      if (side) {
        ScrollTrigger.create({
          id: `infra-stack-side`,
          // Trigger off the title itself so it sticks exactly 80px from the top,
          // and hold it for the whole cards stage.
          trigger: side,
          start: `top top+=${PHONE_TITLE_OFFSET}`,
          end: `+=${totalDistance}`,
          pin: side,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }
    }, section);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => context.revert();
  });

  // Tablet (768–1024px): the whole title stops, and the cards stop directly
  // under it. Their offset is measured from the title on every refresh instead
  // of the phone's hardcoded 280px, so a heading plus a subtitle that reflows
  // with the viewport width can never end up underneath a card.
  mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
    const context = gsap.context(() => {
      setStackInitialState();

      const cardsOffset = () =>
        TABLET_TITLE_OFFSET + (side ? side.offsetHeight : 0) + TABLET_CARDS_GAP;

      const { tl } = createStage({
        start: () => `top top+=${cardsOffset()}`,
        targetOpacity: 1,
      });

      if (side) {
        const stage = tl.scrollTrigger;

        ScrollTrigger.create({
          id: `infra-stack-side`,
          trigger: side,
          start: `top top+=${TABLET_TITLE_OFFSET}`,
          // The title starts sticking earlier than the cards do, so `+=distance`
          // would release it before the last card lands. Borrow the stage's own
          // end instead. refreshPriority keeps this recalculated after the stage,
          // so the value read here is the fresh one.
          end: () => stage.end,
          pin: side,
          pinSpacing: false,
          invalidateOnRefresh: true,
          refreshPriority: -1,
        });
      }
    }, section);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => context.revert();
  });

  // Desktop (> 1024px): unchanged — the title rides along with `inner` and the
  // outgoing card fades to 0.75 rather than out.
  mm.add('(min-width: 1025px)', () => {
    const context = gsap.context(() => {
      setStackInitialState();

      createStage({
        start: 'top top+=80',
        targetOpacity: 1,
      });

      if (side) {
        ScrollTrigger.create({
          id: `infra-stack-side`,
          trigger: inner,
          start: 'top top+=120',
          endTrigger: inner,
          end: 'bottom bottom-=100',
          pin: side,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }
    }, section);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => context.revert();
  });
};

initInfraStack();
