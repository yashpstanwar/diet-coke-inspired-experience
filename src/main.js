// Diet Coke Interactive 3D Experience - Main Entry
import { initHeroExperience } from './can.js';
import { initPourExperience } from './pour.js';

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
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    toggleMenu(!mobileMenu.classList.contains('is-open'));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
}

// Check reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionForced = false;
try {
  motionForced = localStorage.getItem('diet-coke-motion-enabled') === 'true';
} catch {}
const shouldReduceMotion = prefersReducedMotion && !motionForced;

// Initialize 3D Hero Experience
initHeroExperience(shouldReduceMotion);

// Initialize 3D Pour Experience
initPourExperience(shouldReduceMotion);
