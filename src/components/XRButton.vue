<script>

/**
  * NOTE: All XR export operations are now run on-demand and do not need to be prepared ahead-of-time,
  * so hacking into Vue reactivity as per XRButtonComponent.mounted may no longer be strictly necessary.
  * However, all required info for XR export functions (e.g. feature server content, top feature server, current feature track,
  * current sequence, current structure, current chain etc) should be available, ideally without hacks, globals or localstorage.
  * Consider storing larger state info (like parsed features) in importable singletons 'let features = {}; export default features;',
  * while properly integrating smaller state (e.g. current feature track) into Vue reactivity (fed into XRButtonComponent as properties).
  * Server-side parsing of features (except perhaps 'Added Features') combined with HTTP (not WebSocket) delivery and appropriate
  * caching headers should render localStorage caching unecessary, improve client performance, and simplify client code
  **/

import * as XR from '../utils/XRUtils'
import QRCode from 'qrcode'

const search = new URLSearchParams(location.search)

/** automatic XR (QR redirect)
 * @TODO a more robust solution would be to flag xr=true and use rest of existing params to reconstruct export URL
 * benefits include:
 *   - ability to easily redirect to auto-XR from non-Aquaria sources (won't need to know the implementation detail of constructing export URLs)
 *   - likely shorter URLs (aka simpler QR code, no limit on number of features)
 * challenges include:
 *   - not enough state contained in the regular URL yet (e.g. active feature/track)
 *   - are all required params available near instantly for full export URI construction? Don't want to keep a user waiting on a load screen pre-XR
 **/
if (search.has('xr')) {
  // parse auto XR details
  const uri = search.get('xr')

  // remove the auto XR tag from search params, one time operation
  search.delete('xr')
  history.replaceState(null, '', `${location.pathname}?${search.toString()}`)

  // perform auto XR action
  XR.invokeAutoXR(uri)
}

const XRButtonComponent = {
  name: 'XRButton',
  components: {},
  data: () => {
    return {
      dataReceived: false,
      pdbId: 'none',
      proteinId: 'none',
      quickLook: XR.Platform.supportsQuickLook,
      sceneViewer: XR.Platform.supportsSceneViewer,
      feature: null,
      featureTrack: -1,
      isOpen: false,
      hevsPlatform: search.get('HEVS'),
      hevsAsset: null,
      psvrEnabled: !!search.get('PSVR'),
      advancedViewerEnabled: !!search.get('dev')
    }
  },
  mounted: function () {
    // shim the chainSelected function to detect changes
    let chainSelectionOriginal
    const chainSelectionProxy = (accession, pdb, chain) => {
      chainSelectionOriginal(accession, pdb, chain)
      this.proteinId = accession
      this.pdbId = pdb
      this.dataReceived = true
    }
    if (window.AQUARIA.chainSelected !== chainSelectionProxy) {
      chainSelectionOriginal = window.AQUARIA.chainSelected
      window.AQUARIA.chainSelected = chainSelectionProxy
    }

    // detect changes to current feature
    window.AQUARIA.onFeatureChange = (feature, trackNo) => {
      if (feature) {
        this.feature = feature
        this.featureTrack = trackNo
      } else {
        this.feature = null
        this.featureTrack = -1
      }
    }
  },
  computed: {
    currentFeatureTrack: function () {
      return this.feature ? this.feature.Tracks[this.featureTrack] : null
    }
  },
  methods: {
    open: function () {
      this.isOpen = true
      const autoXRData = XR.prepareAutoXR(this.proteinId, this.pdbId, this.currentFeatureTrack)
      const url = location.search ? `${location.href}&xr=${autoXRData}` : `${location.href}?xr=${autoXRData}`
      console.log(url)
      // need to wait for canvas to render (its behind a v-if)
      this.$nextTick(() => QRCode.toCanvas(this.$refs.qr, url))
    },
    close: function () {
      this.isOpen = false
    },
    downloadGltf: function () {
      XR.download(this.proteinId, this.pdbId, 'glb', this.currentFeatureTrack, `${this.proteinId}${this.pdbId}.glb`)
    },
    downloadUsd: function () {
      XR.download(this.proteinId, this.pdbId, 'usdz', this.currentFeatureTrack, `${this.proteinId}${this.pdbId}.usdz`)
    },
    openInQuickLook: function () {
      XR.openInQuickLook(this.proteinId, this.pdbId, this.currentFeatureTrack)
    },
    openInSceneViewer: function () {
      XR.openInSceneViewer(this.proteinId, this.pdbId, this.currentFeatureTrack)
    },
    psvrExport: async function () {
      try {
        const response = await XR.openInPSVR(this.proteinId, this.pdbId, XR.retrieveTopFeatureCollection(this.proteinId))
        console.log(`sendToPSVR success, PSVR response [${response}]`)
      } catch (err) {
        console.warn('sendToPSVR error')
        console.dir(err)
        alert(`Send to PSVR failed (${err.message || 'Unknown error'})`)
      }
    },
    hevsExport: async function () {
      try {
        this.hevsAsset = await XR.openInHEVS(this.proteinId, this.pdbId, XR.retrieveTopFeatureCollection(this.proteinId), this.hevsPlatform)
        console.log(`sendToHEVS success, asset ID is ${this.hevsAsset}`)
      } catch (err) {
        console.warn('sendToHEVS error')
        console.dir(err)
        alert(`Send to HEVS failed (${err.message || 'Unknown error'})`)
      }
    },
    openInAdvancedViewer: function () {
      XR.openInAdvancedViewer(this.proteinId, this.pdbId)
    }
  }
}

export default XRButtonComponent
</script>

<template>
<div>
  <img v-if="dataReceived && !isOpen" @click="open()" class="xr-menu-button" src="/images/ar-button.png">
  <div class="column xr-modal" v-if="isOpen">
    <div class="column inner-modal">
      <div class="row modal-header">
        <div></div>
        <h1>XR Options</h1>
        <button @click="close()">X</button>
      </div>
      <div class="column modal-content">

        <!-- Download (GLTF) -->
        <button class="xr-item default-button" @click="close(); downloadGltf()">Download GLTF (.glb)</button>

        <!-- Download (USD) -->
        <button class="xr-item default-button" @click="close(); downloadUsd()">Download USD (.usdz)</button>

        <!-- Scene Viewer -->
        <button v-if="sceneViewer" class="xr-item default-button" @click="close(); openInSceneViewer()">Open in Scene Viewer</button>

        <!-- AR Quick Look (iOS) -->
        <button v-if="quickLook" class="xr-item default-button" @click="close(); openInQuickLook()">Open in AR Quick Look</button>

        <!-- Send to PlayStation -->
        <button v-if="psvrEnabled" class="xr-item default-button" @click="close(); psvrExport()">Send to PSVR</button>

        <!-- Send to HEVS -->
        <button v-if="hevsPlatform" class="xr-item default-button" @click="close(); hevsExport()">Send to HEVS</button>

        <!-- Advanced Viewer (Debug) -->
        <button v-if="advancedViewerEnabled" class="xr-item default-button" @click="close(); openInAdvancedViewer()">Open in Advanced Viewer</button>

        <!-- QR Code (Auto XR) -->
        <canvas class="xr-qr" ref="qr"></canvas>

      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

  .xr-modal {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.75);
  }

  .default-button {
    margin: 5px;
    color: black;
    background-color: white;
    border-radius: 5px;
    font-size: 1.5em;
    box-shadow: none;
    border: 2px solid black;
    padding: 3px;
    line-height: 100%;
    cursor: pointer;
    min-width: 250px;
    padding: 10px;
  }

  .default-button:hover:enabled {
    color: white;
    background-color: black;
  }

  .default-button:disabled {
    cursor: not-allowed;
    color: gray;
    border-color: gray;
  }

  .xr-item {
    margin: 5px;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .xr-modal .inner-modal {
    background-color: white;
    width: 400px;
    max-width: 80%;
    height: 500px;
    max-height: 80%;
  }

  .modal-header {
    align-items: center;
    background-color: black;
    width: 100%;
  }

  .modal-header h1 {
    flex-grow: 1;
    color: white;
  }

  .modal-header div, .modal-header button {
    width: 40px;
    height: 40px;
    margin: 10px;
  }

  .modal-header button {
    color: white;
    cursor: pointer;
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
  }

  .modal-content {
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .xr-menu-button {
    appearance: none;
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0;
    z-index: 1;
    margin-left: 65px;
    margin-top: 10px;
    cursor: pointer;
  }

  .xr-qr {
    max-width: 200px;
    max-height: 200px;
  }

</style>
