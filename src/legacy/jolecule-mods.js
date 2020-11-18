var selectRes = new MutationObserver(function () {
  if(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection').style.display == 'none'){
    document.querySelector('.jolecule-embed-footer').style.visibility = 'hidden'
    document.querySelector('#threeDSpan-inner').style.height = '99.5%'
    document.querySelector('.icons').style.bottom = '11px'
    document.querySelector('#selectedCluster').style.display = 'block'
  }
  else{
    document.querySelector('.jolecule-embed-footer').style.visibility = 'visible'
    document.querySelector('#threeDSpan-inner').style.height = '95%'
    document.querySelector('.icons').style.bottom = '85px'
    document.querySelector('#selectedCluster').style.display = 'none'
  }
})

selectRes.observe(document.querySelector('#threeDSpan-inner-jolecule-soup-display-canvas-wrapper-selection'), {
  childlist: true,
  attributes: true,
  attributeFilter: ['style'],
  characterDataOldValue: true
})