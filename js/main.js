$(function() {
	
	// print link
	$("#print_link").on("click", function(evt) {
		evt.preventDefault();
		window.print();
	});

	// docked header / footer animation
    $(window).scroll(function() {
    	var top = "-3em",
			bottom = "-4em";

        if ($(window).scrollTop() > 230) {
        	top = "0";
        	bottom = "0";
		}

        $(".navbar.fixed-top").css("top", top);
        $(".navbar.fixed-bottom").css("bottom", bottom);
	});

});
