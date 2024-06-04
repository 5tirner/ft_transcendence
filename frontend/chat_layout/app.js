/* ------------------------------------ */
/*  MTD Menu
/* ------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

    // Function to handle adding/removing classes
    function toggleClass(element, className) {
        element.classList.toggle(className);
    }

    function removeClass(element, className) {
        element.classList.remove(className);
    }

    // Menu Add Class Left
    document.getElementById("hamburger-icon").addEventListener("click", function() {
        const slideMenu = document.querySelector(".slide-menu");
        toggleClass(slideMenu, "slide-left");
    });

    // Menu Add Class Close
    document.querySelector("#close-btn").addEventListener("click", function() {
        const slideMenu = document.querySelector(".slide-menu");
        removeClass(slideMenu, "slide-left");
    })
    // Menu Dropdown menu active
    document.querySelector(".dropdownmenu").addEventListener("click", function() {
        const subMenu = document.querySelector(".sub-menu");
        toggleClass(subMenu, "active");

        // If fadeIn effect is needed
        subMenu.style.opacity = 0;
        subMenu.style.transition = "opacity 460ms";
        subMenu.style.opacity = 1;
    });

});
