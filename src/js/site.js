// Plain Javascript 
$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 90) {
        $(".navbar-campus-life").addClass("scrolling");
    } else {
        $(".navbar-campus-life").removeClass("scrolling");
    }
});