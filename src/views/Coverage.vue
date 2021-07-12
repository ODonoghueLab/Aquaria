<template>
  <div id='matrix'>
    <MatrixHeader />
    <LoadingPage />
     <div id='container'>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MatrixHeader from '../components/MatrixLayout/MatrixHeader'
import LoadingPage from '../components/MatrixLayout/LoadingPage'
import store from '@/store/index'

export default {
  name: 'Matrix',
  components: {
    MatrixHeader,
    LoadingPage
  },
  data () {
    return {
      hostname: store.state.url,
      publicPath: process.env.BASE_URL,
      structures: null,
      totalStructures: 0,
      d3: require('d3'),
      green: '#7A9D5B',
      backgroundColour: '#ffffff',
      x: 0,
      y: 15,
      organismId: '2697049' // COVID:2697049 SARS:694009 MERS:1263720
    }
  },
  mounted () {
    // TODO: ruler at the top, shrink the space, offset the ticks, make the rectangles' height smaller

    let allStructures
    // window.BACKEND = 'https://odonoghuelab.org:8011/'

    // gets an organism and runs all the functions and loads everything
    var url = `${window.BACKEND}/${this.organismId}`
    axios({
      method: 'get',
      url: url
    })
      .then(response => {
        allStructures = JSON.parse(response.data.primary_accessions)
        this.getStructures(this.organismId, allStructures).then(response => {
          console.log(response)
          this.getMatchingStructures(response).then(response => {
            this.getProteinSynonyms(response).then(response => {
              this.loadShapes(response).then(() => {
                if (document.querySelector('.matrixLoading')) {
                  document.querySelector('.matrixLoading').style.visibility = 'hidden'
                  document.querySelector('.matrixLoading').style.display = 'none'
                }
              })
            })
          })
        })
        this.structures = allStructures
      })

    window.addEventListener('resize', this.initialDisplay)
  },
  methods: {
    // TODO: INITIAL STATE SEEMS TO BE BROKEN. EVERYTHING IS COLLAPSED.

    // given sequence length, return length of the rectangle to generate.
    getResidueSize (scale, length) {
      return length * scale
    },

    // This function takes in the protein data, and draws all the shapes
    async loadShapes (data) {
      // data in the format of [{name:string, primary_accession:string, sequence:string, position:int, length:int, clusters:array or 0, continuous:bool}]
      data = this.partitionToThree(data)
      var continuous = 0 // used to draw continuous axis over multiple proteins

      // var svg = this.d3.select('#container').append('svg').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 960 1200') // 960 width preserving aspect ratio instead of using window.innerWidth
      var scale = 960 / Math.max(...(data.map(el => this.getListSum(el)))) // scale the viewport by the longest of the three lists in data

      for (var i = 0; i < data.length; i++) {
        var svg = this.d3.select('#container').append('svg').attr('class', 'row').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 960 340') // 960 width preserving aspect ratio instead of using window.innerWidth

        this.x = 0 // displacement from the left
        this.y = 15
        var offset = 0

        for (var n = 0; n < data[i].length; n++) {
          var height = 20 // the height of the rectangles, and the length of the triangle that is appended. Triangle width is 2*height
          var triangleSize = height / 1.5
          var width = this.getResidueSize(scale, data[i][n].length) - triangleSize // length of the residues, minus the width of the appended triangle
          if (width < 0) {
            triangleSize = this.getResidueSize(scale, data[i][n].length) // scale down the triangle
            width = 0
          }

          // Draw the arrows for the protein
          this.drawArrow(svg, data[i][n], width, height, triangleSize, offset, scale)

          // draw the non-dark regions
          // this.fillArrow(svg, data[i][n], width, height, triangleSize, offset, scale)

          // Draw the axis
          this.drawRuler(svg, data[i][n], continuous, width, triangleSize, offset)

          if (data[i][n].continuous) {
            continuous = data[i][n].length
          } else {
            continuous = 0
          }

          this.addNonDarkToFragments(data[i][n])

          // Draw fragments if they exist
          this.drawFragments(svg, data[i][n].fragments, scale)

          // Draw the image of the protein if one exists, or fetch default if it does not
          var imgYOffset = this.renderImage(svg, data[i][n], width, height, offset)

          this.drawMatchingStructures(svg, data[i][n], width, height, triangleSize, offset, imgYOffset)

          // Adjust the offset for the next protein
          offset = offset + width + triangleSize
        }
        this.drawExpandButton(svg)
      }
      this.initialDisplay(false)
    },

    fillData (protein) {
      var data = [{ offset: '0%', color: 'black' }]
      if (protein.nonDark) {
        for (var i = 0; i < protein.nonDark.length; i++) {
          var segment = protein.nonDark[i]
          data.push({ offset: '' + 100 * (segment.Start / protein.length) + '%', color: 'black' }) // end of the black
          data.push({ offset: '' + 100 * (segment.Start / protein.length) + '%', color: this.green }) // start of the green
          data.push({ offset: '' + 100 * (segment.Stop / protein.length) + '%', color: this.green }) // end of the green
          data.push({ offset: '' + 100 * (segment.Stop / protein.length) + '%', color: 'black' }) // start of the black
        }
      }
      // data.push({ offset: '100%', color: 'black' })
      return data
    },

    getNonDarkBetween (protein, start, stop) {
      var nonDark = []
      if (protein.nonDark) {
        for (var i = 0; i < protein.nonDark.length; i++) {
          if (protein.nonDark[i].Start <= start && protein.nonDark[i].Stop >= start) {
            nonDark.push({ Start: 0, Stop: (protein.nonDark[i].Stop - start) })
          } else if (protein.nonDark[i].Start >= start && protein.nonDark[i].Stop <= stop) {
            nonDark.push({ Start: (protein.nonDark[i].Start - start), Stop: (protein.nonDark[i].Stop - start) })
          } else if (protein.nonDark[i].Start <= stop && protein.nonDark[i].Stop >= stop) {
            nonDark.push({ Start: (protein.nonDark[i].Start - start), Stop: (stop - start) })
          }
        }
      }
      return nonDark
    },

    splitToChunks (array, parts) {
      var result = []
      for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)))
      }
      return result
    },

    addNonDarkToFragments (protein) {
      if (protein.fragments) {
        for (var j = 0; j < protein.fragments.length; j++) {
          var fragment = protein.fragments[j]
          protein.fragments[j].nonDark = this.getNonDarkBetween(protein, fragment.Start, fragment.Stop)
        }
      }
    },

    /* eslint-enable */

    drawArrow (svg, protein, width, height, triangleSize, offset, scale) {
      // var fill = protein.dark ? 'black' : this.green
      // create a rectangle
      var fill = this.fillData(protein)
      var id = protein.id ? protein.id : protein.primary_accession

      // split longer proteins into multiple rectangles to get around chrome issue. No more than 7 explicit start / end definitions
      // this is necessary for some browers like chrome, which renders large gradients with many explicit divisions incorrectly
      if (fill.length > 14 && width > 300) {
        var prevOffset = 0
        var nonDarkFragments = JSON.parse(JSON.stringify(protein.nonDark))
        var numChunks = Math.floor(fill.length / 10) > 4 ? Math.floor(fill.length / 10) : 4
        console.log(numChunks)
        var newFill = this.splitToChunks(nonDarkFragments, numChunks) // can split into more chunks if needed to get around chrome blurring
        var prevStop = 0
        for (var i = 0; i < newFill.length; i++) {
          var len = newFill[i].slice(-1)[0].Stop - prevStop
          if (i === newFill.length - 1) {
            len = protein.length - prevStop
          }
          var fragmentWidth = this.getResidueSize(scale, len)
          for (var k = 0; k < newFill[i].length; k++) {
            newFill[i][k].Start = newFill[i][k].Start - prevStop
            newFill[i][k].Stop = newFill[i][k].Stop - prevStop
          }

          var shapeFill = this.fillData({ length: len, nonDark: newFill[i] })

          svg.append('linearGradient')
            .attr('id', 'grad_partial_' + id + '_' + i)
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '0%')
            .selectAll('stop')
            .data(shapeFill)
            // .data([{"offset":"0%","color":"black"},{"offset":"0%","color":"black"},{"offset":"0%","color":"#7A9D5B"},{"offset":"2%","color":"#7A9D5B"},{"offset":"2%","color":"black"},{"offset":"3%","color":"black"},{"offset":"3%","color":"#7A9D5B"},{"offset":"4%","color":"#7A9D5B"},{"offset":"4%","color":"black"},{"offset":"18%","color":"black"},{"offset":"18%","color":"#7A9D5B"},{"offset":"21%","color":"#7A9D5B"},{"offset":"21%","color":"black"},{"offset":"23%","color":"black"},{"offset":"23%","color":"#7A9D5B"},{"offset":"27%","color":"#7A9D5B"},{"offset":"27%","color":"black"},{"offset":"27%","color":"black"},{"offset":"27%","color":"#7A9D5B"},{"offset":"42%","color":"#7A9D5B"},{"offset":"42%","color":"black"},{"offset":"42%","color":"black"},{"offset":"42%","color":"#7A9D5B"},{"offset":"45%","color":"#7A9D5B"},{"offset":"45%","color":"black"},{"offset":"71%","color":"black"},{"offset":"71%","color":"#7A9D5B"},{"offset":"72%","color":"#7A9D5B"},{"offset":"72%","color":"black"},{"offset":"72%","color":"black"},{"offset":"72%","color":"#7A9D5B"},{"offset":"81%","color":"#7A9D5B"},{"offset":"81%","color":"black"},{"offset":"87%","color":"black"},{"offset":"87%","color":"#7A9D5B"},{"offset":"99%","color":"#7A9D5B"},{"offset":"99%","color":"black"}])
            .enter().append('stop')
            .attr('offset', function (d) { return d.offset })
            .attr('stop-color', function (d) { return d.color })
            .attr('stop-opacity', 1)

          if (i === newFill.length - 1) {
            var rectLen = fragmentWidth - triangleSize
            let p
            if (rectLen > 0) {
              p = [this.x, this.y, this.x, this.y + height, this.x + rectLen, this.y + height, this.x + rectLen, this.y + (0.5 * height) + triangleSize, this.x + rectLen + triangleSize, this.y + 0.5 * height, this.x + rectLen, this.y + (0.5 * height) - triangleSize, this.x + rectLen, this.y]
            } else {
              p = [this.x, this.y + (0.5 * height) - triangleSize, this.x, this.y + (0.5 * height) + triangleSize, this.x + triangleSize, this.y + (0.5 * height)] // point 1 x coords, y coords. Point 2 x, y. Point 3 x,y.
            }

            // create an arrow
            svg.append('svg:polygon')
              .attr('points', p)
              // .attr('fill', fill)
              .attr('fill', 'url(#grad_partial_' + id + '_' + i + ')')
              .attr('id', id)
              .attr('title', protein.primary_accession)
              .attr('transform', 'translate(' + (offset + prevOffset) + ',0)')
              .on('mouseover', function (d, i) {
                var d3 = require('d3')
                d3.select(this).attr('opacity', '.85')
                d3.selectAll('rect#' + this.id).attr('opacity', '.85')
              })
              .on('mouseout', function (d, i) {
                var d3 = require('d3')
                d3.select(this).attr('opacity', '1')
                d3.selectAll('rect#' + this.id).attr('opacity', '1')
              })
              .on('click', function () {
                var d3 = require('d3')
                var baseUrl = window.location.origin
                window.open(baseUrl + '/' + d3.select(this).attr('title'))
              })
              .append('svg:title')
              .text(protein.name)
          } else {
            // create an arrow
            svg.append('svg:rect')
              .attr('fill', 'url(#grad_partial_' + id + '_' + i + ')')
              .attr('x', this.x)
              .attr('y', this.y)
              .attr('width', fragmentWidth)
              .attr('height', height)
              .attr('id', id)
              .attr('title', protein.primary_accession)
              .attr('transform', 'translate(' + (offset + prevOffset) + ',0)')
              .on('mouseover', function (d, i) {
                var d3 = require('d3')
                d3.select(this).attr('opacity', '.85')
                d3.selectAll('rect#' + this.id).attr('opacity', '.85')
                d3.selectAll('polygon#' + this.id).attr('opacity', '.85')
              })
              .on('mouseout', function (d, i) {
                var d3 = require('d3')
                d3.select(this).attr('opacity', '1')
                d3.selectAll('rect#' + this.id).attr('opacity', '1')
                d3.selectAll('polygon#' + this.id).attr('opacity', '1')
              })
              .on('click', function () {
                var d3 = require('d3')
                var baseUrl = window.location.origin
                window.open(baseUrl + '/' + d3.select(this).attr('title'))
              })
              .append('svg:title')
              .text(protein.name)
          }
          prevStop = prevStop + len
          prevOffset = prevOffset + fragmentWidth
        }
      } else {
        svg.append('linearGradient')
          .attr('id', 'grad_' + id)
          .attr('x1', '0%').attr('y1', '0%')
          .attr('x2', '100%').attr('y2', '0%')
          .selectAll('stop')
          .data(fill)
          // .data([{"offset":"0%","color":"black"},{"offset":"0%","color":"black"},{"offset":"0%","color":"#7A9D5B"},{"offset":"2%","color":"#7A9D5B"},{"offset":"2%","color":"black"},{"offset":"3%","color":"black"},{"offset":"3%","color":"#7A9D5B"},{"offset":"4%","color":"#7A9D5B"},{"offset":"4%","color":"black"},{"offset":"18%","color":"black"},{"offset":"18%","color":"#7A9D5B"},{"offset":"21%","color":"#7A9D5B"},{"offset":"21%","color":"black"},{"offset":"23%","color":"black"},{"offset":"23%","color":"#7A9D5B"},{"offset":"27%","color":"#7A9D5B"},{"offset":"27%","color":"black"},{"offset":"27%","color":"black"},{"offset":"27%","color":"#7A9D5B"},{"offset":"42%","color":"#7A9D5B"},{"offset":"42%","color":"black"},{"offset":"42%","color":"black"},{"offset":"42%","color":"#7A9D5B"},{"offset":"45%","color":"#7A9D5B"},{"offset":"45%","color":"black"},{"offset":"71%","color":"black"},{"offset":"71%","color":"#7A9D5B"},{"offset":"72%","color":"#7A9D5B"},{"offset":"72%","color":"black"},{"offset":"72%","color":"black"},{"offset":"72%","color":"#7A9D5B"},{"offset":"81%","color":"#7A9D5B"},{"offset":"81%","color":"black"},{"offset":"87%","color":"black"},{"offset":"87%","color":"#7A9D5B"},{"offset":"99%","color":"#7A9D5B"},{"offset":"99%","color":"black"}])
          .enter().append('stop')
          .attr('offset', function (d) { return d.offset })
          .attr('stop-color', function (d) { return d.color })
          .attr('stop-opacity', 1)

        let p
        if (width > 0) {
          p = [this.x, this.y, this.x, this.y + height, this.x + width, this.y + height, this.x + width, this.y + (0.5 * height) + triangleSize, this.x + width + triangleSize, this.y + 0.5 * height, this.x + width, this.y + (0.5 * height) - triangleSize, this.x + width, this.y]
        } else {
          p = [this.x, this.y + (0.5 * height) - triangleSize, this.x, this.y + (0.5 * height) + triangleSize, this.x + triangleSize, this.y + (0.5 * height)] // point 1 x coords, y coords. Point 2 x, y. Point 3 x,y.
        }

        // create an arrow
        svg.append('svg:polygon')
          .attr('points', p)
          // .attr('fill', fill)
          .attr('fill', 'url(#grad_' + id + ')')
          .attr('id', id)
          .attr('title', protein.primary_accession)
          .attr('transform', 'translate(' + offset + ',0)')
          .on('mouseover', function (d, i) {
            var d3 = require('d3')
            d3.select(this).attr('opacity', '.85')
            // d3.select('rect#' + this.id).transition().duration('50').attr('opacity', '.85')
          })
          .on('mouseout', function (d, i) {
            var d3 = require('d3')
            d3.select(this).attr('opacity', '1')
            // d3.select('rect#' + this.id).transition().duration('50').attr('opacity', '1')
          })
          .on('click', function () {
            var d3 = require('d3')
            var baseUrl = window.location.origin
            window.open(baseUrl + '/' + d3.select(this).attr('title'))
          })
          .append('svg:title')
          .text(protein.name)
      }

      // append protein names to the rectangles
      var lab = svg.append('text')
        .attr('x', this.x + 0.5 * (width + 0.5 * triangleSize))
        .attr('y', this.y + 0.5 * height)
        .attr('transform', 'translate(' + offset + ',0)')
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text(protein.name)

      if (lab.node().getComputedTextLength() > width) {
        lab.text(protein.synonym[0]) // prefer the first synonym
        if (lab.node().getComputedTextLength() > width) { // if it's too long
          var shortest = protein.synonym.reduce((a, b) => a.length <= b.length ? a : b)
          shortest = shortest.replace('orf', '').replace('ORF', '')
          lab.text(shortest) // use the shortest name
          if (lab.node().getComputedTextLength() > width + 0.5 * triangleSize) {
            // if the shortest name still doesn't fit, display it below the arrow in green
            lab.attr('y', this.y + height * 1.5)
            lab.style('fill', this.green)
            lab.attr('class', 'rowContent')
          }
        }
      }
    },

    // fillArrow (svg, protein, width, height, triangleSize, offset, scale) {
    //   // TODO: POLYPOTEIN 1B IS INCORRECT. NEED TO FIND PROBLEM IN CLEAN PROTEINS
    //   var range = protein.nonDark
    //   console.log(width, height, triangleSize, range)
    //   for (var i = 0; i < range.length; i++) {
    //     var length = this.getResidueSize(scale, range[i].Stop - range[i].Start)
    //     console.log('x1:', this.x + this.getResidueSize(scale, range[i].Start) / 2, protein.name)
    //     svg.append('line')
    //       .style('stroke', this.green)
    //       .style('stroke-width', length) // scaled by scale?
    //       .attr('x1', this.x + this.getResidueSize(scale, range[i].Start) + this.getResidueSize(scale, (range[i].Stop - range[i].Start) / 2))
    //       .attr('y1', this.y)
    //       .attr('x2', this.x + this.getResidueSize(scale, range[i].Start) + this.getResidueSize(scale, (range[i].Stop - range[i].Start) / 2))
    //       .attr('y2', this.y + height)
    //       .attr('id', protein.id ? protein.id : protein.primary_accession)
    //       .attr('transform', 'translate(' + offset + ',0)')
    //   }
    // },

    drawRuler (svg, protein, continuous, width, triangleSize, offset) {
      // Draw the axis
      var xScale = this.d3.scale.linear()
        .domain([continuous, continuous + protein.length]) // This is what is written on the Axis: from 0 to length of residue
        .range([1, width + triangleSize - 1]) // This is where the axis is placed: from start to end of triangle. Add a tiny bit of spacing between the two

      var ticks = Math.floor(protein.length / 500 + 1) // a tick every 500 residues
      if (ticks > 3) { // if longer than 1500 residues
        var axis = svg
          .append('g')
          .attr('transform', 'translate(' + offset + ',' + (this.y - 15) + ')') // This controls the vertical position of the Axis
          .attr('style', '')
          .style('fill', 'gray')
          .style('font-size', '10px')
          .attr('class', 'rowContent')
          .call(this.d3.svg.axis().scale(xScale).tickSize(0, 1).tickFormat((interval, i) => { return (interval === 0 || interval % 1000 !== 0) ? ' ' : interval }).orient('bottom').ticks(ticks)) // render only thousand ticks
          // .call(g => g.selectAll('text')
          //   .attr('y', 4)
          //   .attr('dx', -4)) // shifts text to the left.

        axis.selectAll('.tick')
          .attr('stroke', 'gray')
          .attr('x1', this.x)
          .attr('x2', this.x)
          .attr('y2', 0)
          .attr('y1', 3)
          .attr('stroke-width', '1')
      } else if (protein.length > 200) {
        var smallAxis = svg.append('g')
          .attr('transform', 'translate(' + offset + ',' + (this.y - 10) + ')')
          .style('fill', 'gray')
          .attr('class', 'rowContent')
          .call(this.d3.svg.axis().scale(this.d3.scale.linear().domain([0, 1]).range([1, width + triangleSize - 1])).tickSize(2, 1).orient('top').ticks(2).tickFormat(''))

        smallAxis.selectAll('.tick')
          .attr('stroke', 'gray')
          .attr('x1', this.x)
          .attr('y1', 4) // height of the ticks
          .attr('y2', -1) // displacement from the line
          .attr('stroke-width', '1')

        var axisLabel = svg.append('text') // set this as var la
          .attr('x', this.x + 0.5 * (width + triangleSize))
          .attr('y', this.y - 10)
          .attr('dy', '.35em')
          .style('text-anchor', 'middle')
          .attr('transform', 'translate(' + offset + ',0)')
          .style('fill', 'gray')
          .style('font-size', '10px')
          .attr('class', 'rowContent')
          .text(protein.length)

        svg.append('rect', 'text') // draw a white rectangle
          .datum(function () { return axisLabel.node().getBBox() })
          .attr('x', function (d) { return d.x - 2 })
          .attr('y', function (d) { return d.y })
          .style('fill', this.backgroundColour)
          .attr('transform', 'translate(' + offset + ',0)')
          .attr('class', 'rowContent')
          .attr('width', function (d) { return d.width + 2 * 2 })
          .attr('height', function (d) { return d.height })

        axisLabel.node().parentNode.appendChild(axisLabel.node()) // put label above rectangle
      }
    },

    drawFragments (svg, fragments, scale) {
      if (fragments.length !== 0) {
        this.y = this.y + 35
      }
      var offset = 0
      for (var i = 0; i < fragments.length; i++) {
        var protein = {
          name: fragments[i].Name,
          primary_accession: fragments[i].Primary_Accession,
          synonym: [fragments[i].Short_Name].concat(fragments[i].Short_Name.match(/[0-9]+/g)),
          Start: fragments[i].Start,
          Stop: fragments[i].Stop,
          pdb: null,
          length: (fragments[i].Stop - fragments[i].Start),
          id: fragments[i].Primary_Accession + '_' + fragments[i].Short_Name.match(/[0-9]+/g)[0],
          nonDark: fragments[i].nonDark
        }
        var len = fragments[i].Stop - fragments[i].Start
        var height = 20 // the height of the rectangles, and the length of the triangle that is appended. Triangle width is 2*height
        var triangleSize = height / 1.5
        var width = this.getResidueSize(scale, len) - triangleSize // length of the residues, minus the width of the appended triangle
        if (width < 0) {
          triangleSize = this.getResidueSize(scale, len) // scale down the triangle
          width = 0
        }
        if (i === 0) {
          this.drawArrow(svg, protein, width, height, triangleSize, offset, scale)
          offset = offset + width + triangleSize
        // if the start of the fragment is after the end of the previous fragment (not occupying the same space)
        } else if (fragments[i].Start >= fragments[i - 1].Stop) {
          this.drawArrow(svg, protein, width, height, triangleSize, offset, scale) // draw the fragment
          offset = offset + width + triangleSize
        }
      }
    },

    renderImage (svg, protein, width, height, offset) {
      // Add the image of the protein if one exists
      // TODO: trim images and crop them down.
      var imgYOffset = 30
      var imgSize = width * 2 < 200 ? width * 2 : 200
      var img = svg.append('svg:image') // add the image of the protein
        .attr('x', width * 0.5)
        .attr('y', this.y + height)
        .attr('transform', 'translate(' + (offset - imgSize / 2) + ',' + imgYOffset + ')') // - half its width to have image anchor center
        .attr('width', imgSize)
        .attr('height', imgSize)

      if (!protein.dark && this.organismId === '2697049') {
        img.attr('xlink:href', '../images/covid19/WEBP/' + protein.primary_accession + '_w500.webp')
      } else if (!protein.dark) {
        img.attr('xlink:href', 'https://aquaria.ws:8080/image/' + protein.primary_accession + '/' + protein.pdb + '?color=0x000000&alpha=0')
      } else {
        img.attr('xlink:href', '../images/covid19/unknown-structure_1000.png')
      }
      return imgYOffset
    },

    drawMatchingStructures (svg, protein, width, height, triangleSize, offset, imgYOffset) {
      // draw the bottom matching structures axis
      if (!protein.dark) {
        var matchingScale = this.d3.scale.linear()
          .domain([0, 2]) // This is what is written on the Axis: from 0 to length of residue
          .range([2, width + triangleSize - 2]) // This is where the axis is placed: from start to end of triangle. Add a tiny bit of spacing between the two
          .nice()

        var matchingAxis = svg
          .append('g')
          .attr('transform', 'translate(' + offset + ',' + (this.y + height + 10) + ')') // This controls the vertical position of the Axis
          .attr('style', '')
          .style('fill', this.green)
          .style('font-size', '10px')
          .call(this.d3.svg.axis().scale(matchingScale).tickSize(0, 1).tickFormat('').orient('bottom').ticks(2)) // render only thousand ticks

        // Create a long down tick in the centre of the bottom axis
        this.d3.select(matchingAxis.selectAll('.tick')[0][1])
          .attr('stroke', this.green)
          .attr('x1', this.x)
          .attr('x2', this.x)
          .attr('y2', 0)
          .attr('y1', imgYOffset)
          .attr('stroke-width', '1')

        var matchingLabel = svg.append('text') // set this as var la
          .attr('x', this.x + 0.5 * (width + triangleSize))
          .attr('y', this.y + height + imgYOffset + 5) // the axis offset from matchingAxis
          .attr('dy', '.35em')
          .style('text-anchor', 'middle')
          .attr('transform', 'translate(' + offset + ',0)')
          .style('fill', 'white')
          .style('font-size', '12px')
          .text(this.countMatchingStructures(protein.clusters))

        svg.append('rect', 'text') // draw a green round rectangle
          .datum(function () { return matchingLabel.node().getBBox() })
          .attr('x', function (d) { return d.x - 4 })
          .attr('y', function (d) { return d.y })
          .attr('rx', 6)
          .attr('ry', 10)
          .style('fill', this.green)
          .attr('transform', 'translate(' + offset + ',0)')
          .attr('width', function (d) { return d.width + 4 * 2 })
          .attr('height', function (d) { return d.height })

        matchingLabel.node().parentNode.appendChild(matchingLabel.node()) // put label above rectangle
      }
    },

    drawExpandButton (svg) {
      // Create the expand and collapse button
      var expandButton = svg.append('svg:rect')
        .attr('x', 0)
        .attr('y', 5)
        .attr('stroke', '#CCCCCC')
        .attr('fill', '#CCCCCC')
        .attr('opacity', 0.80)
        .attr('width', window.innerWidth)
        .attr('height', 40)
        .attr('id', 'expand')

      if (window.innerHeight > window.innerWidth) {
        expandButton.attr('display', 'none')
      }

      expandButton.on('mouseover', function (d, i) {
        var d3 = require('d3')
        d3.select(this.parentNode).select('path#expand:last-child').attr('stroke', 'orange')
      })
        .on('mouseout', function (d, i) {
          var d3 = require('d3')
          d3.select(this.parentNode).select('path#expand:last-child').attr('stroke', '#CCCCCC')
        })

      expandButton.on('click', function (d, i) {
        var d3 = require('d3')

        if (this.parentNode.className.baseVal.split(' ').indexOf('open') > -1) { // if current row is open
          d3.select(this.parentNode).classed('open', false)
          d3.selectAll('.row').transition().duration(1000).attr('viewBox', '0 0 960 45')
          d3.selectAll('.rowContent').transition().duration(1000).attr('opacity', 0)
        } else {
          d3.selectAll('.open').selectAll('rect#expand').attr('opacity', 0)
          d3.selectAll('.open').selectAll('rect#expand').attr('display', 'block')
          d3.selectAll('.open').selectAll('rect#expand').transition().duration(1000).attr('opacity', 0.8)

          d3.selectAll('.open').selectAll('path#expand').attr('opacity', 0)
          d3.selectAll('.open').selectAll('path#expand').attr('display', 'block')
          d3.selectAll('.open').selectAll('path#expand').transition().duration(1000).attr('opacity', 1)

          d3.selectAll('.row').classed('open', false)
          d3.selectAll('.row').transition().duration(1000).attr('viewBox', '0 0 960 45')
          d3.selectAll('.rowContent').transition().duration(1000).attr('opacity', 0)

          d3.select(this.parentNode).classed('open', true)
          d3.select(this).attr('display', 'none')
          // d3.selectAll('.open').transition().duration(1000).attr('viewBox', '0 0 960 ' + viewboxHeight)
          d3.select(this.parentNode).selectAll('path#expand').attr('display', 'none')
          d3.selectAll('.open').transition().duration(1000).attr('viewBox', '0 0 960 340')
          d3.selectAll('.open .rowContent').transition().duration(1000).attr('opacity', 1)

          // change the direction of the semi-circle arrows
          var rows = d3.selectAll('.row')
          var foundOpen = false
          for (var j = 0; j < rows[0].length; j++) {
            if (d3.select(rows[0][j]).classed('open')) {
              foundOpen = true
            }
            if (!foundOpen) {
              d3.select(rows[0][j]).select('path#expand').attr('transform', 'translate(' + 480 + ',' + 45 + ')')
              d3.select(rows[0][j]).select('path#expand:last-child').attr('transform', 'scale(1, -1) translate(' + 480 + ', -' + 45 + ')')
            } else {
              d3.select(rows[0][j]).select('path#expand').attr('transform', 'scale(1, -1) translate(' + 480 + ', -' + 5 + ')')
              d3.select(rows[0][j]).select('path#expand:last-child').attr('transform', 'translate(' + 480 + ',' + 5 + ')')
            }
          }
        }
      })

      this.renderHalfMoon(svg, 480, 5)
    },

    renderHalfMoon (svg, x, y) {
      var arcGenerator = this.d3.svg.arc()
        .outerRadius(20)
        .innerRadius(0)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2)

      var semicircle = svg.append('path')
        .attr('transform', 'scale(1, -1) translate(' + x + ', -' + y + ')')
        .attr('d', arcGenerator())
        .attr('fill', 'gray')
        .attr('id', 'expand')
        .on('mouseover', function (d, i) {
          var d3 = require('d3')
          d3.select(this.parentNode).select('path#expand:last-child').attr('stroke', 'orange')
        })
        .on('mouseout', function (d, i) {
          var d3 = require('d3')
          d3.select(this.parentNode).select('path#expand:last-child').attr('stroke', '#CCCCCC')
        })

      var arrow = svg.append('path')
        .attr('transform', 'translate(' + x + ',' + y + ')')
        .attr('d', 'M-8 12 0 5 8 12')
        .attr('stroke', '#CCCCCC')
        .attr('stroke-width', 3)
        .attr('fill', 'transparent')
        .attr('id', 'expand')
        .on('mouseover', function (d, i) {
          var d3 = require('d3')
          d3.select(this).attr('stroke', 'orange')
        })
        .on('mouseout', function (d, i) {
          var d3 = require('d3')
          d3.select(this).attr('stroke', '#CCCCCC')
        })

      arrow.on('click', function (d, i) {
        var d3 = require('d3')

        d3.selectAll('.open').selectAll('rect#expand').attr('opacity', 0)
        d3.selectAll('.open').selectAll('rect#expand').attr('display', 'block')
        d3.selectAll('.open').selectAll('rect#expand').transition().duration(1000).attr('opacity', 0.8)

        d3.selectAll('.open').selectAll('path#expand').attr('opacity', 0)
        d3.selectAll('.open').selectAll('path#expand').attr('display', 'block')
        d3.selectAll('.open').selectAll('path#expand').transition().duration(1000).attr('opacity', 1)

        d3.selectAll('.row').classed('open', false)
        d3.selectAll('.row').transition().duration(1000).attr('viewBox', '0 0 960 45')
        d3.selectAll('.rowContent').transition().duration(1000).attr('opacity', 0)

        d3.select(this.parentNode).classed('open', true)
        d3.select(this.parentNode).selectAll('rect#expand').attr('display', 'none')
        d3.select(this.parentNode).selectAll('path#expand').attr('display', 'none')
        d3.selectAll('.open').transition().duration(1000).attr('viewBox', '0 0 960 340')
        d3.selectAll('.open .rowContent').transition().duration(1000).attr('opacity', 1)

        // change the direction of the semi-circle arrows
        var rows = d3.selectAll('.row')
        var foundOpen = false
        for (var j = 0; j < rows[0].length; j++) {
          if (d3.select(rows[0][j]).classed('open')) {
            foundOpen = true
          }
          if (!foundOpen) {
            d3.select(rows[0][j]).select('path#expand').attr('transform', 'translate(' + 480 + ',' + 45 + ')')
            d3.select(rows[0][j]).select('path#expand:last-child').attr('transform', 'scale(1, -1) translate(' + 480 + ', -' + 45 + ')')
          } else {
            d3.select(rows[0][j]).select('path#expand').attr('transform', 'scale(1, -1) translate(' + 480 + ', -' + 5 + ')')
            d3.select(rows[0][j]).select('path#expand:last-child').attr('transform', 'translate(' + 480 + ',' + 5 + ')')
          }
        }
      })

      semicircle.on('click', function (d, i) {
        var d3 = require('d3')

        d3.selectAll('.open').selectAll('rect#expand').attr('opacity', 0)
        d3.selectAll('.open').selectAll('rect#expand').attr('display', 'block')
        d3.selectAll('.open').selectAll('rect#expand').transition().duration(1000).attr('opacity', 0.8)

        d3.selectAll('.open').selectAll('path#expand').attr('opacity', 0)
        d3.selectAll('.open').selectAll('path#expand').attr('display', 'block')
        d3.selectAll('.open').selectAll('path#expand').transition().duration(1000).attr('opacity', 1)

        d3.selectAll('.row').classed('open', false)
        d3.selectAll('.row').transition().duration(1000).attr('viewBox', '0 0 960 45')
        d3.selectAll('.rowContent').transition().duration(1000).attr('opacity', 0)

        d3.select(this.parentNode).classed('open', true)
        d3.select(this.parentNode).selectAll('rect#expand').attr('display', 'none')
        d3.select(this.parentNode).selectAll('path#expand').attr('display', 'none')
        d3.selectAll('.open').transition().duration(1000).attr('viewBox', '0 0 960 340')
        d3.selectAll('.open .rowContent').transition().duration(1000).attr('opacity', 1)

        // change the direction of the semi-circle arrows
        var rows = d3.selectAll('.row')
        var foundOpen = false
        for (var j = 0; j < rows[0].length; j++) {
          if (d3.select(rows[0][j]).classed('open')) {
            foundOpen = true
          }
          if (!foundOpen) {
            d3.select(rows[0][j]).select('path#expand').attr('transform', 'translate(' + 480 + ',' + 45 + ')')
            d3.select(rows[0][j]).select('path#expand:last-child').attr('transform', 'scale(1, -1) translate(' + 480 + ', -' + 45 + ')')
          } else {
            d3.select(rows[0][j]).select('path#expand').attr('transform', 'scale(1, -1) translate(' + 480 + ', -' + 5 + ')')
            d3.select(rows[0][j]).select('path#expand:last-child').attr('transform', 'translate(' + 480 + ',' + 5 + ')')
          }
        }
      })
    },

    initialDisplay (isResize) { // Change the display if the window is resized
      if (window.innerHeight > window.innerWidth) { // expand everything
        this.d3.selectAll('rect#expand').attr('display', 'none')
        this.d3.selectAll('path#expand').attr('display', 'none')
        this.d3.selectAll('.row').classed('open', true)
        this.d3.selectAll('.open').transition().duration(1000).attr('viewBox', '0 0 960 340')
        this.d3.selectAll('.open .rowContent').transition().duration(1000).attr('opacity', 1)
      } else if (window.innerHeight < 0.25 * window.innerWidth) { // collapse everything
        this.d3.selectAll('rect#expand').attr('display', 'block')
        this.d3.selectAll('path#expand').attr('display', 'block')
        this.d3.selectAll('.row').classed('open', false)
        this.d3.selectAll('.row').transition().duration(500).attr('viewBox', '0 0 960 45')
        this.d3.selectAll('.rowContent').transition().duration(500).attr('opacity', 0)
      } else {
        var opened = this.d3.select('.open')
        this.d3.selectAll('rect#expand').attr('display', 'block')
        this.d3.selectAll('path#expand').attr('display', 'block')
        this.d3.selectAll('.row').classed('open', false)
        this.d3.selectAll('.row').transition().duration(500).attr('viewBox', '0 0 960 45')
        this.d3.selectAll('.rowContent').transition().duration(500).attr('opacity', 0)

        if (!isResize) {
          opened = this.d3.select('.row').classed('open', true)
          this.d3.select('rect#expand').attr('display', 'none')
          opened.selectAll('path#expand').attr('display', 'none')
          this.d3.selectAll('.open').transition().duration(500).attr('viewBox', '0 0 960 340')
          this.d3.selectAll('.open .rowContent').transition().duration(500).attr('opacity', 1)
        } else {
          opened.classed('open', true)
          opened.select('rect#expand').attr('display', 'none')
          opened.selectAll('path#expand').attr('display', 'none')
          opened.transition().duration(1000).attr('viewBox', '0 0 960 340')
          this.d3.selectAll('.open .rowContent').transition().duration(500).attr('opacity', 1)
        }
      }
    },

    // algorithm to split the proteins list into three lists as close to equal as possible.
    // It adds a new number to the list that is 1/3 the sum of all the numbers
    // then it splits the new list into two roughly equal parts using parititionToTwo
    // Remove the placeholder number from the part that contains it, and then split the other part into two with parititionToTwo
    partitionToThree (list) {
      var totalSum = this.getListSum(list)
      var newNum = totalSum / 3
      list.push({ name: 'newPlaceholderNum', length: newNum })
      var twoPart = this.partitionToTwo(list)
      twoPart[1].pop()

      var threePart = this.partitionToTwo(twoPart[0])
      return [threePart[0], threePart[1], twoPart[1]]
    },

    // This algorithm runs into weirdness if the last element is very large, as it would only contain placeholder num
    // can get around it by just skipping any empty lists in loadShape or forcing each list to contain at least 1 element that isnt placeholder num
    partitionToTwo (list) {
      var totalSum = this.getListSum(list)
      var index = list.length - 1
      while (this.getListSum(list.slice(index)) < (totalSum / 2)) {
        if (this.getListSum(list.slice(index - 1)) >= (totalSum / 2)) {
          break
        }
        index--
      }
      return [list.slice(0, index), list.slice(index)]
    },

    getListSum (list) { // takes in data, and returns the sum of all elements .length
      return list.reduce(function (prev, cur) { return prev + cur.length }, 0)
    },

    // Takes in an ID of the organism, and all the structures. Sorts all the structures by genomic position and returns it as a list
    async sortStructures (organismId, allStructures) {
      var pos = await this.getPositions(organismId)
      for (let index = 0; index < allStructures.length; index++) {
        allStructures[index].position = pos[allStructures[index].primary_accession]
      }
      allStructures.sort(function (first, second) {
        return first.position - second.position
      })
      return allStructures
    },

    // checks if any proteins overlap in genomic position, and cuts them when necessary
    async cleanProteins (proteins) {
      var positionArrays = {}
      proteins.forEach(function (protein) {
        // Get the array for this position, if any
        var positionArray = positionArrays[protein.position]
        if (!positionArray) {
          // There wasn't one, create it
          positionArray = positionArrays[protein.position] = []
        }
        // Add this entry
        positionArray.push(protein)
      })

      var proteinsCleaned = []
      for (let i = 1; i <= Object.keys(positionArrays).length; i++) {
        if (positionArrays[i].length !== 1) { // if there are multiple proteins at the same position
          let longest
          positionArrays[i].forEach(function (p) {
            if (!longest) {
              longest = p
            } else if (p.length > longest.length) {
              longest = p
            }
          })

          var cur = longest
          for (let n = 0; n < positionArrays[i].length; n++) {
            if (positionArrays[i][n].sequence !== longest.sequence) {
              // find longest common substring and delete it from cur
              var substring = this.findSubstring(positionArrays[i][n].sequence, longest.sequence)
              cur.sequence = cur.sequence.replace(substring, '')
              cur.length = cur.sequence.length
              cur.name = cur.name + ' (split)'
              positionArrays[i][n].continuous = true
              proteinsCleaned.push(positionArrays[i][n])

              // if the protein has fragments, remove duplicate fragments from the longest protein
              if (cur.fragments.length > 0) {
                positionArrays[i][n].fragments.forEach(fragment => {
                  cur.fragments = cur.fragments.filter(function (e) { return e.Name !== fragment.Name })
                })
              }

              // change the starts and stops to be relative to the split protein
              for (var k = 0; k < cur.fragments.length; k++) {
                cur.fragments[k].Start = cur.fragments[k].Start - positionArrays[i][n].length
                cur.fragments[k].Stop = cur.fragments[k].Stop - positionArrays[i][n].length
                if (cur.fragments[k].Start < 0) {
                  cur.fragments[k].Start = 0
                }
              }
              cur.fragments = cur.fragments.filter(function (e) { return e.Start >= 0 })

              // clean the non-dark regions data
              var newNonDark = []
              for (var j = 0; j < cur.nonDark.length; j++) {
                if (cur.nonDark[j].Stop > positionArrays[i][n].length) {
                  var start = cur.nonDark[j].Start - positionArrays[i][n].length
                  if (start < 0) {
                    start = 0
                  }
                  var stop = cur.nonDark[j].Stop - positionArrays[i][n].length
                  newNonDark.push({ Primary_Accession: cur.primary_accession, Start: start, Stop: stop })
                }
              }
              cur.nonDark = newNonDark
            }
          }

          cur.continuous = false
          proteinsCleaned.push(cur) // append the modified longest protein to the protein list
        } else {
          positionArrays[i][0].continuous = false
          proteinsCleaned.push(positionArrays[i][0])
        }
      }
      return proteinsCleaned
    },

    findSubstring (a1, a2) {
      var L = a1.length
      var i = 0
      while (i < L && a1.charAt(i) === a2.charAt(i)) i++
      return a1.substring(0, i)
    },

    // get the genomic position of a particular protein using primary accession
    async getPositions (id) {
      var posUrl = `${window.BACKEND}/getGenomicPosition/${id}`
      var r = {}
      await axios({
        method: 'get',
        url: posUrl
      })
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            r[response.data[i].primary_accession] = response.data[i].position_index
          }
        })
      if (Object.keys(r).length === 0) {
        console.log('cannot get genomic positions of ' + id + ' in getPositions() Coverage.vue')
      }
      return r
    },

    async getProteinSynonyms (proteins) {
      for (var i = 0; i < proteins.length; i++) {
        var synonym = await this.getSynonym(proteins[i].primary_accession)
        proteins[i].synonym = synonym
      }
      return proteins
    },

    async getSynonym (id) {
      var synUrl = `${window.BACKEND}/getProteinSynonyms/${id}`
      var synonyms = []
      await axios({
        method: 'get',
        url: synUrl
      })
        .then(response => {
          if (response.data.Synonym) {
            synonyms.push(response.data.Synonym) // TODO: if this gene name is short enough display it with priority over other synonyms
          }
          synonyms = synonyms.concat(response.data.synonyms)
        })
      return synonyms
    },

    async getMatchingStructures (proteins) {
      for (var i = 0; i < proteins.length; i++) {
        var loadRequest = {
          selector: [proteins[i].primary_accession]
        }
        var urlMatching = `${window.BACKEND}/get_matching_structures`
        await axios({
          method: 'get',
          url: urlMatching,
          params: loadRequest
        })
          .then(function (response) {
            if (response.data === '\'Dark\' protein') {
              proteins[i].clusters = 0
              proteins[i].pdb = null
            } else {
              proteins[i].clusters = response.data.clusters
              proteins[i].pdb = response.data.Best_PDB.pdb_id
            }
          })
      }
      return proteins
    },

    countMatchingStructures (clusters) {
      if (clusters === 0) {
        return 0
      } else {
        return clusters.reduce(function (prev, cur) { return prev + cur.members.length }, 0)
      }
    },

    async getNonDarkRegions (proteins) {
      for (var i = 0; i < proteins.length; i++) {
        var nonDark = await this.getNonDark(proteins[i].primary_accession)
        proteins[i].nonDark = nonDark
      }
      return proteins
    },

    async getNonDark (id) {
      var url = `${window.BACKEND}getNonDarkRegions/${id}`
      // var url = 'http://localhost:8010/getNonDarkRegions/' + id
      var nonDark = []
      await axios({
        method: 'get',
        url: url
      })
        .then(response => {
          if (response.data) {
            nonDark = response.data
          }
        })
      return nonDark
    },

    // Gets all the structures of a particular organism, removes irrelevant information
    async getStructures (organismId, allStructures) {
      var proteins = []
      var purl
      allStructures = await this.sortStructures(organismId, allStructures)

      for (let index = 0; index < allStructures.length; index++) {
        allStructures[index].count = 0

        var loadRequest = {
          selector: [allStructures[index].primary_accession]
        }
        purl = `${window.BACKEND}/get_3D_alignment`
        await axios({
          method: 'get',
          url: purl,
          params: loadRequest
        })
          .then(response => {
            var sequence = ''
            if (response.data.sequences) {
              sequence = response.data.sequences[0]
              var seqLength = sequence.length
              console.log('Loaded ', allStructures[index].synonym, seqLength)
              proteins.push({ name: allStructures[index].synonym, primary_accession: allStructures[index].primary_accession, sequence: sequence.sequence, position: allStructures[index].position, length: seqLength })
            } else {
              // this is a dark protein
              sequence = response.data[allStructures[index].primary_accession]
              proteins.push({ name: allStructures[index].synonym, primary_accession: allStructures[index].primary_accession, sequence: sequence.sequence, position: allStructures[index].position, length: sequence.length })
            }
            return this.getFragments(allStructures[index].primary_accession)
          }).then(fragments => {
            proteins[index].fragments = fragments
          })
      }
      proteins = await this.getNonDarkRegions(proteins).then(response => { return this.cleanProteins(response) })
      return proteins
    },

    async getFragments (id) {
      var posUrl = `${window.BACKEND}/getProteinFragments/${id}`
      var r = []
      await axios({
        method: 'get',
        url: posUrl
      })
        .then(response => {
          if (response.data.length > 0) {
            r = response.data
          }
        })
      return r
    }
  }
}
</script>

<style scoped>
.v-lazy-image{
  width: 100vw;
}

.infoLink{
    position: absolute;
    top: 10px;
    height: 42px;
    right: 125px;
}

/* Christian's work */
@media screen and (min-width: 550px){
  #matrix{
    height: 99vh;
    background: #c0c0c0 url('../assets/img/Resource-banner.svg') no-repeat calc(6px + 0.4vw) calc(8px + 0.1vh);
    background-size: calc(115px + 5vw) calc(26px + 2vw);
    text-align: center;
  }
}
 @media screen and (max-width: 549px){
   #matrix{
  height: 99vh;
  background: #c0c0c0 url('../assets/img/AquariaLogo.svg') no-repeat calc(6px + 0.4vw) calc(8px + 0.1vh);
  background-size: calc(130px + 1.5vw) calc(35px + 1.5vw);
  text-align: center;
  }
}
/* general layout and colors */
    body {
        margin: 0;
        padding: 0;
        background: #bbbbbb;
    }
    div.no_match h3 {
        font-weight:400;
    }
    .cell {
        background-color: #ffffff;
        position: relative;
        overflow: scroll;
        /* 'relative' as reference point for absolute positioned elements inside */
    }

    .rowContent {
      display: none;
    }

    .open .rowContent {
      position: relative;
      width: 100%;
      height: 100%;
      display: block;
    }

    /* * * * * CSS grid * * * * */
    #container {
        /* display: grid; c0c0c0 */
        grid-gap: 6px;
        background: #ffffff;
        padding: 0px; /* removed the padding here */
        height: 95%;
        margin: 0 auto;
        overflow: scroll;
    }
    /* Wide aspect ratio */
    #container {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(3, 1fr);
        height: 95%;
    }

    .cell {
        grid-column: span 1;
        grid-row: span 1;
    }
    .cell img {
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
    /* TYPOGRAPHY */
    /* responsive sizes */
    #matrix .cell {
        /* font-family: 'Source Sans Pro', sans-serif; */
        font-size: 10px;
    }
    @media screen and (min-width: 320px) {
        #matrix .cell {
            font-size: calc(8px + 6 * ((100vw - 320px) / 680));
        }
    }
    /* Alignment */
    h1, h3, p {
        margin: 0;
    }
    span#count {
        color:#383838;
        font-weight: 300;
        font-size: 60%;
        margin-left: 20px;
    }
    a span#help {
        display:inline-block;
        color:#ffffff;
        background:#0876d6;
        font-weight: 700;
        font-size: 80%;
        border-radius: 50%;
        margin-left: 20px;
        width: 1.2em;
        line-height: 1.2em;
    }
    .cell p {
        position: absolute;
        width: 100%; /* this, together with 'text-align:center' from body, keeps text centered */
        bottom: 5%;
        z-index:1;
    }
    .cell h3 {
        position: absolute;
        width: 100%;
        top: 5%;
        z-index:1;
        font-size: inherit;
    }
</style>
