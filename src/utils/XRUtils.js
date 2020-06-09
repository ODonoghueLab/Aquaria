// instance of https://github.com/ODonoghueLab/aquariaExport
const MODEL_SERVER = 'https://ie.csiro.au/services/aquaria-export'

// instance of https://bitbucket.csiro.au/scm/~and490/aquaria-export-preview
const ADVANCED_VIEWER = 'https://ie.csiro.au/apps/aquaria-export-preview'

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
 * Retrieve feature collection (from local storage) for a given sequence and feature server combo
 * Note: 'Added Features' is a special server representing external features
 */
export function retrieveFeatureCollection (sequence, server) {
  return JSON.parse(localStorage.getItem(`${sequence}_${server}`).replace(/\[[^\]]*\]/, ''))
}

/**
 * Retrieve the feature collection (from local storage) for a given sequence corresponding to the topmost server in the features list
 */
export function retrieveTopFeatureCollection (sequence) {
  const featureOrder = localStorage.getItem('featureOrder').split(',')
  const topFeatureCollectionKey = featureOrder[0]
  return retrieveFeatureCollection(sequence, topFeatureCollectionKey)
}

/**
 * Convert a single feature track to Aquaria Export's baked feature format
 */
export function exportFeatureTrack (track) {
  return track.map(f => ({
    c: f.color,
    n: f.name,
    s: f.start,
    e: f.end,
    d: f.desc
  }))
}

export function download (protein, pdb, format, featureTrackToBake) {
  const link = document.createElement('a')
  link.href = getExportUri(protein, pdb, format, featureTrackToBake)
  link.download = `${protein}.${pdb}.${format}`
  link.click()
}

export function openInQuickLook (protein, pdb, featureTrackToBake) {
  // https://developer.apple.com/documentation/arkit/previewing_a_model_with_ar_quick_look
  const link = document.createElement('a')
  link.href = getExportUri(protein, pdb, 'usdz', featureTrackToBake)
  link.rel = 'ar'
  link.appendChild(document.createElement('img')) // this is required
  link.click()
}

export function openInSceneViewer (protein, pdb, featureTrackToBake) {
  // https://developers.google.com/ar/develop/java/scene-viewer
  // @TODO: give thought to what the appropriate fallback URI is
  const pkg = 'com.google.android.googlequicksearchbox' // Scene Viewer including non-AR fallback is now built into Google Search
  const action = 'android.intent.action.VIEW'
  const file = getExportUri(protein, pdb, 'glb', featureTrackToBake) // server generated file URI
  const title = `${protein}.${pdb}` // title to be displayed
  const mode = 'ar_preferred' // default to AR view if available, fall back to a 3D model view if AR not supported or Google Play Services for AR not installed
  const fallback = 'https://developers.google.com/ar' // this will only be visited if Google Search pkg is out of date or unavailable
  const uri = `intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=${mode}&title=${title}#Intent;scheme=https;package=${pkg};action=${action};S.browser_fallback_url=${fallback};end;`
  const link = document.createElement('a')
  link.href = uri
  link.click()
}

export function openInPSVR (protein, pdb, features) {
  return new Promise((resolve, reject) => {
    const uri = getExportUri(protein, pdb, 'gltf')
    window.AQUARIA.remote.sendToPSVR(uri, features, `${protein}.${pdb}`, (err, response) => {
      if (err) reject(err)
      else resolve(response)
    })
  })
}

export function openInHEVS (protein, pdb, features, platform) {
  return new Promise((resolve, reject) => {
    const uri = getExportUri(protein, pdb, 'glb')
    window.AQUARIA.remote.sendToHEVS(uri, features, `${protein}.${pdb}`, platform, (err, assetId) => {
      if (err) reject(err)
      else resolve(assetId)
    })
  })
}

export function updateHEVSAsset (assetId, patchData) {
  return new Promise((resolve, reject) => {
    window.AQUARIA.remote.updateHEVSAsset(assetId, patchData, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function openInAdvancedViewer (protein, pdb) {
  const link = document.createElement('a')
  link.href = `${ADVANCED_VIEWER}?protein=${protein}&pdb=${pdb}`
  link.target = '_'
  link.click()
}

export function getExportUri (protein, pdb, format, featureTrackToBake = null) {
  const base = `${MODEL_SERVER}/${protein}/${pdb}.${format}`
  const query = new URLSearchParams()
  if (featureTrackToBake) {
    for (const feature in featureTrackToBake) {
      query.append('f', JSON.stringify(feature))
    }
  }
  const queryString = query.toString()
  if (queryString) return `${base}?${query}`
  return base
}
