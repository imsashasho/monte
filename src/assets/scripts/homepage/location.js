const MOBILE_BREAKPOINT = '(max-width: 767px)';

class MobileMapDrag {
  constructor() {
    this.mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    this.mapInner = document.querySelector('.location-img-block');
    this.marker = document.querySelector('.location-swipe-path-marker');
    this.path = document.querySelector('.location-swipe-path');

    if (!this.mapInner) return;

    this.isDragging = false;
    this.startX = 0;
    this.startScrollLeft = 0;

    this.handleViewportChange = this.handleViewportChange.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);

    this.mediaQuery.addEventListener('change', this.handleViewportChange);
    this.handleViewportChange(this.mediaQuery);

    if (this.marker && this.path) {
      this.isMarkerDragging = false;
      this.markerStartX = 0;
      this.markerStartScrollLeft = 0;

      this.marker.addEventListener('pointerdown', (e) => {
        this.isMarkerDragging = true;
        this.markerStartX = e.clientX;
        this.markerStartScrollLeft = this.mapInner.scrollLeft;
        this.marker.setPointerCapture(e.pointerId);
        e.preventDefault();
        e.stopPropagation();
      });

      document.addEventListener(
        'pointermove',
        (e) => {
          if (!this.isMarkerDragging) return;
          e.preventDefault();
          const maxScroll = this.mapInner.scrollWidth - this.mapInner.clientWidth;
          const pathWidth = this.path.clientWidth - this.marker.clientWidth;
          const dx = e.clientX - this.markerStartX;
          const newScroll = Math.min(
            Math.max(this.markerStartScrollLeft + dx * (maxScroll / pathWidth), 0),
            maxScroll,
          );
          this.mapInner.scrollLeft = newScroll;
          this.marker.style.left = `${(newScroll / maxScroll) * pathWidth}px`;
        },
        { passive: false },
      );

      document.addEventListener('pointerup', () => {
        this.isMarkerDragging = false;
      });

      this.mapInner.addEventListener(
        'scroll',
        () => {
          if (this.isMarkerDragging) return;
          this.updateMarker();
        },
        { passive: true },
      );
    }
  }

  updateMarker() {
    if (!this.marker || !this.path) return;
    const maxScroll = this.mapInner.scrollWidth - this.mapInner.clientWidth;
    if (maxScroll <= 0) return;
    const pathWidth = this.path.clientWidth - this.marker.clientWidth;
    this.marker.style.left = `${(this.mapInner.scrollLeft / maxScroll) * pathWidth}px`;
  }

  handleViewportChange(event) {
    if (event.matches) {
      this.enable();
      this.setInitialScroll();
      return;
    }
    this.disable();
  }

  enable() {
    this.mapInner.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove, { passive: false });
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
  }

  disable() {
    this.mapInner.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    this.isDragging = false;
    this.mapInner.classList.remove('is-dragging');
  }

  setInitialScroll() {
    requestAnimationFrame(() => {
      const maxScroll = this.mapInner.scrollWidth - this.mapInner.clientWidth;
      if (maxScroll <= 0) return;
      this.mapInner.scrollLeft = maxScroll / 2;
      this.updateMarker();
    });
  }

  handlePointerDown(event) {
    if (this.isMarkerDragging) return;
    this.isDragging = true;
    this.startX = event.clientX;
    this.startScrollLeft = this.mapInner.scrollLeft;
    this.mapInner.classList.add('is-dragging');
    if (typeof this.mapInner.setPointerCapture === 'function') {
      this.mapInner.setPointerCapture(event.pointerId);
    }
  }

  handlePointerMove(event) {
    if (!this.isDragging) return;
    event.preventDefault();
    const deltaX = event.clientX - this.startX;
    this.mapInner.scrollLeft = this.startScrollLeft - deltaX;
  }

  handlePointerUp(event) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.mapInner.classList.remove('is-dragging');
    if (typeof this.mapInner.releasePointerCapture === 'function') {
      this.mapInner.releasePointerCapture(event.pointerId);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new MobileMapDrag());
