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
/*
function jsToolTips() {
	// CONVERT ALL title ATTRIBUTES TO data-title TO DISPLAY TOOLTIPS IN JAVASCRIPT
	$("[title]").attr("data-title", function() { 
		var tooltip = $(this).attr("title");
		$(this).removeAttr("title");
		return tooltip; 
	});
	
	
	$("[data-title]").mouseenter( 
		function(e) { console.log("hovering over data-title");
			$(".longtitle").remove(); //remove old instance from DOM
			var tooltip = null;	//reset
			tooltip = $(this).attr("data-title");
			timer = window.setTimeout( showTitle, 500, tooltip, e);
		});
		
	$("[data-title]").mouseleave( function() {
		nodeOut();
		});
	
	function nodeOut(){ window.clearTimeout(timer); $(".longtitle").fadeOut(); }
	
	function showTitle(strng, event) {
		var p = $(event.target).offsetParent().offset();
		var t = $(event.target).offset();
		var wx = parseInt(t.left-p.left);
		var wy = parseInt(t.top-p.top); 
		
		$(event.target).offsetParent().append("<div class='longtitle' style='left:"+wx+"px; top:"+(wy+20)+"px;'>"+strng+"</div>");
		$("div.longtitle").fadeIn("slow");
	}
}
*/
$(function() {
    $( document ).tooltip({ position: { my: "right top+15", at: "right center", collision: "none" }}, { show: { delay: 1200 } });
  });