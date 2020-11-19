import d3 from 'd3'
import $ from 'jquery'

export function createFeatureMap (datum) {
  document.querySelectorAll("#selectedCluster [id*='r_'] rect").forEach(function (part) {
    part.style.fill = '#a5a5a5'
    part.style.stroke = '#a5a5a5'
  })
  document.querySelectorAll("#selectedCluster [id*='r_'] polygon").forEach(function (part) {
    part.style.fill = '#a5a5a5'
    part.style.stroke = '#a5a5a5'
  })
  this.width = document.getElementById('structureviewer').offsetWidth / 1.2 - window.AQUARIA.margin.right - window.AQUARIA.margin.left
  this.height = 40 - window.AQUARIA.margin.top - window.AQUARIA.margin.bottom + 35 // height
  this.datum = datum
  this.drawTrack(this.datum)
}

// Draw selected feature track
export function drawTrack (datum) {
  var features = datum.Tracks
  var outerdiv = d3.select('#selectedFeature').append('div').attr('id', 'outerFeatureMap')
  this.nusvg = outerdiv.append('svg').attr('width', '100vw')
    .attr('height', this.height + 30)
    .attr('viewBox', '0 0 ' + (this.width) + ' ' + (this.height + 30))
    .attr('preserveAspectRatio', 'none')

  this.nusvg.append('rect')
    .attr('width', this.width + window.AQUARIA.margin.left)
    .attr('height', 25)
    .attr('class', 'bg')
    .attr('fill', 'none')
  for (var o in features) {
    // draw outline of the whole chain
    this.nusg = this.nusvg.append('g').attr('transform', 'translate(' + window.AQUARIA.margin.left + ',0)')
    // add center line
    this.nusg.append('rect')
      .attr('width', this.width)
      .attr('height', 1)
      .attr('transform', 'translate(0,13)')
      .attr('class', 'insertion')
  }
  for (var p in features[o]) {
    this.drawFeatures(p, o, features)
  }
  d3.selectAll('#selectedFeature rect.feature').attr(
    'fill', function () {
      return d3.select(this).attr('color')
    })
}

// Draw feature by residue
export function drawFeatures (p, o, features) {
  this.nusg.append('rect')
    .attr('width', function () { return (/* parseInt */((features[o][p].size + 1) * window.AQUARIA.srw) > 2) ? /* parseInt */((features[o][p].size + 1) * window.AQUARIA.srw) : 2 })
    .attr('height', 14)
    .attr('id', 'r_' + o + '_' + p)
    .attr('transform', 'translate(' + /* parseInt */ (features[o][p].start * (window.AQUARIA.srw - 0.0085)) + ',6)')
    .attr('color', features[o][p].color).attr('fill', '#a4abdf')
    .attr('class', 'feature')
    .on('mouseover', createMouseOverCallback(features[o][p]))
    .on('mouseout',
      function () {
        var ID = d3.select(this).attr('id')
        return d3.select(this).call(mouseoutFeature, ID)
      })
    // .attr('fill-opacity', function () {
    //   return (this.datum.Class.track === 'single_track') ? 0.3 : 1
    // })
}

export function createMouseOverCallback (feature) {
  return function () {
    // console.log(">>>>>>>>>> over here ....???");
    var ID = d3.select(this).attr('id')
    d3.select(this).call(mouseoverFeature, feature, ID)
  }
}

// show feature pop-up
function showAnnotation (f, eid) {
  var urlhtml = ''
  if (f.urls.length > 0) {
    // var lnx = f.urls.split(";");
    urlhtml = '<p>'
    for (var i = 0; i < f.urls.length; i++) {
      urlhtml += "<a href='" + f.urls[i].href + "' target='_blank'>" + f.urls[i].text + '</a><br>'
    }
    urlhtml += '</p>'
  }
  $('div.popup').remove()
  var balloon = "<div class='balloon' id='balloon'><span class='x'>&nbsp;</span><p>" + f.label + ' ('
  if (f.start === f.end) {
    balloon = balloon + 'Residue ' + f.start
  } else {
    balloon = balloon + 'Residues ' + f.start + '-' + f.end
  }

  balloon = balloon + ')<br/>' + f.desc + '</p>' + urlhtml + '</div>'

  d3.select('body')
    .append('div')
    .attr('class', 'popup')
    .html(balloon)

  var popheight = $('div.popup').innerHeight()

  var fpos = $('#' + eid).offset()
  var fwidth = $('#' + eid).attr('width')

  var bleft = parseInt(fpos.left + fwidth / 2 - 160)
  var btop = parseInt(fpos.top - popheight)

  $('div.popup').css({
    left: bleft + 'px',
    top: btop + 'px',
    width: '470px'
  }).fadeIn(600)

  $('span.x').on('click', function () {
    $('div.popup').fadeOut()
  })

  $('div.popup').on('hover', function () {
    clearTimeout(s)
  }, function () {
    s = setTimeout(function () {
      $('div.popup').fadeOut()
    }, 500)
  })
}

var t, s
export function mouseoverFeature (el, f, eid) {
  t = setTimeout(function () {
    showAnnotation(f, eid)
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
