document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

// ---------- Project gallery ----------

const desktopGallery = document.querySelector(".desktop-gallery");
const mobileGallery = document.querySelector(".mobile-gallery");

if (desktopGallery || mobileGallery) {

    const visibleGallery =
        desktopGallery &&
        window.getComputedStyle(desktopGallery).display !== "none"
            ? desktopGallery
            : mobileGallery;

    const items = Array.from(
        visibleGallery.querySelectorAll("img, video")
    );

    items.sort((a, b) =>
        Number(a.dataset.order) - Number(b.dataset.order)
    );

    const elements = items.map(el => {

        if (el.tagName === "VIDEO") {

            return {
                href: el.querySelector("source").src,
                type: "video"
            };

        }

        return {
            href: el.src,
            type: "image"
        };

    });

    const lightbox = GLightbox({

        elements,
        loop:true,
        touchNavigation:true,
        autoplayVideos:true,

        zoomable:false,
        draggable:false,

        moreText:false,
        skin:"clean",

        openEffect:"fade",
        closeEffect:"fade",

        touchFollowAxis:false,

        plyr:{
            config:{
                controls:["play","progress","current-time","fullscreen"],
                muted:true,
                volume:0
            }
        }

    });

    lightbox.on("slide_changed", ({ current }) => {

        const video = current?.slide?.querySelector("video");

        if(video){

            video.muted = true;
            video.volume = 0;
            video.autoplay = false;

        }

    });

    lightbox.on("slide_after_load", ({ slide }) => {

        const img = slide.querySelector("img");
        const media = slide.querySelector(".gslide-media");

        if(img){

            img.style.pointerEvents = "none";
            img.style.cursor = "default";

        }

        if(media){

            media.style.transform = "none";

        }

    });

    items.forEach(item => {

        item.style.cursor = "default";

        item.addEventListener("click", e => {

            e.preventDefault();

            lightbox.openAt(items.indexOf(item));

        });

    });

  }


document.querySelectorAll(".video-unmute").forEach(button => {

    button.addEventListener("click", () => {

        const wrapper = button.closest(
            ".section-four-video-wrapper, .section-five-video-wrapper, .section-six-video-wrapper"
        );

        const video = wrapper.querySelector(
            ".section-four-video, .section-five-video, .section-six-video"
        );

        const icon = button.querySelector("i");

        if (video.muted) {

            document.querySelectorAll(
                ".section-four-video, .section-five-video, .section-six-video"
            ).forEach(v => {
                v.muted = true;
            });

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


});
