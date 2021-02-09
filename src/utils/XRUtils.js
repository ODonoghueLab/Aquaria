import axios from 'axios'

const MAX_QR_FEATURES = Number.parseInt(process.env.VUE_APP_MAX_QR_FEATURES) || 40

/**
 * Information about platform XR support
 */
const featureDetection = {
  supportsSceneViewer: /(android)/i.test(navigator.userAgent),
  supportsQuickLook: document.createElement('a').relList.supports('ar'),
  supportsMixedReality: /(Windows NT 10.0)/i.test(navigator.userAgent)
}
export { featureDetection as Platform }

/**
 * Retrieve feature collection (from global state) for a given feature server
 * Note: 'Added Features' is a special server representing external features
 */
export function retrieveFeatureCollection (server) {
  const [, featureSets] = window.AQUARIA.groupedFeatures.find(([s]) => s === server)
  return { featureSets, name: server }
}

export function getFeatureIndices (collection, featureSet, featureTrack) {
  // determine active feature set/track indices (can't use object equality, collection has likely been in and out of localStorage)
  // @TODO the above comment is likely no longer true, this can probably be optimised
  let featureSetIndex = 0
  const featureTrackIndex = Math.max(featureTrack, 0)
  featureSetIndex = Math.max(collection.featureSets.findIndex(fs => {
    return fs.Type === featureSet.Type && fs.Category === featureSet.Category
  }), 0)
  return [featureSetIndex, featureTrackIndex]
}

export function download (protein, pdb, format, featureTrackToBake) {
  const link = document.createElement('a')
  link.href = getExportUri(protein, pdb, { format, featureTrackToBake })
  link.download = `${protein}.${pdb}.${format}`
  link.click()
}

export function openInQuickLook (protein, pdb, featureTrackToBake) {
  const uri = getExportUri(protein, pdb, { format: 'usdz', featureTrackToBake, merge: true, detail: 1 })
  openUriInQuickLook(uri)
}

export function openInSceneViewer (protein, pdb, featureTrackToBake) {
  const uri = getExportUri(protein, pdb, { featureTrackToBake, merge: true, detail: 1 })
  const title = `${protein}.${pdb}` // title to be displayed
  openUriInSceneViewer(uri, title)
}

export function openInWindowsMixedReality (protein, pdb, featureTrackToBake) {
  const uri = getExportUri(protein, pdb, { featureTrackToBake, merge: true, detail: 1 })
  openUriInWindowsMixedReality(uri)
}

export async function openInPSVR (protein, pdb, collection) {
  const modelUri = getExportUri(protein, pdb, { format: 'gltf' })
  const payload = { modelUri, fileName: `${protein}.${pdb}`, collection }
  const response = await axios.post(`${process.env.VUE_APP_AQUARIA_BACKEND}/xr/sendToPSVR`, payload)
  if (response.status >= 400) throw new Error(response.data)
  else return response.data.result
}

export async function openInHEVS (platform, protein, pdb) {
  const modelUri = getExportUri(protein, pdb, { rescale: false })
  const payload = { hevsPlatform: platform, modelUri, name: `${protein}.${pdb}` }
  const response = await axios.post(`${process.env.VUE_APP_AQUARIA_BACKEND}/xr/sendToHEVS`, payload)
  if (response.status >= 400) throw new Error(response.data)
  else return response.data.assetId
}

export async function updateHEVSFeature (platform, asset, collection, featureSetIndex, trackIndex, skip) {
  if (collection) {
    const payload = { hevsPlatform: platform, assetId: asset, collection, featureSetIndex, trackName: trackIndex, skipUpload: skip }
    const response = await axios.post(`${process.env.VUE_APP_AQUARIA_BACKEND}/xr/setHEVSFeature`, payload)
    if (response.status >= 400) throw new Error(response.data)
  } else {
    const payload = { hevsPlatform: platform, assetId: asset }
    const response = await axios.post(`${process.env.VUE_APP_AQUARIA_BACKEND}/xr/clearHEVSFeature`, payload)
    if (response.status >= 400) throw new Error(response.data)
  }
}

export async function updateHEVSView (platform, asset, pose) {
  const payload = { hevsPlatform: platform, assetId: asset, pose }
  const response = await axios.post(`${process.env.VUE_APP_AQUARIA_BACKEND}/xr/setHEVSView`, payload)
  if (response.status >= 400) throw new Error(response.data)
}

export function openInAdvancedViewer (protein, pdb) {
  const link = document.createElement('a')
  link.href = `${process.env.VUE_APP_ADVANCED_VIEWER_URL}?protein=${protein}&pdb=${pdb}`
  link.target = '_'
  link.click()
}

/**
 * @param {String} protein Accession
 * @param {String} pdb PDB ID
 * @param {Object} options
 * @param {String} options.format 'glb', 'gltf', or 'usdz' (default 'glb')
 * @param {String} options.encodedFeatureTrack pre-encoded feature track (default none)
 * @param {Object} options.featureTrackToBake feature track (default none)
 * @param {Boolean} options.rescale resize model for XR (default true)
 * @param {Boolean} options.merge merge model nodes to minimise node count at the cost of losing metadata (default false)
 * @param {Boolean} options.detail ribbon detail level (default server decides - typically 4)
 */
export function getExportUri (protein, pdb, options = {}) {
  const defaults = { format: 'glb', encodedFeatureTrack: null, featureTrackToBake: null, rescale: true, detail: null }
  const opts = Object.assign(defaults, options)
  const base = `${process.env.VUE_APP_AQUARIA_EXPORT_URL}/model/${protein}/${pdb}.${opts.format}`
  const query = new URLSearchParams()
  if (options.rescale === false) query.append('rescale', 'false')
  if (options.merge === true) query.append('merge', 'true')
  if (options.detail) query.append('detail', options.detail)
  if (options.encodedFeatureTrack) query.append('f', options.encodedFeatureTrack)
  else if (options.featureTrackToBake) query.append('f', encodeFeatureTrack(options.featureTrackToBake))
  const queryString = query.toString()
  if (queryString) return `${base}?${query}`
  return base
}

/**
 * Prepare the data payload required to invoke auto-xr later
 * @returns {string}
 */
export function prepareAutoXR (protein, pdb, featureTrackToBake = null) {
  // payload is currently: PROTEIN|PDB|ENCODEDFEATURES (ENCODEDFEATURES can be empty string if no active features)
  // enough info to reconstruct the export URL immediately without waiting for the whole page to initialise
  // @TODO could protein/pdb just be grabbed out of the URL pathname?
  // @NOTE: too many features will break the QR code. Truncate to avoid
  const features = (featureTrackToBake && featureTrackToBake.length > MAX_QR_FEATURES)
    ? featureTrackToBake.slice(0, MAX_QR_FEATURES)
    : featureTrackToBake

  const payload = `${protein}|${pdb}|${features ? encodeFeatureTrack(features) : ''}`
  return payload
}

/**
 * Parse the auto-xr data and immediately invoke XR appropriately
 * @param {string} data
 */
export function invokeAutoXR (data) {
  // data is currently just a URI with a special token to be replaced by the appropriate format
  console.info(`Auto-XR invoked with payload: ${data}`)
  const [protein, pdb, encodedFeatureTrack] = data.split('|')
  if (featureDetection.supportsQuickLook) {
    const uri = getExportUri(protein, pdb, { format: 'usdz', detail: 1, merge: true, encodedFeatureTrack })
    openUriInQuickLook(uri)
  } else if (featureDetection.supportsSceneViewer) {
    const uri = getExportUri(protein, pdb, { format: 'glb', detail: 1, merge: true, encodedFeatureTrack })
    openUriInSceneViewer(uri, 'Aquaria Auto-XR') // @TODO: better title required here
  } else if (featureDetection.supportsMixedReality) {
    const uri = getExportUri(protein, pdb, { format: 'glb', detail: 1, merge: true, encodedFeatureTrack })
    openUriInWindowsMixedReality(uri)
  }
}

/**
 * Grab the current raw camera pose with optional handedness conversion
 * @param {Boolean} convertToLHS
 * @returns {{ position: Number[], orientation: Number[] }}
 */
export function getRawCameraPose (convertToLHS = true) {
  const position = window.AQUARIA.panel3d.embededJolecule.soupWidget.camera.position.clone()
  const orientation = window.AQUARIA.panel3d.embededJolecule.soupWidget.camera.quaternion.clone()
  if (convertToLHS) {
    position.x = -position.x
    orientation.set(orientation.z, orientation.w, orientation.x, orientation.y)
  }
  return {
    position: [position.x, position.y, position.z],
    orientation: [orientation.x, orientation.y, orientation.z, orientation.w]
  }
}

/**
 * Grab high level view data
 */
export function getView () {
  return window.AQUARIA.panel3d.embededJolecule.soupView
}

export function countPolygons (object) {
  let count = 0
  object.traverse(obj => {
    if (obj.geometry) {
      const index = obj.geometry.getIndex()
      if (index) {
        count += index.count / 3
      } else {
        count += obj.geometry.getAttribute('position').count / 3
      }
    }
  })
  return count
}

/**
 * Encode a feature track for use with Aquaria Export service
 * @param {*} featureTrack
 */
function encodeFeatureTrack (featureTrack) {
  return featureTrack.map(feature => {
    let encodedFeature = `${feature.color.replace('#', '')}-${feature.start}`
    if (feature.start !== feature.end) encodedFeature = `${encodedFeature}-${feature.end}`
    return encodedFeature
  }).join(',')
}

function openUriInSceneViewer (uri, title) {
  // https://developers.google.com/ar/develop/java/scene-viewer
  // @TODO: give thought to what the appropriate fallback URI is
  const pkg = 'com.google.android.googlequicksearchbox' // Scene Viewer including non-AR fallback is now built into Google Search
  const action = 'android.intent.action.VIEW'
  const mode = 'ar_preferred' // default to AR view if available, fall back to a 3D model view if AR not supported or Google Play Services for AR not installed
  const fallback = 'https://developers.google.com/ar' // this will only be visited if Google Search pkg is out of date or unavailable

  // need to encode just the query part of the model URI or scene viewer won't respect it correctly
  const [uriBase, uriQuery] = uri.split('?')
  // const encodedQuery = uriQuery ? encodeURIComponent(`?${uriQuery}`) : ''
  const encodedQuery = uriQuery ? ('?' + uriQuery.replace(/&/g, '%26')) : ''
  const encodedUri = uriBase + encodedQuery
  console.log(encodedUri)

  const fullUri = `intent://arvr.google.com/scene-viewer/1.0?file=${encodedUri}&mode=${mode}&title=${title}#Intent;scheme=https;package=${pkg};action=${action};S.browser_fallback_url=${fallback};end;`
  const link = document.createElement('a')
  link.href = fullUri
  link.click()
}

function openUriInQuickLook (uri) {
  // https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look
  const link = document.createElement('a')
  link.href = uri
  link.rel = 'ar'
  link.appendChild(document.createElement('img')) // this is required
  link.click()
}

function openUriInWindowsMixedReality (uri) {
  const link = document.createElement('a')
  link.href = `ms-mixedreality:addModel?uri=${encodeURIComponent(uri)}`
  link.click()
}
