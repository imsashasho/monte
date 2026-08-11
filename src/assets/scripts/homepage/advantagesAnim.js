import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const initAdvantagesAnim = () => {
  const sec = document.querySelector('.advantages');
  if (!sec) return;

  const grid = sec.querySelector('.advantages__grid');
  if (grid) {
    const cards = gsap.utils.toArray(grid.querySelectorAll('.advantages-card'));
    if (cards.length) {
      // Set initial state
      gsap.set(cards, {
        y: 60,
        opacity: 0,
        scale: 0.97,
        filter: 'blur(10px)',
      });

      ScrollTrigger.create({
        trigger: grid,
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 2,
            ease: 'power2.out',
            stagger: {
              each: 0.15,
              from: 'start',
            },
            clearProps: 'filter',
          });
        },
        once: true, // Only play once
      });
    }
  }

  // Background Parallax and Distortion on Mouse Move
  const bgImg = sec.querySelector('.advantages__bg-img');
  if (bgImg) {
    // Scroll Parallax (slight y-axis shift as we scroll past)
    gsap.set(bgImg, { scale: 1.15, transformOrigin: 'center center' });
    
    gsap.fromTo(bgImg, 
      { yPercent: -5 },
      { 
        yPercent: 5, 
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    // Mouse Move Parallax
    let xTo = gsap.quickTo(bgImg, "x", {duration: 1, ease: "power3.out"});
    let yTo = gsap.quickTo(bgImg, "y", {duration: 1, ease: "power3.out"});
    
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
};

initAdvantagesAnim();
