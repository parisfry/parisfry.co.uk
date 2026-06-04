document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  const visibleGallery = document.querySelector(
    window.getComputedStyle(document.querySelector('.desktop-gallery')).display !== 'none'
      ? '.desktop-gallery'
      : '.mobile-gallery'
  );

  const items = Array.from(
    visibleGallery.querySelectorAll('img, video')
  );

  items.sort((a, b) =>
    Number(a.dataset.order) - Number(b.dataset.order)
  );

  const elements = items.map(el => {

    if (el.tagName === 'VIDEO') {
      return {
        href: el.querySelector('source').src,
        type: 'video'
      };
    }

    return {
      href: el.src,
      type: 'image'
    };
  });

 const lightbox = GLightbox({
  elements,
  loop: true,
  touchNavigation: true,
  autoplayVideos: true,

  zoomable: false,
  draggable: false,


  moreText: false,
  skin: 'clean',

  openEffect: 'fade',
  closeEffect: 'fade',

  touchFollowAxis: false,

  plyr: {
    config: {
      controls: ['play', 'progress', 'current-time', 'fullscreen'],
      muted: true,
      volume: 0
    }
  }
});

lightbox.on('slide_changed', ({ current }) => {
  const video = current?.slide?.querySelector('video');

  if (video) {
    video.muted = true;
    video.volume = 0;
    video.autoplay = false;
  }
});



lightbox.on('slide_after_load', ({ slide }) => {
  const img = slide.querySelector('img');
  const media = slide.querySelector('.gslide-media');

  if (img) {
    img.style.pointerEvents = 'none';
    img.style.cursor = 'default';
  }

  if (media) {
    media.style.transform = 'none';
  }
});

  items.forEach(item => {
    item.style.cursor = 'default';

    item.addEventListener('click', e => {
      e.preventDefault();

      const index = items.indexOf(item);

      lightbox.openAt(index);
    });
  });

});