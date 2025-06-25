// When the user scrolls the page, execute updateHeader function

window.onscroll = function() {updateHeader()}

// Get the header and the offset position of the header
var header = document.getElementsByClassName("header")[0]

// Initialise scroll position variable
var lastScrollTop = 0;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function updateHeader() {

    var st = window.pageYOffset;
    if (st > lastScrollTop){
      // downscroll code
      header.classList.remove("header")
      header.classList.add("nav-up")
      header.classList.add("header")
    } else {
      // upscroll code
      header.classList.remove("nav-up")
    }
    lastScrollTop = (st <= 0) ? 0 : st; // For Mobile or negative scrolling
    
    if (window.pageYOffset > 0) {
      header.classList.remove("header")
      header.classList.add("sticky")
      header.classList.add("header")

    } else {
        header.classList.remove("sticky")
    }

    
}



function navUp(){
}