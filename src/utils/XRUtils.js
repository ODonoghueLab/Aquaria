// instance of https://github.com/ODonoghueLab/aquariaExport
const MODEL_SERVER = 'https://ie.csiro.au/services/aquaria-export'

// instance of https://bitbucket.csiro.au/scm/~and490/aquaria-export-preview
const ADVANCED_VIEWER = 'https://ie.csiro.au/apps/aquaria-export-preview'

const MAX_QR_FEATURES = 45

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
  try {
    // @TODO this needs to be rearchitected now that localStorage isn't being used
    const featureSets = JSON.parse(localStorage.getItem(`${sequence}_${server}`).replace(/\[[^\]]*\]/, ''))
    return { featureSets, name: server }
  } catch {
    console.warn('XR feature integration not available')
  }
}

export function getFeatureIndices (collection, featureSet, featureTrack) {
  // determine active feature set/track indices (can't use object equality, collection has likely been in and out of localStorage)
  let featureSetIndex = 0
  const featureTrackIndex = Math.max(featureTrack, 0)
  featureSetIndex = Math.max(collection.featureSets.findIndex(fs => {
    return fs.Type === featureSet.Type && fs.Category === featureSet.Category
  }), 0)
  return [featureSetIndex, featureTrackIndex]
}

export function download (protein, pdb, format, featureTrackToBake) {
  const link = document.createElement('a')
  link.href = getExportUri(protein, pdb, format, featureTrackToBake)
  link.download = `${protein}.${pdb}.${format}`
  link.click()
}

export function openInQuickLook (protein, pdb, featureTrackToBake) {
  const uri = getExportUri(protein, pdb, 'usdz', featureTrackToBake)
  openUriInQuickLook(uri)
}

export function openInSceneViewer (protein, pdb, featureTrackToBake) {
  const uri = getExportUri(protein, pdb, 'glb', featureTrackToBake)
  const title = `${protein}.${pdb}` // title to be displayed
  openUriInSceneViewer(uri, title)
}

export function openInPSVR (protein, pdb, collection) {
  return new Promise((resolve, reject) => {
    const uri = getExportUri(protein, pdb, 'gltf')
    window.AQUARIA.remote.sendToPSVR(uri, `${protein}.${pdb}`, collection, (err, response) => {
      if (err) reject(err)
      else resolve(response)
    })
  })
}

export function openInHEVS (platform, protein, pdb) {
  return new Promise((resolve, reject) => {
    const uri = getExportUri(protein, pdb, 'glb')
    window.AQUARIA.remote.sendToHEVS(platform, uri, `${protein}.${pdb}`, (err, assetId) => {
      if (err) return reject(err)
      else resolve(assetId)
    })
  })
}

export async function updateHEVSFeature (platform, asset, collection, featureSetIndex, trackIndex, skip) {
  return new Promise((resolve, reject) => {
    if (collection) {
      window.AQUARIA.remote.setHEVSFeature(platform, asset, collection, featureSetIndex, trackIndex, skip, (err) => {
        if (err) reject(err)
        else resolve()
      })
    } else {
      window.AQUARIA.remote.clearHEVSFeature(platform, asset, (err) => {
        if (err) reject(err)
        else resolve()
      })
    }
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
    const featureQuery = featureTrackToBake.map(feature => {
      let encodedFeature = `${feature.color.replace('#', '')}-${feature.start}`
      if (feature.start !== feature.end) encodedFeature = `${encodedFeature}-${feature.end}`
      return encodedFeature
    })
    query.append('f', featureQuery.join(','))
  }
  const queryString = query.toString()
  if (queryString) return `${base}?${query}`
  return base
}

/**
 * Prepare the data required to invoke auto-xr later
 * @returns {string}
 */
export function prepareAutoXR (protein, pdb, featureTrackToBake = null) {
  // data is currently just a URI with a special token to be replaced by the appropriate format
  // NOTE: too many features will break the QR code. Truncate to avoid
  const features = (featureTrackToBake && featureTrackToBake.length > MAX_QR_FEATURES)
    ? featureTrackToBake.slice(0, MAX_QR_FEATURES)
    : featureTrackToBake

  const uri = getExportUri(protein, pdb, '$FORMAT', features)
  return uri
}

/**
 * Parse the auto-xr data and immediately invoke XR appropriately
 * @param {string} data
 */
export function invokeAutoXR (data) {
  // data is currently just a URI with a special token to be replaced by the appropriate format
  if (featureDetection.supportsQuickLook) {
    openUriInQuickLook(data.replace('$FORMAT', 'usdz'))
  } else if (featureDetection.supportsSceneViewer) {
    // @TODO: better title required here
    openUriInSceneViewer(data.replace('$FORMAT', 'glb'), 'Aquaria Auto-XR')
  }
}

function openUriInSceneViewer (uri, title) {
  // https://developers.google.com/ar/develop/java/scene-viewer
  // @TODO: give thought to what the appropriate fallback URI is
  const pkg = 'com.google.android.googlequicksearchbox' // Scene Viewer including non-AR fallback is now built into Google Search
  const action = 'android.intent.action.VIEW'
  const mode = 'ar_preferred' // default to AR view if available, fall back to a 3D model view if AR not supported or Google Play Services for AR not installed
  const fallback = 'https://developers.google.com/ar' // this will only be visited if Google Search pkg is out of date or unavailable
  const fullUri = `intent://arvr.google.com/scene-viewer/1.0?file=${uri}&mode=${mode}&title=${title}#Intent;scheme=https;package=${pkg};action=${action};S.browser_fallback_url=${fallback};end;`
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
