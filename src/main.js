// Diet Coke Interactive 3D Experience - Main Entry
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroExperience } from './can.js';
import { initPourExperience } from './pour.js';
import { initScrollFeedback } from './feedback.js';

gsap.registerPlugin(ScrollTrigger);

// Check reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionForced = false;
try {
  motionForced = localStorage.getItem('diet-coke-motion-enabled') === 'true';
} catch {}
const shouldReduceMotion = prefersReducedMotion && !motionForced;

// Reduced motion control UI
if (prefersReducedMotion) {
  const motionChoice = document.querySelector('.motion-choice');
  const motionToggle = document.querySelector('#motion-toggle');
  const motionStatus = document.querySelector('#motion-status');

  if (motionChoice && motionToggle && motionStatus) {
    motionChoice.classList.add('is-visible');
    document.documentElement.classList.toggle('motion-forced', motionForced);
    motionStatus.textContent = motionForced
      ? '3D motion is enabled.'
      : 'Reduced motion is enabled on this device.';
    motionToggle.textContent = motionForced ? 'USE REDUCED MOTION' : 'ENABLE MOTION';

    motionToggle.addEventListener('click', () => {
      try {
        localStorage.setItem('diet-coke-motion-enabled', String(!motionForced));
      } catch {}
      location.reload();
    });
  }
}

// Lenis Smooth Scroll Engine
const lenis = shouldReduceMotion
  ? null
  : new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      anchors: true
    });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Initialize 3D Hero Experience
initHeroExperience(shouldReduceMotion);

// Initialize 3D Pour Experience
initPourExperience(shouldReduceMotion);

// Initialize Scroll & Haptic Feedback
initScrollFeedback();

// Responsive Navigation & Mobile Slide-Out Menu
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

export function toggleMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.toggle('is-open', open);
  mobileMenu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);

  if (lenis) {
    if (open) lenis.stop();
    else lenis.start();
  }
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    toggleMenu(!mobileMenu.classList.contains('is-open'));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
}

// Scroll Entrance & Reveal Animations
if (!shouldReduceMotion) {
  // Hero load timeline
  gsap.timeline({
    defaults: { ease: 'power3.out' }
  })
    .from('.header', { y: -30, duration: 0.7 })
    .from('.hero h1 > span', { y: 24, stagger: 0.1, duration: 0.85 }, '-=0.4')
    .from(
      '.eyebrow, .hero-copy p, .hero-copy .pill-button',
      { y: 14, stagger: 0.09, duration: 0.65 },
      '-=0.65'
    );

  // Scroll reveal for cards and sections
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 35,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Parallax on break banner background
  gsap.to('.break-image', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.break-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

// Handle anchor hash scrolling on page load
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && lenis) {
      lenis.scrollTo(target, { immediate: true, force: true });
    }
  }
});
