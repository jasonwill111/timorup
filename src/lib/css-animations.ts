/**
 * CSS Animation Utilities for TimorUp
 * Pure CSS replacements for simple Motion animations
 */

/**
 * Scroll-based reveal animation using IntersectionObserver
 * Pure JS for trigger, CSS handles the animation
 */
export function initScrollReveal(selector: string = '.reveal-on-scroll') {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/**
 * Counter animation - JS required for number updates
 * But styling uses CSS transitions
 */
export function animateCounterJS(element: Element, target: number, duration = 1500) {
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = value.toString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * Scroll progress - JS updates value, CSS handles width
 */
export function initScrollProgress(indicatorEl: Element) {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    (indicatorEl as HTMLElement).style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * Lazy load images - CSS fade, JS IntersectionObserver
 */
export function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  images.forEach(img => observer.observe(img));
}

/**
 * Parallax effect - CSS handles transform, JS handles scroll
 */
export function initParallax() {
  // Only target explicit parallax elements, not carousel tracks
  const parallaxElements = document.querySelectorAll('[data-parallax]:not(.carousel-track)');
  if (!parallaxElements.length) return;

  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat((el as HTMLElement).dataset.parallaxSpeed || '0.5');
      const yOffset = scrollY * speed;
      (el as HTMLElement).style.transform = `translateY(${yOffset}px)`;
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax();
}

/**
 * Ripple effect - CSS animates, JS positions and removes
 */
export function addRippleEffect(selector: string) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = (btn as HTMLElement).getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      (btn as HTMLElement).style.position = 'relative';
      (btn as HTMLElement).style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/**
 * Scroll spy - JS tracks active section
 */
export function initScrollSpy(selector: string, activeClass: string = 'text-primary font-semibold') {
  const navItems = document.querySelectorAll(selector);
  if (!navItems.length) return;

  const sectionIds = Array.from(navItems)
    .map(item => item.getAttribute('href')?.replace('#', ''))
    .filter(Boolean);

  const sections = sectionIds.map(id => document.getElementById(id!)).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove(activeClass));
        const activeIndex = sections.indexOf(entry.target);
        if (activeIndex >= 0) navItems[activeIndex]?.classList.add(activeClass);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(section => section && observer.observe(section));
}

/**
 * Initialize all CSS-based animations
 * Note: Carousel components are excluded to prevent transform conflicts
 */
export function initCSSAnimations() {
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-on-scroll:not(.carousel *)').forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Scroll reveal - exclude carousel children
  initScrollReveal('.reveal-on-scroll');

  // Scroll progress
  const scrollProgress = document.querySelector('.scroll-progress-bar');
  if (scrollProgress) initScrollProgress(scrollProgress);

  // Lazy load
  initLazyLoad();

  // Parallax - only explicit [data-parallax] elements
  initParallax();

  // Ripple
  addRippleEffect('button:not(.carousel button), .btn:not(.carousel .btn), [role="button"]:not(.carousel [role="button"])');

  // Scroll spy
  initScrollSpy('.nav-section-link');

  // Counter animations
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count') || '0', 10);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounterJS(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

// Run on DOM ready if this is the main entry
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCSSAnimations);
  } else {
    initCSSAnimations();
  }
}
