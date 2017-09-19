(function ($) {

    function is_touch_device() {
        return 'ontouchstart' in window        // works on most browsers 
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };

    // Disable transitions;
    //$.support.transition = false;

    $(document).ready(function () {
        //MENU adjustments does not listen for changes, very unlikely change touch state on one device
        var $dropdowns = $("#macomb-center-nav > ul > li.dropdown");
        if (!is_touch_device()) {
            $dropdowns.hover(function() {
                $(this).find('.dropdown-menu').stop(true, true).fadeIn(100);
              }, function() {
                $(this).find('.dropdown-menu').stop(true, true).fadeOut(100);
              });
        }
        $dropdowns.on('click', 'a.dropdown-toggle', function(e){
            e.preventDefault();
            e.stopPropagation();
            document.location = e.target.href;
        });
       // $.support.transition = false;

        var sponsorsSliderConfiguration = {
            arrows: false,
            slidesToShow: 4,
            responsive: [
                {
                    breakpoint: 586,
                    settings: {
                        slidesToShow: 1,
                        autoplay: true,
                        autoplaySpeed: 2000
                    }
                }
            ]
        }

        $('.sponsors-slider').each(function () {
            $(this).slick(sponsorsSliderConfiguration).addClass("carousel slick-carousel");
        });

        




       

    });
})(jQuery);
