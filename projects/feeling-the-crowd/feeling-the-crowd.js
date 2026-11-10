const openingVideo = document.querySelector(".feeling-crowd-video video");

if (openingVideo) {
  const playbackRate = 0.3;
  openingVideo.playbackRate = playbackRate;
  openingVideo.addEventListener("loadedmetadata", () => {
    openingVideo.playbackRate = playbackRate;
  });
}

const feelingCrowdCarousel = document.querySelector(".feeling-crowd-carousel-track");

if (feelingCrowdCarousel) {
  const previousButton = document.querySelector(".feeling-crowd-carousel-prev");
  const nextButton = document.querySelector(".feeling-crowd-carousel-next");

  function updateArrowVisibility() {
    if (!previousButton || !nextButton) return;

    const maxScroll = feelingCrowdCarousel.scrollWidth - feelingCrowdCarousel.clientWidth;
    previousButton.hidden = feelingCrowdCarousel.scrollLeft <= 1;
    nextButton.hidden = maxScroll <= 1 || feelingCrowdCarousel.scrollLeft >= maxScroll - 1;
  }

  function moveSlide(direction) {
    const slide = feelingCrowdCarousel.querySelector(".feeling-crowd-carousel-slide");
    if (!slide) return;

    const gap = Number.parseFloat(getComputedStyle(feelingCrowdCarousel).columnGap) || 0;
    feelingCrowdCarousel.scrollBy({
      left: direction * (slide.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  }

  previousButton?.addEventListener("click", () => moveSlide(-1));
  nextButton?.addEventListener("click", () => moveSlide(1));
  feelingCrowdCarousel.addEventListener("scroll", updateArrowVisibility, { passive: true });
  window.addEventListener("resize", updateArrowVisibility);
  updateArrowVisibility();
}
