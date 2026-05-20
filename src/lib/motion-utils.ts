/**
 * Motion animation utilities for TimorUp
 * Extracted from MotionAnimations.astro for use in script blocks
 */
import { animate, timeline, inView } from 'motion';

// Entrance animations
export function fadeInUp(selector: string, delay = 0) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, i) => {
    animate(
      el,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.4, delay: delay + i * 0.05, easing: [0.25, 0.1, 0.25, 1] }
    );
  });
}

// Text reveal animation
export function textReveal(element: Element, duration = 0.8) {
  const words = element.textContent?.split(' ') || [];
  const fragment = document.createDocumentFragment();
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'word-reveal';
    span.style.cssText = 'display: inline-block; opacity: 0; transform: translateY(100%)';
    span.textContent = word;
    fragment.appendChild(span);
  });
  element.textContent = '';
  element.appendChild(fragment);

  element.querySelectorAll('.word-reveal').forEach((word, i) => {
    animate(
      word,
      { opacity: [0, 1], y: [20, 0] },
      { duration, delay: i * 0.05, easing: 'ease-out' }
    );
  });
}

// Scale in animation
export function scaleIn(selector: string, delay = 0) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, i) => {
    animate(
      el,
      { opacity: [0, 1], scale: [0.9, 1] },
      { duration: 0.3, delay: delay + i * 0.03, easing: 'ease-out' }
    );
  });
}

// Hover lift effect
export function addHoverLift(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      animate(el, { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }, { duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      animate(el, { y: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }, { duration: 0.2 });
    });
  });
}

// Slide in from left
export function slideInLeft(selector: string, delay = 0) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, i) => {
    animate(
      el,
      { opacity: [0, 1], x: [-30, 0] },
      { duration: 0.4, delay: delay + i * 0.08, easing: [0.25, 0.1, 0.25, 1] }
    );
  });
}

// Slide in from right
export function slideInRight(selector: string, delay = 0) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, i) => {
    animate(
      el,
      { opacity: [0, 1], x: [30, 0] },
      { duration: 0.4, delay: delay + i * 0.08, easing: [0.25, 0.1, 0.25, 1] }
    );
  });
}

// Button click feedback
export function addButtonFeedback(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('mousedown', () => {
      animate(el, { scale: 0.95 }, { duration: 0.1 });
    });
    el.addEventListener('mouseup', () => {
      animate(el, { scale: 1 }, { duration: 0.1 });
    });
  });
}

// Link hover underline animation
export function addLinkUnderline(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      animate(el, { textDecorationThickness: [0, 2] }, { duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      animate(el, { textDecorationThickness: [2, 0] }, { duration: 0.2 });
    });
  });
}

// Counter animation
export function animateCounter(element: Element, target: number, duration = 1) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (target - start) * eased);
    element.textContent = value.toString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Filter tag click effect
export function addFilterClickEffect(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('click', () => {
      animate(el, { scale: [1, 0.9, 1.05, 1] }, { duration: 0.3 });
    });
  });
}

// Card border glow on hover
export function addCardGlow(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      animate(el, { '--tw-shadow-color': 'rgba(255, 209, 80, 0.4)' }, { duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      animate(el, { '--tw-shadow-color': 'rgba(0, 0, 0, 0.05)' }, { duration: 0.3 });
    });
  });
}

// Staggered fade in for children
export function staggerFadeIn(parentSelector: string, childSelector: string, delay = 0) {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;
  const children = parent.querySelectorAll(childSelector);
  children.forEach((child, i) => {
    animate(
      child,
      { opacity: [0, 1], y: [15, 0] },
      { duration: 0.35, delay: delay + i * 0.06, easing: [0.25, 0.1, 0.25, 1] }
    );
  });
}

// Dropdown animations
export function dropdownIn(dropdown: Element) {
  animate(dropdown, { opacity: [0, 1], scale: [0.95, 1], y: [-5, 0] }, { duration: 0.2, easing: [0.34, 1.56, 0.64, 1] });
}

export function dropdownOut(dropdown: Element, onComplete?: () => void) {
  animate(dropdown, { opacity: [1, 0], scale: [1, 0.95], y: [0, -5] }, { duration: 0.15 }).finished.then(() => onComplete?.());
}

// Toast animations
export function toastIn(toastEl: Element) {
  animate(toastEl, { opacity: [0, 1], x: [100, 0] }, { duration: 0.3, easing: [0.34, 1.56, 0.64, 1] });
}

export function toastOut(toastEl: Element, onComplete?: () => void) {
  animate(toastEl, { opacity: [1, 0], x: [0, 100] }, { duration: 0.25 }).finished.then(() => onComplete?.());
}

// Modal/Dialog animations
export function modalIn(modalEl: Element) {
  const backdrop = modalEl.querySelector('.modal-backdrop') as HTMLElement;
  const content = modalEl.querySelector('.modal-content') as HTMLElement;

  if (backdrop) {
    animate(backdrop, { opacity: [0, 1] }, { duration: 0.2 });
  }
  if (content) {
    animate(content, { opacity: [0, 1], scale: [0.95, 1], y: [10, 0] }, { duration: 0.25, easing: [0.34, 1.56, 0.64, 1] });
  }
}

export function modalOut(modalEl: Element, onComplete?: () => void) {
  const backdrop = modalEl.querySelector('.modal-backdrop') as HTMLElement;
  const content = modalEl.querySelector('.modal-content') as HTMLElement;

  if (content) {
    animate(content, { opacity: [1, 0], scale: [1, 0.95], y: [0, -10] }, { duration: 0.2 }).finished.then(() => {
      if (backdrop) animate(backdrop, { opacity: [1, 0] }, { duration: 0.15 }).finished.then(() => onComplete?.());
      else onComplete?.();
    });
  } else if (backdrop) {
    animate(backdrop, { opacity: [1, 0] }, { duration: 0.15 }).finished.then(() => onComplete?.());
  } else {
    onComplete?.();
  }
}

// Tab switch animation
export function tabSwitch(tabContent: Element, direction: 'left' | 'right' = 'right') {
  const xOffset = direction === 'right' ? 20 : -20;
  animate(tabContent, { opacity: [0, 1], x: [xOffset, 0] }, { duration: 0.25, easing: 'ease-out' });
}

// Accordion animations
export function accordionOpen(panel: HTMLElement) {
  panel.style.overflow = 'hidden';
  const height = panel.scrollHeight;
  animate(panel, { height: [0, height], opacity: [0, 1] }, { duration: 0.3, easing: 'ease-out' }).finished.then(() => {
    panel.style.height = 'auto';
  });
}

export function accordionClose(panel: HTMLElement) {
  panel.style.overflow = 'hidden';
  const height = panel.scrollHeight;
  animate(panel, { height: [height, 0], opacity: [1, 0] }, { duration: 0.25, easing: 'ease-in' }).finished.then(() => {
    panel.style.display = 'none';
  });
}

// Loading skeleton shimmer
export function addSkeletonShimmer(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    const shimmer = document.createElement('div');
    shimmer.className = 'skeleton-shimmer';
    shimmer.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 1.5s infinite;
    `;
    (el as HTMLElement).style.position = 'relative';
    el.appendChild(shimmer);
  });
}

// Scroll progress indicator
export function initScrollProgress(indicatorEl: Element) {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    (indicatorEl as HTMLElement).style.width = `${progress}%`;
  };
  window.addEventListener('scroll', updateProgress);
  updateProgress();
}

// Page transition
export function pageTransitionIn(container: string = 'main') {
  const el = document.querySelector(container);
  if (el) {
    animate(el, { opacity: [0, 1] }, { duration: 0.3 });
  }
}

// Stagger grid entrance
export function staggerGridEntrance(gridSelector: string, cardSelector: string = 'a', baseDelay = 0) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  const cards = grid.querySelectorAll(cardSelector);
  cards.forEach((card, i) => {
    animate(card, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, delay: baseDelay + i * 0.05 });
  });
}

// Ripple effect
export function addRippleEffect(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 10px; height: 10px;
        background: rgba(255,255,255,0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = 'ripple-effect';
      el.appendChild(ripple);
      animate(ripple, { scale: [1, 4], opacity: [1, 0] }, { duration: 0.6 }).finished.then(() => ripple.remove());
    });
  });
}

// Section reveal on scroll
export function sectionReveal(selector: string, threshold = 0.15) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: 0.5, easing: 'ease-out' });
    }, { amount: threshold });
  });
}

// Animate filters
export function animateFilters(selector: string) {
  const filters = document.querySelectorAll(selector);
  filters.forEach((filter, i) => {
    animate(filter, { opacity: [0, 1], y: [-10, 0] }, { duration: 0.3, delay: i * 0.05 });
  });
}

// Animate pagination
export function animatePagination(selector: string) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      animate(btn, { scale: [1, 0.9, 1] }, { duration: 0.2 });
    });
  });
}

// Loading pulse
export function addLoadingPulse(selector: string) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    animate(el, { opacity: [1, 0.5, 1] }, { duration: 1.5, repeat: Infinity });
  });
}

// Floating bounce
export function addFloatingBounce(selector: string, intensity = 1) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    animate(el, { y: [0, -10 * intensity, 0] }, { duration: 2, repeat: Infinity, easing: 'ease-in-out' });
  });
}

// Stacked toast
export function stackedToast(toastEl: Element) {
  animate(toastEl, { opacity: [0, 1], x: [100, 0], y: [-20, 0] }, { duration: 0.3 });
}

// Parallax effect
export function initParallax(elements: NodeListOf<Element>) {
  elements.forEach(el => {
    const speed = 0.5;
    window.addEventListener('scroll', () => {
      const y = window.scrollY * speed;
      (el as HTMLElement).style.transform = `translateY(${y}px)`;
    });
  });
}

// Lazy image fade
export function lazyImageFade(imgEl: HTMLImageElement) {
  imgEl.style.opacity = '0';
  imgEl.style.transition = 'opacity 0.3s';
  if (imgEl.complete) {
    imgEl.style.opacity = '1';
  } else {
    imgEl.addEventListener('load', () => {
      imgEl.style.opacity = '1';
    });
  }
}
