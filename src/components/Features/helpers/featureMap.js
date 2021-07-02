import d3 from 'd3'
import $ from 'jquery'
import * as Panels from '../../AquariaLayout/helpers/hidePanels'
import * as common from '../../AquariaLayout/helpers/common'
var Highcharts = require('./highstocks.js')

export function createFeatureMap (datum, extServerIds_) {

  document.querySelectorAll("#selectedCluster [id*='r_'] rect").forEach(function (part) {
    part.style.fill = '#a5a5a5'
    part.style.stroke = '#a5a5a5'
  })
  document.querySelectorAll("#selectedCluster [id*='r_'] polygon").forEach(function (part) {
    part.style.fill = '#a5a5a5'
    part.style.stroke = '#a5a5a5'
  })
  //   window.AQUARIA.showMatchingStructures.drawCoverageMap(window.AQUARIA.showMatchingStructures.selectedCluster)
  // this.width = document.getElementById('structureviewer').offsetWidth / 1.2 - window.AQUARIA.margin.right - window.AQUARIA.margin.left
  // this.height = 40 - window.AQUARIA.margin.top - window.AQUARIA.margin.bottom + 35 // height
  this.width = document.getElementById('structure-viewer').offsetWidth / 1.2 - window.AQUARIA.margin.right - window.AQUARIA.margin.left
  this.height = 40 - window.AQUARIA.margin.top - window.AQUARIA.margin.bottom + 35 // height
  this.datum = datum
  var outerdiv = d3.select('#selectedFeature').append('div').attr('id', 'outerFeatureMap')
  this.drawTrack(this.datum, this.createSVGforFeature(outerdiv, '100vw', this.height + 10, this.width + 1), extServerIds_)
  d3.select('#outerFeatureMap > svg').attr('class', 'loadedFeature')
}

// Create SVG for selected feature
export function createSVGforFeature (outerdiv, width, height, viewboxWidth) {
  this.nusvg = outerdiv.append('svg').attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ' + viewboxWidth + ' ' + height)
    .attr('preserveAspectRatio', 'none')
  return this.nusvg
}

// Draw selected feature track
export function drawTrack (datum, svg, extServerIds_) {
  var _this = this
  var features = []
  this.nusvg = svg
  const AQUARIA = window.AQUARIA
  if (AQUARIA.currentFeature.oid && datum.Tracks.length > 1) {
    features[0] = datum.Tracks[AQUARIA.currentFeature.oid]
  } else {
    features = datum.Tracks
  }

  this.nusvg.on('click', function () {
    if (d3.select(this).attr('class').includes('loaded')) {
      // deselect feature (it's already displayed)
    //   if (document.querySelector('.featureHeader.actived')) {
    //     document.querySelector('.featureHeader.actived').click()
    //   }
      if (window.location.hash.includes('Features')) {
        d3.select('svg.loaded').classed('loaded', false)
        AQUARIA.panel3d.blankApplet(true, 'Removing feature...')
        AQUARIA.panel3d.blankApplet(false)
        // Stu hack to detect feature changes
        if (typeof AQUARIA.onFeatureChange === 'function') {
          AQUARIA.onFeatureChange(null, 0)
        }
        _this.removeCurrentAnnotationFrom3DViewer()
        AQUARIA.currentFeature.oid = null
        AQUARIA.currentFeature.data = null
        document.querySelector('#outerFeatureMap').remove()
        document.querySelector('#popup').style.display = 'none'
        AQUARIA.showMatchingStructures.showMap(AQUARIA.showMatchingStructures.cluster)
        Panels.hidePanels()
      } else {

      }
    } else { // console.log("clicked to display feature");
      document.querySelector('.featureHeader.actived').click()
      if (document.querySelector('#outerFeatureMap')) {
        document.querySelector('#outerFeatureMap').remove()
      }
      var oid = d3.select(this).attr('id').split('_')[2]
      AQUARIA.panel3d.blankApplet(true, 'Loading feature...')
      AQUARIA.panel3d.blankApplet(false)
      if (datum.Server !== 'Added Features') {
        AQUARIA.addedFeature = false
      }
      AQUARIA.passFeature(datum, oid, this)
      // Stu hack to detect feature changes
      if (typeof AQUARIA.onFeatureChange === 'function') {
        AQUARIA.onFeatureChange(datum, oid)
      }
      // console.log("Datum");
      // console.log(datum);
      // console.log(oid);
      d3.selectAll('svg.loaded rect.feature').attr('fill', '#a4abdf')
      d3.select('svg.loaded').classed('loaded', false)
      d3.select(this).attr('class', 'loaded') // console.log("it's " + d3.select(this).attr("class"));
      _this.createFeatureMap(datum, extServerIds_)
      Panels.hidePanels()
    }
  })

  this.nusvg.append('rect')
    .attr('width', this.width + AQUARIA.margin.left)
    .attr('height', 25)
    .attr('class', 'bg')
    .attr('fill', 'none')

  for (var o in features) {
    // draw outline of the whole chain
    this.nusg = this.nusvg.append('g').attr('transform', 'translate(0 ,20)')
    // add center line
    this.nusg.append('rect')
      .attr('width', this.width)
      .attr('height', 1)
      .attr('transform', 'translate(0,13)')
      .attr('class', 'insertion')
  }

  let firstSpecifiedPos = -1;
  let firstSpecifiedId = "";
  for (var p in features[o]) {
    this.drawFeatures(p, o, features, extServerIds_)

    if (features[o][p].label.match('span_missenseHeading')){
      // console.log("A feature is ")
      // console.log(features[o][p])

      if (firstSpecifiedPos == -1){
        window.AQUARIA.ifUrlHasVarExtractInfo2().then(function (varRes) {
          Object.keys(varRes).forEach(function(aRes, aRes_i){
            // console.log('aRes.order is ' + varRes[aRes].order)
            if (varRes[aRes].order == 0){
              firstSpecifiedPos = aRes_i
              firstSpecifiedId = 'r_' + o + '_' + p

              var element = document.getElementById(firstSpecifiedId)
              console.log("The first specified element is " + element)
              var event = new MouseEvent('mouseover', {
                'view': window,
                'bubbles': true,
                'cancelable': true
              });
              element.dispatchEvent(event);
              d3.select('#' + firstSpecifiedId).attr('stroke-width', '0px')

            }
          })
        })
      }

    }
  }

  // popup open by default on page load.
  // console.log("The smallest pos is " + smallestPos)




  // console.log("Element width is ")
  // console.log(element)

  d3.selectAll('#selectedFeature rect.feature').attr(
    'fill', function () {
      return d3.select(this).attr('color')
    })

  /*
  var event_2 = new MouseEvent('mouseleave', {
    'view': window,
    'bubbles': true,
    'cancelable': true
  });
  element.dispatchEvent(event_2)
  */

}

// Draw feature by residue
export function drawFeatures (p, o, features, extServerIds_) {
  var offsetWidth = document.getElementById('structure-viewer').offsetWidth
  var seqLength = window.AQUARIA.showMatchingStructures.sequence.length

  var myScale = d3.scale.linear().domain([1, seqLength]).range([1, document.getElementById('structure-viewer').offsetWidth / 1.2 - window.AQUARIA.margin.right - window.AQUARIA.margin.left - 5])
  var trans_x = myScale(parseInt(features[o][p].start))
  // var trans_x = Math.floor(parseInt(features[o][p].start)/seqLength * (offsetWidth - 300)) // ((parseInt(features[o][p].start)) * (parseFloat(window.AQUARIA.srw)))
  this.nusg.append('rect')
    .attr('width', function () { return (parseInt((features[o][p].size + 1) * window.AQUARIA.coverageMapsrw) > 2) ? parseInt((features[o][p].size + 1) * window.AQUARIA.coverageMapsrw) : 2 })
    .attr('height', 14)
    .attr('id', 'r_' + o + '_' + p)
    .attr('x', trans_x)
    .attr('transform', 'translate(0,6)')
    .attr('color', features[o][p].color).attr('fill', '#a4abdf')
    .attr('class', 'feature')
    .on('mouseover', createMouseOverCallback(features[o][p], extServerIds_))
    .on('mouseout',
      function () {
        var ID = d3.select(this).attr('id')
        return d3.select(this).call(mouseoutFeature, ID)
      })
    // .attr('fill-opacity', function () {
    //   return (this.datum.Class.track === 'single_track') ? 0.3 : 1
    // })
}

export function createMouseOverCallback (feature, extServerIds_) {
  return function () {
    // console.log(">>>>>>>>>> over here ....???");
    var ID = d3.select(this).attr('id')
    d3.select(this).call(mouseoverFeature, feature, ID, extServerIds_)
  }
}

const oneAaCodes = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']

// show feature pop-up
function showAnnotation (f, eid, extServerIds_) {
  var urlhtml = ''
  if (f.urls.length > 0) {
    // var lnx = f.urls.split(";");
    urlhtml = '<p>'
    for (var i = 0; i < f.urls.length; i++) {
      urlhtml += "<a href='" + f.urls[i].href + "' target='_blank'>" + f.urls[i].text + '</a><br>'
    }
    urlhtml += '</p>'
  }
  // $('div.popup').remove()
  var balloon = '<div style="display: none;"> <div id="divVariantInfo" class="aaLightBg"></div><div id="divVI_chosen"></div> <div id="divVI_posInfo"><hr class="anAaHr"><b>Residue ' + f.start + '</b></div> '

  let oldAa = ''
  if (f.name.includes('&#8201;&#8594;&#8201;')) {
    oldAa = f.name.replace(/^.*\(/, '')
    // eslint-disable-next-line
    oldAa = oldAa.replace(/\&.*$/, '')
  }
  let btnsDiv = '<div id="buttons_eachAa"> <b>See also:</b><p class="pAaColor"> ' + oldAa + ' &rarr;</p>'
  balloon = balloon + "<div id='divVI_varInfo'>"
  oneAaCodes.forEach(function (anAa, _i) {
    if (anAa !== oldAa) {
      balloon = balloon + "<div id='divVI_varInfo_" + anAa + "'></div>"
      const isUniCosOrFun = isUniCosOrFunPresent(anAa, f.desc, f.start)
      btnsDiv = btnsDiv + "<button id='btnVI_" + anAa + "'"
      if (isUniCosOrFun === true) {
        btnsDiv = btnsDiv + ' class="btnAaBold_b"> <b>' + anAa + '</b> '
      } else {
        btnsDiv = btnsDiv + ' class="btnAaBold"> ' + anAa
      }
      btnsDiv = btnsDiv + '</button>'
    }
  })

  balloon = balloon + '</div>'
  btnsDiv = btnsDiv + '</div>'
  balloon = balloon + btnsDiv
  balloon = balloon + '</div><div class="balloon" id="balloon"><span class="x">&nbsp;</span><p id="popupheader">'

  if (f.name.includes('span_missenseHeading')) {
    if (typeof extServerIds_ !== 'undefined') {
      let isAnyFalse = false
      for (const serverId in extServerIds_) {
        if (extServerIds_[serverId] === false) {
          isAnyFalse = true
        }
      }
      if (isAnyFalse === true) {
        balloon = balloon + '<img src="/images/ajax-loader1.gif" alt="Loading..."  width=15/> '
      }
      // console.log(extServerIds_)
    }
  }

  balloon = balloon + f.label
  if (!f.name.includes('span_missenseHeading')) {
    balloon = balloon + ' ('
    if (f.start === f.end) {
      balloon = balloon + 'Residue ' + f.start
    } else {
      balloon = balloon + 'Residues ' + f.start + '-' + f.end
    }
    balloon = balloon + ') '
  }

  if (!f.name.includes('span_missenseHeading')) {
    balloon = balloon + '<br/>'
  }

  // balloon = balloon.append(f.desc);
  balloon = balloon + f.desc + '</p>' + urlhtml + '</div>'
  // d3.select('#popuptext')
  //   // .append('div')
  //   // .attr('class', 'popup')
  //   .html(balloon)

  // $('div.popup').fadeIn()
  // var popheight = $('div.popup').innerHeight()

  if (Object.prototype.hasOwnProperty.call(f, 'hc_go') && Object.prototype.hasOwnProperty.call(f, 'hc_ec') && Object.prototype.hasOwnProperty.call(f, 'hc_species')) {
    // console.log('CATH plot data')
    // console.log(f)
    handleCathPopups(f).then(function () {
      updateTheStyleOfHc()
    })
  } else {
    console.log('CATH plot no data')
    console.log(f)
  }

  var fpos = document.querySelector('#' + eid).getBoundingClientRect()
  var svgdim = document.querySelector('#' + eid).getBBox()
  var fwidth = svgdim.width
  // var fleft = d3.select('#' + eid).attr('transform').split('(')[1].split(',')[0]
  // var ftop = fpos.top
  common.appendPopup(balloon, fpos, fwidth, true)

  // var bleft = parseInt(fpos.left + (fwidth / 2) - 235)
  // var btop = parseInt(fpos.top - popheight)

  // if (bleft < 0) {
  //   bleft = 0
  //   document.querySelector('div#popup').style.backgroundPositionX = '0px'
  // } else if (parseInt(fpos.left + (fwidth / 2)) + (470 / 2) > window.innerWidth) {
  //   bleft = bleft - 470 / 2
  //   document.querySelector('div#popup').style.backgroundPositionX = 'right'
  // } else {
  //   document.querySelector('div#popup').style.backgroundPositionX = 'center'
  // }

  // $('div#popup').css({
  //   left: bleft + 'px',
  //   top: btop + 'px',
  //   width: '470px'
  // })

  // // Click on X to close popup
  // $('span.x').on('click', function () {
  //   $('div.popup').fadeOut()
  // })

  // $('div.popup').on('hover', function () {
  //   clearTimeout(s)
  // }, function () {
  //   s = setTimeout(function () {
  //     $('div#popup').fadeOut()
  //   }, 500)
  // })
}

var t, s
export function mouseoverFeature (el, f, eid, extServerIds_) {
  t = setTimeout(function () {
    showAnnotation(f, eid, extServerIds_)
  }, 500)
  d3.select('#' + eid).attr('stroke-width', '2px').attr('stroke', 'white')
}

// Mouseout from feature
export function mouseoutFeature (el, eid) {
  clearTimeout(t)
  d3.select('#' + eid).attr('stroke-width', '0px')
  s = setTimeout(function () {
    moveTheDiv()
      .then(function () {
        $('div.popup').fadeOut()
      })
      .catch(
        function (error) {
          console.log(error)
        })
  }, 500)
}

export function moveTheDiv () {
  return new Promise(function (resolve, reject) {
    const aSuperFamFeature = document.getElementById('superFamCharts_0_go')
    document.getElementById('superFamCharts').append(aSuperFamFeature)
  })
}

function isUniCosOrFunPresent (anAa, desc, resNum) {
  console.log('These values are: ' + anAa + ' ' + resNum)
  const tagOpen = '<toReplace_varInfo_' + anAa + '>'
  const tagClose = '</toReplace_varInfo_' + anAa + '>'

  const firstOpenPos = desc.indexOf(tagOpen)
  const lastClosePos = desc.lastIndexOf(tagClose)

  const description = desc.substring(firstOpenPos, lastClosePos)

  if (description.match('UniProt') || description.match('FunVar') || description.match('COSMIC') || (window.AQUARIA.variantStructs.hasOwnProperty(resNum) && window.AQUARIA.variantStructs[resNum].hasOwnProperty(anAa) && window.AQUARIA.variantStructs[resNum][anAa].hasOwnProperty('pdbs') && window.AQUARIA.variantStructs[resNum][anAa]['pdbs'].length > 0)) {
    return true
  }
  return false
}

// DAS annotation handling

/**
 * removes the current annotation track from the 3D viewer
 */
export function removeCurrentAnnotationFrom3DViewer () {
  // remove existing Annotation
  const currentAnnotationsIn3DViewer = window.AQUARIA.currentAnnotationsIn3DViewer
  if (currentAnnotationsIn3DViewer !== undefined) {
    for (var i in currentAnnotationsIn3DViewer) {
      // API call
      window.AQUARIA.panel3d.removeAnnotation(currentAnnotationsIn3DViewer[i].id,
        currentAnnotationsIn3DViewer[i].annotationName)
    }
    currentAnnotationsIn3DViewer.length = 0
  }
}

// ////////////////////// CATH in popup

function handleCathPopups (f) {
  return new Promise(function (resolve, reject) {
    // console.log("here...??");
    // handle this one.
    if (typeof f.hc_go !== 'undefined' && Object.prototype.hasOwnProperty.call(f.hc_go, 'data') && Object.prototype.hasOwnProperty.call(f.hc_go.data, 'series') && f.hc_go.data.series.length >= 2) {
      doThePlottingV2('hc_go_div', f.hc_go.data.series[0].data, f.hc_go.data.series[1].data, '', f.hc_go.data.series[0].size, f.hc_go.data.series[0].dataLabels.color, f.hc_go.data.series[0].dataLabels.dist, f.hc_go.data.series[1].innerSize, f.hc_go.data.series[0].name, f.hc_go.data.series[1].name, f.hc_go.data.series[1].dataLabels.color).then(function () {
        // console.log('CATH plot: 1')
        document.getElementById('hc_go').prepend(document.getElementById('hc_go_div'))
      })
        .catch(function (error) {
          // console.log("CATH plot: 2");
          // if (!document.getElementById('hc_go_noData')){
          // create element
          createANewDivHcNoData('hc_go_noData').then(function () {
            document.getElementById('hc_go').prepend(document.getElementById('hc_go_noData'))
            document.getElementById('hc_go_noData').innerHTML = document.getElementById('hc_go_noData').innerHTML + '<br> <br> <center> No data</center>'
            console.log('featureslist.showAnnotation ERROR ' + error)
          })
        // }
        })
    } else {
      // no data.

      // if (!document.getElementById('hc_go_noData')){
      // create element
      createANewDivHcNoData('hc_go_noData').then(function () {
        document.getElementById('hc_go').prepend(document.getElementById('hc_go_noData'))
        document.getElementById('hc_go_noData').innerHTML = document.getElementById('hc_go_noData').innerHTML + '<br> <br> <center> No data</center>'
      })
      // }
      // console.log('CATH plot: 3')

      // document.getElementById('hc_go_div').style['background-color'] = "white";
    }

    if (typeof f.hc_ec !== 'undefined' && Object.prototype.hasOwnProperty.call(f.hc_ec, 'data') && Object.prototype.hasOwnProperty.call(f.hc_ec.data, 'series') && f.hc_ec.data.series.length >= 2) {
      doThePlottingV2('hc_ec_div', f.hc_ec.data.series[0].data, f.hc_ec.data.series[1].data, '', f.hc_ec.data.series[0].size, f.hc_ec.data.series[0].dataLabels.color, f.hc_ec.data.series[0].dataLabels.dist, f.hc_ec.data.series[1].innerSize, f.hc_ec.data.series[0].name, f.hc_ec.data.series[1].name, f.hc_ec.data.series[1].dataLabels.color).then(function () {
        document.getElementById('hc_ec').prepend(document.getElementById('hc_ec_div'))
      })
        .catch(function (error) {
          // if (!document.getElementById('hc_ec_noData')){
          // create element
          createANewDivHcNoData('hc_ec_noData').then(function () {
            document.getElementById('hc_ec').prepend(document.getElementById('hc_ec_noData'))
            document.getElementById('hc_ec_noData').innerHTML = document.getElementById('hc_ec_noData').innerHTML + '<br> <br> <center> No data</center>'
            console.log('featureslist.showAnnotation ERROR ' + error)
          })
          // }
        })
    } else {
      // no data
      // document.getElementById('hc_ec').innerHTML = document.getElementById('hc_ec').innerHTML + ' <br> No data';
      // if (!document.getElementById('hc_ec_noData')){
      // create element
      createANewDivHcNoData('hc_ec_noData').then(function () {
        document.getElementById('hc_ec').prepend(document.getElementById('hc_ec_noData'))
        document.getElementById('hc_ec_noData').innerHTML = document.getElementById('hc_ec_noData').innerHTML + '<br> <br> <center> No data</center>'
      })
        .catch(function () {
        })
      // }
    }

    if (typeof f.hc_species !== 'undefined' && Object.prototype.hasOwnProperty.call(f.hc_species, 'data') && Object.prototype.hasOwnProperty.call(f.hc_species.data, 'series') && f.hc_species.data.series.length >= 2) {
      doThePlottingV2('hc_species_div', f.hc_species.data.series[0].data, f.hc_species.data.series[1].data, '', f.hc_species.data.series[0].size, f.hc_species.data.series[0].dataLabels.color, f.hc_species.data.series[0].dataLabels.dist, f.hc_species.data.series[1].innerSize, f.hc_species.data.series[0].name, f.hc_species.data.series[1].name, f.hc_species.data.series[1].dataLabels.color).then(function () {
        document.getElementById('hc_species').prepend(document.getElementById('hc_species_div'))
      })
        .catch(function (error) {
        // if (!document.getElementById('hc_species_noData')){
        // create element
          createANewDivHcNoData('hc_species_noData').then(function () {
            document.getElementById('hc_species').prepend(document.getElementById('hc_species_noData'))
            document.getElementById('hc_species_noData').innerHTML = document.getElementById('hc_species_noData').innerHTML + '<br> <br> <center> No data</center>'

            console.log('featureslist.showAnnotation ERROR ' + error)
          })
          // }
        })
    } else {
      createANewDivHcNoData('hc_species_noData').then(function () {
        document.getElementById('hc_species').prepend(document.getElementById('hc_species_noData'))
        document.getElementById('hc_species_noData').innerHTML = document.getElementById('hc_species_noData').innerHTML + '<br> <br> <center> No data</center>'
      })
    }
    resolve()
  })
}

function updateTheStyleOfHc () {
  const hcSeriesGroup = document.getElementsByClassName('highcharts-pie-series')
  // console.log("The highcharts series group are: ");
  // console.log(hcSeriesGroup);
  // console.log(hcSeriesGroup.children('path'));

  for (const key in hcSeriesGroup) {
    if (Object.prototype.hasOwnProperty.call(hcSeriesGroup, key)) {
      /* hcSeriesGroup[key].childNodes.forEach(function(item, i){
      console.log("The item is");
      console.log(item);
      }); */

      const thePaths = hcSeriesGroup[key].getElementsByTagName('path')
      // console.log("The paths are");
      // console.log(thePaths);

      for (const pathKey in thePaths) {
        if (Object.prototype.hasOwnProperty.call(thePaths, pathKey)) {
          // console.log('The path is ');
          // console.log(thePaths[pathKey]);
          // console.log(thePaths[pathKey].getAttribute('fill'));

          const theColor = thePaths[pathKey].getAttribute('fill')

          thePaths[pathKey].removeAttribute('fill')
          thePaths[pathKey].setAttribute('style', 'fill:' + theColor)
        }
      }
    }
  }
}

function doThePlottingV2 (divId, theSeriesDataInner, theSeriesDataOuter, theTitle, theSizeInner, labelColInner, labelDistInner, innerSizeOuter, nameInner, nameOuter, labelColOuter) {
  return new Promise(function (resolve, reject) {
    createANewDivHcNoData(divId).then(function () {
      // First add new Div.
      try {
        Highcharts.chart(divId, {
          chart: {
            type: 'pie',
            margin: 0
          },
          title: {
            text: theTitle
          }, /*
          subtitle: {
          text: 'Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
          }, */
          plotOptions: {
            pie: {
              shadow: false,
              center: ['50%', '50%']
            }
          },
          tooltip: {
            valueSuffix: '%'
          },
          series: [{
            name: nameInner,
            data: theSeriesDataInner,
            size: theSizeInner,
            dataLabels: {
              enabled: false,
              formatter: function () {
                return this.y > 3 ? this.point.name : null
              },
              color: labelColInner,
              distance: labelDistInner
            }
          }, {
            name: nameOuter,
            data: theSeriesDataOuter,
            // size: '80%',
            innerSize: innerSizeOuter,
            dataLabels: {
              enabled: false,
              formatter: function () {
                // display only if larger than 1
                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                this.y + '%' : null
              },
              color: labelColOuter
            },
            id: 'versions'
          }],
          responsive: {
            rules: [{
              condition: {
                maxWidth: 100
              },
              chartOptions: {
                series: [{
                }, {
                  id: 'versions',
                  dataLabels: {
                    enabled: false
                  }
                }]
              }
            }]
          }
        })
        resolve()
        // console.log('In the highcharts plotting function')
      } catch (error) {
        console.log('Highcharts error')
        console.log(error)
        resolve()
        // console.log('In the highcharts plotting function')
      }
    })
    /* }
    catch(error){
    console.log("Highcharts error");
    console.log(error);
    } */
  })
}

function createANewDivHcNoData (divId) {
  return new Promise(function (resolve, reject) {
    if (document.getElementById(divId)) {
      document.getElementById(divId).remove() //  = '';
    }
    // if (!document.getElementById(divId)){
    const newDiv = document.createElement('div')
    document.getElementById('superFamCharts').append(newDiv)
    newDiv.id = divId
    newDiv.style = 'width: 100px; height: 100px; margin: 0 auto; background-color: white;'

    // if (document.getElementById(divId)){
    resolve()
    // }
    // }
  })
}
