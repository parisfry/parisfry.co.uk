const overloadImageSwipe = document.querySelector(".overload-image-swipe");

if (overloadImageSwipe) {
  const previousButton = document.querySelector(".overload-image-arrow--prev");
  const nextButton = document.querySelector(".overload-image-arrow--next");

  function moveImageSlide(direction) {
    const slide = overloadImageSwipe.querySelector(".overload-image-slide");
    if (!slide) return;

    const gap = Number.parseFloat(getComputedStyle(overloadImageSwipe).columnGap) || 0;
    overloadImageSwipe.scrollBy({
      left: direction * (slide.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  }

  previousButton?.addEventListener("click", () => moveImageSlide(-1));
  nextButton?.addEventListener("click", () => moveImageSlide(1));
}
