<template>
  <div id="matrix">
    <MatrixHeader />
    <LoadingPage />
    <a id='graph' title='Click to open interactive version'>
      <v-lazy-image
        :src="Fig100"
        :src-placeholder="Fig55"
        />
    </a>
     <div id="container">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MatrixHeader from '../components/MatrixLayout/MatrixHeader'
import LoadingPage from '../components/MatrixLayout/LoadingPage'
import VLazyImage from 'v-lazy-image'
import store from '@/store/index'

export default {
  name: 'Matrix',
  components: {
    VLazyImage,
    MatrixHeader,
    LoadingPage
  },
  data () {
    return {
      Fig55: require('../assets/img/Fig_2_55.jpg'),
      Fig100: require('../assets/img/Fig_2_100.jpg'),
      hostname: store.state.url,
      publicPath: process.env.BASE_URL,
      structures: null,
      organism: null,
      clicked: false,
      totalStructures: 0,
      d3: require('d3'),
      green: '#7A9D5B',
      backgroundColour: '#cccccc',
      x: 0,
      y: 20,
      organismId: '2697049' // can look at others but they do not exist in database for getGenomicPosition COVID:2697049 SARS:694009 MERS:1263720
    }
  },
  mounted () {
    document.querySelector('#graph').style.display = 'none'
    // document.querySelector('#container').style.display = 'grid'
    // TODO: INTERACTIVE COLLAPSE AND EXPAND THE DIFFERENT SECTIONS
    // TODO: REPLACE IMAGES WITH THE ONES ON KEYNOTE, AUTOMATICALLY FETCH IMAGES FROM IMAGE SERVER FOR SARS AND MERS

    let allStructures

    // gets an organism and runs all the functions and loads everything
    var url = 'https://aquaria.ws:8010/' + this.organismId
    document.querySelector('#graph > img').addEventListener('load', () => {
      setTimeout(function () {
        if (document.querySelector('.matrixLoading')) {
          document.querySelector('.matrixLoading').style.visibility = 'hidden'
          document.querySelector('.matrixLoading').style.display = 'none'
        }
      }, 350)
      axios({
        method: 'get',
        url: url
      })
        .then(response => {
          allStructures = JSON.parse(response.data.primary_accessions)
          this.getStructures(this.organismId, allStructures).then(response => {
            this.getMatchingStructures(response).then(response => {
              this.getProteinSynonyms(response).then(response => {
                this.loadShapes(response)
              })
            })
          })
          this.structures = allStructures
        })
    })
  },
  methods: {
    // given sequence length, return length of the rectangle to generate.
    getResidueSize (scale, length) {
      return length * scale
    },

    // This function takes in the protein data, and draws all the shapes
    async loadShapes (data) {
      // data in the format of [{name:string, primary_accession:string, sequence:string, position:int, length:int, clusters:array or 0, dark:bool, continuous:bool}]
      data = this.partitionToThree(data)
      var continuous = 0 // used to draw continuous axis over multiple proteins

      // var svg = this.d3.select('#container').append('svg').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 960 1200') // 960 width preserving aspect ratio instead of using window.innerWidth
      var scale = 960 / Math.max(...(data.map(el => this.getListSum(el)))) // scale the viewport by the longest of the three lists in data

      for (var i = 0; i < data.length; i++) {
        var svg = this.d3.select('#container').append('svg').attr('class', 'row').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 960 300') // 960 width preserving aspect ratio instead of using window.innerWidth

        this.x = 0 // displacement from the left
        this.y = 20
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
          this.drawArrow(svg, data[i][n], width, height, triangleSize, offset)

          // Draw the axis
          var xScale = this.d3.scale.linear()
            .domain([continuous, continuous + data[i][n].length]) // This is what is written on the Axis: from 0 to length of residue
            .range([1, width + triangleSize - 1]) // This is where the axis is placed: from start to end of triangle. Add a tiny bit of spacing between the two

          if (data[i][n].continuous) {
            continuous = data[i][n].length
          } else {
            continuous = 0
          }

          var ticks = Math.floor(data[i][n].length / 500 + 1) // a tick every 500 residues
          if (ticks > 3) { // if longer than 1500 residues
            var axis = svg
              .append('g')
              .attr('transform', 'translate(' + offset + ',' + (this.y - 15) + ')') // This controls the vertical position of the Axis
              .attr('style', '')
              .style('fill', 'gray')
              .style('font-size', '10px')
              .attr('class', 'rowContent')
              .call(this.d3.svg.axis().scale(xScale).tickSize(0, 1).tickFormat((interval, i) => { return interval % 1000 !== 0 ? ' ' : interval }).orient('bottom').ticks(ticks)) // render only thousand ticks
              // .call(g => g.selectAll('text')
              //   .attr('y', 4)
              //   .attr('dx', -4)) // shifts text to the left. How to align properly?

            axis.selectAll('.tick')
              .attr('stroke', 'gray')
              .attr('x1', this.x)
              .attr('x2', this.x)
              .attr('y2', -1)
              .attr('y1', 2)
              .attr('stroke-width', '1')
          } else if (data[i][n].length > 200) {
            var smallAxis = svg.append('g')
              .attr('transform', 'translate(' + offset + ',' + (this.y - 14) + ')')
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
              .attr('y', this.y - 14)
              .attr('dy', '.35em')
              .style('text-anchor', 'middle')
              .attr('transform', 'translate(' + offset + ',0)')
              .style('fill', 'gray')
              .style('font-size', '10px')
              .attr('class', 'rowContent')
              .text(data[i][n].length)

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

          // Draw fragments if they exist
          this.renderFragments(svg, data[i][n].fragments, scale)

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

          if (!data[i][n].dark && this.organismId === '2697049') {
            img.attr('xlink:href', '../images/covid19/WEBP/' + data[i][n].primary_accession + '_w500.webp')
          } else if (!data[i][n].dark) {
            img.attr('xlink:href', 'https://aquaria.ws:8080/image/' + data[i][n].primary_accession + '/' + data[i][n].pdb + '?color=0x000000&alpha=0')
          } else {
            img.attr('xlink:href', '../images/covid19/unknown-structure_1000.png')
          }

          // draw the bottom matching structures axis
          if (!data[i][n].dark) {
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
              .text(this.countMatchingStructures(data[i][n].clusters))

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

            // Create the expand and collapse button
            var expandButton = svg.append('circle')
              .attr('cx', 15)
              .attr('cy', 30)
              .attr('stroke', 'gray')
              .attr('fill', '#69b3a2')
              .attr('r', 15)

            expandButton.on('click', function (d, i) { // TODO COLLAPSE AND EXPAND : Change the initial display of open
              var d3 = require('d3')
              if (this.parentNode.className.baseVal.split(' ').indexOf('open') > -1) {
                d3.select(this.parentNode).classed('open', false)
                d3.selectAll('.row').transition().duration(1000).attr('viewBox', '0 0 960 50')
                d3.selectAll('.rowContent').transition().duration(1000).attr('opacity', 0)
              } else {
                d3.selectAll('.row').classed('open', false)
                d3.selectAll('.row').transition().duration(1000).attr('viewBox', '0 0 960 50')
                d3.selectAll('.rowContent').transition().duration(1000).attr('opacity', 0)

                d3.select(this.parentNode).classed('open', true)
                d3.selectAll('.open').transition().duration(1000).attr('viewBox', '0 0 960 300')
                d3.selectAll('.open .rowContent').transition().duration(1000).attr('opacity', 1)
              }
            })
          }

          // Adjust the offset for the next protein
          offset = offset + width + triangleSize
        }
      }
    },

    drawArrow (svg, protein, width, height, triangleSize, offset) {
      var fill = protein.dark ? 'black' : this.green
      // create a rectangle
      svg.append('rect')
        .attr('x', this.x)
        .attr('y', this.y)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', fill)
        .attr('id', protein.primary_accession)
        .attr('title', protein.primary_accession)
        .attr('transform', 'translate(' + offset + ',0)')
        .on('mouseover', function (d, i) {
          var d3 = require('d3')
          d3.select(this).transition().duration('50').attr('opacity', '.85')
          d3.select('polygon#' + this.id).transition().duration('50').attr('opacity', '.85')
        })
        .on('mouseout', function (d, i) {
          var d3 = require('d3')
          d3.select(this).transition().duration('50').attr('opacity', '1')
          d3.select('polygon#' + this.id).transition().duration('50').attr('opacity', '1')
        //   div.transition().duration('50').style('opacity', 0)
        })
        .on('click', function () {
          var d3 = require('d3')
          var baseUrl = window.location.origin
          window.open(baseUrl + '/' + d3.select(this).attr('title'))
        })
        .append('svg:title')
        .text(protein.name)

      var xend = this.x + width // x coords at the right-most end of the rectangle
      var ycenter = this.y + (height / 2) // the y coords of the center of the rectangle. y displacement + half the rectangle's height
      var points = [xend, ycenter - triangleSize, xend, ycenter + triangleSize, xend + triangleSize, ycenter] // point 1 x coords, y coords. Point 2 x, y. Point 3 x,y.

      // create a triangle
      svg.append('svg:polygon')
        .attr('points', points)
        .attr('fill', fill)
        .attr('id', protein.primary_accession)
        .attr('title', protein.primary_accession)
        .attr('transform', 'translate(' + offset + ',0)')
        .on('mouseover', function (d, i) {
          var d3 = require('d3')
          d3.select(this).transition().duration('50').attr('opacity', '.85')
          d3.select('rect#' + this.id).transition().duration('50').attr('opacity', '.85')
        })
        .on('mouseout', function (d, i) {
          var d3 = require('d3')
          d3.select(this).transition().duration('50').attr('opacity', '1')
          d3.select('rect#' + this.id).transition().duration('50').attr('opacity', '1')
        })
        .on('click', function () {
          var d3 = require('d3')
          var baseUrl = window.location.origin
          window.open(baseUrl + '/' + d3.select(this).attr('title'))
        })
        .append('svg:title')
        .text(protein.name)

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
        var shortest = protein.synonym.reduce((a, b) => a.length <= b.length ? a : b)
        shortest = shortest.replace('orf', '').replace('ORF', '')
        lab.text(shortest)
        if (lab.node().getComputedTextLength() > width + 0.5 * triangleSize) {
          lab.attr('y', this.y + height * 1.5)
          lab.style('fill', this.green)
          lab.attr('class', 'rowContent')
        }
      }
    },

    renderFragments (svg, fragments, scale) {
      console.log(fragments)
      if (fragments.length !== 0) {
        this.y = this.y + 30
      }
      var offset = 0
      for (var i = 0; i < fragments.length; i++) {
        var protein = {
          name: fragments[i].Name,
          primary_accession: fragments[i].Primary_Accession,
          synonym: [fragments[i].Short_Name],
          pdb: null,
          dark: true
        }
        var len = fragments[i].Stop - fragments[i].Start
        var height = 20 // the height of the rectangles, and the length of the triangle that is appended. Triangle width is 2*height
        var triangleSize = height / 1.5
        var width = this.getResidueSize(scale, len) - triangleSize // length of the residues, minus the width of the appended triangle
        if (width < 0) {
          triangleSize = this.getResidueSize(scale, len) // scale down the triangle
          width = 0
        }
        this.drawArrow(svg, protein, width, height, triangleSize, offset)
        offset = offset + width + triangleSize
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
    cleanProteins (proteins) {
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
      var posUrl = 'http://localhost:8010/getGenomicPosition/' + id
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
      var synUrl = 'https://aquaria.ws:8010/getProteinSynonyms/' + id
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
        var urlMatching = 'https://aquaria.ws:8010/get_matching_structures?selector[]=' + proteins[i].primary_accession
        await axios({
          method: 'get',
          url: urlMatching
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

    // Gets all the structures of a particular organism, removes irrelevant information
    async getStructures (organismId, allStructures) {
      var proteins = []
      var purl
      allStructures = await this.sortStructures(organismId, allStructures)

      for (let index = 0; index < allStructures.length; index++) {
        allStructures[index].count = 0
        purl = 'https://odonoghuelab.org:8011/get_3D_alignment?selector[]=' + allStructures[index].primary_accession
        await axios({
          method: 'get',
          url: purl
        })
          .then(response => {
            var sequence = ''
            if (response.data.sequences) {
              sequence = response.data.sequences[0]
              var seqLength = sequence.length
              console.log('Loaded ', allStructures[index].synonym, seqLength)
              proteins.push({ name: allStructures[index].synonym, primary_accession: allStructures[index].primary_accession, sequence: sequence.sequence, position: allStructures[index].position, length: seqLength, dark: false })
            } else {
              // this is a dark protein
              sequence = response.data[allStructures[index].primary_accession]
              proteins.push({ name: allStructures[index].synonym, primary_accession: allStructures[index].primary_accession, sequence: sequence.sequence, position: allStructures[index].position, length: sequence.length, dark: true })
            }
            return this.getFragments(allStructures[index].primary_accession)
          }).then(fragments => {
            proteins[index].fragments = fragments
          })
      }
      proteins = this.cleanProteins(proteins)
      return proteins
    },

    // TODO: if clean proteins was split, get fragments but also be split! Need to do this before the cleanProteins step
    async getFragments (id) {
      console.log('getting fragments for d', id)
      var posUrl = 'http://localhost:8010/getProteinFragments/' + id
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
        background-color: #cccccc;
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
        background: #cccccc;
        padding: 6px;
        height: 90%;
        margin: 0 auto;
        overflow: scroll;
    }
    /* Wide aspect ratio */
    #container {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(3, 1fr);
        height: 90%;
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

    /* iframe#slide{
      height:91.7vh;
      width: 100%;
      border: none;
    } */

    #graph{
      width: 100vw;
      position: absolute;
    }

  .v-lazy-image {
  filter: blur(10px);
  transition: filter 1.5s;
  }

  .v-lazy-image-loaded {
    filter: blur(0);
  }
</style>
