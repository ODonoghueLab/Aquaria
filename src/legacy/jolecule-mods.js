var selectRes = new MutationObserver(function () {
  if(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.display == 'none'){
    document.querySelector('.jolecule-embed-footer').style.visibility = 'hidden'
    document.querySelector('#color-legend').style.visibility = 'hidden'
    document.querySelector('#threeDSpan-inner').style.height = '99.5%'
    document.querySelector('#selectedCluster').style.display = 'block'
    document.querySelector('#selectedFeature').style.display = 'block'
    document.querySelector('#center > div.icons').style.bottom = '50px'
  }
  else{
    document.querySelector('.jolecule-embed-footer').style.visibility = 'visible'
    document.querySelector('#color-legend').style.visibility = 'visible'
    document.querySelector('#threeDSpan-inner').style.height = '95%'
    document.querySelector('#selectedCluster').style.display = 'none'
    document.querySelector('#selectedFeature').style.display = 'none'
    document.querySelector('#center > div.icons').style.bottom = '76px'
  }
})

selectRes.observe(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection'), {
  childlist: true,
  attributes: true,
  attributeFilter: ['style'],
  characterDataOldValue: true
})