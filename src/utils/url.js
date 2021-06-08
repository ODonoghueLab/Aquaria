
//  Main client script that defines the AQUARIA namespace and initiates page load.
//  Copyright (c) Garvan Institue of Medical Research and CSIRO
//
//  Authors:
//  Neblina Sikta <n.sikta@garvan.org.au>
//
// This work is licensed under the terms of the GNU GPL version 2.

import axios from 'axios'
import * as LoadAQUARIA from './loadData'
import Store from '../store/index'
var AQUARIA = window.AQUARIA
var uniprotAccession = []
var pdb, chain, previousPDB

export function remoteSuccess () {
  var pathname = document.location.pathname // document.URL.split('?')[0];
  if (pathname
    .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/?$/)) {
    uniprotAccession.push(RegExp.$1.toUpperCase())
    AQUARIA.initialisePanels(true)
    window.AQUARIA.panel3d.blankApplet(true)
    AQUARIA.blankAll(true, 'Waiting for data...')
    previousPDB = window.AQUARIA.pdbTopTen.previousLookup(uniprotAccession)
    if (!previousPDB) {
      LoadAQUARIA.loadAccession(uniprotAccession)
    } else {
      const featureRegex = new RegExp(/(p\.)?[A-Za-z]+[0-9]+[A-Za-z\*\_\?\[\]\(\)\%\=]+/) // eslint-disable-line
      var searchParam = decodeURIComponent(window.location.search.split('?')[1])

      if (featureRegex.test(searchParam)) {
        console.log('The pdbParam should now be false')
        LoadAQUARIA.loadAccession(uniprotAccession)
      } else {
        LoadAQUARIA.loadAccession(uniprotAccession, previousPDB)
      }
    }
    // LoadAQUARIA.loadAccession(uniprotAccession)
  } else if (pathname // primary accession and pdb
    .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])\/?$/)) {
    uniprotAccession.push(RegExp.$1.toUpperCase())
    pdb = RegExp.$2.toLowerCase()
    AQUARIA.initialisePanels(true)
    window.AQUARIA.panel3d.blankApplet(true)
    AQUARIA.blankAll(true, 'Waiting for data...')
    LoadAQUARIA.loadAccession(uniprotAccession, pdb)
  } else if (pathname // primary accession and pdb and chain
    .match(/\/(?:leap\/)?([A-Z a-z][0-9][A-Z a-z,0-9][A-Z a-z,0-9][A-Z a-z,0-9][0-9])\/([0-9]([A-Z a-z,0-9][A-Z a-z,0-9])[A-Z a-z,0-9])\/([a-zA-Z,0-9])?$/)) {
    uniprotAccession = []
    uniprotAccession.push(RegExp.$1.toUpperCase())
    pdb = RegExp.$2.toLowerCase()
    chain = RegExp.$4.toUpperCase()
    AQUARIA.initialisePanels(true)
    window.AQUARIA.panel3d.blankApplet(true)
    AQUARIA.blankAll(true, 'Waiting for data...')
    LoadAQUARIA.loadAccession(uniprotAccession, pdb, chain, false)
  } else if (pathname
    .match(/^\/([0-9]([A-Z a-z,0-9][A-Z a-z,0-9])[A-Z a-z,0-9])?$/)) {
    pdb = RegExp.$1.toLowerCase()
    var url = `${window.BACKEND}/getAccessionForPDB/${pdb}`
    axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        uniprotAccession.push(response.data.Accession)
        chain = response.data.Chain
        AQUARIA.initialisePanels(true)
        window.AQUARIA.panel3d.blankApplet(true)
        AQUARIA.blankAll(true, 'Waiting for data...')
        LoadAQUARIA.loadAccession(uniprotAccession, pdb)
      })
  } else if (window.location.pathname) {
    var accession = []
    const attr = window.location.pathname.split('/')
    // const organism_gene = attr[1] + '/' + attr[2]
    url = `${window.BACKEND}/getAccessionbyOrgNameandGene/${attr[1]}/${attr[2]}`
    axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        console.log('In url.js, looking at the response')
        console.log(response)
        AQUARIA.orgName = attr[1]
        AQUARIA.Gene = attr[2]
        // const orgID = response.data[0].orgID
        accession.push(response.data[0].Primary_Accession)
        if (attr.length > 4) {
          if (attr[3].match(/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])/)) {
            pdb = attr[3]
          }
          if (attr[4].match(/([a-zA-Z,0-9])?$/)) {
            chain = attr[4]
          }
          AQUARIA.initialisePanels(true)
          window.AQUARIA.panel3d.blankApplet(true)
          LoadAQUARIA.loadAccession(accession, pdb, chain)
        } else if (attr.length > 3) {
          if (attr[3].match(/([0-9]([A-Z a-z,0-9][A-z a-z,0-9])[A-Z a-z,0-9])/)) {
            pdb = attr[3]
          }
          AQUARIA.initialisePanels(true)
          window.AQUARIA.panel3d.blankApplet(true)
          LoadAQUARIA.loadAccession(accession, pdb)
        } else {
          AQUARIA.initialisePanels(true)
          window.AQUARIA.panel3d.blankApplet(true)
          previousPDB = window.AQUARIA.pdbTopTen.previousLookupByName(AQUARIA.orgName + '_' + AQUARIA.Gene)
          if (!previousPDB) {
            LoadAQUARIA.loadAccession(accession)
          } else {
            const featureRegex = new RegExp(/(p\.)?[A-Za-z]+[0-9]+[A-Za-z\*\_\?\[\]\(\)\%\=]+/) // eslint-disable-line
            var searchParam = decodeURIComponent(window.location.search.split('?')[1])

            if (featureRegex.test(searchParam)) {
              console.log('The pdbParam should now be false')
              LoadAQUARIA.loadAccession(accession)
            } else {
              LoadAQUARIA.loadAccession(accession, previousPDB)
            }
            // LoadAQUARIA.loadAccession(accession, previousPDB)
          }
        }
      })
      .catch(function () {
        AQUARIA.initialisePanels(false)
        window.AQUARIA.panel3d.blankApplet(true)
        Store.commit('setErrorTitle', 'Cannot find PDB.')
      })
  } else {
    AQUARIA.initialisePanels(false)
    window.AQUARIA.panel3d.blankApplet(true)
    Store.commit('setErrorTitle', 'PDB not available.')
  }
}
