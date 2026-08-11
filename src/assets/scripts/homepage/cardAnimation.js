import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Select all decorative elements
  const decoElements = document.querySelectorAll('[class^="features-additional-list-item-deco--"]');

  // Create a unique parallax effect for each decorative element
  decoElements.forEach((element, index) => {
    // Calculate unique parallax parameters based on element index
    const parallaxIntensity = 25 + (index % 3) * 10; // Values between 25-45
    const scaleAmount = 1 + (index % 5) * 0.05; // Values between 1.0-1.2
    const rotationAmount = index % 2 === 0 ? 5 : -5; // Alternate rotation direction
    const parallaxDirection = index % 2 === 0 ? 1 : -1; // Alternate parallax direction

    // Create a timeline for this element
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element.closest('.features-additional-list-item'),
        start: 'top top', // Start animation when the top of the container hits the bottom of the viewport
        end: 'bottom bottom', // End animation when the bottom of the container leaves the top of the viewport
        scrub: 1.5, // Smooth scrubbing effect with slight delay for more natural feel
        toggleActions: 'play none none reverse',
        // markers: true, // Enable for debugging
      },
    });

    // Add animations to the timeline
    tl.fromTo(
      element,
      {
        y: parallaxDirection * -20, // Starting position
        scale: 0.95,
        opacity: 0.85,
        rotation: parallaxDirection * -rotationAmount,
      },
      {
        y: parallaxDirection * parallaxIntensity, // Move element for parallax effect
        scale: scaleAmount, // Slightly scale up
        opacity: 1,
        rotation: parallaxDirection * rotationAmount, // Slight rotation for more dynamic feel
        ease: 'power1.inOut',
      },
    );

    // Add hover effect
    element.addEventListener('mouseenter', () => {
      gsap.to(element, {
        scale: scaleAmount + 0.1,
        rotation: parallaxDirection * rotationAmount * 1.5,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        scale: gsap.getProperty(element, 'scale'),
        rotation: gsap.getProperty(element, 'rotation'),
        duration: 0.4,
        ease: 'power2.inOut',
      });
    });
  });

  const featuresList = document.querySelector('.features-additional-list');
  if (featuresList) {
    const layeredParallax = gsap.timeline({
      scrollTrigger: {
        trigger: featuresList,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Group elements by layers for different parallax speeds
    const layer1 = document.querySelectorAll(
      '.features-additional-list-item-deco--1, .features-additional-list-item-deco--4, .features-additional-list-item-deco--7',
    );
    const layer2 = document.querySelectorAll(
      '.features-additional-list-item-deco--2, .features-additional-list-item-deco--5, .features-additional-list-item-deco--8',
    );
    const layer3 = document.querySelectorAll(
      '.features-additional-list-item-deco--3, .features-additional-list-item-deco--6, .features-additional-list-item-deco--9',
    );

    // Add subtle floating animation to each layer
    layer1.forEach((element) => {
      gsap.to(element, {
        y: '+=15',
        x: '+=10',
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    layer2.forEach((element) => {
      gsap.to(element, {
        y: '+=20',
        x: '-=5',
        duration: 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random(),
      });
    });

    layer3.forEach((element) => {
      gsap.to(element, {
        y: '+=10',
        x: '+=7',
        duration: 5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random(),
      });
    });
  }

  // Add fade-in effect when elements enter the viewport
  gsap.utils.toArray('.features-additional-list-item').forEach((item, i) => {
    gsap.from(item, {
      autoAlpha: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
      delay: i * 0.1, // Stagger effect
    });
  });
});

// Optional: Add CSS for better performance
// Add this to your CSS:
/*
.features-additional-list-item-deco img {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
*/
