<script>

import * as XR from '../utils/XRUtils'
import QRCode from 'qrcode'
import debounce from 'lodash.debounce'
import * as THREE from 'three'

// const CHAIN_JOIN_CHAR = '~'
const RES_SEPERATE_CHAR = ','
const DECIMAL_PRECISION = 2

const search = new URLSearchParams(location.search)
const HEVS_UPDATE_INTERVAL = Number.parseInt(
  search.has('HEVS_UPDATE_INTERVAL')
    ? search.get('HEVS_UPDATE_INTERVAL')
    : process.env.VUE_APP_HEVS_VIEW_UPDATE_INTERVAL
) || 1000

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
      featuresActive: false,
      featureSet: null,
      featureTrack: -1,
      featureCollection: null,
      isOpen: false,
      view: null,
      pose: null,
      hevsPlatform: search.get('HEVS'),
      hevsAsset: null,
      hevsUploadedCollections: [],
      psvrEnabled: !!search.get('PSVR'),
      advancedViewerEnabled: !!search.get('dev')
    }
  },
  mounted: function () {
    this.hevsViewUpdateDebounced = debounce(() => this.hevsViewUpdate(), HEVS_UPDATE_INTERVAL, { leading: true, maxWait: HEVS_UPDATE_INTERVAL })

    // shim the chainSelected function to detect changes
    let chainSelectionOriginal
    const chainSelectionProxy = (accession, pdb, chain) => {
      chainSelectionOriginal(accession, pdb, chain)
      this.dataReceived = true

      // clear feature state
      this.featuresActive = false
      this.featureSet = null
      this.featureTrack = -1
      this.featureCollection = null

      // clear hevs state
      this.hevsUploadedCollections = []

      // update primary state
      this.proteinId = accession
      this.pdbId = pdb
      loadView()
    }
    if (window.AQUARIA.chainSelected !== chainSelectionProxy) {
      chainSelectionOriginal = window.AQUARIA.chainSelected
      window.AQUARIA.chainSelected = chainSelectionProxy
    }

    // detect changes to current feature
    window.AQUARIA.onFeatureChange = (featureSet, trackNo) => {
      if (featureSet) {
        this.featuresActive = true
        this.featureSet = featureSet
        this.featureTrack = trackNo
        this.featureCollection = XR.retrieveFeatureCollection(featureSet.Server)
      } else {
        this.featuresActive = false
        this.featureSet = null
        this.featureTrack = -1
        this.featureCollection = null
      }

      // update HEVS if connected
      if (this.hevsPlatform && this.hevsAsset) this.hevsFeatureUpdate()
    }
    // view change detection (@TODO drive this from Jolecule, this is expensive)
    (() => {
      const update = () => {
        requestAnimationFrame(() => update())
        try {
          const view = XR.getView()
          const latestPose = XR.getRawCameraPose()
          if (!this.pose) {
            this.pose = latestPose
            this.view = view
          }

          let viewChanged = false
          for (let i = 0; i < 3; i++) if (latestPose.position[i] !== this.pose.position[i]) { viewChanged = true; break }
          for (let i = 0; i < 4; i++) if (latestPose.orientation[i] !== this.pose.orientation[i]) { viewChanged = true; break }
          if (viewChanged) {
            this.pose = latestPose
            this.view = view
          }
        } catch {}
      }
      update()
    })()
    const loadView = () => {
      if (window.location.search !== '' || window.location.hash !== '') {
        console.log('loading view')
        const results = parseURL()
        if (results) {
          setView(results.selected, results.pitch, results.yaw, results.roll, results.zoom)
        }
        // const urlParams = new URLSearchParams(window.location.search)
        // const resString = urlParams.get('res')
        // const selected = {}
        // resString.split(CHAIN_JOIN_CHAR).forEach(chainString => {
        //   const elems = chainString.split(RES_SEPERATE_CHAR)
        //   selected[elems[0]] = []
        //   for (let i = 1; i < elems.length; i++) {
        //     selected[elems[0]].push(Number(elems[i]))
        //   }
        // })

        // const pitch = Number(urlParams.get('p') ?? 0)
        // const yaw = Number(urlParams.get('y') ?? 0)
        // const roll = Number(urlParams.get('r') ?? 0)
        // const zoom = Number(urlParams.get('z') ?? 8)

        // setView(0, selected, pitch, yaw, roll, zoom)
      }
    }
    function setURL () {
      const view = window.AQUARIA.panel3d.embededJolecule.soupView
      const soup = window.AQUARIA.panel3d.embededJolecule.soup
      const selected = {}
      const residue = soup.getResidueProxy()
      for (let iRes = 0; iRes < soup.getResidueCount(); iRes++) {
        residue.load(iRes)
        if (residue.selected) {
          if (!selected[residue.chain]) {
            selected[residue.chain] = []
          }
          selected[residue.chain].push(residue.resNum)
        }
      }

      // const urlParams = new URLSearchParams(window.location.search)

      let resString = '#'
      if (Object.keys(selected).length > 0) {
        resString = '#'
      }

      for (const chain in selected) {
        if (resString.length > 1) {
          resString += RES_SEPERATE_CHAR
        }
        resString += chain
        const sorted = selected[chain].sort()
        let start = 0
        while (start < sorted.length) {
          if (start > 0) {
            resString += RES_SEPERATE_CHAR
          }
          resString += sorted[start]
          let i = 1
          while (start + i < sorted.length && sorted[start + i] - sorted[start] === i) {
            i++
          }
          if (i > 1) {
            resString += '-' + sorted[start + i - 1]
          }
          start += i
        }
        // resString += selected[chain].join(RES_SEPERATE_CHAR)
      }

      const forward = view.currentView.cameraParams.position.clone().sub(view.currentView.cameraParams.focus).normalize()
      const up = view.currentView.cameraParams.up

      const side = up.clone().cross(forward)
      const up2 = forward.clone().cross(side)

      const rot = new THREE.Matrix4()
      rot.set(side.x, up2.x, forward.x, 0,
        side.y, up2.y, forward.y, 0,
        side.z, up2.z, forward.z, 0,
        0, 0, 0, 1)

      const e = new THREE.Euler().setFromRotationMatrix(rot, 'YXZ')

      const zoom = (view.currentView.cameraParams.zoom / 10)

      let sign = '+'
      if (zoom < 0) {
        sign = '-'
      }

      const urlEnding = `${resString}?(${THREE.MathUtils.radToDeg(e.y).toFixed(DECIMAL_PRECISION)},${THREE.MathUtils.radToDeg(e.x).toFixed(DECIMAL_PRECISION)},${THREE.MathUtils.radToDeg(e.z).toFixed(DECIMAL_PRECISION)})&${sign}${zoom.toFixed(DECIMAL_PRECISION)}`
      window.history.replaceState(null, null, window.location.origin + window.location.pathname + window.location.search + urlEnding)

      // urlParams.set('res', resString)
      // urlParams.set('p', THREE.MathUtils.radToDeg(e.x).toFixed(DECIMAL_PRECISION))
      // urlParams.set('y', THREE.MathUtils.radToDeg(e.y).toFixed(DECIMAL_PRECISION))
      // urlParams.set('r', THREE.MathUtils.radToDeg(e.z).toFixed(DECIMAL_PRECISION))

      // urlParams.set('z', (view.currentView.cameraParams.zoom / 10).toFixed(DECIMAL_PRECISION))
      // window.history.replaceState(null, null, '?' + urlParams.toString())
    }

    // eslint-disable-next-line no-unused-vars
    function parseURL () {
      const post = decodeURIComponent(window.location.href.substr(window.location.origin.length + window.location.pathname.length + window.location.search.length))
      if (post.length === 0) {
        return null
      }
      const q = post.indexOf('?')
      var selected = {}
      var chain = 'A'
      var yaw = 0
      var pitch = 0
      var roll = 0
      var zoom

      if (post[0] === '#') {
        let i = 0
        const selectedResidueString = post.substring(1, q)
        if (selectedResidueString.length > 0) {
          const elements = selectedResidueString.split(',')
          for (i = 0; i < elements.length; i++) {
            const split = elements[i].split('-')

            let k = 0
            while (k < split[0].length) {
              if (!isNaN(Number(split[0][k]))) {
                break
              }
              k++
            }
            if (k > 0) {
              chain = split[0].substring(0, k)
              if (!selected[chain]) {
                selected[chain] = []
              }
              split[0] = split[0].substr(k)
            }
            let first = Number(split[0].trim())
            let last = split.length > 1 ? Number(split[1].trim()) : NaN
            if (isNaN(first)) {
              break
            }
            if (isNaN(last)) {
              last = first
            }

            for (; first <= last; first++) {
              selected[chain].push(first)
            }
          }
        }
      }

      if (q !== -1) {
        const query = post.substr(q + 1).split('&')
        for (let i = 0; i < query.length; i++) {
          const part = query[i].trim()
          if (part[0] === '(') {
            const inner = part.substring(1, part.length - 1)
            const split = inner.split(',')
            yaw = Number(split[0]) || 0
            pitch = Number(split[1]) || 0
            roll = Number(split[2]) || 0
          } else if (part[0] === '+' || part[0] === '-') {
            zoom = parseFloat(part) || undefined
          }
        }
      }

      return { selected: selected, yaw: yaw, pitch: pitch, roll: roll, zoom: zoom }
    }

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Digit1') {
        loadView()
      } else if (e.code === 'Digit2') {
        // const view = window.AQUARIA.panel3d.embededJolecule.soupView

        setView({ A: [114, 115, 116, 125] }, 0, 0, 0, 8)
      } else if (e.code === 'Digit3') {
        const soup = window.AQUARIA.panel3d.embededJolecule.soup
        const resNums = []
        const residue = soup.getResidueProxy()
        for (let iRes = 0; iRes < soup.getResidueCount(); iRes++) {
          residue.load(iRes)
          if (residue.selected) {
            resNums.push(residue.resNum)
          }
        }
        console.log('resNums: ', resNums)
      }
    })
    // eslint-disable-next-line no-unused-vars
    function setView (selectedResidues, pitch, yaw, roll, zoom) {
      const soupView = window.AQUARIA.panel3d.embededJolecule.soupView
      const soupController = window.AQUARIA.panel3d.embededJolecule.controller

      let proxies = []
      for (const chain in selectedResidues) {
        proxies = proxies.concat(selectedResidues[chain].map((res) => window.AQUARIA.panel3d.embededJolecule.soup.findFirstResidue(chain, res)))
      }

      // const proxies = resNums.map((res) => window.AQUARIA.panel3d.embededJolecule.soup.findFirstResidue(chain, res)) // window.AQUARIA.panel3d.embededJolecule.soup.findResidueIndices(structure, chain, resNums)
      soupController.clearSelectedResidues()
      if (proxies[0]) {
        proxies.forEach((proxy) => {
          soupController.selectResidue(proxy.iRes, true)
        })
      }
      const currentView = soupView.getZoomedOutViewOfSelection()
      if (zoom) {
        zoom *= 10
      } else {
        zoom = currentView.cameraParams.zoom
      }
      const focus = currentView.cameraParams.focus
      const rotation = new THREE.Euler(THREE.MathUtils.degToRad(pitch), THREE.MathUtils.degToRad(yaw), THREE.MathUtils.degToRad(roll), 'YXZ')
      const position = focus.clone().add(new THREE.Vector3(0, 0, zoom).applyEuler(rotation))
      const up = new THREE.Vector3(0, 1, 0).applyEuler(rotation)

      const view = window.AQUARIA.panel3d.embededJolecule.soupView
      const newView = view.currentView.clone()

      newView.cameraParams.focus.set(focus.x, focus.y, focus.z)
      newView.cameraParams.up.set(up.x, up.y, up.z)
      newView.cameraParams.position = position
      newView.cameraParams.zoom = zoom

      view.setTargetView(newView)
      // view.setCurrentView(newView)
    }

    window.addEventListener('mouseup', () => {
      setURL()
    })
  },
  computed: {
    currentFeatureTrack: function () {
      return this.featuresActive ? this.featureSet.Tracks[this.featureTrack] : null
    }
  },
  watch: {
    pose: function (pose) {
      if (this.hevsAsset) this.hevsViewUpdateDebounced()
    }
  },
  methods: {
    open: function () {
      this.isOpen = true
      const autoXRData = XR.prepareAutoXR(this.proteinId, this.pdbId, this.currentFeatureTrack)
      const url = location.search ? `${location.href}&xr=${autoXRData}` : `${location.href}?xr=${autoXRData}`
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
        // default to top collection in list if no active feature
        const collection = this.featureCollection || XR.retrieveFeatureCollection(localStorage.getItem('featureOrder').split(',')[0])
        console.log(`[PSVR] Exporting Asset w/ ${this.featureCollection ? 'ACTIVE' : 'DEFAULT/FIRST'} collection [${collection.name}]`)
        const response = await XR.openInPSVR(this.proteinId, this.pdbId, collection)
        console.log(`[PSVR] Transfer successful, PSVR Response: [${response}]`)
      } catch (err) {
        console.warn('[PSVR] Transfer error')
        console.dir(err)
        alert(`Send to PSVR failed (${err.message || 'Unknown error'})`)
      }
    },
    hevsExport: async function () {
      try {
        console.log('[HEVS] Exporting Asset')
        this.hevsAsset = await XR.openInHEVS(this.hevsPlatform, this.proteinId, this.pdbId)
        console.log(`[HEVS] Transfer successful, HEVS Asset ID: [${this.hevsAsset}]`)
        if (this.featuresActive) this.hevsFeatureUpdate()
        this.hevsViewUpdate()
      } catch (err) {
        console.warn('[HEVS] Transfer error')
        console.dir(err)
        alert(`Send to HEVS failed (${err.message || 'Unknown error'})`)
      }
    },
    hevsFeatureUpdate: async function () {
      try {
        if (this.featuresActive) {
          const [featureSetIndex, featureTrackIndex] = XR.getFeatureIndices(this.featureCollection, this.featureSet, this.featureTrack)

          // prevent duplicate HEVS uploads by passing and extra param
          const skip = this.hevsUploadedCollections.includes(this.featureCollection.name)
          if (!skip) this.hevsUploadedCollections.push(this.featureCollection.name) // skip next time

          console.log(`[HEVS] Updating Feature Info [${this.featureCollection.name} | Set ${featureSetIndex} | Track ${featureTrackIndex}]${(skip ? ' (SKIPPING DATA UPLOAD)' : '')}`)

          await XR.updateHEVSFeature(this.hevsPlatform, this.hevsAsset, this.featureCollection, featureSetIndex, featureTrackIndex, skip)
        } else {
          console.log('[HEVS] Clearing Feature Info')
          await XR.updateHEVSFeature(this.hevsPlatform, this.hevsAsset, null, null, null)
        }
        console.log('[HEVS] Feature update OK')
      } catch (err) {
        console.warn('[HEVS] Feature update error')
        console.dir(err)
      }
    },
    hevsViewUpdate: async function () {
      try {
        console.log(`[HEVS] Updating View [${this.pose.position[0]}, ${this.pose.position[1]}, ${this.pose.position[2]}], ${this.pose.orientation[0]}, ${this.pose.orientation[1]}, ${this.pose.orientation[2]}, ${this.pose.orientation[3]}]`)
        await XR.updateHEVSView(this.hevsPlatform, this.hevsAsset, this.pose, this.view)
      } catch (err) {
        console.warn('[HEVS] View update error')
        console.dir(err)
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
  <a v-if="dataReceived && !isOpen" @click="open()" class="xr-menu-button" id='XRbutton'>XR Mode</a>
  <!-- <img v-if="dataReceived && !isOpen" @click="open()" class="xr-menu-button" src="/images/ar-button.png"> -->
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
        <button v-if="hevsPlatform" :disabled="!!hevsAsset" class="xr-item default-button" @click="close(); hevsExport()">{{hevsAsset ? 'Connected to HEVS' : 'Send to HEVS'}}</button>

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
