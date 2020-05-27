<template>
<div>
  <img v-if="this.dataReceived && !this.isOpen" @click="isOpen = true" class="xr-menu-button" src="/images/ar-button.png">
  <div class="column xr-modal" v-if="isOpen">
    <div class="column inner-modal">
      <div class="row modal-header">
        <div></div>
        <h1>XR Options</h1>
        <button @click="isOpen = false">X</button>
      </div>
      <div class="column modal-content">

        <!-- iOS (AR Quick Look) -->
        <a v-if="this.quickLook" class="xr-item xr-platform-button ios" rel="ar" :href="this.quickLookUri">
          <img class="xr-image" src="/images/ar-button.png">
        </a>
        <!-- Android (Scene Viewer) -->
        <a v-if="this.sceneViewer" class="xr-item xr-platform-button android" :href="this.sceneViewerUri">
          <img class="xr-image" src="/images/ar-button.png">
        </a>
        <!-- Other (Download GLTF) -->
        <a v-if="!this.sceneViewer && !this.quickLook" class="xr-item xr-platform-button default" :href="this.defaultUri" :download="this.proteinId + '.' + this.pdbId + '.glb'">
          <img class="xr-image" src="/images/ar-button.png">
        </a>

        <!-- PlayStation -->
        <button class="xr-item default-button" v-bind:disabled="features === null" @click="isOpen = false; psvrExport()">Send to PSVR</button>

        <!-- HEVS -->
        <button class="xr-item default-button" v-bind:disabled="true" @click="hevsExport()">Send to HEVS</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import { detect } from 'detect-browser'

const MODEL_SERVER = 'https://ie.csiro.au/services/aquaria-export'

function exportFeatures (features) {
  return features.map(f => ({
    c: f.color,
    n: f.name,
    s: f.start,
    e: f.end,
    d: f.desc
  }))
}

function encodeFeatures (features) {
  const str = exportFeatures(features)
    .map(f => encodeURIComponent(JSON.stringify(f)))
    .join('&f=')
  return `f=${str}`
}

export default {
  name: 'XRButton',
  components: {},
  data: () => {
    return {
      dataReceived: false,
      pdbId: 'none',
      proteinId: 'none',
      quickLook: false,
      sceneViewer: false,
      features: null,
      isOpen: false
    }
  },
  mounted: function () {
    // shim the chainSelected function to detect changes
    // @TODO: integrate rest of Aquaria into Vue reactivity so hacks like this aren't necessary
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

    // detect changes to current features
    window.AQUARIA.onFeatureChange = (features, trackNo) => {
      if (features) {
        this.features = features.Tracks[trackNo]
      } else {
        this.features = null
      }
    }

    // platform detection
    const browser = detect()
    if (browser.os === 'iOS' || (browser.os === 'Mac OS' && browser.name === 'safari')) {
      // Since iOS 13, iPad Safari reports as MacOS Safari, so it must be treated same as iOS to support AR on iPad
      // will fall back to USDZ download if used on actual MacOS Safari
      this.quickLook = true
    } else if (browser.os === 'Android OS' && browser.name === 'chrome') {
      // @TODO consider behaviour for non-Chrome browsers on Android
      this.sceneViewer = true
    }
    // otherwise the default behaviour (download .glb) will be used
  },
  computed: {
    baseUri () {
      // https://bitbucket.csiro.au/scm/~and490/jolecule-server
      // @TODO: Add features. Server currently requires URI to fetch features from but these don't seem to be exposed to us here in the Aquaria client
      return `${MODEL_SERVER}/${this.proteinId}/${this.pdbId}`
    },
    query () {
      const query = []
      if (this.features) {
        query.push(encodeFeatures(this.features))
      }
      if (query.length > 0) {
        return `?${query.join('&')}`
      } else return ''
    },
    quickLookUri () {
      // https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look
      return `${this.baseUri}.usdz${this.query}`
    },
    sceneViewerUri () {
      // https://developers.google.com/ar/develop/java/scene-viewer
      // @TODO: give thought to what the appropriate fallback URI is
      const pkg = 'com.google.android.googlequicksearchbox' // Scene Viewer including non-AR fallback is now built into Google Search
      const action = 'android.intent.action.VIEW'
      const file = `${this.baseUri}.glb${this.query}` // server generated file URI
      const title = `${this.proteinId}.${this.pdbId}` // title to be displayed
      const mode = 'ar_preferred' // default to AR view if available, fall back to a 3D model view if AR not supported or Google Play Services for AR not installed
      const fallback = 'https://developers.google.com/ar' // this will only be visited if Google Search pkg is out of date or unavailable
      return `intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=${mode}&title=${title}#Intent;scheme=https;package=${pkg};action=${action};S.browser_fallback_url=${fallback};end;`
    },
    defaultUri () {
      return `${this.baseUri}.glb${this.query}`
    }
  },
  methods: {
    psvrExport: async function () {
      const result = await fetch(`${MODEL_SERVER}/psvr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ protein: this.proteinId, pdb: this.pdbId, features: exportFeatures(this.features) })
      })
      if (result.status !== 200) {
        alert('PSVR Error')
      } else {
        console.debug(`PSVR Success. Returned: ${await result.text()}`)
      }
    },
    hevsExport: function () {
      alert('coming soon!')
    }
  }
}
</script>

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
    color: black;
    background-color: white;
    border-radius: 5px;
    font-size: 1.5em;
    box-shadow: none;
    border: 2px solid black;
    padding: 3px;
    line-height: 100%;
    cursor: pointer;
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

  .xr-platform-button {
    width: 40px;
    height: 40px;
  }

  .xr-image {
    width: 100%;
    height: 100%;
  }

</style>
