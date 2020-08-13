/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
//   (function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);

function maximise() {
//	$(window.threeDFrame.document.body).css('padding', 0);
//	$(window.threeDFrame.document.body).css('margin', '0 10px');
	var aw= $('#threeD').width();
	var ah = ($(document).height() - $("#vis").outerHeight() - 90); //console.log("computed height is: "+ah);
	if (ah < 572) {
		ah = 572;
	}
	$('#threeD').height(ah);
	AQUARIA.changeAppletSize();
}

AQUARIA.changeAppletSize = function() {
  var w = $('#threeD').css('width'); 
  var h = $('#threeD').css('height');

  if (AQUARIA.panel3d) {
    AQUARIA.panel3d.changeViewerSize(w, h);
  }
	
  //adjust sidebars
  $("#waitingFrame").css("width",  w);
  $("#waitingFrame").css("height",  h);
  matchSidebars(h);

}
var oldWidth = 0;


$('#threeD').resize( function() {
  // disable redraw if cluster is expanded or help is visible
  if ($("div.dimmer").length == 1 || $(".chardinjs-overlay").length ==1 ) { /*console.log("resize event fired by cluster expansion"); */ }
  else {
    var aw= $(this).width(); // $(this)[0].offsetWidth; //
    var ah = $(this).height();
    AQUARIA.changeAppletSize();
    matchSidebars(ah);
    if(aw !== oldWidth) {
    	AQUARIA.refresh();
    //	AQUARIA.display_features(AQUARIA.structures2match.sequences);
    	oldWidth = aw;
    	}
  }
});


function getAppletSize() {
	var frame = $("#threeDFrame")[0];
	var frameCompatible = (frame.contentWindow || frame.contentDocument);
	if (frameCompatible.document) { frameCompatible = frameCompatible.document; }
	return {width: $(frameCompatible).find("applet").css('width'), height: $(frameCompatible).find("applet").css('height')};
}

function expandFullScreen() {
	console.log("full screen");
	$("span#expander, div.panel#structureviewer").toggleClass("fullscreen");
	//if ($("#expander").hasClass("fullscreen")){ $("#threeD").height("inherit"); }
	//else { 
		$("#threeD").css("height","96%"); //}
}

$("span#expander").click(function() {
    expandFullScreen();
  });
  
function matchSidebars(ht) {
	var formheight = parseInt($("#searchByName").height())+110; //console.log("form is "+formheight+"px tall");
	$("#description span.content").height(ht+12);	
	$("div#uniProtDesc").height(ht-formheight); //console.log("uniProtDesc: "+$('div#uniProtDesc').height());
}


AQUARIA.appletFinishedLoading = function() {
	maximise();
};

module.exports.stopLogoSpin = function stopLogoSpin() {
	 $("#wait").hide(); 
}

module.exports.startLogoSpin = function startLogoSpin() {
	 $("#wait").show(); 
}

$(document).ready(function(e) {
	
	//make scrollbars appear
    $("#description span.content, div#uniProtDesc").on("mouseover", function() {
			$(this).css("overflow-y","auto");
		});
	$("#description span.content, div#uniProtDesc").on("mouseout", function() {
			$(this).css("overflow-y","hidden");	
		});
	//force refresh after Help closes
	$("body").on('chardinJs:stop', function() { console.log("closed help - redrawing");
		setTimeout(function(){ AQUARIA.refresh(); AQUARIA.changeAppletSize(); }, 300); 
	});
});
