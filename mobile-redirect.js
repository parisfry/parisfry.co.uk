function checkMobile() {
    if (window.innerWidth <= 700) {
        window.location.href = "mobile.html";
    }
}

checkMobile();
window.addEventListener("resize", checkMobile);