import { gsap } from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.core.globals('ScrollTrigger', ScrollTrigger);
gsap.core.globals('SplitText', SplitText);

window.addEventListener('load', function (evt) {
  document.querySelectorAll('[data-split-lines-new-animation]').forEach((el) => {
    let split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      position: 'absolute',
      reduceWhiteSpace: false,
    });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          once: true,
          start: '50% bottom',
        },
      })
      .fromTo(
        split.lines,
        {
          y: 100,
        },
        {
          y: 0,
          duration: 1.25,
          ease: 'power4.out',
          stagger: {
            amount: 0.25,
          },
        },
      )
      .add(() => {
        split.revert();
      });
  });
});
