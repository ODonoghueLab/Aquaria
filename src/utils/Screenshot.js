export function screenshot (resX, resY, bgColor, bgAlpha) {
  // ugly hack since jolecule hides three.js
  // @TODO migrate to bundling our own jolecule and unifying the bundling systems (abandon browserify), thus exposing three.js to application source.
  const WebGLRenderTarget = window.AQUARIA.panel3d.embededJolecule.soupWidget.pickingTexture.constructor
  const screenshotTarget = new WebGLRenderTarget(resX, resY)

  // retrieve relevant objects from jolecule
  const renderer = window.AQUARIA.panel3d.embededJolecule.soupWidget.renderer
  const scene = window.AQUARIA.panel3d.embededJolecule.soupWidget.displayScene
  const mainCamera = window.AQUARIA.panel3d.embededJolecule.soupWidget.camera

  // set up camera (don't modify the main camera)
  const camera = mainCamera.clone()
  camera.aspect = resX / resY
  camera.updateProjectionMatrix()

  // back up state
  const clearColor = renderer.getClearColor().clone()
  const clearAlpha = renderer.getClearColor()
  const target = renderer.getRenderTarget()
  const background = scene.background
  const fog = { near: scene.fog.near, far: scene.fog.far }

  // configure new state
  scene.background = null
  scene.fog.near = -Infinity
  scene.fog.far = Infinity
  renderer.setClearColor(bgColor, bgAlpha)
  renderer.setRenderTarget(screenshotTarget)

  // render to texture and extract pixel data
  renderer.clear(true, true, true)
  renderer.render(scene, camera)
  const data = new Uint8Array(resX * resY * 4)
  renderer.readRenderTargetPixels(screenshotTarget, 0, 0, resX, resY, data)

  // restore old state
  renderer.setRenderTarget(target)
  renderer.setClearColor(clearColor, clearAlpha)
  scene.background = background
  scene.fog.near = fog.near
  scene.fog.far = fog.far

  const canvas = pixelDataToCanvas(data, resX, resY)
  return canvasToPng(canvas)
}

function pixelDataToCanvas (pixelData, width, height) {
  // create a 2D canvas to store the result
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  // vertical flip
  const tempRow = new Uint8Array(width * 4)
  const rowBytes = width * 4
  for (let iRow = 0; iRow < height / 2; iRow++) {
    const upperRow = new Uint8Array(pixelData.buffer, iRow * rowBytes, rowBytes)
    const lowerRow = new Uint8Array(pixelData.buffer, (height - 1 - iRow) * rowBytes, rowBytes)
    tempRow.set(lowerRow) // store lower in temp
    lowerRow.set(upperRow) // store upper in lower
    upperRow.set(tempRow) // store temp in upper
  }

  // copy the pixels to the canvas
  const imageData = context.createImageData(width, height)
  imageData.data.set(pixelData)
  context.putImageData(imageData, 0, 0)

  return canvas
}

function canvasToPng (canvas) {
  if (canvas.toBlob) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => resolve(URL.createObjectURL(blob)), 'image/png')
    })
  } else {
    return Promise.resolve(canvas.toDataURL('image/png'))
  }
}
