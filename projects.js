const categoryButtons = document.querySelectorAll('.category-button');
const projectItems = document.querySelectorAll('.project-item');
const preview = document.querySelector('.project-preview');
const previewImage = preview?.querySelector('img');

function updateDescriptionMarquees() {
  document.querySelectorAll('.project-description').forEach((description) => {
    let track = description.querySelector('.description-track');

    if (!track) {
      const originalContent = description.innerHTML;
      description.dataset.marqueeContent = originalContent;
      track = document.createElement('span');
      track.className = 'description-track';
      track.setAttribute('aria-hidden', 'true');

      const firstCopy = document.createElement('span');
      firstCopy.className = 'description-copy';
      firstCopy.innerHTML = originalContent;

      const repeatedCopy = firstCopy.cloneNode(true);
      repeatedCopy.setAttribute('aria-hidden', 'true');

      track.append(firstCopy, repeatedCopy);
      const accessibleCopy = document.createElement('span');
      accessibleCopy.className = 'description-accessible';
      accessibleCopy.textContent = description.textContent.trim();
      description.replaceChildren(accessibleCopy, track);
    }

    const firstCopy = track.querySelector('.description-copy');
    const repeatedCopy = track.querySelector('[aria-hidden="true"]');
    const originalContent = description.dataset.marqueeContent;
    const withoutTrailingDot = document.createElement('template');
    withoutTrailingDot.innerHTML = originalContent;
    const separators = withoutTrailingDot.content.querySelectorAll('.description-separator');
    separators[separators.length - 1]?.remove();
    const staticContent = withoutTrailingDot.innerHTML;
    const accessibleCopy = description.querySelector('.description-accessible');
    if (accessibleCopy) accessibleCopy.textContent = withoutTrailingDot.content.textContent.trim();

    firstCopy.innerHTML = originalContent;
    const baseWidth = Math.max(1, firstCopy.scrollWidth);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobilePortrait = window.matchMedia(
      '(max-width: 680px) and (orientation: portrait)'
    ).matches;
    const shouldAnimate = mobilePortrait && !reduceMotion;
    const repeatCount = !shouldAnimate
      ? 1
      : Math.max(1, Math.ceil((description.clientWidth + 1) / baseWidth));
    const repeatedContent = shouldAnimate
      ? originalContent.repeat(repeatCount)
      : staticContent;

    firstCopy.innerHTML = repeatedContent;
    repeatedCopy.innerHTML = repeatedContent;
    repeatedCopy.style.display = shouldAnimate ? '' : 'none';
    description.classList.toggle('is-marquee', shouldAnimate);

    if (shouldAnimate) {
      const duration = Math.max(12, firstCopy.scrollWidth / 28);
      description.style.setProperty('--marquee-duration', `${duration}s`);
    } else {
      description.style.removeProperty('--marquee-duration');
    }
  });
}

updateDescriptionMarquees();
window.addEventListener('resize', updateDescriptionMarquees);
if (document.fonts?.ready) document.fonts.ready.then(updateDescriptionMarquees);

function showProjectPreview(item) {
  projectItems.forEach((project) => project.classList.toggle('is-current', project === item));
  if (preview) preview.dataset.project = item.dataset.title;
  if (previewImage) {
    previewImage.src = item.dataset.image;
    previewImage.alt = `${item.dataset.title} project preview`;
  }
  preview?.classList.add('is-visible');
}

function hideProjectPreview() {
  projectItems.forEach((project) => project.classList.remove('is-current'));
  preview?.classList.remove('is-visible');
}

const supportsProjectPreview = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsProjectPreview) {
  projectItems.forEach((item) => {
    item.addEventListener('mouseenter', () => showProjectPreview(item));
    item.addEventListener('focus', () => showProjectPreview(item));
    item.addEventListener('mouseleave', hideProjectPreview);
    item.addEventListener('blur', hideProjectPreview);
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    categoryButtons.forEach((categoryButton) => {
      const isActive = categoryButton === button;
      categoryButton.classList.toggle('is-active', isActive);
      categoryButton.setAttribute('aria-pressed', String(isActive));
    });

    projectItems.forEach((item) => {
      item.hidden = category !== 'all' && item.dataset.category !== category;
    });

    hideProjectPreview();
  });
});
