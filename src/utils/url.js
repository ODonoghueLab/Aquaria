import axios from 'axios'
import domready from 'domready'
// import molecularControlToolkitJS from 'molecular-control-toolkit-js'
var Applet3DPanel = require('../legacy/applet3DPanel')
var PV3DPanel = require('../legacy/pv3DPanel')
var JoleculePanel = require('../legacy/joleculePanel')
var IDRPanel = require('../legacy/IDRPanel')

//
// Functions to run the first time the nowjs socket connection is ready.
//
//
var initialised = false
var AQUARIA = window.AQUARIA

export function remoteSuccess () {
  if (initialised) {
    return
  }

  /// console.log("AQUARIA.remoteSuccess socket connection is ready");

  initialised = true

  //   if (!window.console) {
  //     console = {
  //       log: function () {}
  //     }
  //   }
  var uniprotAccession
  // when 'now' socket is ready, fetch structures if URL specifies
  // a Primary_Accession
  var pathname = document.location.origin + document.location.pathname // document.URL.split('?')[0];
  if (typeof window.initialParams !== 'undefined') {
    AQUARIA.initialisePanels(true)
    uniprotAccession = []
    uniprotAccession.push(window.initialParams.primary_accession)
    AQUARIA.loadAccession(uniprotAccession, window.initialParams.pdb_id, window.initialParams.pdb_chain)
  } else if (pathname
    .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/?$/)) {
    uniprotAccession = []
    uniprotAccession.push(RegExp.$1.toUpperCase())
    AQUARIA.initialisePanels(true)
    AQUARIA.blankAll(true, 'Waiting for data...')
    AQUARIA.loadAccession(uniprotAccession)
  } else if (pathname
    .match(/\/(?:leap\/)?([a-zA-Z0-9]{30,})\/?$/)) {
    uniprotAccession = RegExp.$1.toUpperCase()
    AQUARIA.initialisePanels(true)
    AQUARIA.blankAll(true, 'Waiting for data...')
    AQUARIA.loadAccession(uniprotAccession)
    // primary accession and pdb
  } else if (pathname
    .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])\/?$/)) {
    uniprotAccession = []
    uniprotAccession.push(RegExp.$1.toUpperCase())
    var pdb = RegExp.$2.toLowerCase()
    AQUARIA.initialisePanels(true)
    AQUARIA.blankAll(true, 'Waiting for data...')
    AQUARIA.loadAccession(uniprotAccession, pdb)
    // primary accession and pdb and chain
  } else if (pathname
    .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/([0-9]([A-Z a-z,0-9][A-Z a-z,0-9])[A-Z a-z,0-9])\/([a-zA-Z,0-9])?$/)) {
    uniprotAccession = []
    uniprotAccession.push(RegExp.$1.toUpperCase())
    pdb = RegExp.$2.toLowerCase()
    var chain = RegExp.$4.toUpperCase()
    /// console.log('AQUARIA.remoteSuccess inside chain selection');
    AQUARIA.initialisePanels(true)
    AQUARIA.blankAll(true, 'Waiting for data...')
    AQUARIA.loadAccession(uniprotAccession, pdb, chain)
  } else if (window.location.pathname) {
    var accession = []
    const attr = window.location.pathname.split('/')
    // var organismGene = attr[1] + '/' + attr[2]
    var url = `${window.BACKEND}/getAccessionbyOrgNameandGene/${attr[1]}/${attr[2]}`
    axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        AQUARIA.orgName = attr[1]
        AQUARIA.gene = attr[2]
        // var orgID = response.data[0].orgID
        accession.push(response.data[0].Primary_Accession)
        if (attr.length > 4) {
          if (attr[3].match(/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])/)) {
            pdb = attr[3]
          }
          if (attr[4].match(/([a-zA-Z,0-9])?$/)) {
            chain = attr[4]
          }
          AQUARIA.initialisePanels(true)
          AQUARIA.loadAccession(accession, pdb, chain)
        } else if (attr.length > 3) {
          if (attr[3].match(/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])/)) {
            pdb = attr[3]
          }
          AQUARIA.initialisePanels(true)
          AQUARIA.loadAccession(accession, pdb)
        } else {
          AQUARIA.initialisePanels(true)
          AQUARIA.loadAccession(accession)
        }
      })
  } else if (pathname.match(/\/([A-Za-z]+)/)) {
    // uniprotAccession = RegExp.$1;
    // History:
    // [JH] matches the URL and tries to load it as accession
    // not sure if we need this for the history in the search box?
    // AQUARIA.loadAccession(uniprotAccession);
    AQUARIA.initialisePanels(false)
  } else {
    AQUARIA.initialisePanels(false)
  }
};

domready(function () {
  if (window.threedViewer === 'applet') {
    AQUARIA.panel3d = new Applet3DPanel('#threeDSpan')
  } else if (window.threedViewer === 'jolecule') {
    AQUARIA.panel3d = new JoleculePanel('#threeDSpan', AQUARIA.chainSelected)
  } else if (window.threedViewer === 'webgl') {
    AQUARIA.panel3d = new PV3DPanel('#threeDSpan')
  } else if (window.threedViewer === 'idr') {
    AQUARIA.panel3d = new IDRPanel('#threeDSpan')
  } else {
    console.log('AQUARIA.domready cannot find viewer: ' + window.threedViewer)
  }
  //   AQUARIA.Gesture = new molecularControlToolkitJS.leap(AQUARIA.panel3d.gestures())
  remoteSuccess()
})
