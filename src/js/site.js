// Plain Javascript 
$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 90) {
        $(".navbar-campus-life").addClass("scrolling");
    } else {
        $(".navbar-campus-life").removeClass("scrolling");
    }
});

/*
 * Initializing and Settings
 * 
 */

// Testimonial Carousel
$('.testimonial-carousel').owlCarousel({
    items:2,
    loop:true,
    dots:true,
    margin:15,
    autoplay:true,
	autoplayHoverPause:true,
	responsiveClass:true,
	responsive:{
		0:{
			items:1
		},
		768:{
			items:1
		},
		992:{
			items:2
		}
	}
});

// Two-column Carousel
$('.twoColumn-carousel').owlCarousel({
    items:1,
    loop:true,
    dots:true,
    autoplay:true,
    autoplayHoverPause:true
});

// Swiper Gallery
var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows : true,
    },
    pagination: {
        el: '.swiper-pagination',
    },
});
