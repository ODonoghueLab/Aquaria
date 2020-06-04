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

        <!-- Download (GLTF) -->
        <button class="xr-item default-button" @click="isOpen = false; downloadGltf()">Download GLTF (.glb)</button>

        <!-- Download (USD) -->
        <button class="xr-item default-button" @click="isOpen = false; downloadUsd()">Download USD (.usdz)</button>

        <!-- Scene Viewer -->
        <button v-if="sceneViewer" class="xr-item default-button" @click="isOpen = false; openInSceneViewer()">Open in Scene Viewer</button>

        <!-- AR Quick Look (iOS) -->
        <button v-if="quickLook" class="xr-item default-button" @click="isOpen = false; openInQuickLook()">Open in AR Quick Look</button>

        <!-- Send to PlayStation -->
        <button v-if="psvrEnabled" class="xr-item default-button" @click="isOpen = false; psvrExport()">Send to PSVR</button>

        <!-- Send to HEVS -->
        <button v-if="hevsPlatform" class="xr-item default-button" @click="isOpen = false; hevsExport()">Send to HEVS</button>

        <!-- Advanced Viewer (Debug) -->
        <button v-if="advancedViewerEnabled" class="xr-item default-button" @click="isOpen = false; openInAdvancedViewer()">Open in Advanced Viewer</button>

      </div>
    </div>
  </div>
</div>
</template>

<script>

// instance of https://github.com/ODonoghueLab/aquariaExport
const MODEL_SERVER = 'https://ie.csiro.au/services/aquaria-export'

// instance of https://bitbucket.csiro.au/scm/~and490/aquaria-export-preview
const ADVANCED_VIEWER = 'https://ie.csiro.au/apps/aquaria-export-preview'

const search = new URLSearchParams(location.search)

const featureDetection = {
  supportsSceneViewer: /(android)/i.test(navigator.userAgent),
  supportsQuickLook: document.createElement('a').relList.supports('ar'),
  supportsMixedReality: /(Windows NT 10.0)/i.test(navigator.userAgent)
}

function exportFeatures (features) {
  return features.map(f => ({
    c: f.color,
    n: f.name,
    s: f.start,
    e: f.end,
    d: f.desc
  }))
}

function download (url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

function openInQuickLook (protein, pdb, features) {
  // https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look
  const link = document.createElement('a')
  link.href = getExportUri(protein, pdb, 'usdz', features)
  link.rel = 'ar'
  link.appendChild(document.createElement('img')) // this is required
  link.click()
}

function openInSceneViewer (protein, pdb, features) {
  // https://developers.google.com/ar/develop/java/scene-viewer
  // @TODO: give thought to what the appropriate fallback URI is
  const pkg = 'com.google.android.googlequicksearchbox' // Scene Viewer including non-AR fallback is now built into Google Search
  const action = 'android.intent.action.VIEW'
  const file = getExportUri(protein, pdb, 'glb', features) // server generated file URI
  const title = `${protein}.${pdb}` // title to be displayed
  const mode = 'ar_preferred' // default to AR view if available, fall back to a 3D model view if AR not supported or Google Play Services for AR not installed
  const fallback = 'https://developers.google.com/ar' // this will only be visited if Google Search pkg is out of date or unavailable
  const uri = `intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=${mode}&title=${title}#Intent;scheme=https;package=${pkg};action=${action};S.browser_fallback_url=${fallback};end;`
  const link = document.createElement('a')
  link.href = uri
  link.click()
}

function openInAdvancedViewer (protein, pdb) {
  const link = document.createElement('a')
  link.href = `${ADVANCED_VIEWER}?protein=${protein}&pdb=${pdb}`
  link.target = '_'
  link.click()
}

function getExportUri (protein, pdb, format, bakedFeatures = null) {
  // instance of https://github.com/ODonoghueLab/aquariaExport
  const base = `${MODEL_SERVER}/${protein}/${pdb}.${format}`
  const query = new URLSearchParams()
  if (bakedFeatures) {
    for (const feature in bakedFeatures) {
      query.append('f', JSON.stringify(feature))
    }
  }
  const queryString = query.toString()
  if (queryString) return `${base}?${query}`
  return base
}

export default {
  name: 'XRButton',
  components: {},
  data: () => {
    return {
      dataReceived: false,
      pdbId: 'none',
      proteinId: 'none',
      quickLook: featureDetection.supportsQuickLook,
      sceneViewer: featureDetection.supportsSceneViewer,
      features: null,
      featureTrack: -1,
      isOpen: false,
      hevsPlatform: search.get('HEVS'),
      psvrEnabled: !!search.get('PSVR'),
      advancedViewerEnabled: !!search.get('dev')
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
        this.features = features
        this.featureTrack = trackNo
      } else {
        this.features = null
        this.featureTrack = -1
      }
    }
  },
  methods: {
    downloadGltf: function () {
      download(getExportUri(this.proteinId, this.pdbId, 'glb', this.features ? exportFeatures(this.features.Tracks[this.featureTrack]) : null), `${this.proteinId}${this.pdbId}.glb`)
    },
    downloadUsd: function () {
      download(getExportUri(this.proteinId, this.pdbId, 'usdz', this.features ? exportFeatures(this.features.Tracks[this.featureTrack]) : null), `${this.proteinId}${this.pdbId}.usdz`)
    },
    openInQuickLook: function () {
      openInQuickLook(this.proteinId, this.pdbId, this.features ? exportFeatures(this.features.Tracks[this.featureTrack]) : null)
    },
    openInSceneViewer: function () {
      openInSceneViewer(this.proteinId, this.pdbId, this.features ? exportFeatures(this.features.Tracks[this.featureTrack]) : null)
    },
    psvrExport: async function () {
      // @TODO: send all features from topmost collection
      window.AQUARIA.remote.sendToPSVR(`${this.baseUri}.gltf`, this.features, `${this.proteinId}.${this.pdbId}`, (err, response) => {
        if (err) {
          console.warn(`sendToPSVR error${response !== null ? `, PSVR response [${response}]` : ', No PSVR response'}`)
          console.dir(err)
          alert(`Send to PSVR failed (${err.message || 'Unknown error'})`)
        } else {
          console.log(`sendToPSVR success, PSVR response [${response}]`)
        }
      })
    },
    hevsExport: function () {
      // @TODO: send all features from topmost collection
      window.AQUARIA.remote.sendToHEVS(`${this.baseUri}.gltf`, this.features, this.hevsPlatform, (err) => {
        if (err) {
          console.warn('sendToHEVS error')
          console.dir(err)
          alert(`Send to HEVS failed (${err.message || 'Unknown error'})`)
        } else {
          console.log('sendToHEVS success')
        }
      })
    },
    openInAdvancedViewer: function () {
      openInAdvancedViewer(this.proteinId, this.pdbId)
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

</style>
