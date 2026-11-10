const items = document.querySelectorAll('.scroll-list li');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopScrollSnap = window.matchMedia('(min-width: 1201px) and (hover: hover) and (pointer: fine)').matches;
const about = document.querySelector('.about');

let isSnappingToAbout = false;

function isOnHero() {
  return window.scrollY < about.offsetTop - 2;
}

function scrollToAbout() {
  if (!isOnHero() || isSnappingToAbout) return;

  isSnappingToAbout = true;
  window.scrollTo({
    top: about.offsetTop,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });

  window.setTimeout(() => {
    isSnappingToAbout = false;
  }, reduceMotion ? 0 : 900);
}

if (!reduceMotion && desktopScrollSnap) {
  window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0 && isOnHero()) {
      event.preventDefault();
      scrollToAbout();
    }
  }, { passive: false });

  let touchStartY = 0;
  window.addEventListener('touchstart', (event) => {
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (event) => {
    const touchEndY = event.changedTouches[0].clientY;
    if (touchStartY - touchEndY > 40 && isOnHero()) scrollToAbout();
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    const scrollKeys = ['ArrowDown', 'PageDown', ' '];
    const isEditable = event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(event.target.tagName);
    if (scrollKeys.includes(event.key) && !isEditable && isOnHero()) {
      event.preventDefault();
      scrollToAbout();
    }
  });
}

function updateBlur() {
  if (reduceMotion) {
    items.forEach((item) => {
      item.style.filter = 'none';
      item.style.opacity = 1;
      item.style.color = '#f1f1f1';
    });
    return;
  }

  const isMobileLayout = window.matchMedia(
    '(max-width: 680px), (max-width: 1000px) and (max-height: 500px) and (orientation: landscape), (min-width: 681px) and (max-width: 1200px) and (orientation: portrait)'
  ).matches;
  const isTabletLayout = window.matchMedia('(min-width: 681px) and (max-width: 1200px)').matches;
  const trigger = window.innerHeight * (isMobileLayout ? 1 : 0.84);

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isContactItem = item.closest('.group-contact');
    const isTabletEducationItem = isTabletLayout && !isMobileLayout && item.closest('.group-education');
    const itemTrigger = isContactItem
      ? window.innerHeight * (isMobileLayout ? 1.1 : 0.99)
      : isTabletEducationItem
        ? window.innerHeight * 1.15
        : trigger;
    const revealDistance = isTabletEducationItem
      ? 180
      : isMobileLayout
        ? (isContactItem ? 140 : 180)
        : (isContactItem ? 160 : 240);
    const progress = Math.max(0, Math.min(1, (itemTrigger - rect.top) / revealDistance));
    const channel = Math.round(92 + progress * (241 - 92));

    item.style.filter = `blur(${(1 - progress) * 7}px)`;
    item.style.opacity = 0.25 + progress * 0.75;
    item.style.color = `rgb(${channel}, ${channel}, ${channel})`;
  });
}

window.addEventListener('scroll', updateBlur, { passive: true });
window.addEventListener('resize', updateBlur);
window.addEventListener('load', updateBlur);

updateBlur();
