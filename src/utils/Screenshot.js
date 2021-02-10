export function screenshot (resX, resY, bgColor, bgAlpha) {
  // ugly hack since jolecule hides three.js?
  const WebGLRenderer = window.AQUARIA.panel3d.embededJolecule.soupWidget.renderer.constructor
  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(resX, resY, false)

  // retrieve relevant objects from jolecule
  const scene = window.AQUARIA.panel3d.embededJolecule.soupWidget.displayScene
  const mainCamera = window.AQUARIA.panel3d.embededJolecule.soupWidget.camera

  // set up camera (don't modify the main camera)
  const camera = mainCamera.clone()
  camera.aspect = resX / resY
  camera.updateProjectionMatrix()

  // back up state
  const background = scene.background
  const fog = { near: scene.fog.near, far: scene.fog.far }

  // configure new state
  scene.background = null
  scene.fog.near = -Infinity
  scene.fog.far = Infinity
  renderer.setClearColor(bgColor, bgAlpha)

  // render
  renderer.clear(true, true, true)
  renderer.render(scene, camera)

  // restore old state
  scene.background = background
  scene.fog.near = fog.near
  scene.fog.far = fog.far

  return canvasToPng(renderer.domElement)
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
