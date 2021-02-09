var selectRes = new MutationObserver(function () {
  if (document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.display === 'none') {
    document.querySelector('.jolecule-embed-footer').style.visibility = 'hidden'
    document.querySelector('#color-legend').style.visibility = 'hidden'
    document.querySelector('#threeDSpan-inner').style.height = '100%'
    document.querySelector('#selectedCluster').style.display = 'block'
    document.querySelector('#selectedFeature').style.display = 'block'
    document.querySelector('div.tabs').style.top = '2.8em'
  } else {
    document.querySelector('.jolecule-embed-footer').style.display = 'flex'
    document.querySelector('.jolecule-embed-footer').style.visibility = 'visible'
    document.querySelector('#color-legend').style.visibility = 'visible'
    document.querySelector('#color-legend').style.bottom = '105px'
    document.querySelector('#threeDSpan-inner').style.height = '100%'
    document.querySelector('#selectedCluster').style.display = 'none'
    document.querySelector('#selectedFeature').style.display = 'none'
    document.querySelector('div.tabs').style.top = '0.2em'
    document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.bottom = '105px'
  }
})

selectRes.observe(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection'), {
  childlist: true,
  attributes: true,
  attributeFilter: ['style'],
  characterDataOldValue: true
})
