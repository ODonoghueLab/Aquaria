var selectRes = new MutationObserver(function () {
  if(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.display == 'none'){
    document.querySelector('.jolecule-embed-footer').style.visibility = 'hidden'
    document.querySelector('#threeDSpan-inner').style.height = '99.5%'
    document.querySelector('.icons').style.bottom = '11px'
  }
  else{
    document.querySelector('.jolecule-embed-footer').style.visibility = 'visible'
    document.querySelector('#threeDSpan-inner').style.height = '95%'
    document.querySelector('.icons').style.bottom = '85px'
  }
})

selectRes.observe(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection'), {
  childlist: true,
  attributes: true,
  attributeFilter: ['style'],
  characterDataOldValue: true
})

//NEBLINA'S SCRIPT TO MOVE JOLECULE BUTTON TO THE RIGHT
$("#export-button").removeAttr("style")
  .attr("style", "position: absolute; z-index: 2; top: 6px; right: 33px; margin: 5px; width:35px;")

// $("#toggle-toolbar-button").removeAttr("style")
//   .attr("style", "position: absolute; z-index: 2; top: 3px; right: 0px; margin: 5px; transform: rotate(180deg)")

// $("#toggle-toolbar-button2").click(function () {
//   $("#toggle-toolbar-button").removeAttr("style")
//     .attr("style", "position: absolute; z-index: 2; top: 3px; right: 0px; margin: 5px; transform: rotate(180deg)")
// })

// $(window).on('resize', function () {
//   $("#toggle-toolbar-button").removeAttr('style')
//     .attr("style", "position: absolute; z-index: 2; top: 0px; right: 3px; margin: 5px; transform: rotate(180deg)")
// });

$('.jolecule-embed-header').attr("style", "display: none; flex-flow: row-reverse;")

$(".jolecule-embed-view").removeAttr('style').css({
  position: "",
  "z-index": "1",
  "padding": "4px 5px",
  "display": "flex",
  "top": "2px"
})


// if ((($("#threeDSpan-inner-clipping-plane").length > 0) && $("#export-button").length <= 0)) {
//   $(".jolecule-embed-header").append("<span class='jolecule-button' id='export-button'>Export USDZ</span>")
// }

//Align feature description text
$("#threeDSpan-inner-jolecule-soup-display").css({ 'text-align': 'left' })

// TOGGLE COLOR LEGEND
// var toggle_legend = new MutationObserver(function () {
//   console.log("THIS IS COLOR LEGEND")
//   $("#color-legend-buttons").removeAttr("id").attr("id", "color_legend_buttons")

//   $("#color-legend").click(function () {
//     $('[id^="color-legend-"]').toggle();
//   })

//   $('[id^="color-legend-"]').hide()
// });

// toggle_legend.observe(document.getElementById("color-legend"), {
//   childlist: true,
//   attributes: true,
//   attributeFilter: ['style']
// });

var select_residue = new MutationObserver(function () {
  $("#first_match").hide()
  $("#threeDSpan-inner-sequence-widget-inner>canvas").show()
});

// var on_load = new MutationObserver(function (m) {
//   m.forEach(function (mutation) {
//     if (mutation.attributeName !== 'style') return;
//     var currentValue = mutation.target.style.display;
//     if (currentValue == "none") {
//       if (document.getElementById("loading-message").innerHTML == "Preparing views...") {
//         $(".jolecule-button").hide()
//         // $("#toggle-toolbar-button").hide()
//         $("#export-button").hide()
//         $("#intro").hide()
//         $('#structurematches').hide()
//         $('div.dimmer').remove()
//         $('#gene_name').show()
//         $("#title3D").css("display", "none")
//         $("#searchByName").css("display", "none")

//         sessionStorage.setItem("link", $(location).attr('pathname'))

//         select_residue.observe(document.getElementById("threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection"), {
//           childlist: true,
//           attributes: true,
//           attributeFilter: ['style']
//         });

//         if ($("#first_match").length > 0) {
//           $("#first_match").remove()
//         }
//         //THE COVERAGE MAP
//         $("#threeDSpan-inner-sequence-widget-inner>canvas").hide()
//         if ($("#first_match").length < 1) {
//           var a = $("div.container.loaded").html()
//           var b = $('<div id="first_match">').append(a)
//           $("#threeDSpan-inner-sequence-widget-inner").append(b)
//         }

//         var windowWidth = window.innerWidth
//         $("#first_match>svg>g").find('.thumbnail').remove()
//         document.querySelector("#first_match>svg>g>g>line").setAttribute("x1", -windowWidth);
//         document.querySelector("#first_match>svg>g>g>line").setAttribute("x2", windowWidth + 100);
//         $("#first_match>svg").css({ "width": "100%" })
//         var g_left = parseInt($("#first_match>svg>g").css('transform').split(', ')[4])
//         $("#first_match>svg>g").attr("transform", "translate(" + g_left + ",2)")
//         $("#first_match").css({

//         })
//         $("#first_match").on("mouseenter", function () {
//           $("#first_match").css({
//             transform: "scale(1.04)"
//           })
//         });
//         $("#first_match").on("mouseleave", function () {
//           $("#first_match").css({
//             transform: "scale(1)"
//           })
//         });
//         //   var svg_width = document.querySelector("#first_match > svg").getAttribute("viewBox").split(' ')[2]
//         //   var svg_height = document.querySelector("#first_match > svg").getAttribute("viewBox").split(' ')[3]
//         //   document.querySelector("#first_match > svg").setAttribute("viewBox","0 0 " + svg_width + " " + svg_height- 20 )

//         //REMOVE FOOTER BORDER

//         $(".jolecule-embed-footer").css({ "border-top": "none" })

//         $('#first_match').on('click', function () {
//           if (document.getElementsByClassName('dimmer').length === 0) {
//             $('body').append('<div class="dimmer"></div>')
//             $('#gene_name').hide()
//             $('div.dimmer').on('click', function () {
//               $('#structurematches').hide()
//               $('div.dimmer').remove()
//               $('#gene_name').show()
//             })
//           } else {
//             $('div.dimmer').remove()
//           }
//           $('#structurematches').slideToggle('slow')
//         })

//       }
//     }
//   })
// });

// on_load.observe(document.getElementById("waitingFrame"), {
//   attributes: true,
//   attributeFilter: ["style"]
// })
