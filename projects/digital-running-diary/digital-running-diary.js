(() => {
  const modal = document.querySelector(".video-modal");
  const modalVideo = modal?.querySelector(".video-modal-player");
  const closeButton = modal?.querySelector(".close-video");
  const videos = [...document.querySelectorAll(".section-four-video, .section-five-video, .section-six-video")];

  const setVolumeIcon = (button, muted) => {
    const icon = button?.querySelector("i");
    if (icon) icon.className = muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
  };

  const muteAll = () => {
    videos.forEach((video) => {
      video.muted = true;
      setVolumeIcon(video.closest(".section-four-video-wrapper, .section-five-video-wrapper, .section-six-video-wrapper")?.querySelector(".video-unmute"), true);
    });
  };

  videos.forEach((video) => {
    const wrapper = video.closest(".section-four-video-wrapper, .section-five-video-wrapper, .section-six-video-wrapper");
    const button = wrapper?.querySelector(".video-unmute");
    if (button) {
      button.type = "button";
      button.setAttribute("aria-label", "Turn video sound on");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const shouldUnmute = video.muted;
        muteAll();
        video.muted = !shouldUnmute;
        setVolumeIcon(button, video.muted);
        button.setAttribute("aria-label", video.muted ? "Turn video sound on" : "Turn video sound off");
        if (shouldUnmute) video.play().catch(() => {});
      });
    }

    video.addEventListener("click", () => {
      if (!modal || !modalVideo) return;
      muteAll();
      modalVideo.src = video.currentSrc || video.querySelector("source")?.src || "";
      modalVideo.muted = false;
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      modalVideo.play().catch(() => {});
    });
  });

  const closeModal = () => {
    if (!modal || !modalVideo) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
  };
  closeButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !entry.target.muted) {
          entry.target.muted = true;
          const button = entry.target.closest(".section-four-video-wrapper, .section-five-video-wrapper, .section-six-video-wrapper")?.querySelector(".video-unmute");
          setVolumeIcon(button, true);
          button?.setAttribute("aria-label", "Turn video sound on");
        }
      });
    }, { threshold: 0.2 });
    videos.forEach((video) => observer.observe(video));
  }

  const track = document.querySelector(".section-eight-grid");
  const previous = document.querySelector(".section-eight-prev");
  const next = document.querySelector(".section-eight-next");
  const cards = track ? Array.from(track.querySelectorAll(".section-eight-card")) : [];
  const arrowNavigationOnly = window.matchMedia("(max-width: 1366px)");
  let activeCard = 0;

  const updateCarouselArrows = () => {
    if (!arrowNavigationOnly.matches || !cards.length) return;
    if (previous) previous.hidden = activeCard === 0;
    if (next) next.hidden = activeCard === cards.length - 1;
  };

  const goToCard = (index) => {
    if (!track || !cards.length) return;
    activeCard = Math.max(0, Math.min(cards.length - 1, index));
    const card = cards[activeCard];
    const left = card.offsetLeft - track.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left, behavior: "smooth" });
    updateCarouselArrows();
  };

  const scrollByCard = (direction) => {
    if (arrowNavigationOnly.matches) {
      goToCard(activeCard + direction);
      return;
    }
    const card = track?.querySelector(".section-eight-card");
    if (!track || !card) return;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };
  previous?.addEventListener("click", () => scrollByCard(-1));
  next?.addEventListener("click", () => scrollByCard(1));
  updateCarouselArrows();
  arrowNavigationOnly.addEventListener("change", updateCarouselArrows);
})();
