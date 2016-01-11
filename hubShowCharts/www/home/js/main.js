(function (window, $) {
	'use strict';

	// Cache document for fast access.
	var document = window.document;


	$('a.toggle-menu').click(function(){
        $('ul.menu').fadeToggle("slow");
    });



})(window, jQuery);




