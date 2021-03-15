/** generic functions and stuff to run once document is loaded
 *
 */

// jQuery - format numbers with commas every 3 digits;   to use:  $("span.numbers").digits();

$.fn.digits = function(){
    return this.each(function(){
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
    })
}

// Once document is ready, move focus to protein input field

$(document).ready(function() {
	  $( "#protein_syn_input, #organism_syn_input" ).focus( function() {
		  $(".infocus").removeClass("infocus");
		  $("#searchByName").addClass("infocus");
	  });

	  $("#help3D").hide();

});

$(function() {
    $( document ).tooltip({ position: { my: "right top+15", at: "right center", collision: "none" }}, { show: { delay: 1200 } });
  });
