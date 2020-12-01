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
