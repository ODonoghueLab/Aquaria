var JoleculePanel = function (attachToDiv, chainSelected) {
  this.blankApplet()
  this.attachToDiv = attachToDiv
  var n = attachToDiv.length
  var divId = attachToDiv.substring(1, n)
  var currentDiv = document.getElementById(divId)
  var newDiv = document.createElement('div')
  var newDivId = divId + '-inner'
  var newAttachToDiv = '#' + newDivId
  newDiv.setAttribute('id', newDivId)
  newDiv.setAttribute('style', 'padding-bottom: 2px; box-sizing: border-box; width: 100%; height: 98.6%%')
  currentDiv.appendChild(newDiv)
  this.chainSelected = window.AQUARIA.chainSelected
  this.embededJolecule = jolecule.initEmbedJolecule({
    divTag: newAttachToDiv,
    isLoop: false,
    isGrid: true,
    isLegend: true,
    backgroundColor: '#C0C0C0',
    isEditable: true,
    isResidueSelector: false,
    isExtraEditable: true,
    isMenu: true,
    isToolbarOnTop: true,
    isToolbarOn: true,
    isTextOverlay: false,
    isMouseWheel: true
  })
  // apply Neblina's scripts to alter jolecule appearance
  require('./jolecule-mods')
  var alignment = new jolecule.AquariaAlignment()
  this.joleculeAlignment = alignment
  var controller = this.embededJolecule.controller

  this.embededJolecule.soupWidget.focus = function () {
    document.activeElement.blur()
  }

  document.onkeydown = function (event) {
    const c = String.fromCharCode(event.keyCode).toUpperCase()
    if (false) {
    } else if (event.keyCode === 37) {
      const isClear = !event.shiftKey
      controller.selectPrevResidue(isClear)
    } else if (event.keyCode === 39) {
      const isClear = !event.shiftKey
      controller.selectNextResidue(isClear)
    } else if (event.keyCode === 13) {
      controller.zoomToSelection()
    } else if (event.keyCode === 27) {
      alignment.selectSeq = ''
      controller.clearSelectedResidues()
    } else if (c === 'C' && event.metaKey) {
      alignment.copyToClipboard()
    } else {
      if (document.activeElement === document.body) {
        if (c.match(/^[A-Z]+$/i)) {
          alignment.selectNextChar(c)
        }
      }
    }
  }

  document.addEventListener('paste', e => {
    if (document.activeElement !== document.body) {
      return
    }
    const data = e.clipboardData
    if (data && data.getData) {
      alignment.selectSeq = ''
      const text = data.getData('text/plain')
      // console.log('AlignAquaria.paste', text)
      for (const c of text.toUpperCase()) {
        alignment.selectNextChar(c)
      }
    }
  })
}

JoleculePanel.prototype.load = function (attributes) {
  document.querySelector('#threeDSpan-inner > div.jolecule-embed-header.jolecule-embed-toolbar').style.display = 'none'
  document.querySelector('#toggle-toolbar-button').style.display = 'none'
  this.reload(attributes)
}

JoleculePanel.prototype.changeViewerSize = function (w, h) {
  this.embededJolecule.resize()
}

buildFeatures = function (featureNames, featureDescriptions, featurePositions, featureColours) {
  const features = []
  for (i = 0; i < featurePositions.length; i++) {
    featurePosition = featurePositions[i].split(':')
    featureStart = parseInt(featurePosition[0])
    featureEnd = parseInt(featurePosition[1])
    for (j = featureStart; j <= featureEnd; j++) {
      features.push({
        Residue: j,
        Color: featureColours[i],
        Name: featureNames[i].replace(/\<[^\>\<]*\>/g, '').replace(/^.*\:/, ''),
        Description: ''
      })
    }
  }
  return features
}

JoleculePanel.prototype.addAnnotation = function (id, annotationName, featureColours, featureNames, featureDescriptions, featurePositions, featureURLs, featureURLTexts) {
  const features = buildFeatures(featureNames, featureDescriptions, featurePositions, featureColours)
  // console.log(`JoleculePanel.addAnnotation ${id} "${annotationName}"`, features)
  this.joleculeAlignment.colorFromFeatures(this.embededJolecule, features, id, annotationName)
}

JoleculePanel.prototype.removeAnnotation = function (id, annotationName) {
  // console.log('JoleculePanel.removeAnnotation', id, annotationName, this.embededJolecule)
  this.joleculeAlignment.colorFromConservation(this.embededJolecule)
}

JoleculePanel.prototype.setAlignment = function (attributes) {
  // console.log('JoleculePanel.setAlignment', attributes)
  this.joleculeAlignment.reload(attributes, this.embededJolecule)
  var that = this
  this.joleculeAlignment.selectNewChain = function (seqId, seqName, pdbId, chain) {
    if (seqId && !(seqId === that.seqId && chain === that.chain)) {
      // console.log('JoleculePanel.setAlignment.selectNewChain', seqId, seqName, chain)
      that.chainSelected(seqId, pdbId, chain)
      that.seqId = seqId
      that.chain = chain
    }
  }
}

JoleculePanel.prototype.reload = function (attributes) {
  // console.log('JoleculePanel.reload', attributes)
  attributes = attributes || this.attributes
  this.attributes = attributes
  this.seqId = attributes.sequences[0].primary_acccession
  this.embededJolecule.clear()

  // prevent chain switching from Jolecule inadvertently
  // telling Aquaria to switch proteins when loading and
  // the default chain is not the first
  this.joleculeAlignment.selectNewChain = () => {}

  const that = this
  var DataServer = require('./data-server')

  let PDB_URI = ''
  if (attributes.biounit == 0) {
    // 0, null or undefined
    // url = 'https://files.rcsb.org/download/' + pdbId + '.pdb';
    // PDB_URI = `${window.BACKEND}/getPDB/${attributes.pdb_id}.pdb`;
    PDB_URI = `https://pdbj.org/rest/downloadPDBfile?format=pdb&id=${attributes.pdb_id}`
  } else {
    // url = 'https://files.rcsb.org/download/' + pdbId + '.pdb' + biounit;
    // PDB_URI = `${window.BACKEND}/getPDB/${attributes.pdb_id}.pdb${attributes.biounit}`;
    PDB_URI = `https://pdbj.org/rest/downloadPDBfile?format=bu&id=${attributes.pdb_id}.${attributes.biounit}`
  }
  console.log(PDB_URI)
  const dataServer = new DataServer.DataServer(PDB_URI, attributes.pdb_id)
  this.embededJolecule.asyncAddDataServer(
    dataServer
    // jolecule.makeDataServer(
    //   attributes.pdb_id,
    //   "",
    //   false,
    //   false,
    //   false,
    //   attributes.biounit)
  )
    .then(function () {
      that.setAlignment(attributes)
    })
    .then(function () {
      that.blankApplet(false)
      that.initialised = true
    })
}

// for generating attributes use location+pdb_id
JoleculePanel.prototype.generateAttributes = function (threeDWidth, threeDHeight, pdb_id, pdb_chain, biounit, source_primary_accession, sequences, common_names, pssh_alignment, links, transform,
  conservations) {
  var instanceId = sequences[0].primary_accession + '-' + pdb_id + '-' + (window.AQUARIA.prefferedChain[0] ? window.AQUARIA.prefferedChain[0] : pdb_chain[0])
  return {
    width: threeDWidth,
    height: threeDHeight,
    instanceId,
    biounit,
    pdb_id,
    pdb_chain,
    common_names,
    transform,
    alignment: pssh_alignment,
    conservations,
    sequenceAlignments: null,
    sequences
  }
}

JoleculePanel.prototype.gestures = function () {
  var ret = {}
  return ret
}

JoleculePanel.prototype.blankApplet = function (isOn, message) {
  if (isOn) {
    var appletMessage = $('#waitingFrame').contents().find('#appletMessage')
    if (message) {
      appletMessage.html(message)
    } else {
      appletMessage.text('Please wait...')
    }
    if (!$('#waitingFrame').is(':visible')) {
      $('#waitingFrame').hide()
      $('#waitingFrame').fadeIn('fast')
    }
  } else {
    $('#waitingFrame').fadeOut('slow')
  }
}

module.exports = JoleculePanel
