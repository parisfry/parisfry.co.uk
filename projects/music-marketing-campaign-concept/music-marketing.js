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
  const firstSlide = campaignSwipe.querySelector(".music-campaign-slide");
  const campaignSlides = [...campaignSwipe.querySelectorAll(".music-campaign-slide")];
  const previousButton = document.querySelector(".music-campaign-arrow--prev");
  const nextButton = document.querySelector(".music-campaign-arrow--next");

  function updateCampaignArrows() {
    const gap = Number.parseFloat(getComputedStyle(campaignSwipe).columnGap) || 0;
    const slideWidth = firstSlide?.getBoundingClientRect().width || 0;
    const activeSlide = slideWidth
      ? Math.round(campaignSwipe.scrollLeft / (slideWidth + gap))
      : 0;

    if (previousButton) previousButton.hidden = activeSlide === 0;
    if (nextButton) nextButton.hidden = activeSlide >= Math.min(1, campaignSlides.length - 1);
  }

  function moveCampaignSlide(direction) {
    if (!firstSlide) return;

    const gap = Number.parseFloat(getComputedStyle(campaignSwipe).columnGap) || 0;
    const slideWidth = firstSlide.getBoundingClientRect().width;
    campaignSwipe.scrollBy({ left: direction * (slideWidth + gap), behavior: "smooth" });
  }

  previousButton?.addEventListener("click", () => moveCampaignSlide(-1));
  nextButton?.addEventListener("click", () => moveCampaignSlide(1));
  campaignSwipe.addEventListener("scroll", updateCampaignArrows, { passive: true });
  window.addEventListener("resize", updateCampaignArrows);
  updateCampaignArrows();
}

const postDialog = document.querySelector(".music-post-dialog");
const postDialogContent = postDialog?.querySelector(".music-post-dialog-content");
const postDialogClose = postDialog?.querySelector(".music-post-dialog-close");
let previousPageOverflow = null;

function lockPageScroll() {
  if (previousPageOverflow) return;
  previousPageOverflow = {
    html: document.documentElement.style.overflow,
    body: document.body.style.overflow,
  };
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function unlockPageScroll() {
  if (!previousPageOverflow) return;
  document.documentElement.style.overflow = previousPageOverflow.html;
  document.body.style.overflow = previousPageOverflow.body;
  previousPageOverflow = null;
}

function resetPostDialogShape() {
  postDialog?.classList.remove("music-post-dialog--video");
  postDialog?.style.removeProperty("--post-ratio");
}

document.querySelectorAll(".music-instagram-tile[data-post-kind=\"video\"]").forEach((tile) => {
  const preview = tile.querySelector("video");
  if (!preview) return;

  tile.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    preview.muted = true;
    preview.play()
      .then(() => tile.classList.add("is-playing"))
      .catch(() => {});
  });

  tile.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    preview.pause();
    tile.classList.remove("is-playing");
  });
});

function closeExpandedPost() {
  if (!postDialog || !postDialogContent) return;
  postDialog.close();
  postDialogContent.replaceChildren();
}

document.querySelectorAll(".music-instagram-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!postDialog || !postDialogContent) return;
    const kind = trigger.dataset.postKind;
    const source = trigger.dataset.postSrc;

    postDialogContent.replaceChildren();
    if (kind === "video") {
      const video = document.createElement("video");
      video.src = source;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      postDialog.classList.add("music-post-dialog--video");
      postDialog.style.setProperty("--post-ratio", "9 / 16");
      video.addEventListener("loadedmetadata", () => {
        if (video.videoWidth && video.videoHeight) {
          postDialog.style.setProperty("--post-ratio", `${video.videoWidth} / ${video.videoHeight}`);
        }
      }, { once: true });
      postDialogContent.append(video);
      postDialog.showModal();
      lockPageScroll();
      video.play().catch(() => {});
      return;
    }

    resetPostDialogShape();
    const image = document.createElement("img");
    image.src = source;
    image.alt = trigger.querySelector("img")?.alt || "Expanded Sugar Girl Instagram post";
    postDialogContent.append(image);
    postDialog.showModal();
    lockPageScroll();
  });
});

postDialogClose?.addEventListener("click", closeExpandedPost);
postDialog?.addEventListener("click", (event) => {
  if (event.target === postDialog) closeExpandedPost();
});
postDialog?.addEventListener("close", () => {
  postDialogContent?.replaceChildren();
  resetPostDialogShape();
  unlockPageScroll();
});

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
