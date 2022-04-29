window.addEventListener("load", () => {
    const links = document.querySelectorAll(".menu-link");
    links.forEach((link) => {
        link.addEventListener("click", (ev) => {
            const loc = ev.target.getAttribute("href");
            location.href = loc;
        });
    });
});
