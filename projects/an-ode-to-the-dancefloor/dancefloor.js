const dancefloorCarousel = document.querySelector(".dancefloor-carousel-track");

if (dancefloorCarousel) {
  const previousButton = document.querySelector(".dancefloor-carousel-arrow--prev");
  const nextButton = document.querySelector(".dancefloor-carousel-arrow--next");

  function updateArrowVisibility() {
    if (!previousButton || !nextButton) return;

    const maxScroll = dancefloorCarousel.scrollWidth - dancefloorCarousel.clientWidth;
    previousButton.hidden = dancefloorCarousel.scrollLeft <= 1;
    nextButton.hidden = maxScroll <= 1 || dancefloorCarousel.scrollLeft >= maxScroll - 1;
  }

  function moveSlide(direction) {
    const slide = dancefloorCarousel.querySelector(".dancefloor-carousel-slide");
    if (!slide) return;

    const gap = Number.parseFloat(getComputedStyle(dancefloorCarousel).columnGap) || 0;
    dancefloorCarousel.scrollBy({
      left: direction * (slide.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  }

  previousButton?.addEventListener("click", () => moveSlide(-1));
  nextButton?.addEventListener("click", () => moveSlide(1));
  dancefloorCarousel.addEventListener("scroll", updateArrowVisibility, { passive: true });
  window.addEventListener("resize", updateArrowVisibility);
  updateArrowVisibility();
}
