import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

/**
 * Універсальна паралакс система
 * Використання:
 * <div data-parallax data-speed="0.5" data-direction="vertical"></div>
 */

class ParallaxAnimation {
  constructor() {
    this.animations = [];
    this.rafId = null;
    this.init();
  }

  /**
   * Дефолтні налаштування для різних типів анімацій
   */
  defaults = {
    vertical: {
      scrub: 1.5,
      ease: 'none',
      speed: 1,
      scale: 1,
      opacity: 1,
      rotate: 0,
      yPercent: 0,
      markers: false,
    },
    horizontal: {
      scrub: 2,
      ease: 'none',
      speed: 1,
      scale: 1.2,
      opacity: 1,
      rotate: 0,
      xPercent: 10,
      markers: false,
    },
    smooth: {
      scrub: 3,
      ease: 'sine.inOut',
      speed: 1,
      scale: 1,
      opacity: 1,
      rotate: 0,
      yPercent: 0,
      markers: false,
    },
    scale: {
      scrub: 2,
      ease: 'power2.out',
      speed: 1,
      scaleFrom: 1.2,
      scaleTo: 1,
      opacity: 1,
      markers: false,
    },
    fade: {
      scrub: 1,
      ease: 'none',
      speed: 1,
      opacityFrom: 0,
      opacityTo: 1,
      yPercent: 20,
      markers: false,
    },
  };

  /**
   * Ініціалізація всіх паралакс елементів
   */
  init() {
    // Оновлюємо ScrollTrigger
    ScrollTrigger.refresh();

    // Основний атрибут для всіх паралакс елементів
    const elements = document.querySelectorAll('[data-parallax]');

    if (elements.length === 0) return;

    elements.forEach((element) => this.createAnimation(element));

    // Для специфічних hexagon елементів (якщо потрібен RAF)
    const hexagons = document.querySelectorAll('[data-parallax-raf]');
    if (hexagons.length > 0) {
      this.initRAFParallax(hexagons);
    }

    console.log(`✨ Initialized ${elements.length} parallax animations`);
  }

  /**
   * Створення анімації для елемента
   */
  createAnimation(element) {
    // Отримуємо тип анімації
    const type = element.dataset.parallaxType || 'vertical';
    const preset = this.defaults[type] || this.defaults.vertical;

    // Зчитуємо параметри з data-атрибутів
    const config = this.getConfig(element, preset);

    // Встановлюємо willChange для performance
    gsap.set(element, {
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      perspective: 1000,
    });

    // Створюємо анімацію на основі типу
    switch (type) {
      case 'vertical':
        this.createVerticalAnimation(element, config);
        break;
      case 'horizontal':
        this.createHorizontalAnimation(element, config);
        break;
      case 'smooth':
        this.createSmoothAnimation(element, config);
        break;
      case 'scale':
        this.createScaleAnimation(element, config);
        break;
      case 'fade':
        this.createFadeAnimation(element, config);
        break;
      default:
        this.createVerticalAnimation(element, config);
    }
  }

  /**
   * Отримання конфігурації з data-атрибутів
   */
  getConfig(element, preset) {
    const dataset = element.dataset;

    return {
      speed: parseFloat(dataset.speed) || preset.speed,
      scale: parseFloat(dataset.scale) || preset.scale,
      scaleFrom: parseFloat(dataset.scaleFrom) || preset.scaleFrom,
      scaleTo: parseFloat(dataset.scaleTo) || preset.scaleTo,
      opacity: parseFloat(dataset.opacity) || preset.opacity,
      opacityFrom: parseFloat(dataset.opacityFrom) || preset.opacityFrom,
      opacityTo: parseFloat(dataset.opacityTo) || preset.opacityTo,
      rotate: parseFloat(dataset.rotate) || preset.rotate,
      yPercent: parseFloat(dataset.yPercent) || preset.yPercent,
      xPercent: parseFloat(dataset.xPercent) || preset.xPercent,
      scrub: parseFloat(dataset.scrub) || preset.scrub,
      ease: dataset.ease || preset.ease,
      start: dataset.start || 'top bottom',
      end: dataset.end || 'bottom top',
      markers: dataset.markers === 'true' || preset.markers,
      trigger: dataset.trigger || element,
    };
  }

  /**
   * Вертикальна паралакс анімація
   */
  createVerticalAnimation(element, config) {
    const moveDistance = 10 * (1 - config.speed);

    gsap.fromTo(
      element,
      {
        y: `${config.yPercent}%`,
        opacity: config.opacityFrom !== undefined ? config.opacityFrom : config.opacity,
        scale: config.scaleFrom || 1,
        rotate: 0,
      },
      {
        y: `${moveDistance}%`,
        opacity: config.opacityTo !== undefined ? config.opacityTo : 1,
        scale: config.scale,
        rotate: config.rotate,
        ease: config.ease,
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: config.markers,
        },
      },
    );
  }

  /**
   * Горизонтальна паралакс анімація
   */
  createHorizontalAnimation(element, config) {
    const moveDistance = 10 * (1 - config.speed);

    gsap.set(element, {
      x: `${config.xPercent}%`,
    });

    gsap.fromTo(
      element,
      {
        scale: config.scaleFrom || 1,
        rotate: 0,
      },
      {
        x: `${moveDistance}%`,
        scale: config.scale,
        rotate: config.rotate,
        ease: config.ease,
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: config.markers,
        },
      },
    );
  }

  /**
   * Плавна паралакс анімація (smooth)
   */
  createSmoothAnimation(element, config) {
    const moveDistance = 10 * (1 - config.speed);

    gsap.fromTo(
      element,
      {
        y: `${config.yPercent}%`,
        opacity: config.opacity,
        scale: 1,
      },
      {
        y: `${moveDistance}%`,
        opacity: 1,
        scale: config.scale,
        ease: config.ease,
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: config.markers,
        },
      },
    );
  }

  /**
   * Scale анімація (zoom in/out)
   */
  createScaleAnimation(element, config) {
    gsap.fromTo(
      element,
      {
        scale: config.scaleFrom,
        opacity: config.opacityFrom !== undefined ? config.opacityFrom : config.opacity,
      },
      {
        scale: config.scaleTo,
        opacity: config.opacityTo !== undefined ? config.opacityTo : 1,
        ease: config.ease,
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: config.markers,
        },
      },
    );
  }

  /**
   * Fade анімація (поява з прозорості)
   */
  createFadeAnimation(element, config) {
    gsap.fromTo(
      element,
      {
        y: `${config.yPercent}%`,
        opacity: config.opacityFrom,
      },
      {
        y: '0%',
        opacity: config.opacityTo,
        ease: config.ease,
        scrollTrigger: {
          trigger: config.trigger,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: config.markers,
        },
      },
    );
  }

  /**
   * RAF-based паралакс (для складних випадків, як hexagons)
   */
  initRAFParallax(elements) {
    const updateParallax = () => {
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const offset = (elementCenter - viewportCenter) / windowHeight;

        const speed = parseFloat(element.dataset.speed) || 2;
        const maxMove = (40 * speed) / 5;

        const target = element.querySelector('img') || element;

        gsap.set(target, {
          y: offset * maxMove,
          scale: 1.1,
          force3D: true,
        });
      });

      this.rafId = requestAnimationFrame(updateParallax);
    };

    updateParallax();
  }

  /**
   * Оновлення всіх анімацій
   */
  refresh() {
    ScrollTrigger.refresh();
    console.log('🔄 Parallax animations refreshed');
  }

  /**
   * Знищення всіх анімацій
   */
  destroy() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    console.log('🗑️ Parallax animations destroyed');
  }

  /**
   * Паузa всіх анімацій
   */
  pause() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.disable());
    console.log('⏸️ Parallax animations paused');
  }

  /**
   * Відновлення всіх анімацій
   */
  resume() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
    console.log('▶️ Parallax animations resumed');
  }
}

// Ініціалізація при завантаженні DOM
let parallaxInstance = null;

const initParallax = () => {
  if (parallaxInstance) {
    parallaxInstance.destroy();
  }

  parallaxInstance = new ParallaxAnimation();
};

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallax);
} else {
  initParallax();
}

// Експорт для ручного керування
export default parallaxInstance;
export { ParallaxAnimation, initParallax };
