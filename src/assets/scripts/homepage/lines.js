import gsap from 'gsap';

// Animate the specific set of about background lines
function animateAboutBgLines() {
  // Get the container and all lines
  const container = document.getElementById('matrix-container');
  const lines = document.querySelectorAll('.about-bg-line');

  if (!container || lines.length === 0) {
    console.warn('Matrix container or lines not found');
    return;
  }

  // First, set up the container with initial styling, but preserve its position
  const containerStyle = window.getComputedStyle(container);
  gsap.set(container, {
    width: containerStyle.width,
    height: containerStyle.height,
    overflow: 'hidden',
  });

  // Configure animation parameters for each line with varied starting positions
  const lineConfigs = [
    { speed: 1.5, delay: 0.2, opacity: 0.2, startOffset: -15 },
    { speed: 1.2, delay: 1.1, opacity: 0.1, startOffset: -25 },
    { speed: 1.8, delay: 0.7, opacity: 0.3, startOffset: -20 },
    { speed: 2.5, delay: 0.3, opacity: 0.1, startOffset: -30 },
    { speed: 1.7, delay: 1.5, opacity: 0.3, startOffset: -18 },
    { speed: 2.0, delay: 0.9, opacity: 0.2, startOffset: -22 },
    { speed: 1.9, delay: 0.5, opacity: 0.4, startOffset: -17 },
  ];

  // Apply animations to each line while preserving their original positions
  const animations = [];

  lines.forEach((line, index) => {
    // Get original computed styles
    const originalStyle = window.getComputedStyle(line);

    // Only modify styling attributes we want to animate, preserve position
    gsap.set(line, {
      background: 'linear-gradient(180deg, rgb(72, 89, 89) 75%, #1B1D1D 100%)',
      boxShadow: '0 0 10px rgba(72, 89, 89, 0.5)',
      width: originalStyle.width !== 'auto' ? originalStyle.width : '1px',
      opacity: 0.2, // Set initial opacity
    });

    // Get the config for this line (use index % length to handle more lines than configs)
    const config = lineConfigs[index % lineConfigs.length];

    // Set initial opacity
    gsap.set(line, { opacity: config.opacity });

    // Get dimensions of the container and window for animation bounds
    const containerRect = container.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate the vh equivalent for 20vh higher starting position
    const extraHeightInPixels = windowHeight * 0.5; // 20vh in pixels

    // Calculate starting position:
    // 1. 20vh above container (extraHeightInPixels)
    // 2. Plus the original offset in vw
    // 3. Plus some random variation
    const startY = -(
      extraHeightInPixels +
      (config.startOffset + gsap.utils.random(5, 15)) * (windowWidth / 100)
    );

    // Calculate ending position (below the container)
    const endY = containerRect.height * 2;

    // Create the falling animation with randomized starting position for each repeat
    const fallingAnimation = gsap.fromTo(
      line,
      { y: '30vh' },
      {
        y: endY,
        duration: 10 / config.speed, // Speed factor
        delay: config.delay,
        ease: 'none',
        repeat: -1,
        onRepeat: () => {
          // On repeat, create a new randomized starting position
          // that is 20vh higher plus the configured and random offsets
          const newStartY = -(
            extraHeightInPixels +
            (config.startOffset + gsap.utils.random(0, 20)) * (windowWidth / 100)
          );

          // Apply the new starting position
          gsap.set(line, { y: newStartY });

          // Randomize opacity slightly on each repeat for more dynamic effect
          gsap.to(line, {
            opacity: config.opacity * gsap.utils.random(0.8, 1.2),
            duration: 1,
          });
        },
      },
    );

    // Add subtle width pulsing for more "digital" feel
    const pulseAnimation = gsap.to(line, {
      boxShadow: '0 0 20px rgba(72, 89, 89, 0.8)',
      duration: gsap.utils.random(1, 3),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    animations.push(fallingAnimation, pulseAnimation);
  });

  // Return controls to manage the animations
  return {
    animations,
    // Pause all line animations
    pause: () => {
      animations.forEach((animation) => {
        animation.pause();
      });
    },

    // Resume all line animations
    resume: () => {
      animations.forEach((animation) => {
        animation.resume();
      });
    },

    // Kill all animations
    kill: () => {
      animations.forEach((animation) => {
        animation.kill();
      });
    },

    // Update animation speed
    setSpeed: (speedFactor) => {
      animations.forEach((animation) => {
        animation.timeScale(speedFactor);
      });
    },

    // Reset to original positions and styles
    reset: () => {
      animations.forEach((animation) => {
        animation.kill();
      });

      lines.forEach((line) => {
        gsap.set(line, { clearProps: 'all' });
      });
    },
  };
}

// Handle window resize with better cleanup
function handleResize(matrixControls) {
  if (matrixControls) {
    // Kill existing animations
    matrixControls.kill();

    // Clear all GSAP-applied styles
    const lines = document.querySelectorAll('.about-bg-line');
    lines.forEach((line) => {
      gsap.set(line, { clearProps: 'all' });
    });
  }

  // Recreate with new dimensions
  return animateAboutBgLines();
}

// Initialize animation with resize handling
let matrixControls = animateAboutBgLines();

// Add resize event listener with debouncing for better performance
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    matrixControls = handleResize(matrixControls);
  }, 250);
});

// If page visibility changes (tab switching), handle possible layout changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    matrixControls = handleResize(matrixControls);
  }
});

export default animateAboutBgLines;
