import $ from 'jquery'

export function checkPhone () {
  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ]

  if (navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop() || (screen.width >= 300 && screen.width <= 600)) { return true }
    }
  } else {
    return false
  }
}

export function appendPopup (text, position, width) {
  var s, tailLeft
  document.querySelector('#popuptext').innerHTML = text
  $('div#popup').fadeIn()
  var popheight = document.querySelector('div#popup').offsetHeight

  var bleft = parseInt(position.left + (width / 2) - 120)
  var btop = parseInt(position.top - popheight)

  // var tailLeft = parseInt(position.left + (width / 2))
  document.querySelector('#popupTail').style.marginLeft = '107px'
  // document.querySelector('#popupTail').style.top = btop + 'px'

  $('div#popup').css({
    left: bleft + 'px',
    top: btop + 'px',
    width: '400px'
  }).fadeIn(600)

  if (bleft < 0) {
    tailLeft = 107 + bleft + 3
    document.querySelector('#popupTail').style.marginLeft = tailLeft + 'px'
    document.querySelector('div#popup').style.left = '-5px'
  }
  if (bleft + document.querySelector('div#popup').offsetWidth + 10 > document.querySelector('#structureviewer').clientWidth) {
    document.querySelector('div#popup').style.left = (document.querySelector('#structureviewer').clientWidth + 11 - 400) + 'px'
    tailLeft = 107 + (400 - (document.querySelector('#structureviewer').clientWidth - bleft) - 11)
    document.querySelector('#popupTail').style.marginLeft = tailLeft + 'px'
  }

  // Click on X to close popup
  $('span.x').on('click', function () {
    $('div#popup').fadeOut()
  })

  $('div#popup').on('hover', function () {
    clearTimeout(s)
  }, function () {
    s = setTimeout(function () {
      $('div#popup').fadeOut()
    }, 500)
  })
}
