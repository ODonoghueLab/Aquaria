export function hidePanel (elemParent, elemChild) {
  document.querySelector('#' + elemParent).style.display = 'none'
  document.querySelector('#' + elemChild).className = 'tab inactive'
}

export function hidePanels () {
  window.AQUARIA.RemoveOverlay()
  this.hidePanel('vis', 'Structures')
  this.hidePanel('featurelist', 'Features')
  document.querySelector('#Structures').className = 'tab'
  document.querySelector('#Features').className = 'tab'
  document.querySelector('#Features')
  document.querySelector('a.close').click()
  window.scrollBy(0, 100)
}

export function overlay (className) {
    var elemDiv = document.createElement('div')
    elemDiv.className = 'dimmer'
    if(className) {
      elemDiv.className += ' ' + className
    }
    document.body.append(elemDiv)
}

export function RemoveOverlay () {
  document.querySelectorAll('div.dimmer').forEach(el => el.remove())
}