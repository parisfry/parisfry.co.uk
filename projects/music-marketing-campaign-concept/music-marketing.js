const videoSection = document.querySelector(".music-video-row");
const videoCards = [...document.querySelectorAll(".music-video-card")].map((card) => ({
  video: card.querySelector("video"),
  button: card.querySelector(".music-video-sound"),
}));

function muteAllVideos() {
  videoCards.forEach(({ video, button }) => {
    video.muted = true;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Turn sound on for ${button.dataset.videoLabel}`);
  });
}

videoCards.forEach(({ video, button }) => {
  video.muted = true;

  button.addEventListener("click", () => {
    const enableSound = video.muted;
    muteAllVideos();

    if (!enableSound) return;

    video.muted = false;
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", `Mute sound for ${button.dataset.videoLabel}`);
    video.play().catch(() => {
      muteAllVideos();
    });
  });
});

if (videoSection && "IntersectionObserver" in window) {
  const videoSectionObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
      muteAllVideos();
    }
  }, { threshold: [0, 0.15] });

  videoSectionObserver.observe(videoSection);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) muteAllVideos();
});

const campaignSwipe = document.querySelector(".music-campaign-swipe");

if (campaignSwipe) {
  const firstSlide = campaignSwipe.querySelector("img");
  const previousButton = document.querySelector(".music-campaign-arrow--prev");
  const nextButton = document.querySelector(".music-campaign-arrow--next");

  function moveCampaignSlide(direction) {
    if (!firstSlide) return;

    const gap = Number.parseFloat(getComputedStyle(campaignSwipe).columnGap) || 0;
    const slideWidth = firstSlide.getBoundingClientRect().width;
    campaignSwipe.scrollBy({ left: direction * (slideWidth + gap), behavior: "smooth" });
  }

  previousButton?.addEventListener("click", () => moveCampaignSlide(-1));
  nextButton?.addEventListener("click", () => moveCampaignSlide(1));
}

const timelineScroller = document.querySelector(".music-timeline-board");
const timelineIndicator = document.querySelector(".music-timeline-scroll-indicator span");

if (timelineScroller && timelineIndicator) {
  const updateTimelineIndicator = () => {
    const maxScroll = timelineScroller.scrollWidth - timelineScroller.clientWidth;
    const visibleRatio = timelineScroller.clientWidth / timelineScroller.scrollWidth;
    const trackWidth = timelineScroller.clientWidth;
    const thumbWidth = trackWidth * visibleRatio;
    const thumbTravel = trackWidth - thumbWidth;
    const progress = maxScroll > 0 ? timelineScroller.scrollLeft / maxScroll : 0;

    timelineIndicator.style.width = `${thumbWidth}px`;
    timelineIndicator.style.transform = `translateX(${thumbTravel * progress}px)`;
  };

  timelineScroller.addEventListener("scroll", updateTimelineIndicator, { passive: true });
  window.addEventListener("resize", updateTimelineIndicator);
  timelineScroller.querySelector("img").addEventListener("load", updateTimelineIndicator);
  updateTimelineIndicator();
}
