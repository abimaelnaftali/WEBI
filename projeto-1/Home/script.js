var lastScrollTop = 0;
navbar = document.getElementById("nav");
window.addEventListener("scroll", function(){
    var scrollTop = this.window.scrollY || this.document .documentElement.scrollTop;
    if(scrollTop > lastScrollTop){
        navbar.style.height="0";
    } else {
        navbar.style.height="13vh";
    }
    lastScrollTop = scrollTop;
})