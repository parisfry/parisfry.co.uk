const modal = document.querySelector(".video-modal");
const modalVideo = modal.querySelector("video");
const caption = modal.querySelector(".video-caption");
const close = modal.querySelector(".close-video");

document.addEventListener("DOMContentLoaded", () => {

    const isMobile = window.matchMedia("(max-width: 1100px)").matches;
    const activeClass = isMobile ? "lightbox-mobile" : "lightbox-desktop";

    const images = document.querySelectorAll(`img.${activeClass}`);

    const elements = Array.from(images).map(el => ({
        href: el.src,
        type: "image",
        description: el.dataset.caption || ""
    }));

    const lightbox = GLightbox({
        elements,
        loop:false,
        touchNavigation:true,
        draggable:true,
        zoomable:false,
        openEffect:"fade",
        closeEffect:"fade",
         moreLength: 0
    });

    images.forEach((item, index) => {
        item.classList.add("lightbox-item");
        item.addEventListener("click", () => {
            lightbox.openAt(index);
        });
    });

document.querySelectorAll(`video.${activeClass}`).forEach(video => {
    video.classList.add("lightbox-item");

    video.addEventListener("click", () => {

        video.muted = true;

        const button = video.closest(
            ".section-four-video-wrapper, .section-five-video-wrapper, .section-six-video-wrapper, .section-nine-video-wrapper"
        )?.querySelector(".video-unmute");

        if (button) {
            const icon = button.querySelector("i");

            if (icon) {
                icon.className = "fa-solid fa-volume-xmark";
            }
        }
        modal.classList.add("active");

        modalVideo.src = video.querySelector("source").src;
        modalVideo.controls = true;
        modalVideo.controlsList = "nodownload noplaybackrate";
        modalVideo.disablePictureInPicture = true;

        modalVideo.muted = false;

        caption.textContent = video.dataset.caption || "";

        modalVideo.play();
    });
});

});

close.addEventListener("click",()=>{

    modal.classList.remove("active");

    modalVideo.pause();

    modalVideo.src="";

});

modal.addEventListener("click",e=>{

    if(e.target===modal){

        modal.classList.remove("active");

        modalVideo.pause();

        modalVideo.src="";

    }

});

document.querySelectorAll("[data-caption]").forEach(media => {

    const wrapper = document.createElement("div");

    wrapper.className = "caption-wrapper";


    media.parentNode.insertBefore(wrapper, media);

    wrapper.appendChild(media);


    const caption = document.createElement("div");

    caption.className = "media-caption";

    caption.textContent = media.dataset.caption;


    wrapper.appendChild(caption);


    media.addEventListener("mouseenter", () => {
        caption.classList.add("visible");
    });


    media.addEventListener("mouseleave", () => {
        caption.classList.remove("visible");
    });

});

document.querySelectorAll(".video-unmute").forEach(button => {

    button.addEventListener("click", (e) => {

        e.stopPropagation(); 

        const wrapper = button.closest(
            ".section-four-video-wrapper, .section-five-video-wrapper, .section-six-video-wrapper, .section-nine-video-wrapper"
        );

        const video = wrapper.querySelector(
            ".section-four-video, .section-five-video, .section-six-video, .section-nine-video"
        );

        const icon = button.querySelector("i");

        if (video.muted) {

            document.querySelectorAll(
                ".section-four-video, .section-five-video, .section-six-video, .section-nine-video"
            ).forEach(v => { v.muted = true; });

            document.querySelectorAll(".video-unmute i").forEach(i => {
                i.className = "fa-solid fa-volume-xmark";
            });

            video.muted = false;
            icon.className = "fa-solid fa-volume-high";

        } else {

            video.muted = true;
            icon.className = "fa-solid fa-volume-xmark";

        }

    });

});

const sectionNine = document.querySelector(".section-nine-video");

if (sectionNine) {

    const button = sectionNine.querySelector(".video-unmute");
    const video = sectionNine.querySelector("video");
    const icon = button.querySelector("i");

 button.addEventListener("click", (e) => {
    e.stopPropagation();

        if (video.muted) {

            video.muted = false;
            icon.className = "fa-solid fa-volume-high";

        } else {

            video.muted = true;
            icon.className = "fa-solid fa-volume-xmark";

        }

    });

}
document.querySelectorAll(".project-category").forEach(button => {

    button.addEventListener("click", () => {

        const section = button.parentElement;

        section.classList.toggle("active");


        const icon = button.querySelector("span");

        icon.textContent = section.classList.contains("active")
            ? "−"
            : "+";

    });

});

const items = document.querySelectorAll(".column li, .mobile-column li");

function updateBlur() {

    const trigger = window.innerHeight * 0.80;

    items.forEach(item => {

        const rect = item.getBoundingClientRect();

        const progress = Math.max(
            0,
            Math.min(1, (trigger - rect.top) / 120)
        );

        item.style.filter = `blur(${(1 - progress) * 4}px)`;
        item.style.opacity = 0.25 + progress * 0.75;

    });

}

window.addEventListener("scroll", updateBlur);
window.addEventListener("resize", updateBlur);
window.addEventListener("load", updateBlur);

updateBlur();

const track = document.querySelector(".instagram-track");
const slides = document.querySelectorAll(".instagram-slide");

const prevButton = document.querySelector(".instagram-prev");
const nextButton = document.querySelector(".instagram-next");

const dots = document.querySelectorAll(".instagram-dot");

let currentSlide = 0;

function updateInstagramCarousel() {

    track.style.transform =
        `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentSlide
        );

    });

    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slides.length - 1;
}

nextButton.addEventListener("click", () => {

    if (currentSlide < slides.length - 1) {

        currentSlide++;

        updateInstagramCarousel();

    }

});

prevButton.addEventListener("click", () => {

    if (currentSlide > 0) {

        currentSlide--;

        updateInstagramCarousel();

    }

});

updateInstagramCarousel();

const videos = document.querySelectorAll("video");

const videoObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        const video = entry.target;

        if (!entry.isIntersecting) {

            video.muted = true;

            const button = video.closest(
                ".section-four-video-wrapper, .section-five-video-wrapper, .section-six-video-wrapper, .section-nine-video-wrapper"
            )?.querySelector(".video-unmute");

            if (button) {
                const icon = button.querySelector("i");

                if (icon) {
                    icon.className = "fa-solid fa-volume-xmark";
                }
            }

        }

    });

}, {
    threshold: 0.2
});

videos.forEach(video => {
    videoObserver.observe(video);
});