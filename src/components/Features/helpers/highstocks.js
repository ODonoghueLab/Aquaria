/*
 Highstock JS v8.1.0 (2020-05-05)

 (c) 2009-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (S, P) { typeof module === 'object' && module.exports ? (P.default = P, module.exports = S.document ? P(S) : P) : typeof define === 'function' && define.amd ? define('highcharts/highstock', function () { return P(S) }) : (S.Highcharts && S.Highcharts.error(16, !0), S.Highcharts = P(S)) })(typeof window !== 'undefined' ? window : this, function (S) {
  function P (k, g, H, v) { k.hasOwnProperty(g) || (k[g] = v.apply(null, H)) } var A = {}; P(A, 'parts/Globals.js', [], function () {
    var k = typeof S !== 'undefined' ? S : typeof window !== 'undefined' ? window : {}; var g = k.document
    var H = k.navigator && k.navigator.userAgent || ''; var v = g && g.createElementNS && !!g.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect; var K = /(edge|msie|trident)/i.test(H) && !k.opera; var G = H.indexOf('Firefox') !== -1; var N = H.indexOf('Chrome') !== -1; var M = G && parseInt(H.split('Firefox/')[1], 10) < 4; return {
      product: 'Highcharts',
      version: '8.1.0',
      deg2rad: 2 * Math.PI / 360,
      doc: g,
      hasBidiBug: M,
      hasTouch: !!k.TouchEvent,
      isMS: K,
      isWebKit: H.indexOf('AppleWebKit') !== -1,
      isFirefox: G,
      isChrome: N,
      isSafari: !N && H.indexOf('Safari') !== -1,
      isTouchDevice: /(Mobile|Android|Windows Phone)/.test(H),
      SVG_NS: 'http://www.w3.org/2000/svg',
      chartCount: 0,
      seriesTypes: {},
      symbolSizes: {},
      svg: v,
      win: k,
      marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
      noop: function () {},
      charts: [],
      dateFormats: {}
    }
  }); P(A, 'parts/Utilities.js', [A['parts/Globals.js']], function (k) {
    function g () {
      var b; var d = arguments; var n = {}; var x = function (b, d) { typeof b !== 'object' && (b = {}); T(d, function (n, a) { !H(n, !0) || q(n) || t(n) ? b[a] = d[a] : b[a] = x(b[a] || {}, n) }); return b }; !0 === d[0] && (n = d[1], d = Array.prototype.slice.call(d, 2)); var a = d.length; for (b = 0; b <
a; b++)n = x(n, d[b]); return n
    } function H (b, d) { return !!b && typeof b === 'object' && (!d || !z(b)) } function v (b, d, n) { var x; D(d) ? f(n) ? b.setAttribute(d, n) : b && b.getAttribute && ((x = b.getAttribute(d)) || d !== 'class' || (x = b.getAttribute(d + 'Name'))) : T(d, function (d, n) { b.setAttribute(n, d) }); return x } function K () { for (var b = arguments, d = b.length, n = 0; n < d; n++) { var x = b[n]; if (typeof x !== 'undefined' && x !== null) return x } } function G (b, d) {
      if (!b) return d; var n = b.split('.').reverse(); if (n.length === 1) return d[b]; for (b = n.pop(); typeof b !==
'undefined' && typeof d !== 'undefined' && d !== null;)d = d[b], b = n.pop(); return d
    }k.timers = []; var N = k.charts; var M = k.doc; var y = k.win; var I = k.error = function (b, d, n, x) { var a = r(b); var c = a ? 'Highcharts error #' + b + ': www.highcharts.com/errors/' + b + '/' : b.toString(); var e = function () { if (d) throw Error(c); y.console && console.log(c) }; if (typeof x !== 'undefined') { var f = ''; a && (c += '?'); T(x, function (b, d) { f += '\n' + d + ': ' + b; a && (c += encodeURI(d) + '=' + encodeURI(b)) }); c += f }n ? Z(n, 'displayError', { code: b, message: c, params: x }, e) : e() }; var J = (function () {
      function b (b, d,
        n) { this.options = d; this.elem = b; this.prop = n }b.prototype.dSetter = function () { var b = this.paths; var d = b && b[0]; b = b && b[1]; var n = []; var x = this.now || 0; if (x !== 1 && d && b) if (d.length === b.length && x < 1) for (var a = 0; a < b.length; a++) { for (var c = d[a], e = b[a], f = [], m = 0; m < e.length; m++) { var u = c[m]; var p = e[m]; f[m] = typeof u === 'number' && typeof p === 'number' && (e[0] !== 'A' || m !== 4 && m !== 5) ? u + x * (p - u) : p }n.push(f) } else n = b; else n = this.toD || []; this.elem.attr('d', n, void 0, !0) }; b.prototype.update = function () {
        var b = this.elem; var d = this.prop; var n = this.now; var x = this.options.step
        if (this[d + 'Setter']) this[d + 'Setter'](); else b.attr ? b.element && b.attr(d, n, null, !0) : b.style[d] = n + this.unit; x && x.call(b, n, this)
      }; b.prototype.run = function (b, d, n) {
        var x = this; var a = x.options; var c = function (b) { return c.stopped ? !1 : x.step(b) }; var e = y.requestAnimationFrame || function (b) { setTimeout(b, 13) }; var f = function () { for (var b = 0; b < k.timers.length; b++)k.timers[b]() || k.timers.splice(b--, 1); k.timers.length && e(f) }; b !== d || this.elem['forceAnimate:' + this.prop] ? (this.startTime = +new Date(), this.start = b, this.end = d, this.unit = n, this.now =
this.start, this.pos = 0, c.elem = this.elem, c.prop = this.prop, c() && k.timers.push(c) === 1 && e(f)) : (delete a.curAnim[this.prop], a.complete && Object.keys(a.curAnim).length === 0 && a.complete.call(this.elem))
      }; b.prototype.step = function (b) {
        var d = +new Date(); var n = this.options; var x = this.elem; var a = n.complete; var c = n.duration; var e = n.curAnim; if (x.attr && !x.element)b = !1; else if (b || d >= c + this.startTime) { this.now = this.end; this.pos = 1; this.update(); var f = e[this.prop] = !0; T(e, function (b) { !0 !== b && (f = !1) }); f && a && a.call(x); b = !1 } else {
          this.pos = n.easing((d -
this.startTime) / c), this.now = this.start + (this.end - this.start) * this.pos, this.update(), b = !0
        } return b
      }; b.prototype.initPath = function (b, d, n) {
        function x (b, d) { for (;b.length < h;) { var n = b[0]; var x = d[h - b.length]; x && n[0] === 'M' && (b[0] = x[0] === 'C' ? ['C', n[1], n[2], n[1], n[2], n[1], n[2]] : ['L', n[1], n[2]]); b.unshift(n); f && b.push(b[b.length - 1]) } } function a (b, d) { for (;b.length < h;) if (d = b[b.length / m - 1].slice(), d[0] === 'C' && (d[1] = d[5], d[2] = d[6]), f) { var n = b[b.length / m].slice(); b.splice(b.length / 2, 0, d, n) } else b.push(d) } var c = b.startX
        var e = b.endX; d = d && d.slice(); n = n.slice(); var f = b.isArea; var m = f ? 2 : 1; if (!d) return [n, n]; if (c && e) { for (b = 0; b < c.length; b++) if (c[b] === e[0]) { var u = b; break } else if (c[0] === e[e.length - c.length + b]) { u = b; var p = !0; break } else if (c[c.length - 1] === e[e.length - c.length + b]) { u = c.length - b; break } typeof u === 'undefined' && (d = []) } if (d.length && r(u)) { var h = n.length + u * m; p ? (x(d, n), a(n, d)) : (x(n, d), a(d, n)) } return [d, n]
      }; b.prototype.fillSetter = function () { b.prototype.strokeSetter.apply(this, arguments) }; b.prototype.strokeSetter = function () {
        this.elem.attr(this.prop,
          k.color(this.start).tweenTo(k.color(this.end), this.pos), null, !0)
      }; return b
    }()); k.Fx = J; k.merge = g; var E = k.pInt = function (b, d) { return parseInt(b, d || 10) }; var D = k.isString = function (b) { return typeof b === 'string' }; var z = k.isArray = function (b) { b = Object.prototype.toString.call(b); return b === '[object Array]' || b === '[object Array Iterator]' }; k.isObject = H; var t = k.isDOMElement = function (b) { return H(b) && typeof b.nodeType === 'number' }; var q = k.isClass = function (b) {
      var d = b && b.constructor; return !(!H(b, !0) || t(b) || !d || !d.name || d.name ===
'Object')
    }; var r = k.isNumber = function (b) { return typeof b === 'number' && !isNaN(b) && Infinity > b && -Infinity < b }; var h = k.erase = function (b, d) { for (var n = b.length; n--;) if (b[n] === d) { b.splice(n, 1); break } }; var f = k.defined = function (b) { return typeof b !== 'undefined' && b !== null }; k.attr = v; var a = k.splat = function (b) { return z(b) ? b : [b] }; var l = k.syncTimeout = function (b, d, n) { if (d > 0) return setTimeout(b, d, n); b.call(0, n); return -1 }; var e = k.clearTimeout = function (b) { f(b) && clearTimeout(b) }; var c = k.extend = function (b, d) { var n; b || (b = {}); for (n in d)b[n] = d[n]; return b }
    k.pick = K; var m = k.css = function (b, d) { k.isMS && !k.svg && d && typeof d.opacity !== 'undefined' && (d.filter = 'alpha(opacity=' + 100 * d.opacity + ')'); c(b.style, d) }; var u = k.createElement = function (b, d, n, x, a) { b = M.createElement(b); d && c(b, d); a && m(b, { padding: '0', border: 'none', margin: '0' }); n && m(b, n); x && x.appendChild(b); return b }; var L = k.extendClass = function (b, d) { var n = function () {}; n.prototype = new b(); c(n.prototype, d); return n }; var F = k.pad = function (b, d, n) { return Array((d || 2) + 1 - String(b).replace('-', '').length).join(n || '0') + b }; var w = k.relativeLength =
function (b, d, n) { return /%$/.test(b) ? d * parseFloat(b) / 100 + (n || 0) : parseFloat(b) }; var p = k.wrap = function (b, d, n) { var x = b[d]; b[d] = function () { var b = Array.prototype.slice.call(arguments); var d = arguments; var a = this; a.proceed = function () { x.apply(a, arguments.length ? arguments : d) }; b.unshift(x); b = n.apply(this, b); a.proceed = null; return b } }; var C = k.format = function (b, d, n) {
      var x = '{'; var a = !1; var c = []; var e = /f$/; var f = /\.([0-9])/; var m = k.defaultOptions.lang; var u = n && n.time || k.time; for (n = n && n.numberFormatter || W; b;) {
        var p = b.indexOf(x); if (p === -1) break; var h = b.slice(0,
          p); if (a) { h = h.split(':'); x = G(h.shift() || '', d); if (h.length && typeof x === 'number') if (h = h.join(':'), e.test(h)) { var Q = parseInt((h.match(f) || ['', '-1'])[1], 10); x !== null && (x = n(x, Q, m.decimalPoint, h.indexOf(',') > -1 ? m.thousandsSep : '')) } else x = u.dateFormat(h, x); c.push(x) } else c.push(h); b = b.slice(p + 1); x = (a = !a) ? '}' : '{'
      }c.push(b); return c.join('')
    }; var O = k.getMagnitude = function (b) { return Math.pow(10, Math.floor(Math.log(b) / Math.LN10)) }; var B = k.normalizeTickInterval = function (b, d, n, x, a) {
      var c = b; n = K(n, 1); var e = b / n; d || (d = a ? [1,
        1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === x && (n === 1 ? d = d.filter(function (b) { return b % 1 === 0 }) : n <= 0.1 && (d = [1 / n]))); for (x = 0; x < d.length && !(c = d[x], a && c * n >= b || !a && e <= (d[x] + (d[x + 1] || d[x])) / 2); x++);return c = R(c * n, -Math.round(Math.log(0.001) / Math.LN10))
    }; var d = k.stableSort = function (b, d) { var n = b.length; var x; var a; for (a = 0; a < n; a++)b[a].safeI = a; b.sort(function (b, n) { x = d(b, n); return x === 0 ? b.safeI - n.safeI : x }); for (a = 0; a < n; a++) delete b[a].safeI }; var b = k.arrayMin = function (b) { for (var d = b.length, n = b[0]; d--;)b[d] < n && (n = b[d]); return n }
    var n = k.arrayMax = function (b) { for (var d = b.length, n = b[0]; d--;)b[d] > n && (n = b[d]); return n }; var x = k.destroyObjectProperties = function (b, d) { T(b, function (n, x) { n && n !== d && n.destroy && n.destroy(); delete b[x] }) }; var Q = k.discardElement = function (b) { var d = k.garbageBin; d || (d = u('div')); b && d.appendChild(b); d.innerHTML = '' }; var R = k.correctFloat = function (b, d) { return parseFloat(b.toPrecision(d || 14)) }; var X = k.setAnimation = function (b, d) { d.renderer.globalAnimation = K(b, d.options.chart.animation, !0) }; var U = k.animObject = function (b) {
      return H(b) ? g(b)
        : { duration: b ? 500 : 0 }
    }; var V = k.timeUnits = { millisecond: 1, second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5, month: 24192E5, year: 314496E5 }; var W = k.numberFormat = function (b, d, n, x) {
      b = +b || 0; d = +d; var a = k.defaultOptions.lang; var c = (b.toString().split('.')[1] || '').split('e')[0].length; var e = b.toString().split('e'); if (d === -1)d = Math.min(c, 20); else if (!r(d))d = 2; else if (d && e[1] && e[1] < 0) {
        var f = d + +e[1]; f >= 0 ? (e[0] = (+e[0]).toExponential(f).split('e')[0], d = f) : (e[0] = e[0].split('.')[0] || 0, b = d < 20 ? (e[0] * Math.pow(10, e[1])).toFixed(d)
          : 0, e[1] = 0)
      } var m = (Math.abs(e[1] ? e[0] : b) + Math.pow(10, -Math.max(d, c) - 1)).toFixed(d); c = String(E(m)); f = c.length > 3 ? c.length % 3 : 0; n = K(n, a.decimalPoint); x = K(x, a.thousandsSep); b = (b < 0 ? '-' : '') + (f ? c.substr(0, f) + x : ''); b += c.substr(f).replace(/(\d{3})(?=\d)/g, '$1' + x); d && (b += n + m.slice(-d)); e[1] && +b !== 0 && (b += 'e' + e[1]); return b
    }; Math.easeInOutSine = function (b) { return -0.5 * (Math.cos(Math.PI * b) - 1) }; var aa = k.getStyle = function (b, d, n) {
      if (d === 'width') {
        return d = Math.min(b.offsetWidth, b.scrollWidth), n = b.getBoundingClientRect &&
b.getBoundingClientRect().width, n < d && n >= d - 1 && (d = Math.floor(n)), Math.max(0, d - k.getStyle(b, 'padding-left') - k.getStyle(b, 'padding-right'))
      } if (d === 'height') return Math.max(0, Math.min(b.offsetHeight, b.scrollHeight) - k.getStyle(b, 'padding-top') - k.getStyle(b, 'padding-bottom')); y.getComputedStyle || I(27, !0); if (b = y.getComputedStyle(b, void 0))b = b.getPropertyValue(d), K(n, d !== 'opacity') && (b = E(b)); return b
    }; var Y = k.inArray = function (b, d, n) { return d.indexOf(b, n) }; var fa = k.find = Array.prototype.find ? function (b, d) { return b.find(d) }
      : function (b, d) { var n; var x = b.length; for (n = 0; n < x; n++) if (d(b[n], n)) return b[n] }; k.keys = Object.keys; var ba = k.offset = function (b) { var d = M.documentElement; b = b.parentElement || b.parentNode ? b.getBoundingClientRect() : { top: 0, left: 0 }; return { top: b.top + (y.pageYOffset || d.scrollTop) - (d.clientTop || 0), left: b.left + (y.pageXOffset || d.scrollLeft) - (d.clientLeft || 0) } }; var ca = k.stop = function (b, d) { for (var n = k.timers.length; n--;)k.timers[n].elem !== b || d && d !== k.timers[n].prop || (k.timers[n].stopped = !0) }; var T = k.objectEach = function (b, d, n) {
      for (var x in b) {
        Object.hasOwnProperty.call(b,
          x) && d.call(n || b[x], b[x], x, b)
      }
    }; T({ map: 'map', each: 'forEach', grep: 'filter', reduce: 'reduce', some: 'some' }, function (b, d) { k[d] = function (d) { return Array.prototype[b].apply(d, [].slice.call(arguments, 1)) } }); var ha = k.addEvent = function (b, d, n, x) {
      void 0 === x && (x = {}); var a = b.addEventListener || k.addEventListenerPolyfill; var c = typeof b === 'function' && b.prototype ? b.prototype.protoEvents = b.prototype.protoEvents || {} : b.hcEvents = b.hcEvents || {}; k.Point && b instanceof k.Point && b.series && b.series.chart && (b.series.chart.runTrackerClick =
!0); a && a.call(b, d, n, !1); c[d] || (c[d] = []); c[d].push({ fn: n, order: typeof x.order === 'number' ? x.order : Infinity }); c[d].sort(function (b, d) { return b.order - d.order }); return function () { A(b, d, n) }
    }; var A = k.removeEvent = function (b, d, n) {
      function x (d, n) { var x = b.removeEventListener || k.removeEventListenerPolyfill; x && x.call(b, d, n, !1) } function a (n) { var a; if (b.nodeName) { if (d) { var c = {}; c[d] = !0 } else c = n; T(c, function (b, d) { if (n[d]) for (a = n[d].length; a--;)x(d, n[d][a].fn) }) } } var c; ['protoEvents', 'hcEvents'].forEach(function (e, f) {
        var m =
(f = f ? b : b.prototype) && f[e]; m && (d ? (c = m[d] || [], n ? (m[d] = c.filter(function (b) { return n !== b.fn }), x(d, n)) : (a(m), m[d] = [])) : (a(m), f[e] = {}))
      })
    }; var Z = k.fireEvent = function (b, d, n, x) {
      var a; n = n || {}; if (M.createEvent && (b.dispatchEvent || b.fireEvent)) { var e = M.createEvent('Events'); e.initEvent(d, !0, !0); c(e, n); b.dispatchEvent ? b.dispatchEvent(e) : b.fireEvent(d, e) } else {
        n.target || c(n, { preventDefault: function () { n.defaultPrevented = !0 }, target: b, type: d }), (function (d, x) {
          void 0 === d && (d = []); void 0 === x && (x = []); var c = 0; var e = 0; var f = d.length +
x.length; for (a = 0; a < f; a++)!1 === (d[c] ? x[e] ? d[c].order <= x[e].order ? d[c++] : x[e++] : d[c++] : x[e++]).fn.call(b, n) && n.preventDefault()
        }(b.protoEvents && b.protoEvents[d], b.hcEvents && b.hcEvents[d]))
      }x && !n.defaultPrevented && x.call(b, n)
    }; var ia = k.animate = function (b, d, n) {
      var x; var a = ''; var c; var e; if (!H(n)) { var f = arguments; n = { duration: f[2], easing: f[3], complete: f[4] } }r(n.duration) || (n.duration = 400); n.easing = typeof n.easing === 'function' ? n.easing : Math[n.easing] || Math.easeInOutSine; n.curAnim = g(d); T(d, function (f, m) {
        ca(b, m); e = new J(b,
          n, m); c = null; m === 'd' && z(d.d) ? (e.paths = e.initPath(b, b.pathArray, d.d), e.toD = d.d, x = 0, c = 1) : b.attr ? x = b.attr(m) : (x = parseFloat(aa(b, m)) || 0, m !== 'opacity' && (a = 'px')); c || (c = f); c && c.match && c.match('px') && (c = c.replace(/px/g, '')); e.run(x, c, a)
      })
    }; var ja = k.seriesType = function (b, d, n, x, a) { var c = k.getOptions(); var e = k.seriesTypes; c.plotOptions[b] = g(c.plotOptions[d], n); e[b] = L(e[d] || function () {}, x); e[b].prototype.type = b; a && (e[b].prototype.pointClass = L(k.Point, a)); return e[b] }; var ea = k.uniqueKey = (function () {
      var b = Math.random().toString(36).substring(2,
        9); var d = 0; return function () { return 'highcharts-' + b + '-' + d++ }
    }()); var P = k.isFunction = function (b) { return typeof b === 'function' }; y.jQuery && (y.jQuery.fn.highcharts = function () { var b = [].slice.call(arguments); if (this[0]) return b[0] ? (new (k[D(b[0]) ? b.shift() : 'Chart'])(this[0], b[0], b[1]), this) : N[v(this[0], 'data-highcharts-chart')] }); return {
      Fx: k.Fx,
      addEvent: ha,
      animate: ia,
      animObject: U,
      arrayMax: n,
      arrayMin: b,
      attr: v,
      clamp: function (b, d, n) { return b > d ? b < n ? b : n : d },
      clearTimeout: e,
      correctFloat: R,
      createElement: u,
      css: m,
      defined: f,
      destroyObjectProperties: x,
      discardElement: Q,
      erase: h,
      error: I,
      extend: c,
      extendClass: L,
      find: fa,
      fireEvent: Z,
      format: C,
      getMagnitude: O,
      getNestedProperty: G,
      getStyle: aa,
      inArray: Y,
      isArray: z,
      isClass: q,
      isDOMElement: t,
      isFunction: P,
      isNumber: r,
      isObject: H,
      isString: D,
      merge: g,
      normalizeTickInterval: B,
      numberFormat: W,
      objectEach: T,
      offset: ba,
      pad: F,
      pick: K,
      pInt: E,
      relativeLength: w,
      removeEvent: A,
      seriesType: ja,
      setAnimation: X,
      splat: a,
      stableSort: d,
      stop: ca,
      syncTimeout: l,
      timeUnits: V,
      uniqueKey: ea,
      wrap: p
    }
  }); P(A, 'parts/Color.js', [A['parts/Globals.js'],
    A['parts/Utilities.js']], function (k, g) {
    var H = g.isNumber; var v = g.merge; var K = g.pInt; g = (function () {
      function g (k) { this.parsers = [{ regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/, parse: function (g) { return [K(g[1]), K(g[2]), K(g[3]), parseFloat(g[4], 10)] } }, { regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/, parse: function (g) { return [K(g[1]), K(g[2]), K(g[3]), 1] } }]; this.rgba = []; if (!(this instanceof g)) return new g(k); this.init(k) }g.parse = function (k) { return new g(k) }
      g.prototype.init = function (k) { var v, y; if ((this.input = k = g.names[k && k.toLowerCase ? k.toLowerCase() : ''] || k) && k.stops) this.stops = k.stops.map(function (y) { return new g(y[1]) }); else { if (k && k.charAt && k.charAt() === '#') { var I = k.length; k = parseInt(k.substr(1), 16); I === 7 ? v = [(k & 16711680) >> 16, (k & 65280) >> 8, k & 255, 1] : I === 4 && (v = [(k & 3840) >> 4 | (k & 3840) >> 8, (k & 240) >> 4 | k & 240, (k & 15) << 4 | k & 15, 1]) } if (!v) for (y = this.parsers.length; y-- && !v;) { var J = this.parsers[y]; (I = J.regex.exec(k)) && (v = J.parse(I)) } } this.rgba = v || [] }; g.prototype.get =
function (k) { var g = this.input; var y = this.rgba; if (typeof this.stops !== 'undefined') { var I = v(g); I.stops = [].concat(I.stops); this.stops.forEach(function (y, g) { I.stops[g] = [I.stops[g][0], y.get(k)] }) } else I = y && H(y[0]) ? k === 'rgb' || !k && y[3] === 1 ? 'rgb(' + y[0] + ',' + y[1] + ',' + y[2] + ')' : k === 'a' ? y[3] : 'rgba(' + y.join(',') + ')' : g; return I }; g.prototype.brighten = function (k) {
        var g; var y = this.rgba; if (this.stops) this.stops.forEach(function (y) { y.brighten(k) }); else if (H(k) && k !== 0) {
          for (g = 0; g < 3; g++) {
            y[g] += K(255 * k), y[g] < 0 && (y[g] = 0), y[g] > 255 &&
(y[g] = 255)
          }
        } return this
      }; g.prototype.setOpacity = function (g) { this.rgba[3] = g; return this }; g.prototype.tweenTo = function (g, k) { var y = this.rgba; var v = g.rgba; v.length && y && y.length ? (g = v[3] !== 1 || y[3] !== 1, k = (g ? 'rgba(' : 'rgb(') + Math.round(v[0] + (y[0] - v[0]) * (1 - k)) + ',' + Math.round(v[1] + (y[1] - v[1]) * (1 - k)) + ',' + Math.round(v[2] + (y[2] - v[2]) * (1 - k)) + (g ? ',' + (v[3] + (y[3] - v[3]) * (1 - k)) : '') + ')') : k = g.input || 'none'; return k }; g.names = { white: '#ffffff', black: '#000000' }; return g
    }()); k.Color = g; k.color = g.parse; return k.Color
  }); P(A, 'parts/SVGElement.js',
    [A['parts/Color.js'], A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g, H) {
      var v = g.deg2rad; var K = g.doc; var G = g.hasTouch; var N = g.isFirefox; var M = g.noop; var y = g.svg; var I = g.SVG_NS; var J = g.win; var E = H.animate; var D = H.animObject; var z = H.attr; var t = H.createElement; var q = H.css; var r = H.defined; var h = H.erase; var f = H.extend; var a = H.fireEvent; var l = H.inArray; var e = H.isArray; var c = H.isFunction; var m = H.isNumber; var u = H.isString; var L = H.merge; var F = H.objectEach; var w = H.pick; var p = H.pInt; var C = H.stop; var O = H.uniqueKey; H = (function () {
        function B () {
          this.height = this.element = void 0; this.opacity = 1; this.renderer = void 0
          this.SVG_NS = I; this.symbolCustomAttribs = 'x y width height r start end innerR anchorX anchorY rounded'.split(' '); this.textProps = 'color cursor direction fontFamily fontSize fontStyle fontWeight lineHeight textAlign textDecoration textOutline textOverflow width'.split(' '); this.width = void 0
        }B.prototype._defaultGetter = function (d) { d = w(this[d + 'Value'], this[d], this.element ? this.element.getAttribute(d) : null, 0); /^[\-0-9\.]+$/.test(d) && (d = parseFloat(d)); return d }; B.prototype._defaultSetter = function (d, b, n) {
          n.setAttribute(b,
            d)
        }; B.prototype.add = function (d) { var b = this.renderer; var n = this.element; d && (this.parentGroup = d); this.parentInverted = d && d.inverted; typeof this.textStr !== 'undefined' && b.buildText(this); this.added = !0; if (!d || d.handleZ || this.zIndex) var x = this.zIndexSetter(); x || (d ? d.element : b.box).appendChild(n); if (this.onAdd) this.onAdd(); return this }; B.prototype.addClass = function (d, b) {
          var n = b ? '' : this.attr('class') || ''; d = (d || '').split(/ /g).reduce(function (b, d) { n.indexOf(d) === -1 && b.push(d); return b }, n ? [n] : []).join(' '); d !==
n && this.attr('class', d); return this
        }; B.prototype.afterSetters = function () { this.doTransform && (this.updateTransform(), this.doTransform = !1) }; B.prototype.align = function (d, b, n) {
          var x; var a = {}; var c = this.renderer; var e = c.alignedObjects; var f, m; if (d) { if (this.alignOptions = d, this.alignByTranslate = b, !n || u(n)) this.alignTo = x = n || 'renderer', h(e, this), e.push(this), n = void 0 } else d = this.alignOptions, b = this.alignByTranslate, x = this.alignTo; n = w(n, c[x], c); x = d.align; c = d.verticalAlign; e = (n.x || 0) + (d.x || 0); var p = (n.y || 0) + (d.y ||
0); x === 'right' ? f = 1 : x === 'center' && (f = 2); f && (e += (n.width - (d.width || 0)) / f); a[b ? 'translateX' : 'x'] = Math.round(e); c === 'bottom' ? m = 1 : c === 'middle' && (m = 2); m && (p += (n.height - (d.height || 0)) / m); a[b ? 'translateY' : 'y'] = Math.round(p); this[this.placed ? 'animate' : 'attr'](a); this.placed = !0; this.alignAttr = a; return this
        }; B.prototype.alignSetter = function (d) { var b = { left: 'start', center: 'middle', right: 'end' }; b[d] && (this.alignValue = d, this.element.setAttribute('text-anchor', b[d])) }; B.prototype.animate = function (d, b, n) {
          var x = D(w(b,
            this.renderer.globalAnimation, !0)); w(K.hidden, K.msHidden, K.webkitHidden, !1) && (x.duration = 0); x.duration !== 0 ? (n && (x.complete = n), E(this, d, x)) : (this.attr(d, void 0, n), F(d, function (b, d) { x.step && x.step.call(this, b, { prop: d, pos: 1 }) }, this)); return this
        }; B.prototype.applyTextOutline = function (d) {
          var b = this.element; var n; d.indexOf('contrast') !== -1 && (d = d.replace(/contrast/g, this.renderer.getContrast(b.style.fill))); d = d.split(' '); var x = d[d.length - 1]; if ((n = d[0]) && n !== 'none' && g.svg) {
            this.fakeTS = !0; d = [].slice.call(b.getElementsByTagName('tspan'))
            this.ySetter = this.xSetter; n = n.replace(/(^[\d\.]+)(.*?)$/g, function (b, d, n) { return 2 * d + n }); this.removeTextOutline(d); var a = b.textContent ? /^[\u0591-\u065F\u066A-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(b.textContent) : !1; var c = b.firstChild; d.forEach(function (d, e) {
              e === 0 && (d.setAttribute('x', b.getAttribute('x')), e = b.getAttribute('y'), d.setAttribute('y', e || 0), e === null && b.setAttribute('y', 0)); e = d.cloneNode(!0); z(a && !N ? d : e, { class: 'highcharts-text-outline', fill: x, stroke: x, 'stroke-width': n, 'stroke-linejoin': 'round' })
              b.insertBefore(e, c)
            }); a && N && d[0] && (d = d[0].cloneNode(!0), d.textContent = ' ', b.insertBefore(d, c))
          }
        }; B.prototype.attr = function (d, b, n, x) {
          var a = this.element; var c; var e = this; var f; var m; var u = this.symbolCustomAttribs; if (typeof d === 'string' && typeof b !== 'undefined') { var p = d; d = {}; d[p] = b } typeof d === 'string' ? e = (this[d + 'Getter'] || this._defaultGetter).call(this, d, a) : (F(d, function (b, n) {
            f = !1; x || C(this, n); this.symbolName && l(n, u) !== -1 && (c || (this.symbolAttr(d), c = !0), f = !0); !this.rotation || n !== 'x' && n !== 'y' || (this.doTransform = !0); f || (m =
this[n + 'Setter'] || this._defaultSetter, m.call(this, b, n, a), !this.styledMode && this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(n) && this.updateShadows(n, b, m))
          }, this), this.afterSetters()); n && n.call(this); return e
        }; B.prototype.clip = function (d) { return this.attr('clip-path', d ? 'url(' + this.renderer.url + '#' + d.id + ')' : 'none') }; B.prototype.crisp = function (d, b) {
          b = b || d.strokeWidth || 0; var n = Math.round(b) % 2 / 2; d.x = Math.floor(d.x || this.x || 0) + n; d.y = Math.floor(d.y || this.y || 0) + n; d.width = Math.floor((d.width ||
this.width || 0) - 2 * n); d.height = Math.floor((d.height || this.height || 0) - 2 * n); r(d.strokeWidth) && (d.strokeWidth = b); return d
        }; B.prototype.complexColor = function (d, b, n) {
          var x = this.renderer; var c; var f; var m; var u; var p; var h; var w; var l; var C; var B; var t = []; var q; a(this.renderer, 'complexColor', { args: arguments }, function () {
            d.radialGradient ? f = 'radialGradient' : d.linearGradient && (f = 'linearGradient'); if (f) {
              m = d[f]; p = x.gradients; h = d.stops; C = n.radialReference; e(m) && (d[f] = m = { x1: m[0], y1: m[1], x2: m[2], y2: m[3], gradientUnits: 'userSpaceOnUse' }); f === 'radialGradient' && C &&
!r(m.gradientUnits) && (u = m, m = L(m, x.getRadialAttr(C, u), { gradientUnits: 'userSpaceOnUse' })); F(m, function (b, d) { d !== 'id' && t.push(d, b) }); F(h, function (b) { t.push(b) }); t = t.join(','); if (p[t])B = p[t].attr('id'); else { m.id = B = O(); var a = p[t] = x.createElement(f).attr(m).add(x.defs); a.radAttr = u; a.stops = []; h.forEach(function (b) { b[1].indexOf('rgba') === 0 ? (c = k.parse(b[1]), w = c.get('rgb'), l = c.get('a')) : (w = b[1], l = 1); b = x.createElement('stop').attr({ offset: b[0], 'stop-color': w, 'stop-opacity': l }).add(a); a.stops.push(b) }) }q = 'url(' +
x.url + '#' + B + ')'; n.setAttribute(b, q); n.gradient = t; d.toString = function () { return q }
            }
          })
        }; B.prototype.css = function (d) {
          var b = this.styles; var n = {}; var x = this.element; var a = ''; var c = !b; var e = ['textOutline', 'textOverflow', 'width']; d && d.color && (d.fill = d.color); b && F(d, function (d, x) { b && b[x] !== d && (n[x] = d, c = !0) }); if (c) {
            b && (d = f(b, n)); if (d) if (d.width === null || d.width === 'auto') delete this.textWidth; else if (x.nodeName.toLowerCase() === 'text' && d.width) var m = this.textWidth = p(d.width); this.styles = d; m && !y && this.renderer.forExport && delete d.width
            if (x.namespaceURI === this.SVG_NS) { var u = function (b, d) { return '-' + d.toLowerCase() }; F(d, function (b, d) { e.indexOf(d) === -1 && (a += d.replace(/([A-Z])/g, u) + ':' + b + ';') }); a && z(x, 'style', a) } else q(x, d); this.added && (this.element.nodeName === 'text' && this.renderer.buildText(this), d && d.textOutline && this.applyTextOutline(d.textOutline))
          } return this
        }; B.prototype.dashstyleSetter = function (d) {
          var b = this['stroke-width']; b === 'inherit' && (b = 1); if (d = d && d.toLowerCase()) {
            var n = d.replace('shortdashdotdot', '3,1,1,1,1,1,').replace('shortdashdot',
              '3,1,1,1').replace('shortdot', '1,1,').replace('shortdash', '3,1,').replace('longdash', '8,3,').replace(/dot/g, '1,3,').replace('dash', '4,3,').replace(/,$/, '').split(','); for (d = n.length; d--;)n[d] = '' + p(n[d]) * w(b, NaN); d = n.join(',').replace(/NaN/g, 'none'); this.element.setAttribute('stroke-dasharray', d)
          }
        }; B.prototype.destroy = function () {
          var d = this; var b = d.element || {}; var n = d.renderer; var x = n.isSVG && b.nodeName === 'SPAN' && d.parentGroup || void 0; var a = b.ownerSVGElement; b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = b.point =
null; C(d); if (d.clipPath && a) { var c = d.clipPath; [].forEach.call(a.querySelectorAll('[clip-path],[CLIP-PATH]'), function (b) { b.getAttribute('clip-path').indexOf(c.element.id) > -1 && b.removeAttribute('clip-path') }); d.clipPath = c.destroy() } if (d.stops) { for (a = 0; a < d.stops.length; a++)d.stops[a].destroy(); d.stops.length = 0; d.stops = void 0 }d.safeRemoveChild(b); for (n.styledMode || d.destroyShadows(); x && x.div && x.div.childNodes.length === 0;)b = x.parentGroup, d.safeRemoveChild(x.div), delete x.div, x = b; d.alignTo && h(n.alignedObjects,
            d); F(d, function (b, n) { d[n] && d[n].parentGroup === d && d[n].destroy && d[n].destroy(); delete d[n] })
        }; B.prototype.destroyShadows = function () { (this.shadows || []).forEach(function (d) { this.safeRemoveChild(d) }, this); this.shadows = void 0 }; B.prototype.destroyTextPath = function (d, b) {
          var n = d.getElementsByTagName('text')[0]; if (n) {
            if (n.removeAttribute('dx'), n.removeAttribute('dy'), b.element.setAttribute('id', ''), this.textPathWrapper && n.getElementsByTagName('textPath').length) {
              for (d = this.textPathWrapper.element.childNodes; d.length;)n.appendChild(d[0])
              n.removeChild(this.textPathWrapper.element)
            }
          } else if (d.getAttribute('dx') || d.getAttribute('dy'))d.removeAttribute('dx'), d.removeAttribute('dy'); this.textPathWrapper && (this.textPathWrapper = this.textPathWrapper.destroy())
        }; B.prototype.dSetter = function (d, b, n) {
          e(d) && (typeof d[0] === 'string' && (d = this.renderer.pathToSegments(d)), this.pathArray = d, d = d.reduce(function (b, d, n) { return d && d.join ? (n ? b + ' ' : '') + d.join(' ') : (d || '').toString() }, '')); /(NaN| {2}|^$)/.test(d) && (d = 'M 0 0'); this[b] !== d && (n.setAttribute(b,
            d), this[b] = d)
        }; B.prototype.fadeOut = function (d) { var b = this; b.animate({ opacity: 0 }, { duration: w(d, 150), complete: function () { b.attr({ y: -9999 }).hide() } }) }; B.prototype.fillSetter = function (d, b, n) { typeof d === 'string' ? n.setAttribute(b, d) : d && this.complexColor(d, b, n) }; B.prototype.getBBox = function (d, b) {
          var n; var x = this.renderer; var a = this.element; var e = this.styles; var m = this.textStr; var u = x.cache; var p = x.cacheKeys; var h = a.namespaceURI === this.SVG_NS; b = w(b, this.rotation, 0); var l = x.styledMode ? a && B.prototype.getStyle.call(a, 'font-size') : e && e.fontSize
          if (r(m)) { var C = m.toString(); C.indexOf('<') === -1 && (C = C.replace(/[0-9]/g, '0')); C += ['', b, l, this.textWidth, e && e.textOverflow, e && e.fontWeight].join() }C && !d && (n = u[C]); if (!n) {
            if (h || x.forExport) { try { var F = this.fakeTS && function (b) { [].forEach.call(a.querySelectorAll('.highcharts-text-outline'), function (d) { d.style.display = b }) }; c(F) && F('none'); n = a.getBBox ? f({}, a.getBBox()) : { width: a.offsetWidth, height: a.offsetHeight }; c(F) && F('') } catch (ba) { '' } if (!n || n.width < 0)n = { width: 0, height: 0 } } else n = this.htmlGetBBox(); x.isSVG &&
(d = n.width, x = n.height, h && (n.height = x = { '11px,17': 14, '13px,20': 16 }[e && e.fontSize + ',' + Math.round(x)] || x), b && (e = b * v, n.width = Math.abs(x * Math.sin(e)) + Math.abs(d * Math.cos(e)), n.height = Math.abs(x * Math.cos(e)) + Math.abs(d * Math.sin(e)))); if (C && n.height > 0) { for (;p.length > 250;) delete u[p.shift()]; u[C] || p.push(C); u[C] = n }
          } return n
        }; B.prototype.getStyle = function (d) { return J.getComputedStyle(this.element || this, '').getPropertyValue(d) }; B.prototype.hasClass = function (d) { return ('' + this.attr('class')).split(' ').indexOf(d) !== -1 }
        B.prototype.hide = function (d) { d ? this.attr({ y: -9999 }) : this.attr({ visibility: 'hidden' }); return this }; B.prototype.htmlGetBBox = function () { return { height: 0, width: 0, x: 0, y: 0 } }; B.prototype.init = function (d, b) { this.element = b === 'span' ? t(b) : K.createElementNS(this.SVG_NS, b); this.renderer = d; a(this, 'afterInit') }; B.prototype.invert = function (d) { this.inverted = d; this.updateTransform(); return this }; B.prototype.on = function (d, b) {
          var n; var x; var a = this.element; var c; G && d === 'click' ? (a.ontouchstart = function (b) {
            n = b.touches[0].clientX; x =
b.touches[0].clientY
          }, a.ontouchend = function (d) { n && Math.sqrt(Math.pow(n - d.changedTouches[0].clientX, 2) + Math.pow(x - d.changedTouches[0].clientY, 2)) >= 4 || b.call(a, d); c = !0; d.preventDefault() }, a.onclick = function (d) { c || b.call(a, d) }) : a['on' + d] = b; return this
        }; B.prototype.opacitySetter = function (d, b, n) { this[b] = d; n.setAttribute(b, d) }; B.prototype.removeClass = function (d) { return this.attr('class', ('' + this.attr('class')).replace(u(d) ? new RegExp(' ?' + d + ' ?') : d, '')) }; B.prototype.removeTextOutline = function (d) {
          for (var b =
d.length, n; b--;)n = d[b], n.getAttribute('class') === 'highcharts-text-outline' && h(d, this.element.removeChild(n))
        }; B.prototype.safeRemoveChild = function (d) { var b = d.parentNode; b && b.removeChild(d) }; B.prototype.setRadialReference = function (d) { var b = this.element.gradient && this.renderer.gradients[this.element.gradient]; this.element.radialReference = d; b && b.radAttr && b.animate(this.renderer.getRadialAttr(d, b.radAttr)); return this }; B.prototype.setTextPath = function (d, b) {
          var n = this.element; var x = { textAnchor: 'text-anchor' }
          var a = !1; var c = this.textPathWrapper; var e = !c; b = L(!0, { enabled: !0, attributes: { dy: -5, startOffset: '50%', textAnchor: 'middle' } }, b); var f = b.attributes; if (d && b && b.enabled) {
            c && c.element.parentNode === null ? (e = !0, c = c.destroy()) : c && this.removeTextOutline.call(c.parentGroup, [].slice.call(n.getElementsByTagName('tspan'))); this.options && this.options.padding && (f.dx = -this.options.padding); c || (this.textPathWrapper = c = this.renderer.createElement('textPath'), a = !0); var u = c.element; (b = d.element.getAttribute('id')) || d.element.setAttribute('id',
              b = O()); if (e) for (d = n.getElementsByTagName('tspan'); d.length;)d[0].setAttribute('y', 0), m(f.dx) && d[0].setAttribute('x', -f.dx), u.appendChild(d[0]); a && c && c.add({ element: this.text ? this.text.element : n }); u.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.renderer.url + '#' + b); r(f.dy) && (u.parentNode.setAttribute('dy', f.dy), delete f.dy); r(f.dx) && (u.parentNode.setAttribute('dx', f.dx), delete f.dx); F(f, function (b, d) { u.setAttribute(x[d] || d, b) }); n.removeAttribute('transform'); this.removeTextOutline.call(c,
              [].slice.call(n.getElementsByTagName('tspan'))); this.text && !this.renderer.styledMode && this.attr({ fill: 'none', 'stroke-width': 0 }); this.applyTextOutline = this.updateTransform = M
          } else c && (delete this.updateTransform, delete this.applyTextOutline, this.destroyTextPath(n, d), this.updateTransform(), this.options && this.options.rotation && this.applyTextOutline(this.options.style.textOutline)); return this
        }; B.prototype.shadow = function (d, b, n) {
          var x = []; var a = this.element; var c = !1; var e = this.oldShadowOptions; var m = {
            color: '#000000',
            offsetX: 1,
            offsetY: 1,
            opacity: 0.15,
            width: 3
          }; var u; !0 === d ? u = m : typeof d === 'object' && (u = f(m, d)); u && (u && e && F(u, function (b, d) { b !== e[d] && (c = !0) }), c && this.destroyShadows(), this.oldShadowOptions = u); if (!u) this.destroyShadows(); else if (!this.shadows) {
            var p = u.opacity / u.width; var h = this.parentInverted ? 'translate(-1,-1)' : 'translate(' + u.offsetX + ', ' + u.offsetY + ')'; for (m = 1; m <= u.width; m++) {
              var w = a.cloneNode(!1); var l = 2 * u.width + 1 - 2 * m; z(w, { stroke: d.color || '#000000', 'stroke-opacity': p * m, 'stroke-width': l, transform: h, fill: 'none' })
              w.setAttribute('class', (w.getAttribute('class') || '') + ' highcharts-shadow'); n && (z(w, 'height', Math.max(z(w, 'height') - l, 0)), w.cutHeight = l); b ? b.element.appendChild(w) : a.parentNode && a.parentNode.insertBefore(w, a); x.push(w)
            } this.shadows = x
          } return this
        }; B.prototype.show = function (d) { return this.attr({ visibility: d ? 'inherit' : 'visible' }) }; B.prototype.strokeSetter = function (d, b, n) {
          this[b] = d; this.stroke && this['stroke-width'] ? (B.prototype.fillSetter.call(this, this.stroke, 'stroke', n), n.setAttribute('stroke-width',
            this['stroke-width']), this.hasStroke = !0) : b === 'stroke-width' && d === 0 && this.hasStroke ? (n.removeAttribute('stroke'), this.hasStroke = !1) : this.renderer.styledMode && this['stroke-width'] && (n.setAttribute('stroke-width', this['stroke-width']), this.hasStroke = !0)
        }; B.prototype.strokeWidth = function () {
          if (!this.renderer.styledMode) return this['stroke-width'] || 0; var d = this.getStyle('stroke-width'); var b = 0; if (d.indexOf('px') === d.length - 2)b = p(d); else if (d !== '') {
            var n = K.createElementNS(I, 'rect'); z(n, { width: d, 'stroke-width': 0 })
            this.element.parentNode.appendChild(n); b = n.getBBox().width; n.parentNode.removeChild(n)
          } return b
        }; B.prototype.symbolAttr = function (d) { var b = this; 'x y r start end width height innerR anchorX anchorY clockwise'.split(' ').forEach(function (n) { b[n] = w(d[n], b[n]) }); b.attr({ d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b) }) }; B.prototype.textSetter = function (d) { d !== this.textStr && (delete this.textPxLength, this.textStr = d, this.added && this.renderer.buildText(this)) }; B.prototype.titleSetter = function (d) {
          var b =
this.element.getElementsByTagName('title')[0]; b || (b = K.createElementNS(this.SVG_NS, 'title'), this.element.appendChild(b)); b.firstChild && b.removeChild(b.firstChild); b.appendChild(K.createTextNode(String(w(d, '')).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')))
        }; B.prototype.toFront = function () { var d = this.element; d.parentNode.appendChild(d); return this }; B.prototype.translate = function (d, b) { return this.attr({ translateX: d, translateY: b }) }; B.prototype.updateShadows = function (d, b, n) {
          var x = this.shadows
          if (x) for (var a = x.length; a--;)n.call(x[a], d === 'height' ? Math.max(b - (x[a].cutHeight || 0), 0) : d === 'd' ? this.d : b, d, x[a])
        }; B.prototype.updateTransform = function () {
          var d = this.translateX || 0; var b = this.translateY || 0; var n = this.scaleX; var x = this.scaleY; var a = this.inverted; var c = this.rotation; var e = this.matrix; var f = this.element; a && (d += this.width, b += this.height); d = ['translate(' + d + ',' + b + ')']; r(e) && d.push('matrix(' + e.join(',') + ')'); a ? d.push('rotate(90) scale(-1,1)') : c && d.push('rotate(' + c + ' ' + w(this.rotationOriginX, f.getAttribute('x'), 0) + ' ' +
w(this.rotationOriginY, f.getAttribute('y') || 0) + ')'); (r(n) || r(x)) && d.push('scale(' + w(n, 1) + ' ' + w(x, 1) + ')'); d.length && f.setAttribute('transform', d.join(' '))
        }; B.prototype.visibilitySetter = function (d, b, n) { d === 'inherit' ? n.removeAttribute(b) : this[b] !== d && n.setAttribute(b, d); this[b] = d }; B.prototype.xGetter = function (d) { this.element.nodeName === 'circle' && (d === 'x' ? d = 'cx' : d === 'y' && (d = 'cy')); return this._defaultGetter(d) }; B.prototype.zIndexSetter = function (d, b) {
          var n = this.renderer; var x = this.parentGroup; var a = (x || n).element ||
n.box; var c = this.element; var e = !1; n = a === n.box; var f = this.added; var m; r(d) ? (c.setAttribute('data-z-index', d), d = +d, this[b] === d && (f = !1)) : r(this[b]) && c.removeAttribute('data-z-index'); this[b] = d; if (f) { (d = this.zIndex) && x && (x.handleZ = !0); b = a.childNodes; for (m = b.length - 1; m >= 0 && !e; m--) { x = b[m]; f = x.getAttribute('data-z-index'); var u = !r(f); if (x !== c) if (d < 0 && u && !n && !m)a.insertBefore(c, b[m]), e = !0; else if (p(f) <= d || u && (!r(d) || d >= 0))a.insertBefore(c, b[m + 1] || null), e = !0 }e || (a.insertBefore(c, b[n ? 3 : 0] || null), e = !0) } return e
        }; return B
      }())
      H.prototype['stroke-widthSetter'] = H.prototype.strokeSetter; H.prototype.yGetter = H.prototype.xGetter; H.prototype.matrixSetter = H.prototype.rotationOriginXSetter = H.prototype.rotationOriginYSetter = H.prototype.rotationSetter = H.prototype.scaleXSetter = H.prototype.scaleYSetter = H.prototype.translateXSetter = H.prototype.translateYSetter = H.prototype.verticalAlignSetter = function (a, d) { this[d] = a; this.doTransform = !0 }; g.SVGElement = H; return g.SVGElement
    }); P(A, 'parts/SvgRenderer.js', [A['parts/Color.js'], A['parts/Globals.js'],
    A['parts/SVGElement.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    var K = k.parse; var G = v.addEvent; var N = v.attr; var M = v.createElement; var y = v.css; var I = v.defined; var J = v.destroyObjectProperties; var E = v.extend; var D = v.isArray; var z = v.isNumber; var t = v.isObject; var q = v.isString; var r = v.merge; var h = v.objectEach; var f = v.pick; var a = v.pInt; var l = v.removeEvent; var e = v.splat; var c = v.uniqueKey; var m = g.charts; var u = g.deg2rad; var L = g.doc; var F = g.isFirefox; var w = g.isMS; var p = g.isWebKit; v = g.noop; var C = g.svg; var O = g.SVG_NS; var B = g.symbolSizes; var d = g.win; k = g.SVGRenderer = function () { this.init.apply(this, arguments) }; E(k.prototype,
      {
        Element: H,
        SVG_NS: O,
        init: function (b, n, x, a, c, e, f) {
          var m = this.createElement('svg').attr({ version: '1.1', class: 'highcharts-root' }); f || m.css(this.getStyle(a)); a = m.element; b.appendChild(a); N(b, 'dir', 'ltr'); b.innerHTML.indexOf('xmlns') === -1 && N(a, 'xmlns', this.SVG_NS); this.isSVG = !0; this.box = a; this.boxWrapper = m; this.alignedObjects = []; this.url = (F || p) && L.getElementsByTagName('base').length ? d.location.href.split('#')[0].replace(/<[^>]*>/g, '').replace(/([\('\)])/g, '\\$1').replace(/ /g, '%20') : ''; this.createElement('desc').add().element.appendChild(L.createTextNode('Created with Highcharts 8.1.0'))
          this.defs = this.createElement('defs').add(); this.allowHTML = e; this.forExport = c; this.styledMode = f; this.gradients = {}; this.cache = {}; this.cacheKeys = []; this.imgCount = 0; this.setSize(n, x, !1); var u; F && b.getBoundingClientRect && (n = function () { y(b, { left: 0, top: 0 }); u = b.getBoundingClientRect(); y(b, { left: Math.ceil(u.left) - u.left + 'px', top: Math.ceil(u.top) - u.top + 'px' }) }, n(), this.unSubPixelFix = G(d, 'resize', n))
        },
        definition: function (b) {
          function d (b, n) {
            var x; e(b).forEach(function (b) {
              var c = a.createElement(b.tagName); var e = {}
              h(b, function (b, d) { d !== 'tagName' && d !== 'children' && d !== 'textContent' && (e[d] = b) }); c.attr(e); c.add(n || a.defs); b.textContent && c.element.appendChild(L.createTextNode(b.textContent)); d(b.children || [], c); x = c
            }); return x
          } var a = this; return d(b)
        },
        getStyle: function (b) { return this.style = E({ fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif', fontSize: '12px' }, b) },
        setStyle: function (b) { this.boxWrapper.css(this.getStyle(b)) },
        isHidden: function () { return !this.boxWrapper.getBBox().width },
        destroy: function () {
          var b =
this.defs; this.box = null; this.boxWrapper = this.boxWrapper.destroy(); J(this.gradients || {}); this.gradients = null; b && (this.defs = b.destroy()); this.unSubPixelFix && this.unSubPixelFix(); return this.alignedObjects = null
        },
        createElement: function (b) { var d = new this.Element(); d.init(this, b); return d },
        draw: v,
        getRadialAttr: function (b, d) { return { cx: b[0] - b[2] / 2 + d.cx * b[2], cy: b[1] - b[2] / 2 + d.cy * b[2], r: d.r * b[2] } },
        truncate: function (b, d, a, c, e, f, m) {
          var n = this; var x = b.rotation; var u; var p = c ? 1 : 0; var h = (a || c).length; var w = h; var l = []; var C = function (b) {
            d.firstChild &&
d.removeChild(d.firstChild); b && d.appendChild(L.createTextNode(b))
          }; var F = function (x, f) { f = f || x; if (typeof l[f] === 'undefined') if (d.getSubStringLength) try { l[f] = e + d.getSubStringLength(0, c ? f + 1 : f) } catch (ea) { '' } else n.getSpanWidth && (C(m(a || c, x)), l[f] = e + n.getSpanWidth(b, d)); return l[f] }; var Q; b.rotation = 0; var R = F(d.textContent.length); if (Q = e + R > f) { for (;p <= h;)w = Math.ceil((p + h) / 2), c && (u = m(c, w)), R = F(w, u && u.length - 1), p === h ? p = h + 1 : R > f ? h = w - 1 : p = w; h === 0 ? C('') : a && h === a.length - 1 || C(u || m(a || c, w)) }c && c.splice(0, w); b.actualWidth =
R; b.rotation = x; return Q
        },
        escapes: { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' },
        buildText: function (b) {
          var d = b.element; var x = this; var c = x.forExport; var e = f(b.textStr, '').toString(); var m = e.indexOf('<') !== -1; var u = d.childNodes; var p; var w = N(d, 'x'); var l = b.styles; var F = b.textWidth; var B = l && l.lineHeight; var r = l && l.textOutline; var t = l && l.textOverflow === 'ellipsis'; var q = l && l.whiteSpace === 'nowrap'; var z = l && l.fontSize; var g; var k = u.length; l = F && !b.added && this.box; var D = function (b) {
            var n; x.styledMode || (n = /(px|em)$/.test(b && b.style.fontSize) ? b.style.fontSize
              : z || x.style.fontSize || 12); return B ? a(B) : x.fontMetrics(n, b.getAttribute('style') ? b : d).h
          }; var E = function (b, d) { h(x.escapes, function (n, a) { d && d.indexOf(n) !== -1 || (b = b.toString().replace(new RegExp(n, 'g'), a)) }); return b }; var v = function (b, d) { var n = b.indexOf('<'); b = b.substring(n, b.indexOf('>') - n); n = b.indexOf(d + '='); if (n !== -1 && (n = n + d.length + 1, d = b.charAt(n), d === '"' || d === "'")) return b = b.substring(n + 1), b.substring(0, b.indexOf(d)) }; var I = /<br.*?>/g; var J = [e, t, q, B, r, z, F].join(); if (J !== b.textCache) {
            for (b.textCache = J; k--;)d.removeChild(u[k])
            m || r || t || F || e.indexOf(' ') !== -1 && (!q || I.test(e)) ? (l && l.appendChild(d), m ? (e = x.styledMode ? e.replace(/<(b|strong)>/g, '<span class="highcharts-strong">').replace(/<(i|em)>/g, '<span class="highcharts-emphasized">') : e.replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">'), e = e.replace(/<a/g, '<span').replace(/<\/(b|strong|i|em|a)>/g, '</span>').split(I)) : e = [e], e = e.filter(function (b) { return b !== '' }), e.forEach(function (n, a) {
              var e = 0; var f = 0; n = n.replace(/^\s+|\s+$/g,
                '').replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||'); var m = n.split('|||'); m.forEach(function (n) {
                if (n !== '' || m.length === 1) {
                  var u = {}; var h = L.createElementNS(x.SVG_NS, 'tspan'); var l; var Q; (l = v(n, 'class')) && N(h, 'class', l); if (l = v(n, 'style'))l = l.replace(/(;| |^)color([ :])/, '$1fill$2'), N(h, 'style', l); (Q = v(n, 'href')) && !c && (N(h, 'onclick', 'location.href="' + Q + '"'), N(h, 'class', 'highcharts-anchor'), x.styledMode || y(h, { cursor: 'pointer' })); n = E(n.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' '); if (n !== ' ') {
                    h.appendChild(L.createTextNode(n))
                    e ? u.dx = 0 : a && w !== null && (u.x = w); N(h, u); d.appendChild(h); !e && g && (!C && c && y(h, { display: 'block' }), N(h, 'dy', D(h))); if (F) {
                      var R = n.replace(/([^\^])-/g, '$1- ').split(' '); u = !q && (m.length > 1 || a || R.length > 1); Q = 0; var B = D(h); if (t)p = x.truncate(b, h, n, void 0, 0, Math.max(0, F - parseInt(z || 12, 10)), function (b, d) { return b.substring(0, d) + '\u2026' }); else if (u) {
                        for (;R.length;) {
                          R.length && !q && Q > 0 && (h = L.createElementNS(O, 'tspan'), N(h, { dy: B, x: w }), l && N(h, 'style', l), h.appendChild(L.createTextNode(R.join(' ').replace(/- /g, '-'))), d.appendChild(h)),
                          x.truncate(b, h, null, R, Q === 0 ? f : 0, F, function (b, d) { return R.slice(0, d).join(' ').replace(/- /g, '-') }), f = b.actualWidth, Q++
                        }
                      }
                    }e++
                  }
                }
              }); g = g || d.childNodes.length
            }), t && p && b.attr('title', E(b.textStr, ['&lt;', '&gt;'])), l && l.removeChild(d), r && b.applyTextOutline && b.applyTextOutline(r)) : d.appendChild(L.createTextNode(E(e)))
          }
        },
        getContrast: function (b) { b = K(b).rgba; b[0] *= 1; b[1] *= 1.2; b[2] *= 0.5; return b[0] + b[1] + b[2] > 459 ? '#000000' : '#FFFFFF' },
        button: function (b, d, a, c, e, f, m, u, h, p) {
          var n = this.label(b, d, a, h, void 0, void 0, p, void 0,
            'button'); var x = 0; var l = this.styledMode; n.attr(r({ padding: 8, r: 2 }, e)); if (!l) { e = r({ fill: '#f7f7f7', stroke: '#cccccc', 'stroke-width': 1, style: { color: '#333333', cursor: 'pointer', fontWeight: 'normal' } }, e); var C = e.style; delete e.style; f = r(e, { fill: '#e6e6e6' }, f); var F = f.style; delete f.style; m = r(e, { fill: '#e6ebf5', style: { color: '#000000', fontWeight: 'bold' } }, m); var Q = m.style; delete m.style; u = r(e, { style: { color: '#cccccc' } }, u); var R = u.style; delete u.style }G(n.element, w ? 'mouseover' : 'mouseenter', function () { x !== 3 && n.setState(1) })
          G(n.element, w ? 'mouseout' : 'mouseleave', function () { x !== 3 && n.setState(x) }); n.setState = function (b) { b !== 1 && (n.state = x = b); n.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass('highcharts-button-' + ['normal', 'hover', 'pressed', 'disabled'][b || 0]); l || n.attr([e, f, m, u][b || 0]).css([C, F, Q, R][b || 0]) }; l || n.attr(e).css(E({ cursor: 'default' }, C)); return n.on('click', function (b) { x !== 3 && c.call(n, b) })
        },
        crispLine: function (b, d, a) {
          void 0 === a && (a = 'round'); var n = b[0]; var x = b[1]; n[1] === x[1] && (n[1] = x[1] = Math[a](n[1]) -
d % 2 / 2); n[2] === x[2] && (n[2] = x[2] = Math[a](n[2]) + d % 2 / 2); return b
        },
        path: function (b) { var d = this.styledMode ? {} : { fill: 'none' }; D(b) ? d.d = b : t(b) && E(d, b); return this.createElement('path').attr(d) },
        circle: function (b, d, a) { b = t(b) ? b : typeof b === 'undefined' ? {} : { x: b, y: d, r: a }; d = this.createElement('circle'); d.xSetter = d.ySetter = function (b, d, n) { n.setAttribute('c' + d, b) }; return d.attr(b) },
        arc: function (b, d, a, c, e, f) { t(b) ? (c = b, d = c.y, a = c.r, b = c.x) : c = { innerR: c, start: e, end: f }; b = this.symbol('arc', b, d, a, a, c); b.r = a; return b },
        rect: function (b,
          d, a, c, e, f) { e = t(b) ? b.r : e; var n = this.createElement('rect'); b = t(b) ? b : typeof b === 'undefined' ? {} : { x: b, y: d, width: Math.max(a, 0), height: Math.max(c, 0) }; this.styledMode || (typeof f !== 'undefined' && (b.strokeWidth = f, b = n.crisp(b)), b.fill = 'none'); e && (b.r = e); n.rSetter = function (b, d, a) { n.r = b; N(a, { rx: b, ry: b }) }; n.rGetter = function () { return n.r }; return n.attr(b) },
        setSize: function (b, d, a) {
          var n = this.alignedObjects; var c = n.length; this.width = b; this.height = d; for (this.boxWrapper.animate({ width: b, height: d }, {
            step: function () {
              this.attr({
                viewBox: '0 0 ' +
this.attr('width') + ' ' + this.attr('height')
              })
            },
            duration: f(a, !0) ? void 0 : 0
          }); c--;)n[c].align()
        },
        g: function (b) { var d = this.createElement('g'); return b ? d.attr({ class: 'highcharts-' + b }) : d },
        image: function (b, n, a, c, e, f) {
          var x = { preserveAspectRatio: 'none' }; var m = function (b, d) { b.setAttributeNS ? b.setAttributeNS('http://www.w3.org/1999/xlink', 'href', d) : b.setAttribute('hc-svg-href', d) }; var u = function (d) { m(h.element, b); f.call(h, d) }; arguments.length > 1 && E(x, { x: n, y: a, width: c, height: e }); var h = this.createElement('image').attr(x)
          f ? (m(h.element, 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='), x = new d.Image(), G(x, 'load', u), x.src = b, x.complete && u({})) : m(h.element, b); return h
        },
        symbol: function (b, d, a, c, e, u) {
          var n = this; var x = /^url\((.*?)\)$/; var h = x.test(b); var p = !h && (this.symbols[b] ? b : 'circle'); var w = p && this.symbols[p]; var l; if (w) {
            typeof d === 'number' && (l = w.call(this.symbols, Math.round(d || 0), Math.round(a || 0), c, e, u)); var C = this.path(l); n.styledMode || C.attr('fill', 'none'); E(C, { symbolName: p, x: d, y: a, width: c, height: e }); u && E(C,
              u)
          } else if (h) {
            var F = b.match(x)[1]; C = this.image(F); C.imgwidth = f(B[F] && B[F].width, u && u.width); C.imgheight = f(B[F] && B[F].height, u && u.height); var Q = function () { C.attr({ width: C.width, height: C.height }) }; ['width', 'height'].forEach(function (b) {
              C[b + 'Setter'] = function (b, d) {
                var n = {}; var a = this['img' + d]; var c = d === 'width' ? 'translateX' : 'translateY'; this[d] = b; I(a) && (u && u.backgroundSize === 'within' && this.width && this.height && (a = Math.round(a * Math.min(this.width / this.imgwidth, this.height / this.imgheight))), this.element && this.element.setAttribute(d,
                  a), this.alignByTranslate || (n[c] = ((this[d] || 0) - a) / 2, this.attr(n)))
              }
            }); I(d) && C.attr({ x: d, y: a }); C.isImg = !0; I(C.imgwidth) && I(C.imgheight) ? Q() : (C.attr({ width: 0, height: 0 }), M('img', {
              onload: function () { var b = m[n.chartIndex]; this.width === 0 && (y(this, { position: 'absolute', top: '-999em' }), L.body.appendChild(this)); B[F] = { width: this.width, height: this.height }; C.imgwidth = this.width; C.imgheight = this.height; C.element && Q(); this.parentNode && this.parentNode.removeChild(this); n.imgCount--; if (!n.imgCount && b && !b.hasLoaded)b.onload() },
              src: F
            }), this.imgCount++)
          } return C
        },
        symbols: {
          circle: function (b, d, a, c) { return this.arc(b + a / 2, d + c / 2, a / 2, c / 2, { start: 0.5 * Math.PI, end: 2.5 * Math.PI, open: !1 }) },
          square: function (b, d, a, c) { return [['M', b, d], ['L', b + a, d], ['L', b + a, d + c], ['L', b, d + c], ['Z']] },
          triangle: function (b, d, a, c) { return [['M', b + a / 2, d], ['L', b + a, d + c], ['L', b, d + c], ['Z']] },
          'triangle-down': function (b, d, a, c) { return [['M', b, d], ['L', b + a, d], ['L', b + a / 2, d + c], ['Z']] },
          diamond: function (b, d, a, c) { return [['M', b + a / 2, d], ['L', b + a, d + c / 2], ['L', b + a / 2, d + c], ['L', b, d + c / 2], ['Z']] },
          arc: function (b, d, a, c, e) { var n = e.start; var x = e.r || a; var m = e.r || c || a; var u = e.end - 0.001; a = e.innerR; c = f(e.open, Math.abs(e.end - e.start - 2 * Math.PI) < 0.001); var h = Math.cos(n); var p = Math.sin(n); var w = Math.cos(u); u = Math.sin(u); n = f(e.longArc, e.end - n - Math.PI < 0.001 ? 0 : 1); x = [['M', b + x * h, d + m * p], ['A', x, m, 0, n, f(e.clockwise, 1), b + x * w, d + m * u]]; I(a) && x.push(c ? ['M', b + a * w, d + a * u] : ['L', b + a * w, d + a * u], ['A', a, a, 0, n, I(e.clockwise) ? 1 - e.clockwise : 0, b + a * h, d + a * p]); c || x.push(['Z']); return x },
          callout: function (b, d, a, c, e) {
            var n = Math.min(e && e.r || 0, a, c); var x = n + 6; var f =
e && e.anchorX; e = e && e.anchorY; var m = [['M', b + n, d], ['L', b + a - n, d], ['C', b + a, d, b + a, d, b + a, d + n], ['L', b + a, d + c - n], ['C', b + a, d + c, b + a, d + c, b + a - n, d + c], ['L', b + n, d + c], ['C', b, d + c, b, d + c, b, d + c - n], ['L', b, d + n], ['C', b, d, b, d, b + n, d]]; f && f > a ? e > d + x && e < d + c - x ? m.splice(3, 1, ['L', b + a, e - 6], ['L', b + a + 6, e], ['L', b + a, e + 6], ['L', b + a, d + c - n]) : m.splice(3, 1, ['L', b + a, c / 2], ['L', f, e], ['L', b + a, c / 2], ['L', b + a, d + c - n]) : f && f < 0 ? e > d + x && e < d + c - x ? m.splice(7, 1, ['L', b, e + 6], ['L', b - 6, e], ['L', b, e - 6], ['L', b, d + n]) : m.splice(7, 1, ['L', b, c / 2], ['L', f, e], ['L', b, c / 2],
              ['L', b, d + n]) : e && e > c && f > b + x && f < b + a - x ? m.splice(5, 1, ['L', f + 6, d + c], ['L', f, d + c + 6], ['L', f - 6, d + c], ['L', b + n, d + c]) : e && e < 0 && f > b + x && f < b + a - x && m.splice(1, 1, ['L', f - 6, d], ['L', f, d - 6], ['L', f + 6, d], ['L', a - n, d]); return m
          }
        },
        clipRect: function (b, d, a, e) { var n = c() + '-'; var x = this.createElement('clipPath').attr({ id: n }).add(this.defs); b = this.rect(b, d, a, e, 0).add(x); b.id = n; b.clipPath = x; b.count = 0; return b },
        text: function (b, d, a, c) {
          var n = {}; if (c && (this.allowHTML || !this.forExport)) return this.html(b, d, a); n.x = Math.round(d || 0); a && (n.y = Math.round(a))
          I(b) && (n.text = b); b = this.createElement('text').attr(n); c || (b.xSetter = function (b, d, n) { var a = n.getElementsByTagName('tspan'); var c = n.getAttribute(d); var e; for (e = 0; e < a.length; e++) { var x = a[e]; x.getAttribute(d) === c && x.setAttribute(d, b) }n.setAttribute(d, b) }); return b
        },
        fontMetrics: function (b, n) {
          b = !this.styledMode && /px/.test(b) || !d.getComputedStyle ? b || n && n.style && n.style.fontSize || this.style && this.style.fontSize : n && H.prototype.getStyle.call(n, 'font-size'); b = /px/.test(b) ? a(b) : 12; n = b < 24 ? b + 3 : Math.round(1.2 * b); return {
            h: n,
            b: Math.round(0.8 * n),
            f: b
          }
        },
        rotCorr: function (b, d, a) { var n = b; d && a && (n = Math.max(n * Math.cos(d * u), 4)); return { x: -b / 3 * Math.sin(d * u), y: n } },
        pathToSegments: function (b) { for (var d = [], a = [], c = { A: 8, C: 7, H: 2, L: 3, M: 3, Q: 5, S: 5, T: 3, V: 2 }, e = 0; e < b.length; e++)q(a[0]) && z(b[e]) && a.length === c[a[0].toUpperCase()] && b.splice(e, 0, a[0].replace('M', 'L').replace('m', 'l')), typeof b[e] === 'string' && (a.length && d.push(a.slice(0)), a.length = 0), a.push(b[e]); d.push(a.slice(0)); return d },
        label: function (b, d, a, c, e, f, m, u, h) {
          var n = this; var x = n.styledMode
          var p = n.g(h !== 'button' && 'label'); var w = p.text = n.text('', 0, 0, m).attr({ zIndex: 1 }); var C; var F = { width: 0, height: 0, x: 0, y: 0 }; var Q = F; var B = 0; var L = 3; var t = 0; var O; var q; var R; var X; var g; var k = {}; var y; var D; var U = /^url\((.*?)\)$/.test(c); var v = x || U; var W = function () { return x ? C.strokeWidth() % 2 / 2 : (y ? parseInt(y, 10) : 0) % 2 / 2 }; h && p.addClass('highcharts-' + h); var V = function () {
            var b = w.element.style; var d = {}; Q = z(O) && z(q) && !g || !I(w.textStr) ? F : w.getBBox(); p.width = (O || Q.width || 0) + 2 * L + t; p.height = (q || Q.height || 0) + 2 * L; D = L + Math.min(n.fontMetrics(b && b.fontSize, w).b, Q.height || Infinity); v && (C || (p.box =
C = n.symbols[c] || U ? n.symbol(c) : n.rect(), C.addClass((h === 'button' ? '' : 'highcharts-label-box') + (h ? ' highcharts-' + h + '-box' : '')), C.add(p), b = W(), d.x = b, d.y = (u ? -D : 0) + b), d.width = Math.round(p.width), d.height = Math.round(p.height), C.attr(E(d, k)), k = {})
          }; var J = function () { var b = t + L; var d = u ? 0 : D; I(O) && Q && (g === 'center' || g === 'right') && (b += { center: 0.5, right: 1 }[g] * (O - Q.width)); if (b !== w.x || d !== w.y)w.attr('x', b), w.hasBoxWidthChanged && (Q = w.getBBox(!0), V()), typeof d !== 'undefined' && w.attr('y', d); w.x = b; w.y = d }; var M = function (b,
            d) { C ? C.attr(b, d) : k[b] = d }; p.onAdd = function () { w.add(p); p.attr({ text: b || b === 0 ? b : '', x: d, y: a }); C && I(e) && p.attr({ anchorX: e, anchorY: f }) }; p.widthSetter = function (b) { O = z(b) ? b : null }; p.heightSetter = function (b) { q = b }; p['text-alignSetter'] = function (b) { g = b }; p.paddingSetter = function (b) { I(b) && b !== L && (L = p.padding = b, J()) }; p.paddingLeftSetter = function (b) { I(b) && b !== t && (t = b, J()) }; p.alignSetter = function (b) { b = { left: 0, center: 0.5, right: 1 }[b]; b !== B && (B = b, Q && p.attr({ x: R })) }; p.textSetter = function (b) {
            typeof b !== 'undefined' && w.attr({ text: b })
            V(); J()
          }; p['stroke-widthSetter'] = function (b, d) { b && (v = !0); y = this['stroke-width'] = b; M(d, b) }; x ? p.rSetter = function (b, d) { M(d, b) } : p.strokeSetter = p.fillSetter = p.rSetter = function (b, d) { d !== 'r' && (d === 'fill' && b && (v = !0), p[d] = b); M(d, b) }; p.anchorXSetter = function (b, d) { e = p.anchorX = b; M(d, Math.round(b) - W() - R) }; p.anchorYSetter = function (b, d) { f = p.anchorY = b; M(d, b - X) }; p.xSetter = function (b) { p.x = b; B && (b -= B * ((O || Q.width) + 2 * L), p['forceAnimate:x'] = !0); R = Math.round(b); p.attr('translateX', R) }; p.ySetter = function (b) {
            X = p.y = Math.round(b)
            p.attr('translateY', X)
          }; p.isLabel = !0; var G = p.css; m = { css: function (b) { if (b) { var d = {}; b = r(b); p.textProps.forEach(function (n) { typeof b[n] !== 'undefined' && (d[n] = b[n], delete b[n]) }); w.css(d); var n = 'fontSize' in d || 'fontWeight' in d; if ('width' in d || n)V(), n && J() } return G.call(p, b) }, getBBox: function () { return { width: Q.width + 2 * L, height: Q.height + 2 * L, x: Q.x - L, y: Q.y - L } }, destroy: function () { l(p.element, 'mouseenter'); l(p.element, 'mouseleave'); w && w.destroy(); C && (C = C.destroy()); H.prototype.destroy.call(p); p = n = w = V = J = M = null } }
          p.on = function (b, d) { var n = w && w.element.tagName === 'SPAN' ? w : void 0; if (n) { var a = function (a) { (b === 'mouseenter' || b === 'mouseleave') && a.relatedTarget instanceof Element && (p.element.contains(a.relatedTarget) || n.element.contains(a.relatedTarget)) || d.call(p.element, a) }; n.on(b, a) }H.prototype.on.call(p, b, a || d); return p }; x || (m.shadow = function (b) { b && (V(), C && C.shadow(b)); return p }); return E(p, m)
        }
      }); g.Renderer = k
  }); P(A, 'parts/Html.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.attr; var v = g.createElement
    var K = g.css; var G = g.defined; var N = g.extend; var M = g.pick; var y = g.pInt; var I = k.isFirefox; var J = k.isMS; var E = k.isWebKit; var D = k.SVGElement; g = k.SVGRenderer; var z = k.win; N(D.prototype, {
      htmlCss: function (t) { var q = this.element.tagName === 'SPAN' && t && 'width' in t; var r = M(q && t.width, void 0); if (q) { delete t.width; this.textWidth = r; var h = !0 }t && t.textOverflow === 'ellipsis' && (t.whiteSpace = 'nowrap', t.overflow = 'hidden'); this.styles = N(this.styles, t); K(this.element, t); h && this.htmlUpdateTransform(); return this },
      htmlGetBBox: function () {
        var t = this.element; return {
          x: t.offsetLeft,
          y: t.offsetTop,
          width: t.offsetWidth,
          height: t.offsetHeight
        }
      },
      htmlUpdateTransform: function () {
        if (this.added) {
          var t = this.renderer; var q = this.element; var r = this.translateX || 0; var h = this.translateY || 0; var f = this.x || 0; var a = this.y || 0; var l = this.textAlign || 'left'; var e = { left: 0, center: 0.5, right: 1 }[l]; var c = this.styles; var m = c && c.whiteSpace; K(q, { marginLeft: r, marginTop: h }); !t.styledMode && this.shadows && this.shadows.forEach(function (a) { K(a, { marginLeft: r + 1, marginTop: h + 1 }) }); this.inverted && [].forEach.call(q.childNodes, function (a) { t.invertChild(a, q) })
          if (q.tagName === 'SPAN') {
            c = this.rotation; var u = this.textWidth && y(this.textWidth); var L = [c, l, q.innerHTML, this.textWidth, this.textAlign].join(); var F; (F = u !== this.oldTextWidth) && !(F = u > this.oldTextWidth) && ((F = this.textPxLength) || (K(q, { width: '', whiteSpace: m || 'nowrap' }), F = q.offsetWidth), F = F > u); F && (/[ \-]/.test(q.textContent || q.innerText) || q.style.textOverflow === 'ellipsis') ? (K(q, { width: u + 'px', display: 'block', whiteSpace: m || 'normal' }), this.oldTextWidth = u, this.hasBoxWidthChanged = !0) : this.hasBoxWidthChanged = !1; L !== this.cTT &&
(m = t.fontMetrics(q.style.fontSize, q).b, !G(c) || c === (this.oldRotation || 0) && l === this.oldAlign || this.setSpanRotation(c, e, m), this.getSpanCorrection(!G(c) && this.textPxLength || q.offsetWidth, m, e, c, l)); K(q, { left: f + (this.xCorr || 0) + 'px', top: a + (this.yCorr || 0) + 'px' }); this.cTT = L; this.oldRotation = c; this.oldAlign = l
          }
        } else this.alignOnAdd = !0
      },
      setSpanRotation: function (t, q, r) {
        var h = {}; var f = this.renderer.getTransformKey(); h[f] = h.transform = 'rotate(' + t + 'deg)'; h[f + (I ? 'Origin' : '-origin')] = h.transformOrigin = 100 * q + '% ' + r + 'px'
        K(this.element, h)
      },
      getSpanCorrection: function (t, q, r) { this.xCorr = -t * r; this.yCorr = -q }
    }); N(g.prototype, {
      getTransformKey: function () { return J && !/Edge/.test(z.navigator.userAgent) ? '-ms-transform' : E ? '-webkit-transform' : I ? 'MozTransform' : z.opera ? '-o-transform' : '' },
      html: function (t, q, r) {
        var h = this.createElement('span'); var f = h.element; var a = h.renderer; var l = a.isSVG; var e = function (a, e) {
          ['opacity', 'visibility'].forEach(function (c) {
            a[c + 'Setter'] = function (f, m, u) {
              var p = a.div ? a.div.style : e; D.prototype[c + 'Setter'].call(this, f, m, u)
              p && (p[m] = f)
            }
          }); a.addedSetters = !0
        }; h.textSetter = function (a) { a !== f.innerHTML && (delete this.bBox, delete this.oldTextWidth); this.textStr = a; f.innerHTML = M(a, ''); h.doTransform = !0 }; l && e(h, h.element.style); h.xSetter = h.ySetter = h.alignSetter = h.rotationSetter = function (a, e) { e === 'align' && (e = 'textAlign'); h[e] = a; h.doTransform = !0 }; h.afterSetters = function () { this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1) }; h.attr({ text: t, x: Math.round(q), y: Math.round(r) }).css({ position: 'absolute' }); a.styledMode || h.css({
          fontFamily: this.style.fontFamily,
          fontSize: this.style.fontSize
        }); f.style.whiteSpace = 'nowrap'; h.css = h.htmlCss; l && (h.add = function (c) {
          var m = a.box.parentNode; var u = []; if (this.parentGroup = c) {
            var l = c.div; if (!l) {
              for (;c;)u.push(c), c = c.parentGroup; u.reverse().forEach(function (a) {
                function c (c, e) { a[e] = c; e === 'translateX' ? C.left = c + 'px' : C.top = c + 'px'; a.doTransform = !0 } var f = H(a.element, 'class'); l = a.div = a.div || v('div', f ? { className: f } : void 0, {
                  position: 'absolute',
                  left: (a.translateX || 0) + 'px',
                  top: (a.translateY || 0) + 'px',
                  display: a.display,
                  opacity: a.opacity,
                  pointerEvents: a.styles && a.styles.pointerEvents
                }, l || m); var C = l.style; N(a, { classSetter: (function (a) { return function (c) { this.element.setAttribute('class', c); a.className = c } }(l)), on: function () { u[0].div && h.on.apply({ element: u[0].div }, arguments); return a }, translateXSetter: c, translateYSetter: c }); a.addedSetters || e(a)
              })
            }
          } else l = m; l.appendChild(f); h.added = !0; h.alignOnAdd && h.htmlUpdateTransform(); return h
        }); return h
      }
    })
  }); P(A, 'parts/Tick.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.clamp
    var v = g.correctFloat; var K = g.defined; var G = g.destroyObjectProperties; var N = g.extend; var M = g.fireEvent; var y = g.isNumber; var I = g.merge; var J = g.objectEach; var E = g.pick; var D = k.deg2rad; g = (function () {
      function z (t, q, r, h, f) { this.isNewLabel = this.isNew = !0; this.axis = t; this.pos = q; this.type = r || ''; this.parameters = f || {}; this.tickmarkOffset = this.parameters.tickmarkOffset; this.options = this.parameters.options; M(this, 'init'); r || h || this.addLabel() }z.prototype.addLabel = function () {
        var t = this; var q = t.axis; var r = q.options; var h = q.chart; var f = q.categories; var a = q.logarithmic; var l = q.names
        var e = t.pos; var c = E(t.options && t.options.labels, r.labels); var m = q.tickPositions; var u = e === m[0]; var L = e === m[m.length - 1]; l = this.parameters.category || (f ? E(f[e], l[e], e) : e); var F = t.label; f = (!c.step || c.step === 1) && q.tickInterval === 1; m = m.info; var w, p; if (q.dateTime && m) { var C = h.time.resolveDTLFormat(r.dateTimeLabelFormats[!r.grid && m.higherRanks[e] || m.unitName]); var O = C.main }t.isFirst = u; t.isLast = L; t.formatCtx = { axis: q, chart: h, isFirst: u, isLast: L, dateTimeLabelFormat: O, tickPositionInfo: m, value: a ? v(a.lin2log(l)) : l, pos: e }; r = q.labelFormatter.call(t.formatCtx,
          this.formatCtx); if (p = C && C.list)t.shortenLabel = function () { for (w = 0; w < p.length; w++) if (F.attr({ text: q.labelFormatter.call(N(t.formatCtx, { dateTimeLabelFormat: p[w] })) }), F.getBBox().width < q.getSlotWidth(t) - 2 * E(c.padding, 5)) return; F.attr({ text: '' }) }; f && q._addedPlotLB && q.isXAxis && t.moveLabel(r, c); K(F) || t.movedLabel ? F && F.textStr !== r && !f && (!F.textWidth || c.style && c.style.width || F.styles.width || F.css({ width: null }), F.attr({ text: r }), F.textPxLength = F.getBBox().width) : (t.label = F = t.createLabel({ x: 0, y: 0 }, r, c), t.rotation =
0)
      }; z.prototype.createLabel = function (t, q, r) { var h = this.axis; var f = h.chart; if (t = K(q) && r.enabled ? f.renderer.text(q, t.x, t.y, r.useHTML).add(h.labelGroup) : null)f.styledMode || t.css(I(r.style)), t.textPxLength = t.getBBox().width; return t }; z.prototype.destroy = function () { G(this, this.axis) }; z.prototype.getPosition = function (t, q, r, h) {
        var f = this.axis; var a = f.chart; var l = h && a.oldChartHeight || a.chartHeight; t = {
          x: t ? v(f.translate(q + r, null, null, h) + f.transB) : f.left + f.offset + (f.opposite ? (h && a.oldChartWidth || a.chartWidth) - f.right - f.left
            : 0),
          y: t ? l - f.bottom + f.offset - (f.opposite ? f.height : 0) : v(l - f.translate(q + r, null, null, h) - f.transB)
        }; t.y = H(t.y, -1E5, 1E5); M(this, 'afterGetPosition', { pos: t }); return t
      }; z.prototype.getLabelPosition = function (t, q, r, h, f, a, l, e) {
        var c = this.axis; var m = c.transA; var u = c.isLinked && c.linkedParent ? c.linkedParent.reversed : c.reversed; var L = c.staggerLines; var F = c.tickRotCorr || { x: 0, y: 0 }; var w = f.y; var p = h || c.reserveSpaceDefault ? 0 : -c.labelOffset * (c.labelAlign === 'center' ? 0.5 : 1); var C = {}; K(w) || (w = c.side === 0 ? r.rotation ? -8 : -r.getBBox().height : c.side === 2
          ? F.y + 8 : Math.cos(r.rotation * D) * (F.y - r.getBBox(!1, 0).height / 2)); t = t + f.x + p + F.x - (a && h ? a * m * (u ? -1 : 1) : 0); q = q + w - (a && !h ? a * m * (u ? 1 : -1) : 0); L && (r = l / (e || 1) % L, c.opposite && (r = L - r - 1), q += c.labelOffset / L * r); C.x = t; C.y = Math.round(q); M(this, 'afterGetLabelPosition', { pos: C, tickmarkOffset: a, index: l }); return C
      }; z.prototype.getLabelSize = function () { return this.label ? this.label.getBBox()[this.axis.horiz ? 'height' : 'width'] : 0 }; z.prototype.getMarkPath = function (t, q, r, h, f, a) {
        return a.crispLine([['M', t, q], ['L', t + (f ? 0 : -r), q + (f ? r : 0)]],
          h)
      }; z.prototype.handleOverflow = function (t) {
        var q = this.axis; var r = q.options.labels; var h = t.x; var f = q.chart.chartWidth; var a = q.chart.spacing; var l = E(q.labelLeft, Math.min(q.pos, a[3])); a = E(q.labelRight, Math.max(q.isRadial ? 0 : q.pos + q.len, f - a[1])); var e = this.label; var c = this.rotation; var m = { left: 0, center: 0.5, right: 1 }[q.labelAlign || e.attr('align')]; var u = e.getBBox().width; var L = q.getSlotWidth(this); var F = L; var w = 1; var p; var C = {}; if (c || E(r.overflow, 'justify') !== 'justify') {
          c < 0 && h - m * u < l ? p = Math.round(h / Math.cos(c * D) - l) : c > 0 && h + m * u > a && (p = Math.round((f - h) / Math.cos(c *
D)))
        } else if (f = h + (1 - m) * u, h - m * u < l ? F = t.x + F * (1 - m) - l : f > a && (F = a - t.x + F * m, w = -1), F = Math.min(L, F), F < L && q.labelAlign === 'center' && (t.x += w * (L - F - m * (L - Math.min(u, F)))), u > F || q.autoRotation && (e.styles || {}).width)p = F; p && (this.shortenLabel ? this.shortenLabel() : (C.width = Math.floor(p) + 'px', (r.style || {}).textOverflow || (C.textOverflow = 'ellipsis'), e.css(C)))
      }; z.prototype.moveLabel = function (t, q) {
        var r = this; var h = r.label; var f = !1; var a = r.axis; var l = a.reversed; var e = a.chart.inverted; h && h.textStr === t ? (r.movedLabel = h, f = !0, delete r.label) : J(a.ticks,
          function (a) { f || a.isNew || a === r || !a.label || a.label.textStr !== t || (r.movedLabel = a.label, f = !0, a.labelPos = r.movedLabel.xy, delete a.label) }); if (!f && (r.labelPos || h)) { var c = r.labelPos || h.xy; h = e ? c.x : l ? 0 : a.width + a.left; a = e ? l ? a.width + a.left : 0 : c.y; r.movedLabel = r.createLabel({ x: h, y: a }, t, q); r.movedLabel && r.movedLabel.attr({ opacity: 0 }) }
      }; z.prototype.render = function (t, q, r) {
        var h = this.axis; var f = h.horiz; var a = this.pos; var l = E(this.tickmarkOffset, h.tickmarkOffset); a = this.getPosition(f, a, l, q); l = a.x; var e = a.y; h = f && l === h.pos + h.len ||
!f && e === h.pos ? -1 : 1; r = E(r, 1); this.isActive = !0; this.renderGridLine(q, r, h); this.renderMark(a, r, h); this.renderLabel(a, q, r, t); this.isNew = !1; M(this, 'afterRender')
      }; z.prototype.renderGridLine = function (t, q, r) {
        var h = this.axis; var f = h.options; var a = this.gridLine; var l = {}; var e = this.pos; var c = this.type; var m = E(this.tickmarkOffset, h.tickmarkOffset); var u = h.chart.renderer; var L = c ? c + 'Grid' : 'grid'; var F = f[L + 'LineWidth']; var w = f[L + 'LineColor']; f = f[L + 'LineDashStyle']; a || (h.chart.styledMode || (l.stroke = w, l['stroke-width'] = F, f && (l.dashstyle = f)), c || (l.zIndex =
1), t && (q = 0), this.gridLine = a = u.path().attr(l).addClass('highcharts-' + (c ? c + '-' : '') + 'grid-line').add(h.gridGroup)); if (a && (r = h.getPlotLinePath({ value: e + m, lineWidth: a.strokeWidth() * r, force: 'pass', old: t })))a[t || this.isNew ? 'attr' : 'animate']({ d: r, opacity: q })
      }; z.prototype.renderMark = function (t, q, r) {
        var h = this.axis; var f = h.options; var a = h.chart.renderer; var l = this.type; var e = l ? l + 'Tick' : 'tick'; var c = h.tickSize(e); var m = this.mark; var u = !m; var L = t.x; t = t.y; var F = E(f[e + 'Width'], !l && h.isXAxis ? 1 : 0); f = f[e + 'Color']; c && (h.opposite && (c[0] = -c[0]), u &&
(this.mark = m = a.path().addClass('highcharts-' + (l ? l + '-' : '') + 'tick').add(h.axisGroup), h.chart.styledMode || m.attr({ stroke: f, 'stroke-width': F })), m[u ? 'attr' : 'animate']({ d: this.getMarkPath(L, t, c[0], m.strokeWidth() * r, h.horiz, a), opacity: q }))
      }; z.prototype.renderLabel = function (t, q, r, h) {
        var f = this.axis; var a = f.horiz; var l = f.options; var e = this.label; var c = l.labels; var m = c.step; f = E(this.tickmarkOffset, f.tickmarkOffset); var u = !0; var L = t.x; t = t.y; e && y(L) && (e.xy = t = this.getLabelPosition(L, t, e, a, c, f, h, m), this.isFirst && !this.isLast && !E(l.showFirstLabel,
          1) || this.isLast && !this.isFirst && !E(l.showLastLabel, 1) ? u = !1 : !a || c.step || c.rotation || q || r === 0 || this.handleOverflow(t), m && h % m && (u = !1), u && y(t.y) ? (t.opacity = r, e[this.isNewLabel ? 'attr' : 'animate'](t), this.isNewLabel = !1) : (e.attr('y', -9999), this.isNewLabel = !0))
      }; z.prototype.replaceMovedLabel = function () {
        var t = this.label; var q = this.axis; var r = q.reversed; var h = this.axis.chart.inverted; if (t && !this.isNew) {
          var f = h ? t.xy.x : r ? q.left : q.width + q.left; r = h ? r ? q.width + q.top : q.top : t.xy.y; t.animate({ x: f, y: r, opacity: 0 }, void 0, t.destroy)
          delete this.label
        }q.isDirty = !0; this.label = this.movedLabel; delete this.movedLabel
      }; return z
    }()); k.Tick = g; return k.Tick
  }); P(A, 'parts/Time.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.defined; var v = g.error; var K = g.extend; var G = g.isObject; var N = g.merge; var M = g.objectEach; var y = g.pad; var I = g.pick; var J = g.splat; var E = g.timeUnits; var D = k.win; g = (function () {
      function z (t) { this.options = {}; this.variableTimezone = this.useUTC = !1; this.Date = D.Date; this.getTimezoneOffset = this.timezoneOffsetFunction(); this.update(t) }z.prototype.get =
function (t, q) { if (this.variableTimezone || this.timezoneOffset) { var r = q.getTime(); var h = r - this.getTimezoneOffset(q); q.setTime(h); t = q['getUTC' + t](); q.setTime(r); return t } return this.useUTC ? q['getUTC' + t]() : q['get' + t]() }; z.prototype.set = function (t, q, r) {
        if (this.variableTimezone || this.timezoneOffset) { if (t === 'Milliseconds' || t === 'Seconds' || t === 'Minutes') return q['setUTC' + t](r); var h = this.getTimezoneOffset(q); h = q.getTime() - h; q.setTime(h); q['setUTC' + t](r); t = this.getTimezoneOffset(q); h = q.getTime() + t; return q.setTime(h) } return this.useUTC
          ? q['setUTC' + t](r) : q['set' + t](r)
      }; z.prototype.update = function (t) { var q = I(t && t.useUTC, !0); this.options = t = N(!0, this.options || {}, t); this.Date = t.Date || D.Date || Date; this.timezoneOffset = (this.useUTC = q) && t.timezoneOffset; this.getTimezoneOffset = this.timezoneOffsetFunction(); this.variableTimezone = !(q && !t.getTimezoneOffset && !t.timezone) }; z.prototype.makeTime = function (t, q, r, h, f, a) {
        if (this.useUTC) {
          var l = this.Date.UTC.apply(0, arguments); var e = this.getTimezoneOffset(l); l += e; var c = this.getTimezoneOffset(l); e !== c
            ? l += c - e : e - 36E5 !== this.getTimezoneOffset(l - 36E5) || k.isSafari || (l -= 36E5)
        } else l = (new this.Date(t, q, I(r, 1), I(h, 0), I(f, 0), I(a, 0))).getTime(); return l
      }; z.prototype.timezoneOffsetFunction = function () {
        var t = this; var q = this.options; var r = D.moment; if (!this.useUTC) return function (h) { return 6E4 * (new Date(h.toString())).getTimezoneOffset() }; if (q.timezone) { if (r) return function (h) { return 6E4 * -r.tz(h, q.timezone).utcOffset() }; v(25) } return this.useUTC && q.getTimezoneOffset ? function (h) { return 6E4 * q.getTimezoneOffset(h.valueOf()) }
          : function () { return 6E4 * (t.timezoneOffset || 0) }
      }; z.prototype.dateFormat = function (t, q, r) {
        var h; if (!H(q) || isNaN(q)) return ((h = k.defaultOptions.lang) === null || void 0 === h ? void 0 : h.invalidDate) || ''; t = I(t, '%Y-%m-%d %H:%M:%S'); var f = this; h = new this.Date(q); var a = this.get('Hours', h); var l = this.get('Day', h); var e = this.get('Date', h); var c = this.get('Month', h); var m = this.get('FullYear', h); var u = k.defaultOptions.lang; var L = u === null || void 0 === u ? void 0 : u.weekdays; var F = u === null || void 0 === u ? void 0 : u.shortWeekdays; h = K({
          a: F ? F[l] : L[l].substr(0, 3),
          A: L[l],
          d: y(e),
          e: y(e, 2, ' '),
          w: l,
          b: u.shortMonths[c],
          B: u.months[c],
          m: y(c + 1),
          o: c + 1,
          y: m.toString().substr(2, 2),
          Y: m,
          H: y(a),
          k: a,
          I: y(a % 12 || 12),
          l: a % 12 || 12,
          M: y(this.get('Minutes', h)),
          p: a < 12 ? 'AM' : 'PM',
          P: a < 12 ? 'am' : 'pm',
          S: y(h.getSeconds()),
          L: y(Math.floor(q % 1E3), 3)
        }, k.dateFormats); M(h, function (a, c) { for (;t.indexOf('%' + c) !== -1;)t = t.replace('%' + c, typeof a === 'function' ? a.call(f, q) : a) }); return r ? t.substr(0, 1).toUpperCase() + t.substr(1) : t
      }; z.prototype.resolveDTLFormat = function (t) {
        return G(t, !0) ? t : (t = J(t), {
          main: t[0],
          from: t[1],
          to: t[2]
        })
      }; z.prototype.getTimeTicks = function (t, q, r, h) {
        var f = this; var a = []; var l = {}; var e = new f.Date(q); var c = t.unitRange; var m = t.count || 1; var u; h = I(h, 1); if (H(q)) {
          f.set('Milliseconds', e, c >= E.second ? 0 : m * Math.floor(f.get('Milliseconds', e) / m)); c >= E.second && f.set('Seconds', e, c >= E.minute ? 0 : m * Math.floor(f.get('Seconds', e) / m)); c >= E.minute && f.set('Minutes', e, c >= E.hour ? 0 : m * Math.floor(f.get('Minutes', e) / m)); c >= E.hour && f.set('Hours', e, c >= E.day ? 0 : m * Math.floor(f.get('Hours', e) / m)); c >= E.day && f.set('Date', e, c >= E.month ? 1 : Math.max(1,
            m * Math.floor(f.get('Date', e) / m))); if (c >= E.month) { f.set('Month', e, c >= E.year ? 0 : m * Math.floor(f.get('Month', e) / m)); var L = f.get('FullYear', e) }c >= E.year && f.set('FullYear', e, L - L % m); c === E.week && (L = f.get('Day', e), f.set('Date', e, f.get('Date', e) - L + h + (L < h ? -7 : 0))); L = f.get('FullYear', e); h = f.get('Month', e); var F = f.get('Date', e); var w = f.get('Hours', e); q = e.getTime(); f.variableTimezone && (u = r - q > 4 * E.month || f.getTimezoneOffset(q) !== f.getTimezoneOffset(r)); q = e.getTime(); for (e = 1; q < r;) {
            a.push(q), q = c === E.year ? f.makeTime(L + e * m,
              0) : c === E.month ? f.makeTime(L, h + e * m) : !u || c !== E.day && c !== E.week ? u && c === E.hour && m > 1 ? f.makeTime(L, h, F, w + e * m) : q + c * m : f.makeTime(L, h, F + e * m * (c === E.day ? 1 : 7)), e++
          }a.push(q); c <= E.hour && a.length < 1E4 && a.forEach(function (a) { a % 18E5 === 0 && f.dateFormat('%H%M%S%L', a) === '000000000' && (l[a] = 'day') })
        }a.info = K(t, { higherRanks: l, totalRange: c * m }); return a
      }; z.defaultOptions = { Date: void 0, getTimezoneOffset: void 0, timezone: void 0, timezoneOffset: 0, useUTC: !0 }; return z
    }()); k.Time = g; return k.Time
  }); P(A, 'parts/Options.js', [A['parts/Globals.js'],
    A['parts/Time.js'], A['parts/Color.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    H = H.parse; var K = v.merge; k.defaultOptions = {
      colors: '#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1'.split(' '),
      symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
      lang: {
        loading: 'Loading...',
        months: 'January February March April May June July August September October November December'.split(' '),
        shortMonths: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
        weekdays: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
        decimalPoint: '.',
        numericSymbols: 'kMGTPE'.split(''),
        resetZoom: 'Reset zoom',
        resetZoomTitle: 'Reset zoom level 1:1',
        thousandsSep: ' '
      },
      global: {},
      time: g.defaultOptions,
      chart: { styledMode: !1, borderRadius: 0, colorCount: 10, defaultSeriesType: 'line', ignoreHiddenSeries: !0, spacing: [10, 10, 15, 10], resetZoomButton: { theme: { zIndex: 6 }, position: { align: 'right', x: -10, y: 10 } }, width: null, height: null, borderColor: '#335cad', backgroundColor: '#ffffff', plotBorderColor: '#cccccc' },
      title: {
        text: 'Chart title',
        align: 'center',
        margin: 15,
        widthAdjust: -44
      },
      subtitle: { text: '', align: 'center', widthAdjust: -44 },
      caption: { margin: 15, text: '', align: 'left', verticalAlign: 'bottom' },
      plotOptions: {},
      labels: { style: { position: 'absolute', color: '#333333' } },
      legend: {
        enabled: !0,
        align: 'center',
        alignColumns: !0,
        layout: 'horizontal',
        labelFormatter: function () { return this.name },
        borderColor: '#999999',
        borderRadius: 0,
        navigation: { activeColor: '#003399', inactiveColor: '#cccccc' },
        itemStyle: { color: '#333333', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textOverflow: 'ellipsis' },
        itemHoverStyle: { color: '#000000' },
        itemHiddenStyle: { color: '#cccccc' },
        shadow: !1,
        itemCheckboxStyle: { position: 'absolute', width: '13px', height: '13px' },
        squareSymbol: !0,
        symbolPadding: 5,
        verticalAlign: 'bottom',
        x: 0,
        y: 0,
        title: { style: { fontWeight: 'bold' } }
      },
      loading: { labelStyle: { fontWeight: 'bold', position: 'relative', top: '45%' }, style: { position: 'absolute', backgroundColor: '#ffffff', opacity: 0.5, textAlign: 'center' } },
      tooltip: {
        enabled: !0,
        animation: k.svg,
        borderRadius: 3,
        dateTimeLabelFormats: {
          millisecond: '%A, %b %e, %H:%M:%S.%L',
          second: '%A, %b %e, %H:%M:%S',
          minute: '%A, %b %e, %H:%M',
          hour: '%A, %b %e, %H:%M',
          day: '%A, %b %e, %Y',
          week: 'Week from %A, %b %e, %Y',
          month: '%B %Y',
          year: '%Y'
        },
        footerFormat: '',
        padding: 8,
        snap: k.isTouchDevice ? 25 : 10,
        headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
        backgroundColor: H('#f7f7f7').setOpacity(0.85).get(),
        borderWidth: 1,
        shadow: !0,
        style: {
          color: '#333333',
          cursor: 'default',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }
      },
      credits: { enabled: !0, href: 'https://www.highcharts.com?credits', position: { align: 'right', x: -10, verticalAlign: 'bottom', y: -5 }, style: { cursor: 'pointer', color: '#999999', fontSize: '9px' }, text: 'Highcharts.com' }
    }; k.setOptions = function (g) { k.defaultOptions = K(!0, k.defaultOptions, g); (g.time || g.global) && k.time.update(K(k.defaultOptions.global, k.defaultOptions.time, g.global, g.time)); return k.defaultOptions }; k.getOptions = function () { return k.defaultOptions }; k.defaultPlotOptions = k.defaultOptions.plotOptions
    k.time = new g(K(k.defaultOptions.global, k.defaultOptions.time)); k.dateFormat = function (g, v, M) { return k.time.dateFormat(g, v, M) }; ''
  }); P(A, 'parts/Axis.js', [A['parts/Color.js'], A['parts/Globals.js'], A['parts/Tick.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    var K = v.addEvent; var G = v.animObject; var N = v.arrayMax; var M = v.arrayMin; var y = v.clamp; var I = v.correctFloat; var J = v.defined; var E = v.destroyObjectProperties; var D = v.error; var z = v.extend; var t = v.fireEvent; var q = v.format; var r = v.getMagnitude; var h = v.isArray; var f = v.isFunction; var a = v.isNumber; var l = v.isString; var e = v.merge
    var c = v.normalizeTickInterval; var m = v.objectEach; var u = v.pick; var L = v.relativeLength; var F = v.removeEvent; var w = v.splat; var p = v.syncTimeout; var C = g.defaultOptions; var O = g.deg2rad; v = (function () {
      function B (d, b) {
        this.zoomEnabled = this.width = this.visible = this.userOptions = this.translationSlope = this.transB = this.transA = this.top = this.ticks = this.tickRotCorr = this.tickPositions = this.tickmarkOffset = this.tickInterval = this.tickAmount = this.side = this.series = this.right = this.positiveValuesOnly = this.pos = this.pointRangePadding = this.pointRange = this.plotLinesAndBandsGroups =
this.plotLinesAndBands = this.paddedTicks = this.overlap = this.options = this.oldMin = this.oldMax = this.offset = this.names = this.minPixelPadding = this.minorTicks = this.minorTickInterval = this.min = this.maxLabelLength = this.max = this.len = this.left = this.labelFormatter = this.labelEdge = this.isLinked = this.height = this.hasVisibleSeries = this.hasNames = this.coll = this.closestPointRange = this.chart = this.categories = this.bottom = this.alternateBands = void 0; this.init(d, b)
      }B.prototype.init = function (d, b) {
        var a = b.isX; var c = this; c.chart = d
        c.horiz = d.inverted && !c.isZAxis ? !a : a; c.isXAxis = a; c.coll = c.coll || (a ? 'xAxis' : 'yAxis'); t(this, 'init', { userOptions: b }); c.opposite = b.opposite; c.side = b.side || (c.horiz ? c.opposite ? 0 : 2 : c.opposite ? 1 : 3); c.setOptions(b); var e = this.options; var p = e.type; c.labelFormatter = e.labels.formatter || c.defaultLabelFormatter; c.userOptions = b; c.minPixelPadding = 0; c.reversed = e.reversed; c.visible = !1 !== e.visible; c.zoomEnabled = !1 !== e.zoomEnabled; c.hasNames = p === 'category' || !0 === e.categories; c.categories = e.categories || c.hasNames; c.names ||
(c.names = [], c.names.keys = {}); c.plotLinesAndBandsGroups = {}; c.positiveValuesOnly = !(!c.logarithmic || e.allowNegativeLog); c.isLinked = J(e.linkedTo); c.ticks = {}; c.labelEdge = []; c.minorTicks = {}; c.plotLinesAndBands = []; c.alternateBands = {}; c.len = 0; c.minRange = c.userMinRange = e.minRange || e.maxZoom; c.range = e.range; c.offset = e.offset || 0; c.max = null; c.min = null; c.crosshair = u(e.crosshair, w(d.options.tooltip.crosshairs)[a ? 0 : 1], !1); b = c.options.events; d.axes.indexOf(c) === -1 && (a ? d.axes.splice(d.xAxis.length, 0, c) : d.axes.push(c),
        d[c.coll].push(c)); c.series = c.series || []; d.inverted && !c.isZAxis && a && typeof c.reversed === 'undefined' && (c.reversed = !0); c.labelRotation = c.options.labels.rotation; m(b, function (b, d) { f(b) && K(c, d, b) }); t(this, 'afterInit')
      }; B.prototype.setOptions = function (d) { this.options = e(B.defaultOptions, this.coll === 'yAxis' && B.defaultYAxisOptions, [B.defaultTopAxisOptions, B.defaultRightAxisOptions, B.defaultBottomAxisOptions, B.defaultLeftAxisOptions][this.side], e(C[this.coll], d)); t(this, 'afterSetOptions', { userOptions: d }) }
      B.prototype.defaultLabelFormatter = function () {
        var d = this.axis; var b = this.value; var a = d.chart.time; var c = d.categories; var e = this.dateTimeLabelFormat; var f = C.lang; var m = f.numericSymbols; f = f.numericSymbolMagnitude || 1E3; var u = m && m.length; var p = d.options.labels.format; d = d.logarithmic ? Math.abs(b) : d.tickInterval; var h = this.chart; var w = h.numberFormatter; if (p) var l = q(p, this, h); else if (c)l = b; else if (e)l = a.dateFormat(e, b); else if (u && d >= 1E3) {
          for (;u-- && typeof l === 'undefined';) {
            a = Math.pow(f, u + 1), d >= a && 10 * b % a === 0 && m[u] !== null && b !== 0 && (l = w(b / a, -1) +
m[u])
          }
        } typeof l === 'undefined' && (l = Math.abs(b) >= 1E4 ? w(b, -1) : w(b, -1, void 0, '')); return l
      }; B.prototype.getSeriesExtremes = function () {
        var d = this; var b = d.chart; var n; t(this, 'getSeriesExtremes', null, function () {
          d.hasVisibleSeries = !1; d.dataMin = d.dataMax = d.threshold = null; d.softThreshold = !d.isXAxis; d.stacking && d.stacking.buildStacks(); d.series.forEach(function (c) {
            if (c.visible || !b.options.chart.ignoreHiddenSeries) {
              var e = c.options; var f = e.threshold; d.hasVisibleSeries = !0; d.positiveValuesOnly && f <= 0 && (f = null); if (d.isXAxis) {
                if (e =
c.xData, e.length) { n = c.getXExtremes(e); var x = n.min; var m = n.max; a(x) || x instanceof Date || (e = e.filter(a), n = c.getXExtremes(e), x = n.min, m = n.max); e.length && (d.dataMin = Math.min(u(d.dataMin, x), x), d.dataMax = Math.max(u(d.dataMax, m), m)) }
              } else if (c = c.applyExtremes(), a(c.dataMin) && (x = c.dataMin, d.dataMin = Math.min(u(d.dataMin, x), x)), a(c.dataMax) && (m = c.dataMax, d.dataMax = Math.max(u(d.dataMax, m), m)), J(f) && (d.threshold = f), !e.softThreshold || d.positiveValuesOnly)d.softThreshold = !1
            }
          })
        }); t(this, 'afterGetSeriesExtremes')
      }
      B.prototype.translate = function (d, b, n, c, e, f) { var x = this.linkedParent || this; var m = 1; var u = 0; var p = c ? x.oldTransA : x.transA; c = c ? x.oldMin : x.min; var h = x.minPixelPadding; e = (x.isOrdinal || x.brokenAxis && x.brokenAxis.hasBreaks || x.logarithmic && e) && x.lin2val; p || (p = x.transA); n && (m *= -1, u = x.len); x.reversed && (m *= -1, u -= m * (x.sector || x.len)); b ? (d = (d * m + u - h) / p + c, e && (d = x.lin2val(d))) : (e && (d = x.val2lin(d)), d = a(c) ? m * (d - c) * p + u + m * h + (a(f) ? p * f : 0) : void 0); return d }; B.prototype.toPixels = function (d, b) {
        return this.translate(d, !1, !this.horiz, null,
          !0) + (b ? 0 : this.pos)
      }; B.prototype.toValue = function (d, b) { return this.translate(d - (b ? 0 : this.pos), !0, !this.horiz, null, !0) }; B.prototype.getPlotLinePath = function (d) {
        function b (b, d, a) { if (l !== 'pass' && b < d || b > a)l ? b = y(b, d, a) : q = !0; return b } var n = this; var c = n.chart; var e = n.left; var f = n.top; var m = d.old; var p = d.value; var h = d.translatedValue; var w = d.lineWidth; var l = d.force; var C; var F; var B; var L; var r = m && c.oldChartHeight || c.chartHeight; var O = m && c.oldChartWidth || c.chartWidth; var q; var z = n.transB; d = { value: p, lineWidth: w, old: m, force: l, acrossPanes: d.acrossPanes, translatedValue: h }
        t(this, 'getPlotLinePath', d, function (d) { h = u(h, n.translate(p, null, null, m)); h = y(h, -1E5, 1E5); C = B = Math.round(h + z); F = L = Math.round(r - h - z); a(h) ? n.horiz ? (F = f, L = r - n.bottom, C = B = b(C, e, e + n.width)) : (C = e, B = O - n.right, F = L = b(F, f, f + n.height)) : (q = !0, l = !1); d.path = q && !l ? null : c.renderer.crispLine([['M', C, F], ['L', B, L]], w || 1) }); return d.path
      }; B.prototype.getLinearTickPositions = function (d, b, a) {
        var n = I(Math.floor(b / d) * d); a = I(Math.ceil(a / d) * d); var c = []; var e; I(n + d) === n && (e = 20); if (this.single) return [b]; for (b = n; b <= a;) {
          c.push(b); b =
I(b + d, e); if (b === f) break; var f = b
        } return c
      }; B.prototype.getMinorTickInterval = function () { var d = this.options; return !0 === d.minorTicks ? u(d.minorTickInterval, 'auto') : !1 === d.minorTicks ? null : d.minorTickInterval }; B.prototype.getMinorTickPositions = function () {
        var d = this.options; var b = this.tickPositions; var a = this.minorTickInterval; var c = []; var e = this.pointRangePadding || 0; var f = this.min - e; e = this.max + e; var m = e - f; if (m && m / a < this.len / 3) {
          var u = this.logarithmic; if (u) {
            this.paddedTicks.forEach(function (b, d, n) {
              d && c.push.apply(c, u.getLogTickPositions(a,
                n[d - 1], n[d], !0))
            })
          } else if (this.dateTime && this.getMinorTickInterval() === 'auto')c = c.concat(this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(a), f, e, d.startOfWeek)); else for (d = f + (b[0] - f) % a; d <= e && d !== c[0]; d += a)c.push(d)
        }c.length !== 0 && this.trimTicks(c); return c
      }; B.prototype.adjustForMinRange = function () {
        var d = this.options; var b = this.min; var a = this.max; var c = this.logarithmic; var e; var f; var m; var p; var h; this.isXAxis && typeof this.minRange === 'undefined' && !c && (J(d.min) || J(d.max) ? this.minRange = null : (this.series.forEach(function (b) {
          p =
b.xData; for (f = h = b.xIncrement ? 1 : p.length - 1; f > 0; f--) if (m = p[f] - p[f - 1], typeof e === 'undefined' || m < e)e = m
        }), this.minRange = Math.min(5 * e, this.dataMax - this.dataMin))); if (a - b < this.minRange) { var w = this.dataMax - this.dataMin >= this.minRange; var l = this.minRange; var C = (l - a + b) / 2; C = [b - C, u(d.min, b - C)]; w && (C[2] = this.logarithmic ? this.logarithmic.log2lin(this.dataMin) : this.dataMin); b = N(C); a = [b + l, u(d.max, b + l)]; w && (a[2] = c ? c.log2lin(this.dataMax) : this.dataMax); a = M(a); a - b < l && (C[0] = a - l, C[1] = u(d.min, a - l), b = N(C)) } this.min = b; this.max =
a
      }; B.prototype.getClosest = function () { var d; this.categories ? d = 1 : this.series.forEach(function (b) { var a = b.closestPointRange; var c = b.visible || !b.chart.options.chart.ignoreHiddenSeries; !b.noSharedTooltip && J(a) && c && (d = J(d) ? Math.min(d, a) : a) }); return d }; B.prototype.nameToX = function (d) {
        var b = h(this.categories); var a = b ? this.categories : this.names; var c = d.options.x; d.series.requireSorting = !1; J(c) || (c = !1 === this.options.uniqueNames ? d.series.autoIncrement() : b ? a.indexOf(d.name) : u(a.keys[d.name], -1)); if (c === -1) { if (!b) var e = a.length } else {
          e =
c
        } typeof e !== 'undefined' && (this.names[e] = d.name, this.names.keys[d.name] = e); return e
      }; B.prototype.updateNames = function () {
        var d = this; var b = this.names; b.length > 0 && (Object.keys(b.keys).forEach(function (d) { delete b.keys[d] }), b.length = 0, this.minRange = this.userMinRange, (this.series || []).forEach(function (b) {
          b.xIncrement = null; if (!b.points || b.isDirtyData)d.max = Math.max(d.max, b.xData.length - 1), b.processData(), b.generatePoints(); b.data.forEach(function (a, c) {
            if (a && a.options && typeof a.name !== 'undefined') {
              var n = d.nameToX(a)
              typeof n !== 'undefined' && n !== a.x && (a.x = n, b.xData[c] = n)
            }
          })
        }))
      }; B.prototype.setAxisTranslation = function (d) {
        var b = this; var a = b.max - b.min; var c = b.axisPointRange || 0; var e = 0; var f = 0; var m = b.linkedParent; var p = !!b.categories; var h = b.transA; var w = b.isXAxis; if (w || p || c) {
          var C = b.getClosest(); m ? (e = m.minPointOffset, f = m.pointRangePadding) : b.series.forEach(function (d) {
            var a = p ? 1 : w ? u(d.options.pointRange, C, 0) : b.axisPointRange || 0; var n = d.options.pointPlacement; c = Math.max(c, a); if (!b.single || p) {
              d = d.is('xrange') ? !w : w, e = Math.max(e, d && l(n) ? 0 : a / 2), f = Math.max(f,
                d && n === 'on' ? 0 : a)
            }
          }); m = b.ordinal && b.ordinal.slope && C ? b.ordinal.slope / C : 1; b.minPointOffset = e *= m; b.pointRangePadding = f *= m; b.pointRange = Math.min(c, b.single && p ? 1 : a); w && (b.closestPointRange = C)
        }d && (b.oldTransA = h); b.translationSlope = b.transA = h = b.staticScale || b.len / (a + f || 1); b.transB = b.horiz ? b.left : b.bottom; b.minPixelPadding = h * e; t(this, 'afterSetAxisTranslation')
      }; B.prototype.minFromRange = function () { return this.max - this.range }; B.prototype.setTickInterval = function (d) {
        var b = this; var n = b.chart; var e = b.logarithmic; var f = b.options
        var m = b.isXAxis; var p = b.isLinked; var h = f.maxPadding; var w = f.minPadding; var l = f.tickInterval; var C = f.tickPixelInterval; var F = b.categories; var B = a(b.threshold) ? b.threshold : null; var L = b.softThreshold; b.dateTime || F || p || this.getTickAmount(); var O = u(b.userMin, f.min); var q = u(b.userMax, f.max); if (p) { b.linkedParent = n[b.coll][f.linkedTo]; var z = b.linkedParent.getExtremes(); b.min = u(z.min, z.dataMin); b.max = u(z.max, z.dataMax); f.type !== b.linkedParent.options.type && D(11, 1, n) } else {
          if (!L && J(B)) if (b.dataMin >= B)z = B, w = 0; else if (b.dataMax <= B) { var g = B; h = 0 }b.min =
u(O, z, b.dataMin); b.max = u(q, g, b.dataMax)
        }e && (b.positiveValuesOnly && !d && Math.min(b.min, u(b.dataMin, b.min)) <= 0 && D(10, 1, n), b.min = I(e.log2lin(b.min), 16), b.max = I(e.log2lin(b.max), 16)); b.range && J(b.max) && (b.userMin = b.min = O = Math.max(b.dataMin, b.minFromRange()), b.userMax = q = b.max, b.range = null); t(b, 'foundExtremes'); b.beforePadding && b.beforePadding(); b.adjustForMinRange(); !(F || b.axisPointRange || b.stacking && b.stacking.usePercentage || p) && J(b.min) && J(b.max) && (n = b.max - b.min) && (!J(O) && w && (b.min -= n * w), !J(q) && h && (b.max +=
n * h)); a(b.userMin) || (a(f.softMin) && f.softMin < b.min && (b.min = O = f.softMin), a(f.floor) && (b.min = Math.max(b.min, f.floor))); a(b.userMax) || (a(f.softMax) && f.softMax > b.max && (b.max = q = f.softMax), a(f.ceiling) && (b.max = Math.min(b.max, f.ceiling))); L && J(b.dataMin) && (B = B || 0, !J(O) && b.min < B && b.dataMin >= B ? b.min = b.options.minRange ? Math.min(B, b.max - b.minRange) : B : !J(q) && b.max > B && b.dataMax <= B && (b.max = b.options.minRange ? Math.max(B, b.min + b.minRange) : B)); b.tickInterval = b.min === b.max || typeof b.min === 'undefined' || typeof b.max ===
'undefined' ? 1 : p && !l && C === b.linkedParent.options.tickPixelInterval ? l = b.linkedParent.tickInterval : u(l, this.tickAmount ? (b.max - b.min) / Math.max(this.tickAmount - 1, 1) : void 0, F ? 1 : (b.max - b.min) * C / Math.max(b.len, C)); m && !d && b.series.forEach(function (d) { d.processData(b.min !== b.oldMin || b.max !== b.oldMax) }); b.setAxisTranslation(!0); b.beforeSetTickPositions && b.beforeSetTickPositions(); b.ordinal && (b.tickInterval = b.ordinal.postProcessTickInterval(b.tickInterval)); b.pointRange && !l && (b.tickInterval = Math.max(b.pointRange,
          b.tickInterval)); d = u(f.minTickInterval, b.dateTime && b.closestPointRange); !l && b.tickInterval < d && (b.tickInterval = d); b.dateTime || b.logarithmic || l || (b.tickInterval = c(b.tickInterval, void 0, r(b.tickInterval), u(f.allowDecimals, b.tickInterval < 0.5 || void 0 !== this.tickAmount), !!this.tickAmount)); this.tickAmount || (b.tickInterval = b.unsquish()); this.setTickPositions()
      }; B.prototype.setTickPositions = function () {
        var d = this.options; var b = d.tickPositions; var a = this.getMinorTickInterval(); var c = d.tickPositioner; var e = this.hasVerticalPanning()
        var f = this.coll === 'colorAxis'; var m = (f || !e) && d.startOnTick; e = (f || !e) && d.endOnTick; this.tickmarkOffset = this.categories && d.tickmarkPlacement === 'between' && this.tickInterval === 1 ? 0.5 : 0; this.minorTickInterval = a === 'auto' && this.tickInterval ? this.tickInterval / 5 : a; this.single = this.min === this.max && J(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== d.allowDecimals); this.tickPositions = a = b && b.slice(); !a && (this.ordinal && this.ordinal.positions || !((this.max - this.min) / this.tickInterval > Math.max(2 * this.len,
          200)) ? a = this.dateTime ? this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(this.tickInterval, d.units), this.min, this.max, d.startOfWeek, this.ordinal && this.ordinal.positions, this.closestPointRange, !0) : this.logarithmic ? this.logarithmic.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max) : (a = [this.min, this.max], D(19, !1, this.chart)), a.length > this.len && (a = [a[0], a.pop()], a[0] === a[1] && (a.length = 1)), this.tickPositions = a, c && (c = c.apply(this,
          [this.min, this.max]))) && (this.tickPositions = a = c); this.paddedTicks = a.slice(0); this.trimTicks(a, m, e); this.isLinked || (this.single && a.length < 2 && !this.categories && !this.series.some(function (b) { return b.is('heatmap') && b.options.pointPlacement === 'between' }) && (this.min -= 0.5, this.max += 0.5), b || c || this.adjustTickAmount()); t(this, 'afterSetTickPositions')
      }; B.prototype.trimTicks = function (d, b, a) {
        var c = d[0]; var n = d[d.length - 1]; var e = !this.isOrdinal && this.minPointOffset || 0; t(this, 'trimTicks'); if (!this.isLinked) {
          if (b && -Infinity !==
c) this.min = c; else for (;this.min - e > d[0];)d.shift(); if (a) this.max = n; else for (;this.max + e < d[d.length - 1];)d.pop(); d.length === 0 && J(c) && !this.options.tickPositions && d.push((n + c) / 2)
        }
      }; B.prototype.alignToOthers = function () {
        var d = {}; var b; var a = this.options; !1 === this.chart.options.chart.alignTicks || !1 === a.alignTicks || !1 === a.startOnTick || !1 === a.endOnTick || this.logarithmic || this.chart[this.coll].forEach(function (a) {
          var c = a.options; c = [a.horiz ? c.left : c.top, c.width, c.height, c.pane].join(); a.series.length && (d[c] ? b = !0 : d[c] =
1)
        }); return b
      }; B.prototype.getTickAmount = function () { var d = this.options; var b = d.tickAmount; var a = d.tickPixelInterval; !J(d.tickInterval) && !b && this.len < a && !this.isRadial && !this.logarithmic && d.startOnTick && d.endOnTick && (b = 2); !b && this.alignToOthers() && (b = Math.ceil(this.len / a) + 1); b < 4 && (this.finalTickAmt = b, b = 5); this.tickAmount = b }; B.prototype.adjustTickAmount = function () {
        var d = this.options; var b = this.tickInterval; var a = this.tickPositions; var c = this.tickAmount; var e = this.finalTickAmt; var f = a && a.length; var m = u(this.threshold, this.softThreshold
          ? 0 : null); var p; if (this.hasData()) { if (f < c) { for (p = this.min; a.length < c;)a.length % 2 || p === m ? a.push(I(a[a.length - 1] + b)) : a.unshift(I(a[0] - b)); this.transA *= (f - 1) / (c - 1); this.min = d.startOnTick ? a[0] : Math.min(this.min, a[0]); this.max = d.endOnTick ? a[a.length - 1] : Math.max(this.max, a[a.length - 1]) } else f > c && (this.tickInterval *= 2, this.setTickPositions()); if (J(e)) { for (b = d = a.length; b--;)(e === 3 && b % 2 === 1 || e <= 2 && b > 0 && b < d - 1) && a.splice(b, 1); this.finalTickAmt = void 0 } }
      }; B.prototype.setScale = function () {
        var d; var b = !1; var a = !1; this.series.forEach(function (d) {
          var c
          b = b || d.isDirtyData || d.isDirty; a = a || ((c = d.xAxis) === null || void 0 === c ? void 0 : c.isDirty) || !1
        }); this.oldMin = this.min; this.oldMax = this.max; this.oldAxisLength = this.len; this.setAxisSize(); (d = this.len !== this.oldAxisLength) || b || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.stacking && this.stacking.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax,
        this.isDirty || (this.isDirty = d || this.min !== this.oldMin || this.max !== this.oldMax)) : this.stacking && this.stacking.cleanStacks(); b && this.panningState && (this.panningState.isDirty = !0); t(this, 'afterSetScale')
      }; B.prototype.setExtremes = function (d, b, a, c, e) { var n = this; var f = n.chart; a = u(a, !0); n.series.forEach(function (b) { delete b.kdTree }); e = z(e, { min: d, max: b }); t(n, 'setExtremes', e, function () { n.userMin = d; n.userMax = b; n.eventArgs = e; a && f.redraw(c) }) }; B.prototype.zoom = function (d, b) {
        var a = this; var c = this.dataMin; var e = this.dataMax
        var f = this.options; var m = Math.min(c, u(f.min, c)); var p = Math.max(e, u(f.max, e)); d = { newMin: d, newMax: b }; t(this, 'zoom', d, function (b) { var d = b.newMin; var n = b.newMax; if (d !== a.min || n !== a.max)a.allowZoomOutside || (J(c) && (d < m && (d = m), d > p && (d = p)), J(e) && (n < m && (n = m), n > p && (n = p))), a.displayBtn = typeof d !== 'undefined' || typeof n !== 'undefined', a.setExtremes(d, n, !1, void 0, { trigger: 'zoom' }); b.zoomed = !0 }); return d.zoomed
      }; B.prototype.setAxisSize = function () {
        var d = this.chart; var b = this.options; var a = b.offsets || [0, 0, 0, 0]; var c = this.horiz; var e = this.width = Math.round(L(u(b.width,
          d.plotWidth - a[3] + a[1]), d.plotWidth)); var f = this.height = Math.round(L(u(b.height, d.plotHeight - a[0] + a[2]), d.plotHeight)); var m = this.top = Math.round(L(u(b.top, d.plotTop + a[0]), d.plotHeight, d.plotTop)); b = this.left = Math.round(L(u(b.left, d.plotLeft + a[3]), d.plotWidth, d.plotLeft)); this.bottom = d.chartHeight - f - m; this.right = d.chartWidth - e - b; this.len = Math.max(c ? e : f, 0); this.pos = c ? b : m
      }; B.prototype.getExtremes = function () {
        var d = this.logarithmic; return {
          min: d ? I(d.lin2log(this.min)) : this.min,
          max: d ? I(d.lin2log(this.max)) : this.max,
          dataMin: this.dataMin,
          dataMax: this.dataMax,
          userMin: this.userMin,
          userMax: this.userMax
        }
      }; B.prototype.getThreshold = function (d) { var b = this.logarithmic; var a = b ? b.lin2log(this.min) : this.min; b = b ? b.lin2log(this.max) : this.max; d === null || -Infinity === d ? d = a : Infinity === d ? d = b : a > d ? d = a : b < d && (d = b); return this.translate(d, 0, 1, 0, 1) }; B.prototype.autoLabelAlign = function (d) {
        var b = (u(d, 0) - 90 * this.side + 720) % 360; d = { align: 'center' }; t(this, 'autoLabelAlign', d, function (d) { b > 15 && b < 165 ? d.align = 'right' : b > 195 && b < 345 && (d.align = 'left') })
        return d.align
      }; B.prototype.tickSize = function (d) { var b = this.options; var a = b[d === 'tick' ? 'tickLength' : 'minorTickLength']; var c = u(b[d === 'tick' ? 'tickWidth' : 'minorTickWidth'], d === 'tick' && this.isXAxis && !this.categories ? 1 : 0); if (c && a) { b[d + 'Position'] === 'inside' && (a = -a); var e = [a, c] }d = { tickSize: e }; t(this, 'afterTickSize', d); return d.tickSize }; B.prototype.labelMetrics = function () {
        var d = this.tickPositions && this.tickPositions[0] || 0; return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize,
          this.ticks[d] && this.ticks[d].label)
      }; B.prototype.unsquish = function () {
        var d = this.options.labels; var b = this.horiz; var a = this.tickInterval; var c = a; var e = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / a); var f; var m = d.rotation; var p = this.labelMetrics(); var h; var w = Number.MAX_VALUE; var l; var C = this.max - this.min; var F = function (b) { var d = b / (e || 1); d = d > 1 ? Math.ceil(d) : 1; d * a > C && Infinity !== b && Infinity !== e && C && (d = Math.ceil(C / a)); return I(d * a) }; b ? (l = !d.staggerLines && !d.step && (J(m) ? [m] : e < u(d.autoRotationLimit, 80) && d.autoRotation)) && l.forEach(function (b) {
          if (b ===
m || b && b >= -90 && b <= 90) { h = F(Math.abs(p.h / Math.sin(O * b))); var d = h + Math.abs(b / 360); d < w && (w = d, f = b, c = h) }
        }) : d.step || (c = F(p.h)); this.autoRotation = l; this.labelRotation = u(f, m); return c
      }; B.prototype.getSlotWidth = function (d) {
        var b; var c = this.chart; var e = this.horiz; var f = this.options.labels; var m = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1); var u = c.margin[3]; if (d && a(d.slotWidth)) return d.slotWidth; if (e && f && (f.step || 0) < 2) return f.rotation ? 0 : (this.staggerLines || 1) * this.len / m; if (!e) {
          d = (b = f === null || void 0 === f ? void 0
            : f.style) === null || void 0 === b ? void 0 : b.width; if (void 0 !== d) return parseInt(d, 10); if (u) return u - c.spacing[3]
        } return 0.33 * c.chartWidth
      }; B.prototype.renderUnsquish = function () {
        var d = this.chart; var b = d.renderer; var a = this.tickPositions; var c = this.ticks; var e = this.options.labels; var f = e && e.style || {}; var m = this.horiz; var u = this.getSlotWidth(); var p = Math.max(1, Math.round(u - 2 * (e.padding || 5))); var h = {}; var w = this.labelMetrics(); var C = e.style && e.style.textOverflow; var F = 0; l(e.rotation) || (h.rotation = e.rotation || 0); a.forEach(function (b) {
          b = c[b]; b.movedLabel && b.replaceMovedLabel()
          b && b.label && b.label.textPxLength > F && (F = b.label.textPxLength)
        }); this.maxLabelLength = F; if (this.autoRotation)F > p && F > w.h ? h.rotation = this.labelRotation : this.labelRotation = 0; else if (u) { var B = p; if (!C) { var L = 'clip'; for (p = a.length; !m && p--;) { var r = a[p]; if (r = c[r].label)r.styles && r.styles.textOverflow === 'ellipsis' ? r.css({ textOverflow: 'clip' }) : r.textPxLength > u && r.css({ width: u + 'px' }), r.getBBox().height > this.len / a.length - (w.h - w.f) && (r.specificTextOverflow = 'ellipsis') } } }h.rotation && (B = F > 0.5 * d.chartHeight ? 0.33 * d.chartHeight
          : F, C || (L = 'ellipsis')); if (this.labelAlign = e.align || this.autoLabelAlign(this.labelRotation))h.align = this.labelAlign; a.forEach(function (b) { var d = (b = c[b]) && b.label; var a = f.width; var e = {}; d && (d.attr(h), b.shortenLabel ? b.shortenLabel() : B && !a && f.whiteSpace !== 'nowrap' && (B < d.textPxLength || d.element.tagName === 'SPAN') ? (e.width = B + 'px', C || (e.textOverflow = d.specificTextOverflow || L), d.css(e)) : d.styles && d.styles.width && !e.width && !a && d.css({ width: null }), delete d.specificTextOverflow, b.rotation = h.rotation) }, this); this.tickRotCorr =
b.rotCorr(w.b, this.labelRotation || 0, this.side !== 0)
      }; B.prototype.hasData = function () { return this.series.some(function (d) { return d.hasData() }) || this.options.showEmpty && J(this.min) && J(this.max) }; B.prototype.addTitle = function (d) {
        var b = this.chart.renderer; var a = this.horiz; var c = this.opposite; var f = this.options.title; var m; var u = this.chart.styledMode; this.axisTitle || ((m = f.textAlign) || (m = (a ? { low: 'left', middle: 'center', high: 'right' } : { low: c ? 'right' : 'left', middle: 'center', high: c ? 'left' : 'right' })[f.align]), this.axisTitle = b.text(f.text,
          0, 0, f.useHTML).attr({ zIndex: 7, rotation: f.rotation || 0, align: m }).addClass('highcharts-axis-title'), u || this.axisTitle.css(e(f.style)), this.axisTitle.add(this.axisGroup), this.axisTitle.isNew = !0); u || f.style.width || this.isRadial || this.axisTitle.css({ width: this.len + 'px' }); this.axisTitle[d ? 'show' : 'hide'](d)
      }; B.prototype.generateTick = function (d) { var b = this.ticks; b[d] ? b[d].addLabel() : b[d] = new H(this, d) }; B.prototype.getOffset = function () {
        var d = this; var b = d.chart; var a = b.renderer; var c = d.options; var e = d.tickPositions; var f = d.ticks
        var p = d.horiz; var h = d.side; var w = b.inverted && !d.isZAxis ? [1, 0, 3, 2][h] : h; var l; var C = 0; var F = 0; var B = c.title; var r = c.labels; var L = 0; var O = b.axisOffset; b = b.clipOffset; var q = [-1, 1, 1, -1][h]; var z = c.className; var g = d.axisParent; var k = d.hasData(); d.showAxis = l = k || u(c.showEmpty, !0); d.staggerLines = d.horiz && r.staggerLines; d.axisGroup || (d.gridGroup = a.g('grid').attr({ zIndex: c.gridZIndex || 1 }).addClass('highcharts-' + this.coll.toLowerCase() + '-grid ' + (z || '')).add(g), d.axisGroup = a.g('axis').attr({ zIndex: c.zIndex || 2 }).addClass('highcharts-' + this.coll.toLowerCase() +
' ' + (z || '')).add(g), d.labelGroup = a.g('axis-labels').attr({ zIndex: r.zIndex || 7 }).addClass('highcharts-' + d.coll.toLowerCase() + '-labels ' + (z || '')).add(g)); k || d.isLinked ? (e.forEach(function (b, a) { d.generateTick(b, a) }), d.renderUnsquish(), d.reserveSpaceDefault = h === 0 || h === 2 || { 1: 'left', 3: 'right' }[h] === d.labelAlign, u(r.reserveSpace, d.labelAlign === 'center' ? !0 : null, d.reserveSpaceDefault) && e.forEach(function (b) { L = Math.max(f[b].getLabelSize(), L) }), d.staggerLines && (L *= d.staggerLines), d.labelOffset = L * (d.opposite
          ? -1 : 1)) : m(f, function (b, d) { b.destroy(); delete f[d] }); if (B && B.text && !1 !== B.enabled && (d.addTitle(l), l && !1 !== B.reserveSpace)) { d.titleOffset = C = d.axisTitle.getBBox()[p ? 'height' : 'width']; var y = B.offset; F = J(y) ? 0 : u(B.margin, p ? 5 : 10) }d.renderLine(); d.offset = q * u(c.offset, O[h] ? O[h] + (c.margin || 0) : 0); d.tickRotCorr = d.tickRotCorr || { x: 0, y: 0 }; a = h === 0 ? -d.labelMetrics().h : h === 2 ? d.tickRotCorr.y : 0; F = Math.abs(L) + F; L && (F = F - a + q * (p ? u(r.y, d.tickRotCorr.y + 8 * q) : r.x)); d.axisTitleMargin = u(y, F); d.getMaxLabelDimensions && (d.maxLabelDimensions =
d.getMaxLabelDimensions(f, e)); p = this.tickSize('tick'); O[h] = Math.max(O[h], d.axisTitleMargin + C + q * d.offset, F, e && e.length && p ? p[0] + q * d.offset : 0); c = c.offset ? 0 : 2 * Math.floor(d.axisLine.strokeWidth() / 2); b[w] = Math.max(b[w], c); t(this, 'afterGetOffset')
      }; B.prototype.getLinePath = function (d) {
        var b = this.chart; var a = this.opposite; var c = this.offset; var e = this.horiz; var f = this.left + (a ? this.width : 0) + c; c = b.chartHeight - this.bottom - (a ? this.height : 0) + c; a && (d *= -1); return b.renderer.crispLine([['M', e ? this.left : f, e ? c : this.top], ['L', e ? b.chartWidth -
this.right : f, e ? c : b.chartHeight - this.bottom]], d)
      }; B.prototype.renderLine = function () { this.axisLine || (this.axisLine = this.chart.renderer.path().addClass('highcharts-axis-line').add(this.axisGroup), this.chart.styledMode || this.axisLine.attr({ stroke: this.options.lineColor, 'stroke-width': this.options.lineWidth, zIndex: 7 })) }; B.prototype.getTitlePosition = function () {
        var d = this.horiz; var b = this.left; var a = this.top; var c = this.len; var e = this.options.title; var f = d ? b : a; var m = this.opposite; var u = this.offset; var p = e.x || 0; var h = e.y || 0; var w = this.axisTitle
        var l = this.chart.renderer.fontMetrics(e.style && e.style.fontSize, w); w = Math.max(w.getBBox(null, 0).height - l.h - 1, 0); c = { low: f + (d ? 0 : c), middle: f + c / 2, high: f + (d ? c : 0) }[e.align]; b = (d ? a + this.height : b) + (d ? 1 : -1) * (m ? -1 : 1) * this.axisTitleMargin + [-w, w, l.f, -w][this.side]; d = { x: d ? c + p : b + (m ? this.width : 0) + u + p, y: d ? b + h - (m ? this.height : 0) + u : c + h }; t(this, 'afterGetTitlePosition', { titlePosition: d }); return d
      }; B.prototype.renderMinorTick = function (d) {
        var b = this.chart.hasRendered && a(this.oldMin); var c = this.minorTicks; c[d] || (c[d] = new H(this,
          d, 'minor')); b && c[d].isNew && c[d].render(null, !0); c[d].render(null, !1, 1)
      }; B.prototype.renderTick = function (d, b) { var c = this.isLinked; var e = this.ticks; var f = this.chart.hasRendered && a(this.oldMin); if (!c || d >= this.min && d <= this.max)e[d] || (e[d] = new H(this, d)), f && e[d].isNew && e[d].render(b, !0, -1), e[d].render(b) }; B.prototype.render = function () {
        var d = this; var b = d.chart; var c = d.logarithmic; var e = d.options; var f = d.isLinked; var u = d.tickPositions; var h = d.axisTitle; var w = d.ticks; var l = d.minorTicks; var C = d.alternateBands; var F = e.stackLabels; var B = e.alternateGridColor
        var L = d.tickmarkOffset; var r = d.axisLine; var O = d.showAxis; var q = G(b.renderer.globalAnimation); var z; var k; d.labelEdge.length = 0; d.overlap = !1; [w, l, C].forEach(function (b) { m(b, function (b) { b.isActive = !1 }) }); if (d.hasData() || f) {
          d.minorTickInterval && !d.categories && d.getMinorTickPositions().forEach(function (b) { d.renderMinorTick(b) }), u.length && (u.forEach(function (b, a) { d.renderTick(b, a) }), L && (d.min === 0 || d.single) && (w[-1] || (w[-1] = new H(d, -1, null, !0)), w[-1].render(-1))), B && u.forEach(function (a, e) {
            k = typeof u[e + 1] !== 'undefined' ? u[e + 1] + L
              : d.max - L; e % 2 === 0 && a < d.max && k <= d.max + (b.polar ? -L : L) && (C[a] || (C[a] = new g.PlotLineOrBand(d)), z = a + L, C[a].options = { from: c ? c.lin2log(z) : z, to: c ? c.lin2log(k) : k, color: B }, C[a].render(), C[a].isActive = !0)
          }), d._addedPlotLB || ((e.plotLines || []).concat(e.plotBands || []).forEach(function (b) { d.addPlotBandOrLine(b) }), d._addedPlotLB = !0)
        }[w, l, C].forEach(function (d) {
          var a; var c = []; var e = q.duration; m(d, function (b, d) { b.isActive || (b.render(d, !1, 0), b.isActive = !1, c.push(d)) }); p(function () {
            for (a = c.length; a--;) {
              d[c[a]] && !d[c[a]].isActive &&
(d[c[a]].destroy(), delete d[c[a]])
            }
          }, d !== C && b.hasRendered && e ? e : 0)
        }); r && (r[r.isPlaced ? 'animate' : 'attr']({ d: this.getLinePath(r.strokeWidth()) }), r.isPlaced = !0, r[O ? 'show' : 'hide'](O)); h && O && (e = d.getTitlePosition(), a(e.y) ? (h[h.isNew ? 'attr' : 'animate'](e), h.isNew = !1) : (h.attr('y', -9999), h.isNew = !0)); F && F.enabled && d.stacking && d.stacking.renderStackTotals(); d.isDirty = !1; t(this, 'afterRender')
      }; B.prototype.redraw = function () {
        this.visible && (this.render(), this.plotLinesAndBands.forEach(function (d) { d.render() })); this.series.forEach(function (d) {
          d.isDirty =
!0
        })
      }; B.prototype.getKeepProps = function () { return this.keepProps || B.keepProps }; B.prototype.destroy = function (d) {
        var b = this; var a = b.plotLinesAndBands; var c; t(this, 'destroy', { keepEvents: d }); d || F(b); [b.ticks, b.minorTicks, b.alternateBands].forEach(function (b) { E(b) }); if (a) for (d = a.length; d--;)a[d].destroy(); 'axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar'.split(' ').forEach(function (d) { b[d] && (b[d] = b[d].destroy()) }); for (c in b.plotLinesAndBandsGroups)b.plotLinesAndBandsGroups[c] = b.plotLinesAndBandsGroups[c].destroy()
        m(b, function (d, a) { b.getKeepProps().indexOf(a) === -1 && delete b[a] })
      }; B.prototype.drawCrosshair = function (d, b) {
        var a = this.crosshair; var c = u(a.snap, !0); var e; var f = this.cross; var m = this.chart; t(this, 'drawCrosshair', { e: d, point: b }); d || (d = this.cross && this.cross.e); if (this.crosshair && !1 !== (J(b) || !c)) {
          c ? J(b) && (e = u(this.coll !== 'colorAxis' ? b.crosshairPos : null, this.isXAxis ? b.plotX : this.len - b.plotY)) : e = d && (this.horiz ? d.chartX - this.pos : this.len - d.chartY + this.pos); if (J(e)) {
            var p = { value: b && (this.isXAxis ? b.x : u(b.stackY, b.y)), translatedValue: e }
            m.polar && z(p, { isCrosshair: !0, chartX: d && d.chartX, chartY: d && d.chartY, point: b }); p = this.getPlotLinePath(p) || null
          } if (!J(p)) { this.hideCrosshair(); return }c = this.categories && !this.isRadial; f || (this.cross = f = m.renderer.path().addClass('highcharts-crosshair highcharts-crosshair-' + (c ? 'category ' : 'thin ') + a.className).attr({ zIndex: u(a.zIndex, 2) }).add(), m.styledMode || (f.attr({ stroke: a.color || (c ? k.parse('#ccd6eb').setOpacity(0.25).get() : '#cccccc'), 'stroke-width': u(a.width, 1) }).css({ 'pointer-events': 'none' }), a.dashStyle &&
f.attr({ dashstyle: a.dashStyle }))); f.show().attr({ d: p }); c && !a.width && f.attr({ 'stroke-width': this.transA }); this.cross.e = d
        } else this.hideCrosshair(); t(this, 'afterDrawCrosshair', { e: d, point: b })
      }; B.prototype.hideCrosshair = function () { this.cross && this.cross.hide(); t(this, 'afterHideCrosshair') }; B.prototype.hasVerticalPanning = function () { var d, b; return /y/.test(((b = (d = this.chart.options.chart) === null || void 0 === d ? void 0 : d.panning) === null || void 0 === b ? void 0 : b.type) || '') }; B.defaultOptions = {
        dateTimeLabelFormats: {
          millisecond: {
            main: '%H:%M:%S.%L',
            range: !1
          },
          second: { main: '%H:%M:%S', range: !1 },
          minute: { main: '%H:%M', range: !1 },
          hour: { main: '%H:%M', range: !1 },
          day: { main: '%e. %b' },
          week: { main: '%e. %b' },
          month: { main: "%b '%y" },
          year: { main: '%Y' }
        },
        endOnTick: !1,
        labels: { enabled: !0, indentation: 10, x: 0, style: { color: '#666666', cursor: 'default', fontSize: '11px' } },
        maxPadding: 0.01,
        minorTickLength: 2,
        minorTickPosition: 'outside',
        minPadding: 0.01,
        showEmpty: !0,
        startOfWeek: 1,
        startOnTick: !1,
        tickLength: 10,
        tickPixelInterval: 100,
        tickmarkPlacement: 'between',
        tickPosition: 'outside',
        title: {
          align: 'middle',
          style: { color: '#666666' }
        },
        type: 'linear',
        minorGridLineColor: '#f2f2f2',
        minorGridLineWidth: 1,
        minorTickColor: '#999999',
        lineColor: '#ccd6eb',
        lineWidth: 1,
        gridLineColor: '#e6e6e6',
        tickColor: '#ccd6eb'
      }; B.defaultYAxisOptions = {
        endOnTick: !0,
        maxPadding: 0.05,
        minPadding: 0.05,
        tickPixelInterval: 72,
        showLastLabel: !0,
        labels: { x: -8 },
        startOnTick: !0,
        title: { rotation: 270, text: 'Values' },
        stackLabels: {
          allowOverlap: !1,
          enabled: !1,
          crop: !0,
          overflow: 'justify',
          formatter: function () {
            var d = this.axis.chart.numberFormatter; return d(this.total,
              -1)
          },
          style: { color: '#000000', fontSize: '11px', fontWeight: 'bold', textOutline: '1px contrast' }
        },
        gridLineWidth: 1,
        lineWidth: 0
      }; B.defaultLeftAxisOptions = { labels: { x: -15 }, title: { rotation: 270 } }; B.defaultRightAxisOptions = { labels: { x: 15 }, title: { rotation: 90 } }; B.defaultBottomAxisOptions = { labels: { autoRotation: [-45], x: 0 }, margin: 15, title: { rotation: 0 } }; B.defaultTopAxisOptions = { labels: { autoRotation: [-45], x: 0 }, margin: 15, title: { rotation: 0 } }; B.keepProps = 'extKey hcEvents names series userMax userMin'.split(' '); return B
    }())
    g.Axis = v; return g.Axis
  }); P(A, 'parts/DateTimeAxis.js', [A['parts/Axis.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.addEvent; var v = g.getMagnitude; var K = g.normalizeTickInterval; var G = g.timeUnits; var N = (function () {
      function g (g) { this.axis = g }g.prototype.normalizeTimeTickInterval = function (g, k) {
        var y = k || [['millisecond', [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ['second', [1, 2, 5, 10, 15, 30]], ['minute', [1, 2, 5, 10, 15, 30]], ['hour', [1, 2, 3, 4, 6, 8, 12]], ['day', [1, 2]], ['week', [1, 2]], ['month', [1, 2, 3, 4, 6]], ['year', null]]; k = y[y.length - 1]; var E =
G[k[0]]; var D = k[1]; var z; for (z = 0; z < y.length && !(k = y[z], E = G[k[0]], D = k[1], y[z + 1] && g <= (E * D[D.length - 1] + G[y[z + 1][0]]) / 2); z++);E === G.year && g < 5 * E && (D = [1, 2, 5]); g = K(g / E, D, k[0] === 'year' ? Math.max(v(g / E), 1) : 1); return { unitRange: E, count: g, unitName: k[0] }
      }; return g
    }()); g = (function () {
      function g () {}g.compose = function (g) {
        g.keepProps.push('dateTime'); g.prototype.getTimeTicks = function () { return this.chart.time.getTimeTicks.apply(this.chart.time, arguments) }; H(g, 'init', function (g) {
          g.userOptions.type !== 'datetime' ? this.dateTime = void 0
            : this.dateTime || (this.dateTime = new N(this))
        })
      }; g.AdditionsClass = N; return g
    }()); g.compose(k); return g
  }); P(A, 'parts/LogarithmicAxis.js', [A['parts/Axis.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.addEvent; var v = g.getMagnitude; var K = g.normalizeTickInterval; var G = g.pick; var N = (function () {
      function g (g) { this.axis = g }g.prototype.getLogTickPositions = function (g, k, J, E) {
        var y = this.axis; var z = y.len; var t = y.options; var q = []; E || (this.minorAutoInterval = void 0); if (g >= 0.5)g = Math.round(g), q = y.getLinearTickPositions(g, k, J); else if (g >= 0.08) {
          t =
Math.floor(k); var r, h; for (z = g > 0.3 ? [1, 2, 4] : g > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; t < J + 1 && !h; t++) { var f = z.length; for (r = 0; r < f && !h; r++) { var a = this.log2lin(this.lin2log(t) * z[r]); a > k && (!E || l <= J) && typeof l !== 'undefined' && q.push(l); l > J && (h = !0); var l = a } }
        } else {
          k = this.lin2log(k), J = this.lin2log(J), g = E ? y.getMinorTickInterval() : t.tickInterval, g = G(g === 'auto' ? null : g, this.minorAutoInterval, t.tickPixelInterval / (E ? 5 : 1) * (J - k) / ((E ? z / y.tickPositions.length : z) || 1)), g = K(g, void 0, v(g)), q = y.getLinearTickPositions(g, k, J).map(this.log2lin),
          E || (this.minorAutoInterval = g / 5)
        }E || (y.tickInterval = g); return q
      }; g.prototype.lin2log = function (g) { return Math.pow(10, g) }; g.prototype.log2lin = function (g) { return Math.log(g) / Math.LN10 }; return g
    }()); g = (function () {
      function g () {}g.compose = function (g) {
        g.keepProps.push('logarithmic'); var k = g.prototype; var y = N.prototype; k.log2lin = y.log2lin; k.lin2log = y.lin2log; H(g, 'init', function (g) {
          var k = this.logarithmic; g.userOptions.type !== 'logarithmic' ? this.logarithmic = void 0 : (k || (k = this.logarithmic = new N(this)), this.log2lin !==
k.log2lin && (k.log2lin = this.log2lin.bind(this)), this.lin2log !== k.lin2log && (k.lin2log = this.lin2log.bind(this)))
        }); H(g, 'afterInit', function () { var g = this.logarithmic; g && (this.lin2val = function (k) { return g.lin2log(k) }, this.val2lin = function (k) { return g.log2lin(k) }) })
      }; return g
    }()); g.compose(k); return g
  }); P(A, 'parts/PlotLineOrBand.js', [A['parts/Globals.js'], A['parts/Axis.js'], A['parts/Utilities.js']], function (k, g, H) {
    var v = H.arrayMax; var K = H.arrayMin; var G = H.defined; var N = H.destroyObjectProperties; var M = H.erase; var y = H.extend
    var I = H.merge; var J = H.objectEach; var E = H.pick; var D = (function () {
      function g (t, q) { this.axis = t; q && (this.options = q, this.id = q.id) }g.prototype.render = function () {
        k.fireEvent(this, 'render'); var t = this; var q = t.axis; var r = q.horiz; var h = q.logarithmic; var f = t.options; var a = f.label; var l = t.label; var e = f.to; var c = f.from; var m = f.value; var u = G(c) && G(e); var L = G(m); var F = t.svgElem; var w = !F; var p = []; var C = f.color; var O = E(f.zIndex, 0); var B = f.events; p = { class: 'highcharts-plot-' + (u ? 'band ' : 'line ') + (f.className || '') }; var d = {}; var b = q.chart.renderer; var n = u ? 'bands' : 'lines'; h && (c = h.log2lin(c), e = h.log2lin(e), m =
h.log2lin(m)); q.chart.styledMode || (L ? (p.stroke = C || '#999999', p['stroke-width'] = E(f.width, 1), f.dashStyle && (p.dashstyle = f.dashStyle)) : u && (p.fill = C || '#e6ebf5', f.borderWidth && (p.stroke = f.borderColor, p['stroke-width'] = f.borderWidth))); d.zIndex = O; n += '-' + O; (h = q.plotLinesAndBandsGroups[n]) || (q.plotLinesAndBandsGroups[n] = h = b.g('plot-' + n).attr(d).add()); w && (t.svgElem = F = b.path().attr(p).add(h)); if (L)p = q.getPlotLinePath({ value: m, lineWidth: F.strokeWidth(), acrossPanes: f.acrossPanes }); else if (u) {
          p = q.getPlotBandPath(c,
            e, f)
        } else return; (w || !F.d) && p && p.length ? (F.attr({ d: p }), B && J(B, function (b, d) { F.on(d, function (b) { B[d].apply(t, [b]) }) })) : F && (p ? (F.show(!0), F.animate({ d: p })) : F.d && (F.hide(), l && (t.label = l = l.destroy()))); a && (G(a.text) || G(a.formatter)) && p && p.length && q.width > 0 && q.height > 0 && !p.isFlat ? (a = I({ align: r && u && 'center', x: r ? !u && 4 : 10, verticalAlign: !r && u && 'middle', y: r ? u ? 16 : 10 : u ? 6 : -4, rotation: r && !u && 90 }, a), this.renderLabel(a, p, u, O)) : l && l.hide(); return t
      }; g.prototype.renderLabel = function (t, q, r, h) {
        var f = this.label; var a = this.axis.chart.renderer
        f || (f = { align: t.textAlign || t.align, rotation: t.rotation, class: 'highcharts-plot-' + (r ? 'band' : 'line') + '-label ' + (t.className || '') }, f.zIndex = h, h = this.getLabelText(t), this.label = f = a.text(h, 0, 0, t.useHTML).attr(f).add(), this.axis.chart.styledMode || f.css(t.style)); a = q.xBounds || [q[0][1], q[1][1], r ? q[2][1] : q[0][1]]; q = q.yBounds || [q[0][2], q[1][2], r ? q[2][2] : q[0][2]]; r = K(a); h = K(q); f.align(t, !1, { x: r, y: h, width: v(a) - r, height: v(q) - h }); f.show(!0)
      }; g.prototype.getLabelText = function (t) {
        return G(t.formatter) ? t.formatter.call(this)
          : t.text
      }; g.prototype.destroy = function () { M(this.axis.plotLinesAndBands, this); delete this.axis; N(this) }; return g
    }()); y(g.prototype, {
      getPlotBandPath: function (g, t) {
        var q = this.getPlotLinePath({ value: t, force: !0, acrossPanes: this.options.acrossPanes }); var r = this.getPlotLinePath({ value: g, force: !0, acrossPanes: this.options.acrossPanes }); var h = []; var f = this.horiz; var a = 1; g = g < this.min && t < this.min || g > this.max && t > this.max; if (r && q) {
          if (g) { var l = r.toString() === q.toString(); a = 0 } for (g = 0; g < r.length; g += 2) {
            t = r[g]; var e = r[g + 1]; var c = q[g]; var m = q[g +
1]; t[0] !== 'M' && t[0] !== 'L' || e[0] !== 'M' && e[0] !== 'L' || c[0] !== 'M' && c[0] !== 'L' || m[0] !== 'M' && m[0] !== 'L' || (f && c[1] === t[1] ? (c[1] += a, m[1] += a) : f || c[2] !== t[2] || (c[2] += a, m[2] += a), h.push(['M', t[1], t[2]], ['L', e[1], e[2]], ['L', m[1], m[2]], ['L', c[1], c[2]], ['Z'])); h.isFlat = l
          }
        } return h
      },
      addPlotBand: function (g) { return this.addPlotBandOrLine(g, 'plotBands') },
      addPlotLine: function (g) { return this.addPlotBandOrLine(g, 'plotLines') },
      addPlotBandOrLine: function (g, t) {
        var q = (new D(this, g)).render(); var r = this.userOptions; if (q) {
          if (t) {
            var h =
r[t] || []; h.push(g); r[t] = h
          } this.plotLinesAndBands.push(q)
        } return q
      },
      removePlotBandOrLine: function (g) { for (var t = this.plotLinesAndBands, q = this.options, r = this.userOptions, h = t.length; h--;)t[h].id === g && t[h].destroy(); [q.plotLines || [], r.plotLines || [], q.plotBands || [], r.plotBands || []].forEach(function (f) { for (h = f.length; h--;)(f[h] || {}).id === g && M(f, f[h]) }) },
      removePlotBand: function (g) { this.removePlotBandOrLine(g) },
      removePlotLine: function (g) { this.removePlotBandOrLine(g) }
    }); k.PlotLineOrBand = D; return k.PlotLineOrBand
  })
  P(A, 'parts/Tooltip.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.clamp; var v = g.css; var K = g.defined; var G = g.discardElement; var N = g.extend; var M = g.fireEvent; var y = g.format; var I = g.isNumber; var J = g.isString; var E = g.merge; var D = g.pick; var z = g.splat; var t = g.syncTimeout; var q = g.timeUnits; ''; var r = k.doc; var h = (function () {
      function f (a, f) { this.crosshairs = []; this.distance = 0; this.isHidden = !0; this.isSticky = !1; this.now = {}; this.options = {}; this.outside = !1; this.chart = a; this.init(a, f) }f.prototype.applyFilter = function () {
        var a = this.chart; a.renderer.definition({
          tagName: 'filter',
          id: 'drop-shadow-' + a.index,
          opacity: 0.5,
          children: [{ tagName: 'feGaussianBlur', in: 'SourceAlpha', stdDeviation: 1 }, { tagName: 'feOffset', dx: 1, dy: 1 }, { tagName: 'feComponentTransfer', children: [{ tagName: 'feFuncA', type: 'linear', slope: 0.3 }] }, { tagName: 'feMerge', children: [{ tagName: 'feMergeNode' }, { tagName: 'feMergeNode', in: 'SourceGraphic' }] }]
        }); a.renderer.definition({ tagName: 'style', textContent: '.highcharts-tooltip-' + a.index + '{filter:url(#drop-shadow-' + a.index + ')}' })
      }; f.prototype.bodyFormatter = function (a) {
        return a.map(function (a) {
          var e =
a.series.tooltipOptions; return (e[(a.point.formatPrefix || 'point') + 'Formatter'] || a.point.tooltipFormatter).call(a.point, e[(a.point.formatPrefix || 'point') + 'Format'] || '')
        })
      }; f.prototype.cleanSplit = function (a) { this.chart.series.forEach(function (f) { var e = f && f.tt; e && (!e.isActive || a ? f.tt = e.destroy() : e.isActive = !1) }) }; f.prototype.defaultFormatter = function (a) {
        var f = this.points || z(this); var e = [a.tooltipFooterHeaderFormatter(f[0])]; e = e.concat(a.bodyFormatter(f)); e.push(a.tooltipFooterHeaderFormatter(f[0], !0))
        return e
      }; f.prototype.destroy = function () { this.label && (this.label = this.label.destroy()); this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy()); this.renderer && (this.renderer = this.renderer.destroy(), G(this.container)); g.clearTimeout(this.hideTimer); g.clearTimeout(this.tooltipTimeout) }; f.prototype.getAnchor = function (a, f) {
        var e = this.chart; var c = e.pointer; var m = e.inverted; var u = e.plotTop; var h = e.plotLeft; var l = 0; var w = 0; var p; var C; a = z(a); this.followPointer && f ? (typeof f.chartX === 'undefined' && (f = c.normalize(f)),
        a = [f.chartX - h, f.chartY - u]) : a[0].tooltipPos ? a = a[0].tooltipPos : (a.forEach(function (a) { p = a.series.yAxis; C = a.series.xAxis; l += a.plotX + (!m && C ? C.left - h : 0); w += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!m && p ? p.top - u : 0) }), l /= a.length, w /= a.length, a = [m ? e.plotWidth - w : l, this.shared && !m && a.length > 1 && f ? f.chartY - u : m ? e.plotHeight - l : w]); return a.map(Math.round)
      }; f.prototype.getDateFormat = function (a, f, e, c) {
        var m = this.chart.time; var u = m.dateFormat('%m-%d %H:%M:%S.%L', f); var h = { millisecond: 15, second: 12, minute: 9, hour: 6, day: 3 }
        var l = 'millisecond'; for (w in q) { if (a === q.week && +m.dateFormat('%w', f) === e && u.substr(6) === '00:00:00.000') { var w = 'week'; break } if (q[w] > a) { w = l; break } if (h[w] && u.substr(h[w]) !== '01-01 00:00:00.000'.substr(h[w])) break; w !== 'week' && (l = w) } if (w) var p = m.resolveDTLFormat(c[w]).main; return p
      }; f.prototype.getLabel = function () {
        var a; var f; var e = this; var c = this.chart.renderer; var m = this.chart.styledMode; var u = this.options; var h = 'tooltip' + (K(u.className) ? ' ' + u.className : ''); var F = ((a = u.style) === null || void 0 === a ? void 0 : a.pointerEvents) || (!this.followPointer &&
u.stickOnContact ? 'auto' : 'none'); var w; a = function () { e.inContact = !0 }; var p = function () { var a = e.chart.hoverSeries; e.inContact = !1; if (a && a.onMouseOut)a.onMouseOut() }; if (!this.label) {
          this.outside && (this.container = w = k.doc.createElement('div'), w.className = 'highcharts-tooltip-container', v(w, { position: 'absolute', top: '1px', pointerEvents: F, zIndex: 3 }), k.doc.body.appendChild(w), this.renderer = c = new k.Renderer(w, 0, 0, (f = this.chart.options.chart) === null || void 0 === f ? void 0 : f.style, void 0, void 0, c.styledMode)); this.split
            ? this.label = c.g(h) : (this.label = c.label('', 0, 0, u.shape || 'callout', null, null, u.useHTML, null, h).attr({ padding: u.padding, r: u.borderRadius }), m || this.label.attr({ fill: u.backgroundColor, 'stroke-width': u.borderWidth }).css(u.style).css({ pointerEvents: F }).shadow(u.shadow)); m && (this.applyFilter(), this.label.addClass('highcharts-tooltip-' + this.chart.index)); if (e.outside && !e.split) {
            var C = { x: this.label.xSetter, y: this.label.ySetter }; this.label.xSetter = function (a, c) {
              C[c].call(this.label, e.distance); w.style.left = a +
'px'
            }; this.label.ySetter = function (a, c) { C[c].call(this.label, e.distance); w.style.top = a + 'px' }
          } this.label.on('mouseenter', a).on('mouseleave', p).attr({ zIndex: 8 }).add()
        } return this.label
      }; f.prototype.getPosition = function (a, f, e) {
        var c = this.chart; var m = this.distance; var u = {}; var h = c.inverted && e.h || 0; var l; var w = this.outside; var p = w ? r.documentElement.clientWidth - 2 * m : c.chartWidth; var C = w ? Math.max(r.body.scrollHeight, r.documentElement.scrollHeight, r.body.offsetHeight, r.documentElement.offsetHeight, r.documentElement.clientHeight) : c.chartHeight
        var t = c.pointer.getChartPosition(); var B = c.containerScaling; var d = function (b) { return B ? b * B.scaleX : b }; var b = function (b) { return B ? b * B.scaleY : b }; var n = function (n) { var u = n === 'x'; return [n, u ? p : C, u ? a : f].concat(w ? [u ? d(a) : b(f), u ? t.left - m + d(e.plotX + c.plotLeft) : t.top - m + b(e.plotY + c.plotTop), 0, u ? p : C] : [u ? a : f, u ? e.plotX + c.plotLeft : e.plotY + c.plotTop, u ? c.plotLeft : c.plotTop, u ? c.plotLeft + c.plotWidth : c.plotTop + c.plotHeight]) }; var x = n('y'); var q = n('x'); var g = !this.followPointer && D(e.ttBelow, !c.inverted === !!e.negative); var z = function (a, c, e, f, n, p, w) {
          var x =
a === 'y' ? b(m) : d(m); var l = (e - f) / 2; var C = f < n - m; var F = n + m + f < c; var B = n - x - e + l; n = n + x - l; if (g && F)u[a] = n; else if (!g && C)u[a] = B; else if (C)u[a] = Math.min(w - f, B - h < 0 ? B : B - h); else if (F)u[a] = Math.max(p, n + h + e > c ? n : n + h); else return !1
        }; var k = function (b, d, a, c, e) { var f; e < m || e > d - m ? f = !1 : u[b] = e < a / 2 ? 1 : e > d - c / 2 ? d - c - 2 : e - a / 2; return f }; var y = function (b) { var d = x; x = q; q = d; l = b }; var E = function () { !1 !== z.apply(0, x) ? !1 !== k.apply(0, q) || l || (y(!0), E()) : l ? u.x = u.y = 0 : (y(!0), E()) }; (c.inverted || this.len > 1) && y(); E(); return u
      }; f.prototype.getXDateFormat = function (a, f, e) {
        f = f.dateTimeLabelFormats
        var c = e && e.closestPointRange; return (c ? this.getDateFormat(c, a.x, e.options.startOfWeek, f) : f.day) || f.year
      }; f.prototype.hide = function (a) { var f = this; g.clearTimeout(this.hideTimer); a = D(a, this.options.hideDelay, 500); this.isHidden || (this.hideTimer = t(function () { f.getLabel().fadeOut(a ? void 0 : a); f.isHidden = !0 }, a)) }; f.prototype.init = function (a, f) {
        this.chart = a; this.options = f; this.crosshairs = []; this.now = { x: 0, y: 0 }; this.isHidden = !0; this.split = f.split && !a.inverted && !a.polar; this.shared = f.shared || this.split; this.outside =
D(f.outside, !(!a.scrollablePixelsX && !a.scrollablePixelsY))
      }; f.prototype.isStickyOnContact = function () { return !(this.followPointer || !this.options.stickOnContact || !this.inContact) }; f.prototype.move = function (a, f, e, c) {
        var m = this; var u = m.now; var h = !1 !== m.options.animation && !m.isHidden && (Math.abs(a - u.x) > 1 || Math.abs(f - u.y) > 1); var l = m.followPointer || m.len > 1; N(u, { x: h ? (2 * u.x + a) / 3 : a, y: h ? (u.y + f) / 2 : f, anchorX: l ? void 0 : h ? (2 * u.anchorX + e) / 3 : e, anchorY: l ? void 0 : h ? (u.anchorY + c) / 2 : c }); m.getLabel().attr(u); m.drawTracker(); h && (g.clearTimeout(this.tooltipTimeout),
        this.tooltipTimeout = setTimeout(function () { m && m.move(a, f, e, c) }, 32))
      }; f.prototype.refresh = function (a, f) {
        var e = this.chart; var c = this.options; var m = a; var u = {}; var h = []; var l = c.formatter || this.defaultFormatter; u = this.shared; var w = e.styledMode; if (c.enabled) {
          g.clearTimeout(this.hideTimer); this.followPointer = z(m)[0].series.tooltipOptions.followPointer; var p = this.getAnchor(m, f); f = p[0]; var C = p[1]; !u || m.series && m.series.noSharedTooltip ? u = m.getLabelConfig() : (e.pointer.applyInactiveState(m), m.forEach(function (a) {
            a.setState('hover')
            h.push(a.getLabelConfig())
          }), u = { x: m[0].category, y: m[0].y }, u.points = h, m = m[0]); this.len = h.length; e = l.call(u, this); l = m.series; this.distance = D(l.tooltipOptions.distance, 16); !1 === e ? this.hide() : (this.split ? this.renderSplit(e, z(a)) : (a = this.getLabel(), c.style.width && !w || a.css({ width: this.chart.spacingBox.width + 'px' }), a.attr({ text: e && e.join ? e.join('') : e }), a.removeClass(/highcharts-color-[\d]+/g).addClass('highcharts-color-' + D(m.colorIndex, l.colorIndex)), w || a.attr({ stroke: c.borderColor || m.color || l.color || '#666666' }),
          this.updatePosition({ plotX: f, plotY: C, negative: m.negative, ttBelow: m.ttBelow, h: p[2] || 0 })), this.isHidden && this.label && this.label.attr({ opacity: 1 }).show(), this.isHidden = !1); M(this, 'refresh')
        }
      }; f.prototype.renderSplit = function (a, f) {
        function e (b, d, a, c, e) { void 0 === e && (e = !0); a ? (d = y ? 0 : I, b = H(b - c / 2, g.left, g.right - c)) : (d -= E, b = e ? b - c - x : b + x, b = H(b, e ? b : g.left, g.right)); return { x: b, y: d } } var c = this; var m = c.chart; var u = c.chart; var h = u.plotHeight; var l = u.plotLeft; var w = u.plotTop; var p = u.pointer; var C = u.renderer; var r = u.scrollablePixelsY; var B = void 0 === r
          ? 0 : r; r = u.scrollingContainer; r = void 0 === r ? { scrollLeft: 0, scrollTop: 0 } : r; var d = r.scrollLeft; var b = r.scrollTop; var n = u.styledMode; var x = c.distance; var q = c.options; var t = c.options.positioner; var g = { left: d, right: d + u.chartWidth, top: b, bottom: b + u.chartHeight }; var z = c.getLabel(); var y = !(!m.xAxis[0] || !m.xAxis[0].opposite); var E = w + b; var v = 0; var I = h - B; J(a) && (a = [!1, a]); a = a.slice(0, f.length + 1).reduce(function (d, a, m) {
          if (!1 !== a && a !== '') {
            m = f[m - 1] || { isHeader: !0, plotX: f[0].plotX, plotY: h, series: {} }; var u = m.isHeader; var p = u ? c : m.series; var F = p.tt; var r = m.isHeader; var L = m.series
            var O = 'highcharts-color-' + D(m.colorIndex, L.colorIndex, 'none'); F || (F = { padding: q.padding, r: q.borderRadius }, n || (F.fill = q.backgroundColor, F['stroke-width'] = q.borderWidth), F = C.label('', 0, 0, q[r ? 'headerShape' : 'shape'] || 'callout', void 0, void 0, q.useHTML).addClass((r ? 'highcharts-tooltip-header ' : '') + 'highcharts-tooltip-box ' + O).attr(F).add(z)); F.isActive = !0; F.attr({ text: a }); n || F.css(q.style).shadow(q.shadow).attr({ stroke: q.borderColor || m.color || L.color || '#333333' }); a = p.tt = F; r = a.getBBox(); p = r.width + a.strokeWidth()
            u && (v = r.height, I += v, y && (E -= v)); L = m.plotX; L = void 0 === L ? 0 : L; O = m.plotY; O = void 0 === O ? 0 : O; var k = m.series; if (m.isHeader) { L = l + L; var Q = w + h / 2 } else F = k.xAxis, k = k.yAxis, L = F.pos + H(L, -x, F.len + x), k.pos + O >= b + w && k.pos + O <= b + w + h - B && (Q = k.pos + O); L = H(L, g.left - x, g.right + x); typeof Q === 'number' ? (r = r.height + 1, O = t ? t.call(c, p, r, m) : e(L, Q, u, p), d.push({ align: t ? 0 : void 0, anchorX: L, anchorY: Q, boxWidth: p, point: m, rank: D(O.rank, u ? 1 : 0), size: r, target: O.y, tt: a, x: O.x })) : a.isActive = !1
          } return d
        }, []); !t && a.some(function (b) { return b.x < g.left }) &&
(a = a.map(function (b) { var d = e(b.anchorX, b.anchorY, b.point.isHeader, b.boxWidth, !1); return N(b, { target: d.y, x: d.x }) })); c.cleanSplit(); k.distribute(a, I); a.forEach(function (b) { var d = b.pos; b.tt.attr({ visibility: typeof d === 'undefined' ? 'hidden' : 'inherit', x: b.x, y: d + E, anchorX: b.anchorX, anchorY: b.anchorY }) }); a = c.container; m = c.renderer; c.outside && a && m && (u = z.getBBox(), m.setSize(u.width + u.x, u.height + u.y, !1), p = p.getChartPosition(), a.style.left = p.left + 'px', a.style.top = p.top + 'px')
      }; f.prototype.drawTracker = function () {
        if (this.followPointer ||
!this.options.stickOnContact) this.tracker && this.tracker.destroy(); else {
          var a = this.chart; var f = this.label; var e = a.hoverPoint; if (f && e) {
            var c = { x: 0, y: 0, width: 0, height: 0 }; e = this.getAnchor(e); var m = f.getBBox(); e[0] += a.plotLeft - f.translateX; e[1] += a.plotTop - f.translateY; c.x = Math.min(0, e[0]); c.y = Math.min(0, e[1]); c.width = e[0] < 0 ? Math.max(Math.abs(e[0]), m.width - e[0]) : Math.max(Math.abs(e[0]), m.width); c.height = e[1] < 0 ? Math.max(Math.abs(e[1]), m.height - Math.abs(e[1])) : Math.max(Math.abs(e[1]), m.height); this.tracker ? this.tracker.attr(c)
              : (this.tracker = f.renderer.rect(c).addClass('highcharts-tracker').add(f), a.styledMode || this.tracker.attr({ fill: 'rgba(0,0,0,0)' }))
          }
        }
      }; f.prototype.styledModeFormat = function (a) { return a.replace('style="font-size: 10px"', 'class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g, 'class="highcharts-color-{$1.colorIndex}"') }; f.prototype.tooltipFooterHeaderFormatter = function (a, f) {
        var e = f ? 'footer' : 'header'; var c = a.series; var m = c.tooltipOptions; var u = m.xDateFormat; var h = c.xAxis; var l = h && h.options.type === 'datetime' &&
I(a.key); var w = m[e + 'Format']; f = { isFooter: f, labelConfig: a }; M(this, 'headerFormatter', f, function (e) { l && !u && (u = this.getXDateFormat(a, m, h)); l && u && (a.point && a.point.tooltipDateKeys || ['key']).forEach(function (a) { w = w.replace('{point.' + a + '}', '{point.' + a + ':' + u + '}') }); c.chart.styledMode && (w = this.styledModeFormat(w)); e.text = y(w, { point: a, series: c }, this.chart) }); return f.text
      }; f.prototype.update = function (a) { this.destroy(); E(!0, this.chart.options.tooltip.userOptions, a); this.init(this.chart, E(!0, this.options, a)) }; f.prototype.updatePosition =
function (a) {
  var f = this.chart; var e = f.pointer; var c = this.getLabel(); var m = a.plotX + f.plotLeft; var u = a.plotY + f.plotTop; e = e.getChartPosition(); a = (this.options.positioner || this.getPosition).call(this, c.width, c.height, a); if (this.outside) { var h = (this.options.borderWidth || 0) + 2 * this.distance; this.renderer.setSize(c.width + h, c.height + h, !1); if (f = f.containerScaling)v(this.container, { transform: 'scale(' + f.scaleX + ', ' + f.scaleY + ')' }), m *= f.scaleX, u *= f.scaleY; m += e.left - a.x; u += e.top - a.y } this.move(Math.round(a.x), Math.round(a.y || 0),
    m, u)
}; return f
    }()); k.Tooltip = h; return k.Tooltip
  }); P(A, 'parts/Pointer.js', [A['parts/Globals.js'], A['parts/Utilities.js'], A['parts/Tooltip.js'], A['parts/Color.js']], function (k, g, H, v) {
    var K = g.addEvent; var G = g.attr; var N = g.css; var M = g.defined; var y = g.extend; var I = g.find; var J = g.fireEvent; var E = g.isNumber; var D = g.isObject; var z = g.objectEach; var t = g.offset; var q = g.pick; var r = g.splat; var h = v.parse; var f = k.charts; var a = k.noop; g = (function () {
      function l (a, c) {
        this.lastValidTouch = {}; this.pinchDown = []; this.runChartClick = !1; this.chart = a; this.hasDragged = !1; this.options = c; this.unbindContainerMouseLeave =
function () {}; this.init(a, c)
      }l.prototype.applyInactiveState = function (a) { var c = []; var e; (a || []).forEach(function (a) { e = a.series; c.push(e); e.linkedParent && c.push(e.linkedParent); e.linkedSeries && (c = c.concat(e.linkedSeries)); e.navigatorSeries && c.push(e.navigatorSeries) }); this.chart.series.forEach(function (a) { c.indexOf(a) === -1 ? a.setState('inactive', !0) : a.options.inactiveOtherPoints && a.setAllPointsToState('inactive') }) }; l.prototype.destroy = function () {
        var a = this; typeof a.unDocMouseMove !== 'undefined' && a.unDocMouseMove()
        this.unbindContainerMouseLeave(); k.chartCount || (k.unbindDocumentMouseUp && (k.unbindDocumentMouseUp = k.unbindDocumentMouseUp()), k.unbindDocumentTouchEnd && (k.unbindDocumentTouchEnd = k.unbindDocumentTouchEnd())); clearInterval(a.tooltipTimeout); z(a, function (c, e) { a[e] = null })
      }; l.prototype.drag = function (a) {
        var c = this.chart; var e = c.options.chart; var f = a.chartX; var l = a.chartY; var F = this.zoomHor; var w = this.zoomVert; var p = c.plotLeft; var C = c.plotTop; var r = c.plotWidth; var B = c.plotHeight; var d = this.selectionMarker; var b = this.mouseDownX || 0; var n = this.mouseDownY ||
0; var x = D(e.panning) ? e.panning && e.panning.enabled : e.panning; var q = e.panKey && a[e.panKey + 'Key']; if (!d || !d.touch) {
          if (f < p ? f = p : f > p + r && (f = p + r), l < C ? l = C : l > C + B && (l = C + B), this.hasDragged = Math.sqrt(Math.pow(b - f, 2) + Math.pow(n - l, 2)), this.hasDragged > 10) {
            var t = c.isInsidePlot(b - p, n - C); c.hasCartesianSeries && (this.zoomX || this.zoomY) && t && !q && !d && (this.selectionMarker = d = c.renderer.rect(p, C, F ? 1 : r, w ? 1 : B, 0).attr({ class: 'highcharts-selection-marker', zIndex: 7 }).add(), c.styledMode || d.attr({ fill: e.selectionMarkerFill || h('#335cad').setOpacity(0.25).get() }))
            d && F && (f -= b, d.attr({ width: Math.abs(f), x: (f > 0 ? 0 : f) + b })); d && w && (f = l - n, d.attr({ height: Math.abs(f), y: (f > 0 ? 0 : f) + n })); t && !d && x && c.pan(a, e.panning)
          }
        }
      }; l.prototype.dragStart = function (a) { var c = this.chart; c.mouseIsDown = a.type; c.cancelClick = !1; c.mouseDownX = this.mouseDownX = a.chartX; c.mouseDownY = this.mouseDownY = a.chartY }; l.prototype.drop = function (a) {
        var c = this; var e = this.chart; var f = this.hasPinched; if (this.selectionMarker) {
          var h = { originalEvent: a, xAxis: [], yAxis: [] }; var l = this.selectionMarker; var w = l.attr ? l.attr('x') : l.x; var p = l.attr
            ? l.attr('y') : l.y; var C = l.attr ? l.attr('width') : l.width; var r = l.attr ? l.attr('height') : l.height; var B; if (this.hasDragged || f)e.axes.forEach(function (d) { if (d.zoomEnabled && M(d.min) && (f || c[{ xAxis: 'zoomX', yAxis: 'zoomY' }[d.coll]])) { var b = d.horiz; var e = a.type === 'touchend' ? d.minPixelPadding : 0; var m = d.toValue((b ? w : p) + e); b = d.toValue((b ? w + C : p + r) - e); h[d.coll].push({ axis: d, min: Math.min(m, b), max: Math.max(m, b) }); B = !0 } }), B && J(e, 'selection', h, function (d) { e.zoom(y(d, f ? { animation: !1 } : null)) }); E(e.index) && (this.selectionMarker = this.selectionMarker.destroy())
          f && this.scaleGroups()
        }e && E(e.index) && (N(e.container, { cursor: e._cursor }), e.cancelClick = this.hasDragged > 10, e.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
      }; l.prototype.findNearestKDPoint = function (a, c, f) {
        var e = this.chart; var m = e.hoverPoint; e = e.tooltip; if (m && e && e.isStickyOnContact()) return m; var h; a.forEach(function (a) {
          var e = !(a.noSharedTooltip && c) && a.options.findNearestPointBy.indexOf('y') < 0; a = a.searchPoint(f, e); if ((e = D(a, !0)) && !(e = !D(h, !0))) {
            e = h.distX - a.distX; var m = h.dist - a.dist; var u = (a.series.group &&
a.series.group.zIndex) - (h.series.group && h.series.group.zIndex); e = (e !== 0 && c ? e : m !== 0 ? m : u !== 0 ? u : h.series.index > a.series.index ? -1 : 1) > 0
          }e && (h = a)
        }); return h
      }; l.prototype.getChartCoordinatesFromPoint = function (a, c) { var e = a.series; var f = e.xAxis; e = e.yAxis; var h = q(a.clientX, a.plotX); var l = a.shapeArgs; if (f && e) return c ? { chartX: f.len + f.pos - h, chartY: e.len + e.pos - a.plotY } : { chartX: h + f.pos, chartY: a.plotY + e.pos }; if (l && l.x && l.y) return { chartX: l.x, chartY: l.y } }; l.prototype.getChartPosition = function () {
        return this.chartPosition ||
(this.chartPosition = t(this.chart.container))
      }; l.prototype.getCoordinates = function (a) { var c = { xAxis: [], yAxis: [] }; this.chart.axes.forEach(function (e) { c[e.isXAxis ? 'xAxis' : 'yAxis'].push({ axis: e, value: e.toValue(a[e.horiz ? 'chartX' : 'chartY']) }) }); return c }; l.prototype.getHoverData = function (a, c, f, h, l, F) {
        var e; var m = []; h = !(!h || !a); var u = c && !c.stickyTracking; var r = { chartX: F ? F.chartX : void 0, chartY: F ? F.chartY : void 0, shared: l }; J(this, 'beforeGetHoverData', r); u = u ? [c] : f.filter(function (a) {
          return r.filter ? r.filter(a) : a.visible &&
!(!l && a.directTouch) && q(a.options.enableMouseTracking, !0) && a.stickyTracking
        }); c = (e = h || !F ? a : this.findNearestKDPoint(u, l, F)) && e.series; e && (l && !c.noSharedTooltip ? (u = f.filter(function (a) { return r.filter ? r.filter(a) : a.visible && !(!l && a.directTouch) && q(a.options.enableMouseTracking, !0) && !a.noSharedTooltip }), u.forEach(function (a) { var d = I(a.points, function (b) { return b.x === e.x && !b.isNull }); D(d) && (a.chart.isBoosting && (d = a.getPoint(d)), m.push(d)) })) : m.push(e)); r = { hoverPoint: e }; J(this, 'afterGetHoverData', r); return {
          hoverPoint: r.hoverPoint,
          hoverSeries: c,
          hoverPoints: m
        }
      }; l.prototype.getPointFromEvent = function (a) { a = a.target; for (var c; a && !c;)c = a.point, a = a.parentNode; return c }; l.prototype.onTrackerMouseOut = function (a) { a = a.relatedTarget || a.toElement; var c = this.chart.hoverSeries; this.isDirectTouch = !1; if (!(!c || !a || c.stickyTracking || this.inClass(a, 'highcharts-tooltip') || this.inClass(a, 'highcharts-series-' + c.index) && this.inClass(a, 'highcharts-tracker')))c.onMouseOut() }; l.prototype.inClass = function (a, c) {
        for (var e; a;) {
          if (e = G(a, 'class')) {
            if (e.indexOf(c) !==
-1) return !0; if (e.indexOf('highcharts-container') !== -1) return !1
          }a = a.parentNode
        }
      }; l.prototype.init = function (a, c) { this.options = c; this.chart = a; this.runChartClick = c.chart.events && !!c.chart.events.click; this.pinchDown = []; this.lastValidTouch = {}; H && (a.tooltip = new H(a, c.tooltip), this.followTouchMove = q(c.tooltip.followTouchMove, !0)); this.setDOMEvents() }; l.prototype.normalize = function (a, c) {
        var e = a.touches; var f = e ? e.length ? e.item(0) : e.changedTouches[0] : a; c || (c = this.getChartPosition()); e = f.pageX - c.left
        c = f.pageY - c.top; if (f = this.chart.containerScaling)e /= f.scaleX, c /= f.scaleY; return y(a, { chartX: Math.round(e), chartY: Math.round(c) })
      }; l.prototype.onContainerClick = function (a) { var c = this.chart; var e = c.hoverPoint; a = this.normalize(a); var f = c.plotLeft; var h = c.plotTop; c.cancelClick || (e && this.inClass(a.target, 'highcharts-tracker') ? (J(e.series, 'click', y(a, { point: e })), c.hoverPoint && e.firePointEvent('click', a)) : (y(a, this.getCoordinates(a)), c.isInsidePlot(a.chartX - f, a.chartY - h) && J(c, 'click', a))) }; l.prototype.onContainerMouseDown =
function (a) { a = this.normalize(a); if (k.isFirefox && a.button !== 0) this.onContainerMouseMove(a); if (typeof a.button === 'undefined' || ((a.buttons || a.button) & 1) === 1) this.zoomOption(a), this.dragStart(a) }; l.prototype.onContainerMouseLeave = function (a) { var c = f[q(k.hoverChartIndex, -1)]; var e = this.chart.tooltip; a = this.normalize(a); c && (a.relatedTarget || a.toElement) && (c.pointer.reset(), c.pointer.chartPosition = void 0); e && !e.isHidden && this.reset() }; l.prototype.onContainerMouseMove = function (a) {
        var c = this.chart; a = this.normalize(a)
        this.setHoverChartIndex(); a.preventDefault || (a.returnValue = !1); c.mouseIsDown === 'mousedown' && this.drag(a); c.openMenu || !this.inClass(a.target, 'highcharts-tracker') && !c.isInsidePlot(a.chartX - c.plotLeft, a.chartY - c.plotTop) || this.runPointActions(a)
      }; l.prototype.onDocumentTouchEnd = function (a) { f[k.hoverChartIndex] && f[k.hoverChartIndex].pointer.drop(a) }; l.prototype.onContainerTouchMove = function (a) { this.touch(a) }; l.prototype.onContainerTouchStart = function (a) { this.zoomOption(a); this.touch(a, !0) }; l.prototype.onDocumentMouseMove =
function (a) { var c = this.chart; var e = this.chartPosition; a = this.normalize(a, e); var f = c.tooltip; !e || f && f.isStickyOnContact() || c.isInsidePlot(a.chartX - c.plotLeft, a.chartY - c.plotTop) || this.inClass(a.target, 'highcharts-tracker') || this.reset() }; l.prototype.onDocumentMouseUp = function (a) { var c = f[q(k.hoverChartIndex, -1)]; c && c.pointer.drop(a) }; l.prototype.pinch = function (e) {
        var c = this; var f = c.chart; var h = c.pinchDown; var l = e.touches || []; var F = l.length; var w = c.lastValidTouch; var p = c.hasZoom; var C = c.selectionMarker; var r = {}; var B = F === 1 && (c.inClass(e.target,
          'highcharts-tracker') && f.runTrackerClick || c.runChartClick); var d = {}; F > 1 && (c.initiated = !0); p && c.initiated && !B && e.preventDefault(); [].map.call(l, function (b) { return c.normalize(b) }); e.type === 'touchstart' ? ([].forEach.call(l, function (b, d) { h[d] = { chartX: b.chartX, chartY: b.chartY } }), w.x = [h[0].chartX, h[1] && h[1].chartX], w.y = [h[0].chartY, h[1] && h[1].chartY], f.axes.forEach(function (b) {
          if (b.zoomEnabled) {
            var d = f.bounds[b.horiz ? 'h' : 'v']; var a = b.minPixelPadding; var c = b.toPixels(Math.min(q(b.options.min, b.dataMin), b.dataMin))
            var e = b.toPixels(Math.max(q(b.options.max, b.dataMax), b.dataMax)); var h = Math.max(c, e); d.min = Math.min(b.pos, Math.min(c, e) - a); d.max = Math.max(b.pos + b.len, h + a)
          }
        }), c.res = !0) : c.followTouchMove && F === 1 ? this.runPointActions(c.normalize(e)) : h.length && (C || (c.selectionMarker = C = y({ destroy: a, touch: !0 }, f.plotBox)), c.pinchTranslate(h, l, r, C, d, w), c.hasPinched = p, c.scaleGroups(r, d), c.res && (c.res = !1, this.reset(!1, 0)))
      }; l.prototype.pinchTranslate = function (a, c, f, h, l, F) {
        this.zoomHor && this.pinchTranslateDirection(!0, a, c, f, h, l, F)
        this.zoomVert && this.pinchTranslateDirection(!1, a, c, f, h, l, F)
      }; l.prototype.pinchTranslateDirection = function (a, c, f, h, l, F, w, p) {
        var e = this.chart; var m = a ? 'x' : 'y'; var u = a ? 'X' : 'Y'; var d = 'chart' + u; var b = a ? 'width' : 'height'; var n = e['plot' + (a ? 'Left' : 'Top')]; var x; var r; var q = p || 1; var t = e.inverted; var g = e.bounds[a ? 'h' : 'v']; var L = c.length === 1; var k = c[0][d]; var z = f[0][d]; var y = !L && c[1][d]; var D = !L && f[1][d]; f = function () { typeof D === 'number' && Math.abs(k - y) > 20 && (q = p || Math.abs(z - D) / Math.abs(k - y)); r = (n - z) / q + k; x = e['plot' + (a ? 'Width' : 'Height')] / q }; f(); c = r; if (c < g.min) {
          c = g.min; var E =
!0
        } else c + x > g.max && (c = g.max - x, E = !0); E ? (z -= 0.8 * (z - w[m][0]), typeof D === 'number' && (D -= 0.8 * (D - w[m][1])), f()) : w[m] = [z, D]; t || (F[m] = r - n, F[b] = x); F = t ? 1 / q : q; l[b] = x; l[m] = c; h[t ? a ? 'scaleY' : 'scaleX' : 'scale' + u] = q; h['translate' + u] = F * n + (z - F * k)
      }; l.prototype.reset = function (a, c) {
        var e = this.chart; var f = e.hoverSeries; var h = e.hoverPoint; var l = e.hoverPoints; var w = e.tooltip; var p = w && w.shared ? l : h; a && p && r(p).forEach(function (c) { c.series.isCartesian && typeof c.plotX === 'undefined' && (a = !1) }); if (a) {
          w && p && r(p).length && (w.refresh(p), w.shared && l ? l.forEach(function (a) {
            a.setState(a.state,
              !0); a.series.isCartesian && (a.series.xAxis.crosshair && a.series.xAxis.drawCrosshair(null, a), a.series.yAxis.crosshair && a.series.yAxis.drawCrosshair(null, a))
          }) : h && (h.setState(h.state, !0), e.axes.forEach(function (a) { a.crosshair && h.series[a.coll] === a && a.drawCrosshair(null, h) })))
        } else {
          if (h)h.onMouseOut(); l && l.forEach(function (a) { a.setState() }); if (f)f.onMouseOut(); w && w.hide(c); this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove()); e.axes.forEach(function (a) { a.hideCrosshair() }); this.hoverX = e.hoverPoints =
e.hoverPoint = null
        }
      }; l.prototype.runPointActions = function (a, c) {
        var e = this.chart; var h = e.tooltip && e.tooltip.options.enabled ? e.tooltip : void 0; var l = h ? h.shared : !1; var F = c || e.hoverPoint; var w = F && F.series || e.hoverSeries; w = this.getHoverData(F, w, e.series, (!a || a.type !== 'touchmove') && (!!c || w && w.directTouch && this.isDirectTouch), l, a); F = w.hoverPoint; var p = w.hoverPoints; c = (w = w.hoverSeries) && w.tooltipOptions.followPointer; l = l && w && !w.noSharedTooltip; if (F && (F !== e.hoverPoint || h && h.isHidden)) {
          (e.hoverPoints || []).forEach(function (a) {
            p.indexOf(a) ===
-1 && a.setState()
          }); if (e.hoverSeries !== w)w.onMouseOver(); this.applyInactiveState(p); (p || []).forEach(function (a) { a.setState('hover') }); e.hoverPoint && e.hoverPoint.firePointEvent('mouseOut'); if (!F.series) return; F.firePointEvent('mouseOver'); e.hoverPoints = p; e.hoverPoint = F; h && h.refresh(l ? p : F, a)
        } else c && h && !h.isHidden && (F = h.getAnchor([{}], a), h.updatePosition({ plotX: F[0], plotY: F[1] })); this.unDocMouseMove || (this.unDocMouseMove = K(e.container.ownerDocument, 'mousemove', function (a) {
          var c = f[k.hoverChartIndex]
          if (c)c.pointer.onDocumentMouseMove(a)
        })); e.axes.forEach(function (c) { var f = q((c.crosshair || {}).snap, !0); var h; f && ((h = e.hoverPoint) && h.series[c.coll] === c || (h = I(p, function (d) { return d.series[c.coll] === c }))); h || !f ? c.drawCrosshair(a, h) : c.hideCrosshair() })
      }; l.prototype.scaleGroups = function (a, c) {
        var e = this.chart; var f; e.series.forEach(function (h) {
          f = a || h.getPlotBox(); h.xAxis && h.xAxis.zoomEnabled && h.group && (h.group.attr(f), h.markerGroup && (h.markerGroup.attr(f), h.markerGroup.clip(c ? e.clipRect : null)), h.dataLabelsGroup &&
h.dataLabelsGroup.attr(f))
        }); e.clipRect.attr(c || e.clipBox)
      }; l.prototype.setDOMEvents = function () {
        var a = this.chart.container; var c = a.ownerDocument; a.onmousedown = this.onContainerMouseDown.bind(this); a.onmousemove = this.onContainerMouseMove.bind(this); a.onclick = this.onContainerClick.bind(this); this.unbindContainerMouseLeave = K(a, 'mouseleave', this.onContainerMouseLeave.bind(this)); k.unbindDocumentMouseUp || (k.unbindDocumentMouseUp = K(c, 'mouseup', this.onDocumentMouseUp.bind(this))); k.hasTouch && (K(a, 'touchstart',
          this.onContainerTouchStart.bind(this)), K(a, 'touchmove', this.onContainerTouchMove.bind(this)), k.unbindDocumentTouchEnd || (k.unbindDocumentTouchEnd = K(c, 'touchend', this.onDocumentTouchEnd.bind(this))))
      }; l.prototype.setHoverChartIndex = function () { var a = this.chart; var c = k.charts[q(k.hoverChartIndex, -1)]; if (c && c !== a)c.pointer.onContainerMouseLeave({ relatedTarget: !0 }); c && c.mouseIsDown || (k.hoverChartIndex = a.index) }; l.prototype.touch = function (a, c) {
        var e = this.chart; var f; this.setHoverChartIndex(); if (a.touches.length === 1) {
          if (a =
this.normalize(a), (f = e.isInsidePlot(a.chartX - e.plotLeft, a.chartY - e.plotTop)) && !e.openMenu) { c && this.runPointActions(a); if (a.type === 'touchmove') { c = this.pinchDown; var h = c[0] ? Math.sqrt(Math.pow(c[0].chartX - a.chartX, 2) + Math.pow(c[0].chartY - a.chartY, 2)) >= 4 : !1 }q(h, !0) && this.pinch(a) } else c && this.reset()
        } else a.touches.length === 2 && this.pinch(a)
      }; l.prototype.zoomOption = function (a) {
        var c = this.chart; var f = c.options.chart; var e = f.zoomType || ''; c = c.inverted; /touch/.test(a.type) && (e = q(f.pinchType, e)); this.zoomX = a = /x/.test(e)
        this.zoomY = e = /y/.test(e); this.zoomHor = a && !c || e && c; this.zoomVert = e && !c || a && c; this.hasZoom = a || e
      }; return l
    }()); k.Pointer = g; return k.Pointer
  }); P(A, 'parts/MSPointer.js', [A['parts/Globals.js'], A['parts/Pointer.js'], A['parts/Utilities.js']], function (k, g, H) {
    function v () { var q = []; q.item = function (r) { return this[r] }; y(z, function (r) { q.push({ pageX: r.pageX, pageY: r.pageY, target: r.target }) }); return q } function K (q, r, h, f) {
      q.pointerType !== 'touch' && q.pointerType !== q.MSPOINTER_TYPE_TOUCH || !J[k.hoverChartIndex] || (f(q),
      f = J[k.hoverChartIndex].pointer, f[r]({ type: h, target: q.currentTarget, preventDefault: D, touches: v() }))
    } var G = this && this.__extends || (function () { var q = function (r, h) { q = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (f, a) { f.__proto__ = a } || function (f, a) { for (var h in a)a.hasOwnProperty(h) && (f[h] = a[h]) }; return q(r, h) }; return function (r, h) { function f () { this.constructor = r }q(r, h); r.prototype = h === null ? Object.create(h) : (f.prototype = h.prototype, new f()) } }()); var N = H.addEvent; var M = H.css; var y = H.objectEach; var I = H.removeEvent
    var J = k.charts; var E = k.doc; var D = k.noop; var z = {}; var t = !!k.win.PointerEvent; return (function (q) {
      function r () { return q !== null && q.apply(this, arguments) || this }G(r, q); r.prototype.batchMSEvents = function (h) { h(this.chart.container, t ? 'pointerdown' : 'MSPointerDown', this.onContainerPointerDown); h(this.chart.container, t ? 'pointermove' : 'MSPointerMove', this.onContainerPointerMove); h(E, t ? 'pointerup' : 'MSPointerUp', this.onDocumentPointerUp) }; r.prototype.destroy = function () { this.batchMSEvents(I); q.prototype.destroy.call(this) }; r.prototype.init =
function (h, f) { q.prototype.init.call(this, h, f); this.hasZoom && M(h.container, { '-ms-touch-action': 'none', 'touch-action': 'none' }) }; r.prototype.onContainerPointerDown = function (h) { K(h, 'onContainerTouchStart', 'touchstart', function (f) { z[f.pointerId] = { pageX: f.pageX, pageY: f.pageY, target: f.currentTarget } }) }; r.prototype.onContainerPointerMove = function (h) { K(h, 'onContainerTouchMove', 'touchmove', function (f) { z[f.pointerId] = { pageX: f.pageX, pageY: f.pageY }; z[f.pointerId].target || (z[f.pointerId].target = f.currentTarget) }) }
      r.prototype.onDocumentPointerUp = function (h) { K(h, 'onDocumentTouchEnd', 'touchend', function (f) { delete z[f.pointerId] }) }; r.prototype.setDOMEvents = function () { q.prototype.setDOMEvents.call(this); (this.hasZoom || this.followTouchMove) && this.batchMSEvents(N) }; return r
    }(g))
  }); P(A, 'parts/Legend.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.addEvent; var v = g.animObject; var K = g.css; var G = g.defined; var N = g.discardElement; var M = g.find; var y = g.fireEvent; var I = g.format; var J = g.isNumber; var E = g.merge; var D = g.pick; var z = g.relativeLength
    var t = g.setAnimation; var q = g.stableSort; var r = g.syncTimeout; g = g.wrap; var h = k.isFirefox; var f = k.marginNames; var a = k.win; var l = (function () {
      function a (a, f) {
        this.allItems = []; this.contentGroup = this.box = void 0; this.display = !1; this.group = void 0; this.offsetWidth = this.maxLegendWidth = this.maxItemWidth = this.legendWidth = this.legendHeight = this.lastLineHeight = this.lastItemY = this.itemY = this.itemX = this.itemMarginTop = this.itemMarginBottom = this.itemHeight = this.initialItemY = 0; this.options = {}; this.padding = 0; this.pages = []; this.proximate = !1; this.scrollGroup =
void 0; this.widthOption = this.totalItemWidth = this.titleHeight = this.symbolWidth = this.symbolHeight = 0; this.chart = a; this.init(a, f)
      }a.prototype.init = function (a, f) { this.chart = a; this.setOptions(f); f.enabled && (this.render(), H(this.chart, 'endResize', function () { this.legend.positionCheckboxes() }), this.proximate ? this.unchartrender = H(this.chart, 'render', function () { this.legend.proximatePositions(); this.legend.positionItems() }) : this.unchartrender && this.unchartrender()) }; a.prototype.setOptions = function (a) {
        var c = D(a.padding,
          8); this.options = a; this.chart.styledMode || (this.itemStyle = a.itemStyle, this.itemHiddenStyle = E(this.itemStyle, a.itemHiddenStyle)); this.itemMarginTop = a.itemMarginTop || 0; this.itemMarginBottom = a.itemMarginBottom || 0; this.padding = c; this.initialItemY = c - 5; this.symbolWidth = D(a.symbolWidth, 16); this.pages = []; this.proximate = a.layout === 'proximate' && !this.chart.inverted; this.baseline = void 0
      }; a.prototype.update = function (a, f) {
        var c = this.chart; this.setOptions(E(!0, this.options, a)); this.destroy(); c.isDirtyLegend = c.isDirtyBox =
!0; D(f, !0) && c.redraw(); y(this, 'afterUpdate')
      }; a.prototype.colorizeItem = function (a, f) {
        a.legendGroup[f ? 'removeClass' : 'addClass']('highcharts-legend-item-hidden'); if (!this.chart.styledMode) { var c = this.options; var e = a.legendItem; var h = a.legendLine; var m = a.legendSymbol; var p = this.itemHiddenStyle.color; c = f ? c.itemStyle.color : p; var l = f ? a.color || p : p; var r = a.options && a.options.marker; var q = { fill: l }; e && e.css({ fill: c, color: c }); h && h.attr({ stroke: l }); m && (r && m.isMarker && (q = a.pointAttribs(), f || (q.stroke = q.fill = p)), m.attr(q)) }y(this, 'afterColorizeItem',
          { item: a, visible: f })
      }; a.prototype.positionItems = function () { this.allItems.forEach(this.positionItem, this); this.chart.isResizing || this.positionCheckboxes() }; a.prototype.positionItem = function (a) { var c = this.options; var f = c.symbolPadding; c = !c.rtl; var e = a._legendItemPos; var h = e[0]; e = e[1]; var w = a.checkbox; if ((a = a.legendGroup) && a.element)a[G(a.translateY) ? 'animate' : 'attr']({ translateX: c ? h : this.legendWidth - h - 2 * f - 4, translateY: e }); w && (w.x = h, w.y = e) }; a.prototype.destroyItem = function (a) {
        var c = a.checkbox; ['legendItem', 'legendLine',
          'legendSymbol', 'legendGroup'].forEach(function (c) { a[c] && (a[c] = a[c].destroy()) }); c && N(a.checkbox)
      }; a.prototype.destroy = function () { function a (a) { this[a] && (this[a] = this[a].destroy()) } this.getAllItems().forEach(function (c) { ['legendItem', 'legendGroup'].forEach(a, c) }); 'clipRect up down pager nav box title group'.split(' ').forEach(a, this); this.display = null }; a.prototype.positionCheckboxes = function () {
        var a = this.group && this.group.alignAttr; var f = this.clipHeight || this.legendHeight; var e = this.titleHeight; if (a) {
          var h =
a.translateY; this.allItems.forEach(function (c) { var m = c.checkbox; if (m) { var p = h + e + m.y + (this.scrollOffset || 0) + 3; K(m, { left: a.translateX + c.checkboxOffset + m.x - 20 + 'px', top: p + 'px', display: this.proximate || p > h - 6 && p < h + f - 6 ? '' : 'none' }) } }, this)
        }
      }; a.prototype.renderTitle = function () {
        var a = this.options; var f = this.padding; var e = a.title; var h = 0; e.text && (this.title || (this.title = this.chart.renderer.label(e.text, f - 3, f - 4, null, null, null, a.useHTML, null, 'legend-title').attr({ zIndex: 1 }), this.chart.styledMode || this.title.css(e.style), this.title.add(this.group)),
        e.width || this.title.css({ width: this.maxLegendWidth + 'px' }), a = this.title.getBBox(), h = a.height, this.offsetWidth = a.width, this.contentGroup.attr({ translateY: h })); this.titleHeight = h
      }; a.prototype.setText = function (a) { var c = this.options; a.legendItem.attr({ text: c.labelFormat ? I(c.labelFormat, a, this.chart) : c.labelFormatter.call(a) }) }; a.prototype.renderItem = function (a) {
        var c = this.chart; var f = c.renderer; var e = this.options; var h = this.symbolWidth; var w = e.symbolPadding; var p = this.itemStyle; var l = this.itemHiddenStyle; var r = e.layout === 'horizontal'
          ? D(e.itemDistance, 20) : 0; var q = !e.rtl; var d = a.legendItem; var b = !a.series; var n = !b && a.series.drawLegendSymbol ? a.series : a; var x = n.options; x = this.createCheckboxForItem && x && x.showCheckbox; r = h + w + r + (x ? 20 : 0); var t = e.useHTML; var g = a.options.className; d || (a.legendGroup = f.g('legend-item').addClass('highcharts-' + n.type + '-series highcharts-color-' + a.colorIndex + (g ? ' ' + g : '') + (b ? ' highcharts-series-' + a.index : '')).attr({ zIndex: 1 }).add(this.scrollGroup), a.legendItem = d = f.text('', q ? h + w : -w, this.baseline || 0, t), c.styledMode || d.css(E(a.visible
          ? p : l)), d.attr({ align: q ? 'left' : 'right', zIndex: 2 }).add(a.legendGroup), this.baseline || (this.fontMetrics = f.fontMetrics(c.styledMode ? 12 : p.fontSize, d), this.baseline = this.fontMetrics.f + 3 + this.itemMarginTop, d.attr('y', this.baseline)), this.symbolHeight = e.symbolHeight || this.fontMetrics.f, n.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, d, t)); x && !a.checkbox && this.createCheckboxForItem && this.createCheckboxForItem(a); this.colorizeItem(a, a.visible); !c.styledMode && p.width || d.css({
          width: (e.itemWidth ||
this.widthOption || c.spacingBox.width) - r + 'px'
        }); this.setText(a); c = d.getBBox(); a.itemWidth = a.checkboxOffset = e.itemWidth || a.legendItemWidth || c.width + r; this.maxItemWidth = Math.max(this.maxItemWidth, a.itemWidth); this.totalItemWidth += a.itemWidth; this.itemHeight = a.itemHeight = Math.round(a.legendItemHeight || c.height || this.symbolHeight)
      }; a.prototype.layoutItem = function (a) {
        var c = this.options; var f = this.padding; var e = c.layout === 'horizontal'; var h = a.itemHeight; var w = this.itemMarginBottom; var p = this.itemMarginTop; var l = e ? D(c.itemDistance,
          20) : 0; var r = this.maxLegendWidth; c = c.alignColumns && this.totalItemWidth > r ? this.maxItemWidth : a.itemWidth; e && this.itemX - f + c > r && (this.itemX = f, this.lastLineHeight && (this.itemY += p + this.lastLineHeight + w), this.lastLineHeight = 0); this.lastItemY = p + this.itemY + w; this.lastLineHeight = Math.max(h, this.lastLineHeight); a._legendItemPos = [this.itemX, this.itemY]; e ? this.itemX += c : (this.itemY += p + h + w, this.lastLineHeight = h); this.offsetWidth = this.widthOption || Math.max((e ? this.itemX - f - (a.checkbox ? 0 : l) : c) + f, this.offsetWidth)
      }; a.prototype.getAllItems =
function () { var a = []; this.chart.series.forEach(function (c) { var f = c && c.options; c && D(f.showInLegend, G(f.linkedTo) ? !1 : void 0, !0) && (a = a.concat(c.legendItems || (f.legendType === 'point' ? c.data : c))) }); y(this, 'afterGetAllItems', { allItems: a }); return a }; a.prototype.getAlignment = function () { var a = this.options; return this.proximate ? a.align.charAt(0) + 'tv' : a.floating ? '' : a.align.charAt(0) + a.verticalAlign.charAt(0) + a.layout.charAt(0) }; a.prototype.adjustMargins = function (a, e) {
        var c = this.chart; var h = this.options; var m = this.getAlignment()
        m && [/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/].forEach(function (u, p) { u.test(m) && !G(a[p]) && (c[f[p]] = Math.max(c[f[p]], c.legend[(p + 1) % 2 ? 'legendHeight' : 'legendWidth'] + [1, -1, -1, 1][p] * h[p % 2 ? 'x' : 'y'] + D(h.margin, 12) + e[p] + (c.titleOffset[p] || 0))) })
      }; a.prototype.proximatePositions = function () {
        var a = this.chart; var f = []; var e = this.options.align === 'left'; this.allItems.forEach(function (c) {
          var h = e; if (c.yAxis && c.points) {
            c.xAxis.options.reversed && (h = !h); var m = M(h ? c.points : c.points.slice(0).reverse(), function (a) { return J(a.plotY) })
            h = this.itemMarginTop + c.legendItem.getBBox().height + this.itemMarginBottom; var p = c.yAxis.top - a.plotTop; c.visible ? (m = m ? m.plotY : c.yAxis.height, m += p - 0.3 * h) : m = p + c.yAxis.height; f.push({ target: m, size: h, item: c })
          }
        }, this); k.distribute(f, a.plotHeight); f.forEach(function (c) { c.item._legendItemPos[1] = a.plotTop - a.spacing[0] + c.pos })
      }; a.prototype.render = function () {
        var a = this.chart; var f = a.renderer; var e = this.group; var h = this.box; var l = this.options; var w = this.padding; this.itemX = w; this.itemY = this.initialItemY; this.lastItemY = this.offsetWidth =
0; this.widthOption = z(l.width, a.spacingBox.width - w); var p = a.spacingBox.width - 2 * w - l.x; ['rm', 'lm'].indexOf(this.getAlignment().substring(0, 2)) > -1 && (p /= 2); this.maxLegendWidth = this.widthOption || p; e || (this.group = e = f.g('legend').attr({ zIndex: 7 }).add(), this.contentGroup = f.g().attr({ zIndex: 1 }).add(e), this.scrollGroup = f.g().add(this.contentGroup)); this.renderTitle(); var C = this.getAllItems(); q(C, function (a, d) { return (a.options && a.options.legendIndex || 0) - (d.options && d.options.legendIndex || 0) }); l.reversed && C.reverse()
        this.allItems = C; this.display = p = !!C.length; this.itemHeight = this.totalItemWidth = this.maxItemWidth = this.lastLineHeight = 0; C.forEach(this.renderItem, this); C.forEach(this.layoutItem, this); C = (this.widthOption || this.offsetWidth) + w; var r = this.lastItemY + this.lastLineHeight + this.titleHeight; r = this.handleOverflow(r); r += w; h || (this.box = h = f.rect().addClass('highcharts-legend-box').attr({ r: l.borderRadius }).add(e), h.isNew = !0); a.styledMode || h.attr({
          stroke: l.borderColor,
          'stroke-width': l.borderWidth || 0,
          fill: l.backgroundColor ||
'none'
        }).shadow(l.shadow); C > 0 && r > 0 && (h[h.isNew ? 'attr' : 'animate'](h.crisp.call({}, { x: 0, y: 0, width: C, height: r }, h.strokeWidth())), h.isNew = !1); h[p ? 'show' : 'hide'](); a.styledMode && e.getStyle('display') === 'none' && (C = r = 0); this.legendWidth = C; this.legendHeight = r; p && this.align(); this.proximate || this.positionItems(); y(this, 'afterRender')
      }; a.prototype.align = function (a) {
        void 0 === a && (a = this.chart.spacingBox); var c = this.chart; var f = this.options; var e = a.y; /(lth|ct|rth)/.test(this.getAlignment()) && c.titleOffset[0] > 0 ? e += c.titleOffset[0]
          : /(lbh|cb|rbh)/.test(this.getAlignment()) && c.titleOffset[2] > 0 && (e -= c.titleOffset[2]); e !== a.y && (a = E(a, { y: e })); this.group.align(E(f, { width: this.legendWidth, height: this.legendHeight, verticalAlign: this.proximate ? 'top' : f.verticalAlign }), !0, a)
      }; a.prototype.handleOverflow = function (a) {
        var c = this; var f = this.chart; var e = f.renderer; var h = this.options; var l = h.y; var p = this.padding; l = f.spacingBox.height + (h.verticalAlign === 'top' ? -l : l) - p; var C = h.maxHeight; var r; var q = this.clipRect; var d = h.navigation; var b = D(d.animation, !0); var n = d.arrowSize || 12; var x = this.nav
        var t = this.pages; var g; var k = this.allItems; var z = function (b) { typeof b === 'number' ? q.attr({ height: b }) : q && (c.clipRect = q.destroy(), c.contentGroup.clip()); c.contentGroup.div && (c.contentGroup.div.style.clip = b ? 'rect(' + p + 'px,9999px,' + (p + b) + 'px,0)' : 'auto') }; var y = function (b) { c[b] = e.circle(0, 0, 1.3 * n).translate(n / 2, n / 2).add(x); f.styledMode || c[b].attr('fill', 'rgba(0,0,0,0.0001)'); return c[b] }; h.layout !== 'horizontal' || h.verticalAlign === 'middle' || h.floating || (l /= 2); C && (l = Math.min(l, C)); t.length = 0; a > l && !1 !== d.enabled ? (this.clipHeight =
r = Math.max(l - 20 - this.titleHeight - p, 0), this.currentPage = D(this.currentPage, 1), this.fullHeight = a, k.forEach(function (b, a) { var d = b._legendItemPos[1]; var c = Math.round(b.legendItem.getBBox().height); var f = t.length; if (!f || d - t[f - 1] > r && (g || d) !== t[f - 1])t.push(g || d), f++; b.pageIx = f - 1; g && (k[a - 1].pageIx = f - 1); a === k.length - 1 && d + c - t[f - 1] > r && d !== g && (t.push(d), b.pageIx = f); d !== g && (g = d) }), q || (q = c.clipRect = e.clipRect(0, p, 9999, 0), c.contentGroup.clip(q)), z(r), x || (this.nav = x = e.g().attr({ zIndex: 1 }).add(this.group), this.up = e.symbol('triangle',
          0, 0, n, n).add(x), y('upTracker').on('click', function () { c.scroll(-1, b) }), this.pager = e.text('', 15, 10).addClass('highcharts-legend-navigation'), f.styledMode || this.pager.css(d.style), this.pager.add(x), this.down = e.symbol('triangle-down', 0, 0, n, n).add(x), y('downTracker').on('click', function () { c.scroll(1, b) })), c.scroll(0), a = l) : x && (z(), this.nav = x.destroy(), this.scrollGroup.attr({ translateY: 1 }), this.clipHeight = 0); return a
      }; a.prototype.scroll = function (a, f) {
        var c = this; var e = this.chart; var h = this.pages; var m = h.length; var p = this.currentPage +
a; a = this.clipHeight; var l = this.options.navigation; var q = this.pager; var g = this.padding; p > m && (p = m); p > 0 && (typeof f !== 'undefined' && t(f, e), this.nav.attr({ translateX: g, translateY: a + this.padding + 7 + this.titleHeight, visibility: 'visible' }), [this.up, this.upTracker].forEach(function (a) { a.attr({ class: p === 1 ? 'highcharts-legend-nav-inactive' : 'highcharts-legend-nav-active' }) }), q.attr({ text: p + '/' + m }), [this.down, this.downTracker].forEach(function (a) {
          a.attr({
            x: 18 + this.pager.getBBox().width,
            class: p === m ? 'highcharts-legend-nav-inactive'
              : 'highcharts-legend-nav-active'
          })
        }, this), e.styledMode || (this.up.attr({ fill: p === 1 ? l.inactiveColor : l.activeColor }), this.upTracker.css({ cursor: p === 1 ? 'default' : 'pointer' }), this.down.attr({ fill: p === m ? l.inactiveColor : l.activeColor }), this.downTracker.css({ cursor: p === m ? 'default' : 'pointer' })), this.scrollOffset = -h[p - 1] + this.initialItemY, this.scrollGroup.animate({ translateY: this.scrollOffset }), this.currentPage = p, this.positionCheckboxes(), f = v(D(f, e.renderer.globalAnimation, !0)), r(function () {
          y(c, 'afterScroll',
            { currentPage: p })
        }, f.duration || 0))
      }; return a
    }()); (/Trident\/7\.0/.test(a.navigator && a.navigator.userAgent) || h) && g(l.prototype, 'positionItem', function (a, c) { var f = this; var e = function () { c._legendItemPos && a.call(f, c) }; e(); f.bubbleLegend || setTimeout(e) }); k.Legend = l; return k.Legend
  }); P(A, 'parts/Chart.js', [A['parts/Globals.js'], A['parts/Legend.js'], A['parts/MSPointer.js'], A['parts/Pointer.js'], A['parts/Time.js'], A['parts/Utilities.js']], function (k, g, H, v, K, G) {
    var N = G.addEvent; var M = G.animate; var y = G.animObject; var I = G.attr
    var J = G.createElement; var E = G.css; var D = G.defined; var z = G.discardElement; var t = G.erase; var q = G.error; var r = G.extend; var h = G.find; var f = G.fireEvent; var a = G.getStyle; var l = G.isArray; var e = G.isFunction; var c = G.isNumber; var m = G.isObject; var u = G.isString; var L = G.merge; var F = G.numberFormat; var w = G.objectEach; var p = G.pick; var C = G.pInt; var O = G.relativeLength; var B = G.removeEvent; var d = G.setAnimation; var b = G.splat; var n = G.syncTimeout; var x = G.uniqueKey; var Q = k.doc; var R = k.Axis; var X = k.defaultOptions; var U = k.charts; var V = k.marginNames; var W = k.seriesTypes; var A = k.win; var Y = k.Chart = function () { this.getArgs.apply(this, arguments) }; k.chart = function (b,
      a, d) { return new Y(b, a, d) }; r(Y.prototype, {
      callbacks: [],
      getArgs: function () { var b = [].slice.call(arguments); if (u(b[0]) || b[0].nodeName) this.renderTo = b.shift(); this.init(b[0], b[1]) },
      init: function (b, a) {
        var d; var c = b.series; var n = b.plotOptions || {}; f(this, 'init', { args: arguments }, function () {
          b.series = null; d = L(X, b); var h = d.chart || {}; w(d.plotOptions, function (b, a) { m(b) && (b.tooltip = n[a] && L(n[a].tooltip) || void 0) }); d.tooltip.userOptions = b.chart && b.chart.forExport && b.tooltip.userOptions || b.tooltip; d.series = b.series = c; this.userOptions =
b; var p = h.events; this.margin = []; this.spacing = []; this.bounds = { h: {}, v: {} }; this.labelCollectors = []; this.callback = a; this.isResizing = 0; this.options = d; this.axes = []; this.series = []; this.time = b.time && Object.keys(b.time).length ? new K(b.time) : k.time; this.numberFormatter = h.numberFormatter || F; this.styledMode = h.styledMode; this.hasCartesianSeries = h.showAxes; var l = this; l.index = U.length; U.push(l); k.chartCount++; p && w(p, function (b, a) { e(b) && N(l, a, b) }); l.xAxis = []; l.yAxis = []; l.pointCount = l.colorCounter = l.symbolCounter =
0; f(l, 'afterInit'); l.firstRender()
        })
      },
      initSeries: function (b) { var a = this.options.chart; a = b.type || a.type || a.defaultSeriesType; var d = W[a]; d || q(17, !0, this, { missingModuleFor: a }); a = new d(); a.init(this, b); return a },
      setSeriesData: function () { this.getSeriesOrderByLinks().forEach(function (b) { b.points || b.data || !b.enabledDataSorting || b.setData(b.options.data, !1) }) },
      getSeriesOrderByLinks: function () {
        return this.series.concat().sort(function (b, a) {
          return b.linkedSeries.length || a.linkedSeries.length ? a.linkedSeries.length -
b.linkedSeries.length : 0
        })
      },
      orderSeries: function (b) { var a = this.series; for (b = b || 0; b < a.length; b++)a[b] && (a[b].index = b, a[b].name = a[b].getName()) },
      isInsidePlot: function (b, a, d) { var c = d ? a : b; b = d ? b : a; c = { x: c, y: b, isInsidePlot: c >= 0 && c <= this.plotWidth && b >= 0 && b <= this.plotHeight }; f(this, 'afterIsInsidePlot', c); return c.isInsidePlot },
      redraw: function (b) {
        f(this, 'beforeRedraw'); var a = this.axes; var c = this.series; var e = this.pointer; var n = this.legend; var h = this.userOptions.legend; var p = this.isDirtyLegend; var l = this.hasCartesianSeries; var m = this.isDirtyBox
        var x = this.renderer; var u = x.isHidden(); var w = []; this.setResponsive && this.setResponsive(!1); d(this.hasRendered ? b : !1, this); u && this.temporaryDisplay(); this.layOutTitles(); for (b = c.length; b--;) { var C = c[b]; if (C.options.stacking) { var F = !0; if (C.isDirty) { var q = !0; break } } } if (q) for (b = c.length; b--;)C = c[b], C.options.stacking && (C.isDirty = !0); c.forEach(function (b) { b.isDirty && (b.options.legendType === 'point' ? (b.updateTotals && b.updateTotals(), p = !0) : h && (h.labelFormatter || h.labelFormat) && (p = !0)); b.isDirtyData && f(b, 'updatedData') })
        p && n && n.options.enabled && (n.render(), this.isDirtyLegend = !1); F && this.getStacks(); l && a.forEach(function (b) { b.updateNames(); b.setScale() }); this.getMargins(); l && (a.forEach(function (b) { b.isDirty && (m = !0) }), a.forEach(function (b) { var a = b.min + ',' + b.max; b.extKey !== a && (b.extKey = a, w.push(function () { f(b, 'afterSetExtremes', r(b.eventArgs, b.getExtremes())); delete b.eventArgs })); (m || F) && b.redraw() })); m && this.drawChartBox(); f(this, 'predraw'); c.forEach(function (b) {
          (m || b.isDirty) && b.visible && b.redraw(); b.isDirtyData =
!1
        }); e && e.reset(!0); x.draw(); f(this, 'redraw'); f(this, 'render'); u && this.temporaryDisplay(!0); w.forEach(function (b) { b.call() })
      },
      get: function (b) { function a (a) { return a.id === b || a.options && a.options.id === b } var d = this.series; var c; var f = h(this.axes, a) || h(this.series, a); for (c = 0; !f && c < d.length; c++)f = h(d[c].points || [], a); return f },
      getAxes: function () {
        var a = this; var d = this.options; var c = d.xAxis = b(d.xAxis || {}); d = d.yAxis = b(d.yAxis || {}); f(this, 'getAxes'); c.forEach(function (b, a) { b.index = a; b.isX = !0 }); d.forEach(function (b, a) {
          b.index =
a
        }); c.concat(d).forEach(function (b) { new R(a, b) }); f(this, 'afterGetAxes')
      },
      getSelectedPoints: function () { var b = []; this.series.forEach(function (a) { b = b.concat(a.getPointsCollection().filter(function (b) { return p(b.selectedStaging, b.selected) })) }); return b },
      getSelectedSeries: function () { return this.series.filter(function (b) { return b.selected }) },
      setTitle: function (b, a, d) { this.applyDescription('title', b); this.applyDescription('subtitle', a); this.applyDescription('caption', void 0); this.layOutTitles(d) },
      applyDescription: function (b,
        a) { var d = this; var c = b === 'title' ? { color: '#333333', fontSize: this.options.isStock ? '16px' : '18px' } : { color: '#666666' }; c = this.options[b] = L(!this.styledMode && { style: c }, this.options[b], a); var f = this[b]; f && a && (this[b] = f = f.destroy()); c && !f && (f = this.renderer.text(c.text, 0, 0, c.useHTML).attr({ align: c.align, class: 'highcharts-' + b, zIndex: c.zIndex || 4 }).add(), f.update = function (a) { d[{ title: 'setTitle', subtitle: 'setSubtitle', caption: 'setCaption' }[b]](a) }, this.styledMode || f.css(c.style), this[b] = f) },
      layOutTitles: function (b) {
        var a =
[0, 0, 0]; var d = this.renderer; var c = this.spacingBox; ['title', 'subtitle', 'caption'].forEach(function (b) {
          var f = this[b]; var e = this.options[b]; var n = e.verticalAlign || 'top'; b = b === 'title' ? -3 : n === 'top' ? a[0] + 2 : 0; if (f) {
            if (!this.styledMode) var h = e.style.fontSize; h = d.fontMetrics(h, f).b; f.css({ width: (e.width || c.width + (e.widthAdjust || 0)) + 'px' }); var p = Math.round(f.getBBox(e.useHTML).height); f.align(r({ y: n === 'bottom' ? h : b + h, height: p }, e), !1, 'spacingBox'); e.floating || (n === 'top' ? a[0] = Math.ceil(a[0] + p) : n === 'bottom' && (a[2] = Math.ceil(a[2] +
p)))
          }
        }, this); a[0] && (this.options.title.verticalAlign || 'top') === 'top' && (a[0] += this.options.title.margin); a[2] && this.options.caption.verticalAlign === 'bottom' && (a[2] += this.options.caption.margin); var e = !this.titleOffset || this.titleOffset.join(',') !== a.join(','); this.titleOffset = a; f(this, 'afterLayOutTitles'); !this.isDirtyBox && e && (this.isDirtyBox = this.isDirtyLegend = e, this.hasRendered && p(b, !0) && this.isDirtyBox && this.redraw())
      },
      getChartSize: function () {
        var b = this.options.chart; var d = b.width; b = b.height; var c =
this.renderTo; D(d) || (this.containerWidth = a(c, 'width')); D(b) || (this.containerHeight = a(c, 'height')); this.chartWidth = Math.max(0, d || this.containerWidth || 600); this.chartHeight = Math.max(0, O(b, this.chartWidth) || (this.containerHeight > 1 ? this.containerHeight : 400))
      },
      temporaryDisplay: function (b) {
        var d = this.renderTo; if (b) for (;d && d.style;)d.hcOrigStyle && (E(d, d.hcOrigStyle), delete d.hcOrigStyle), d.hcOrigDetached && (Q.body.removeChild(d), d.hcOrigDetached = !1), d = d.parentNode; else {
          for (;d && d.style;) {
            Q.body.contains(d) ||
d.parentNode || (d.hcOrigDetached = !0, Q.body.appendChild(d)); if (a(d, 'display', !1) === 'none' || d.hcOricDetached)d.hcOrigStyle = { display: d.style.display, height: d.style.height, overflow: d.style.overflow }, b = { display: 'block', overflow: 'hidden' }, d !== this.renderTo && (b.height = 0), E(d, b), d.offsetWidth || d.style.setProperty('display', 'block', 'important'); d = d.parentNode; if (d === Q.body) break
          }
        }
      },
      setClassName: function (b) { this.container.className = 'highcharts-container ' + (b || '') },
      getContainer: function () {
        var b = this.options; var a =
b.chart; var e = this.renderTo; var n = x(); var h; var p; e || (this.renderTo = e = a.renderTo); u(e) && (this.renderTo = e = Q.getElementById(e)); e || q(13, !0, this); var m = C(I(e, 'data-highcharts-chart')); c(m) && U[m] && U[m].hasRendered && U[m].destroy(); I(e, 'data-highcharts-chart', this.index); e.innerHTML = ''; a.skipClone || e.offsetWidth || this.temporaryDisplay(); this.getChartSize(); m = this.chartWidth; var l = this.chartHeight; E(e, { overflow: 'hidden' }); this.styledMode || (h = r({
          position: 'relative',
          overflow: 'hidden',
          width: m + 'px',
          height: l + 'px',
          textAlign: 'left',
          lineHeight: 'normal',
          zIndex: 0,
          '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
        }, a.style)); this.container = e = J('div', { id: n }, h, e); this._cursor = e.style.cursor; this.renderer = new (k[a.renderer] || k.Renderer)(e, m, l, null, a.forExport, b.exporting && b.exporting.allowHTML, this.styledMode); d(void 0, this); this.setClassName(a.className); if (this.styledMode) for (p in b.defs) this.renderer.definition(b.defs[p]); else this.renderer.setStyle(a.style); this.renderer.chartIndex = this.index; f(this, 'afterGetContainer')
      },
      getMargins: function (b) {
        var a =
this.spacing; var d = this.margin; var c = this.titleOffset; this.resetMargins(); c[0] && !D(d[0]) && (this.plotTop = Math.max(this.plotTop, c[0] + a[0])); c[2] && !D(d[2]) && (this.marginBottom = Math.max(this.marginBottom, c[2] + a[2])); this.legend && this.legend.display && this.legend.adjustMargins(d, a); f(this, 'getMargins'); b || this.getAxisMargins()
      },
      getAxisMargins: function () {
        var b = this; var a = b.axisOffset = [0, 0, 0, 0]; var d = b.colorAxis; var c = b.margin; var f = function (b) { b.forEach(function (b) { b.visible && b.getOffset() }) }; b.hasCartesianSeries ? f(b.axes) : d &&
d.length && f(d); V.forEach(function (d, f) { D(c[f]) || (b[d] += a[f]) }); b.setChartSize()
      },
      reflow: function (b) { var d = this; var c = d.options.chart; var f = d.renderTo; var e = D(c.width) && D(c.height); var h = c.width || a(f, 'width'); c = c.height || a(f, 'height'); f = b ? b.target : A; if (!e && !d.isPrinting && h && c && (f === A || f === Q)) { if (h !== d.containerWidth || c !== d.containerHeight)G.clearTimeout(d.reflowTimeout), d.reflowTimeout = n(function () { d.container && d.setSize(void 0, void 0, !1) }, b ? 100 : 0); d.containerWidth = h; d.containerHeight = c } },
      setReflow: function (b) {
        var a =
this; !1 === b || this.unbindReflow ? !1 === b && this.unbindReflow && (this.unbindReflow = this.unbindReflow()) : (this.unbindReflow = N(A, 'resize', function (b) { a.options && a.reflow(b) }), N(this, 'destroy', this.unbindReflow))
      },
      setSize: function (b, a, c) {
        var e = this; var h = e.renderer; e.isResizing += 1; d(c, e); c = h.globalAnimation; e.oldChartHeight = e.chartHeight; e.oldChartWidth = e.chartWidth; typeof b !== 'undefined' && (e.options.chart.width = b); typeof a !== 'undefined' && (e.options.chart.height = a); e.getChartSize(); e.styledMode || (c ? M : E)(e.container,
          { width: e.chartWidth + 'px', height: e.chartHeight + 'px' }, c); e.setChartSize(!0); h.setSize(e.chartWidth, e.chartHeight, c); e.axes.forEach(function (b) { b.isDirty = !0; b.setScale() }); e.isDirtyLegend = !0; e.isDirtyBox = !0; e.layOutTitles(); e.getMargins(); e.redraw(c); e.oldChartHeight = null; f(e, 'resize'); n(function () { e && f(e, 'endResize', null, function () { --e.isResizing }) }, y(c).duration || 0)
      },
      setChartSize: function (b) {
        var a = this.inverted; var d = this.renderer; var c = this.chartWidth; var e = this.chartHeight; var n = this.options.chart; var h = this.spacing
        var p = this.clipOffset; var m; var l; var x; var u; this.plotLeft = m = Math.round(this.plotLeft); this.plotTop = l = Math.round(this.plotTop); this.plotWidth = x = Math.max(0, Math.round(c - m - this.marginRight)); this.plotHeight = u = Math.max(0, Math.round(e - l - this.marginBottom)); this.plotSizeX = a ? u : x; this.plotSizeY = a ? x : u; this.plotBorderWidth = n.plotBorderWidth || 0; this.spacingBox = d.spacingBox = { x: h[3], y: h[0], width: c - h[3] - h[1], height: e - h[0] - h[2] }; this.plotBox = d.plotBox = { x: m, y: l, width: x, height: u }; c = 2 * Math.floor(this.plotBorderWidth / 2); a = Math.ceil(Math.max(c,
          p[3]) / 2); d = Math.ceil(Math.max(c, p[0]) / 2); this.clipBox = { x: a, y: d, width: Math.floor(this.plotSizeX - Math.max(c, p[1]) / 2 - a), height: Math.max(0, Math.floor(this.plotSizeY - Math.max(c, p[2]) / 2 - d)) }; b || this.axes.forEach(function (b) { b.setAxisSize(); b.setAxisTranslation() }); f(this, 'afterSetChartSize', { skipAxes: b })
      },
      resetMargins: function () {
        f(this, 'resetMargins'); var b = this; var a = b.options.chart; ['margin', 'spacing'].forEach(function (d) {
          var c = a[d]; var e = m(c) ? c : [c, c, c, c]; ['Top', 'Right', 'Bottom', 'Left'].forEach(function (c, f) {
            b[d][f] =
p(a[d + c], e[f])
          })
        }); V.forEach(function (a, d) { b[a] = p(b.margin[d], b.spacing[d]) }); b.axisOffset = [0, 0, 0, 0]; b.clipOffset = [0, 0, 0, 0]
      },
      drawChartBox: function () {
        var b = this.options.chart; var a = this.renderer; var d = this.chartWidth; var c = this.chartHeight; var e = this.chartBackground; var h = this.plotBackground; var n = this.plotBorder; var p = this.styledMode; var m = this.plotBGImage; var l = b.backgroundColor; var x = b.plotBackgroundColor; var u = b.plotBackgroundImage; var w; var C = this.plotLeft; var r = this.plotTop; var F = this.plotWidth; var q = this.plotHeight; var t = this.plotBox; var g = this.clipRect; var B = this.clipBox
        var O = 'animate'; e || (this.chartBackground = e = a.rect().addClass('highcharts-background').add(), O = 'attr'); if (p) var k = w = e.strokeWidth(); else { k = b.borderWidth || 0; w = k + (b.shadow ? 8 : 0); l = { fill: l || 'none' }; if (k || e['stroke-width'])l.stroke = b.borderColor, l['stroke-width'] = k; e.attr(l).shadow(b.shadow) }e[O]({ x: w / 2, y: w / 2, width: d - w - k % 2, height: c - w - k % 2, r: b.borderRadius }); O = 'animate'; h || (O = 'attr', this.plotBackground = h = a.rect().addClass('highcharts-plot-background').add()); h[O](t); p || (h.attr({ fill: x || 'none' }).shadow(b.plotShadow),
        u && (m ? (u !== m.attr('href') && m.attr('href', u), m.animate(t)) : this.plotBGImage = a.image(u, C, r, F, q).add())); g ? g.animate({ width: B.width, height: B.height }) : this.clipRect = a.clipRect(B); O = 'animate'; n || (O = 'attr', this.plotBorder = n = a.rect().addClass('highcharts-plot-border').attr({ zIndex: 1 }).add()); p || n.attr({ stroke: b.plotBorderColor, 'stroke-width': b.plotBorderWidth || 0, fill: 'none' }); n[O](n.crisp({ x: C, y: r, width: F, height: q }, -n.strokeWidth())); this.isDirtyBox = !1; f(this, 'afterDrawChartBox')
      },
      propFromSeries: function () {
        var b =
this; var a = b.options.chart; var d; var c = b.options.series; var e; var f; ['inverted', 'angular', 'polar'].forEach(function (h) { d = W[a.type || a.defaultSeriesType]; f = a[h] || d && d.prototype[h]; for (e = c && c.length; !f && e--;)(d = W[c[e].type]) && d.prototype[h] && (f = !0); b[h] = f })
      },
      linkSeries: function () {
        var b = this; var a = b.series; a.forEach(function (b) { b.linkedSeries.length = 0 }); a.forEach(function (a) {
          var d = a.options.linkedTo; u(d) && (d = d === ':previous' ? b.series[a.index - 1] : b.get(d)) && d.linkedParent !== a && (d.linkedSeries.push(a), a.linkedParent = d, d.enabledDataSorting &&
a.setDataSortingOptions(), a.visible = p(a.options.visible, d.options.visible, a.visible))
        }); f(this, 'afterLinkSeries')
      },
      renderSeries: function () { this.series.forEach(function (b) { b.translate(); b.render() }) },
      renderLabels: function () { var b = this; var a = b.options.labels; a.items && a.items.forEach(function (d) { var c = r(a.style, d.style); var e = C(c.left) + b.plotLeft; var f = C(c.top) + b.plotTop + 12; delete c.left; delete c.top; b.renderer.text(d.html, e, f).attr({ zIndex: 2 }).css(c).add() }) },
      render: function () {
        var b = this.axes; var a = this.colorAxis
        var d = this.renderer; var c = this.options; var e = 0; var f = function (b) { b.forEach(function (b) { b.visible && b.render() }) }; this.setTitle(); this.legend = new g(this, c.legend); this.getStacks && this.getStacks(); this.getMargins(!0); this.setChartSize(); c = this.plotWidth; b.some(function (b) { if (b.horiz && b.visible && b.options.labels.enabled && b.series.length) return e = 21, !0 }); var h = this.plotHeight = Math.max(this.plotHeight - e, 0); b.forEach(function (b) { b.setScale() }); this.getAxisMargins(); var n = c / this.plotWidth > 1.1; var p = h / this.plotHeight > 1.05
        if (n || p)b.forEach(function (b) { (b.horiz && n || !b.horiz && p) && b.setTickInterval(!0) }), this.getMargins(); this.drawChartBox(); this.hasCartesianSeries ? f(b) : a && a.length && f(a); this.seriesGroup || (this.seriesGroup = d.g('series-group').attr({ zIndex: 3 }).add()); this.renderSeries(); this.renderLabels(); this.addCredits(); this.setResponsive && this.setResponsive(); this.updateContainerScaling(); this.hasRendered = !0
      },
      addCredits: function (b) {
        var a = this; b = L(!0, this.options.credits, b); b.enabled && !this.credits && (this.credits =
this.renderer.text(b.text + (this.mapCredits || ''), 0, 0).addClass('highcharts-credits').on('click', function () { b.href && (A.location.href = b.href) }).attr({ align: b.position.align, zIndex: 8 }), a.styledMode || this.credits.css(b.style), this.credits.add().align(b.position), this.credits.update = function (b) { a.credits = a.credits.destroy(); a.addCredits(b) })
      },
      updateContainerScaling: function () {
        var b = this.container; if (b.offsetWidth && b.offsetHeight && b.getBoundingClientRect) {
          var a = b.getBoundingClientRect(); var d = a.width / b.offsetWidth
          b = a.height / b.offsetHeight; d !== 1 || b !== 1 ? this.containerScaling = { scaleX: d, scaleY: b } : delete this.containerScaling
        }
      },
      destroy: function () {
        var b = this; var a = b.axes; var d = b.series; var c = b.container; var e; var h = c && c.parentNode; f(b, 'destroy'); b.renderer.forExport ? t(U, b) : U[b.index] = void 0; k.chartCount--; b.renderTo.removeAttribute('data-highcharts-chart'); B(b); for (e = a.length; e--;)a[e] = a[e].destroy(); this.scroller && this.scroller.destroy && this.scroller.destroy(); for (e = d.length; e--;)d[e] = d[e].destroy(); 'title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer'.split(' ').forEach(function (a) {
          var d =
b[a]; d && d.destroy && (b[a] = d.destroy())
        }); c && (c.innerHTML = '', B(c), h && z(c)); w(b, function (a, d) { delete b[d] })
      },
      firstRender: function () {
        var b = this; var a = b.options; if (!b.isReadyToRender || b.isReadyToRender()) {
          b.getContainer(); b.resetMargins(); b.setChartSize(); b.propFromSeries(); b.getAxes(); (l(a.series) ? a.series : []).forEach(function (a) { b.initSeries(a) }); b.linkSeries(); b.setSeriesData(); f(b, 'beforeRender'); v && (b.pointer = k.hasTouch || !A.PointerEvent && !A.MSPointerEvent ? new v(b, a) : new H(b, a)); b.render(); if (!b.renderer.imgCount &&
!b.hasLoaded)b.onload(); b.temporaryDisplay(!0)
        }
      },
      onload: function () { this.callbacks.concat([this.callback]).forEach(function (b) { b && typeof this.index !== 'undefined' && b.apply(this, [this]) }, this); f(this, 'load'); f(this, 'render'); D(this.index) && this.setReflow(this.options.chart.reflow); this.hasLoaded = !0 }
    })
  }); P(A, 'parts/ScrollablePlotArea.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.addEvent; var v = g.createElement; var K = g.pick; var G = g.stop; g = k.Chart; ''; H(g, 'afterSetChartSize', function (g) {
      var v =
this.options.chart.scrollablePlotArea; var y = v && v.minWidth; v = v && v.minHeight; if (!this.renderer.forExport) {
        if (y) { if (this.scrollablePixelsX = y = Math.max(0, y - this.chartWidth)) { this.plotWidth += y; this.inverted ? (this.clipBox.height += y, this.plotBox.height += y) : (this.clipBox.width += y, this.plotBox.width += y); var I = { 1: { name: 'right', value: y } } } } else {
          v && (this.scrollablePixelsY = y = Math.max(0, v - this.chartHeight)) && (this.plotHeight += y, this.inverted ? (this.clipBox.width += y, this.plotBox.width += y) : (this.clipBox.height += y, this.plotBox.height +=
y), I = { 2: { name: 'bottom', value: y } })
        }I && !g.skipAxes && this.axes.forEach(function (g) { I[g.side] ? g.getPlotLinePath = function () { var y = I[g.side].name; var D = this[y]; this[y] = D - I[g.side].value; var z = k.Axis.prototype.getPlotLinePath.apply(this, arguments); this[y] = D; return z } : (g.setAxisSize(), g.setAxisTranslation()) })
      }
    }); H(g, 'render', function () { this.scrollablePixelsX || this.scrollablePixelsY ? (this.setUpScrolling && this.setUpScrolling(), this.applyFixed()) : this.fixedDiv && this.applyFixed() }); g.prototype.setUpScrolling = function () {
      var g =
this; var k = { WebkitOverflowScrolling: 'touch', overflowX: 'hidden', overflowY: 'hidden' }; this.scrollablePixelsX && (k.overflowX = 'auto'); this.scrollablePixelsY && (k.overflowY = 'auto'); this.scrollingContainer = v('div', { className: 'highcharts-scrolling' }, k, this.renderTo); H(this.scrollingContainer, 'scroll', function () { g.pointer && delete g.pointer.chartPosition }); this.innerContainer = v('div', { className: 'highcharts-inner-container' }, null, this.scrollingContainer); this.innerContainer.appendChild(this.container); this.setUpScrolling =
null
    }; g.prototype.moveFixedElements = function () {
      var g = this.container; var k = this.fixedRenderer; var y = '.highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-legend-checkbox .highcharts-navigator-series .highcharts-navigator-xaxis .highcharts-navigator-yaxis .highcharts-navigator .highcharts-reset-zoom .highcharts-scrollbar .highcharts-subtitle .highcharts-title'.split(' '); var v; this.scrollablePixelsX && !this.inverted ? v = '.highcharts-yaxis' : this.scrollablePixelsX && this.inverted ? v = '.highcharts-xaxis'
        : this.scrollablePixelsY && !this.inverted ? v = '.highcharts-xaxis' : this.scrollablePixelsY && this.inverted && (v = '.highcharts-yaxis'); y.push(v, v + '-labels'); y.forEach(function (y) { [].forEach.call(g.querySelectorAll(y), function (g) { (g.namespaceURI === k.SVG_NS ? k.box : k.box.parentNode).appendChild(g); g.style.pointerEvents = 'auto' }) })
    }; g.prototype.applyFixed = function () {
      var g; var M; var y = !this.fixedDiv; var I = this.options.chart.scrollablePlotArea; y ? (this.fixedDiv = v('div', { className: 'highcharts-fixed' }, {
        position: 'absolute',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2
      }, null, !0), this.renderTo.insertBefore(this.fixedDiv, this.renderTo.firstChild), this.renderTo.style.overflow = 'visible', this.fixedRenderer = M = new k.Renderer(this.fixedDiv, this.chartWidth, this.chartHeight, (g = this.options.chart) === null || void 0 === g ? void 0 : g.style), this.scrollableMask = M.path().attr({ fill: this.options.chart.backgroundColor || '#fff', 'fill-opacity': K(I.opacity, 0.85), zIndex: -1 }).addClass('highcharts-scrollable-mask').add(), this.moveFixedElements(), H(this, 'afterShowResetZoom',
        this.moveFixedElements), H(this, 'afterLayOutTitles', this.moveFixedElements)) : this.fixedRenderer.setSize(this.chartWidth, this.chartHeight); g = this.chartWidth + (this.scrollablePixelsX || 0); M = this.chartHeight + (this.scrollablePixelsY || 0); G(this.container); this.container.style.width = g + 'px'; this.container.style.height = M + 'px'; this.renderer.boxWrapper.attr({ width: g, height: M, viewBox: [0, 0, g, M].join(' ') }); this.chartBackground.attr({ width: g, height: M }); this.scrollingContainer.style.height = this.chartHeight + 'px'; y &&
(I.scrollPositionX && (this.scrollingContainer.scrollLeft = this.scrollablePixelsX * I.scrollPositionX), I.scrollPositionY && (this.scrollingContainer.scrollTop = this.scrollablePixelsY * I.scrollPositionY)); M = this.axisOffset; y = this.plotTop - M[0] - 1; I = this.plotLeft - M[3] - 1; g = this.plotTop + this.plotHeight + M[2] + 1; M = this.plotLeft + this.plotWidth + M[1] + 1; var J = this.plotLeft + this.plotWidth - (this.scrollablePixelsX || 0); var E = this.plotTop + this.plotHeight - (this.scrollablePixelsY || 0); y = this.scrollablePixelsX ? [['M', 0, y], ['L', this.plotLeft -
1, y], ['L', this.plotLeft - 1, g], ['L', 0, g], ['Z'], ['M', J, y], ['L', this.chartWidth, y], ['L', this.chartWidth, g], ['L', J, g], ['Z']] : this.scrollablePixelsY ? [['M', I, 0], ['L', I, this.plotTop - 1], ['L', M, this.plotTop - 1], ['L', M, 0], ['Z'], ['M', I, E], ['L', I, this.chartHeight], ['L', M, this.chartHeight], ['L', M, E], ['Z']] : [['M', 0, 0]]; this.redrawTrigger !== 'adjustHeight' && this.scrollableMask.attr({ d: y })
    }
  }); P(A, 'parts/StackingAxis.js', [A['parts/Utilities.js']], function (k) {
    var g = k.addEvent; var H = k.destroyObjectProperties; var v = k.fireEvent
    var K = k.objectEach; var G = k.pick; var N = (function () {
      function g (g) { this.oldStacks = {}; this.stacks = {}; this.stacksTouched = 0; this.axis = g }g.prototype.buildStacks = function () { var g = this.axis; var k = g.series; var J = G(g.options.reversedStacks, !0); var E = k.length; var D; if (!g.isXAxis) { this.usePercentage = !1; for (D = E; D--;) { var z = k[J ? D : E - D - 1]; z.setStackedPoints() } for (D = 0; D < E; D++)k[D].modifyStacks(); v(g, 'afterBuildStacks') } }; g.prototype.cleanStacks = function () {
        if (!this.axis.isXAxis) {
          if (this.oldStacks) var g = this.stacks = this.oldStacks; K(g, function (g) {
            K(g,
              function (g) { g.cumulative = g.total })
          })
        }
      }; g.prototype.resetStacks = function () { var g = this; var k = g.stacks; g.axis.isXAxis || K(k, function (k) { K(k, function (y, D) { y.touched < g.stacksTouched ? (y.destroy(), delete k[D]) : (y.total = null, y.cumulative = null) }) }) }; g.prototype.renderStackTotals = function () { var g = this.axis.chart; var k = g.renderer; var v = this.stacks; var E = this.stackTotalGroup = this.stackTotalGroup || k.g('stack-labels').attr({ visibility: 'visible', zIndex: 6 }).add(); E.translate(g.plotLeft, g.plotTop); K(v, function (g) { K(g, function (g) { g.render(E) }) }) }
      return g
    }()); return (function () { function k () {}k.compose = function (y) { g(y, 'init', k.onInit); g(y, 'destroy', k.onDestroy) }; k.onDestroy = function () { var g = this.stacking; if (g) { var k = g.stacks; K(k, function (g, y) { H(g); k[y] = null }); g && g.stackTotalGroup && g.stackTotalGroup.destroy() } }; k.onInit = function () { this.stacking || (this.stacking = new N(this)) }; return k }())
  }); P(A, 'mixins/legend-symbol.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.merge; var v = g.pick; k.LegendSymbolMixin = {
      drawRectangle: function (g,
        k) { var G = g.symbolHeight; var M = g.options.squareSymbol; k.legendSymbol = this.chart.renderer.rect(M ? (g.symbolWidth - G) / 2 : 0, g.baseline - G + 1, M ? G : g.symbolWidth, G, v(g.options.symbolRadius, G / 2)).addClass('highcharts-point').attr({ zIndex: 3 }).add(k.legendGroup) },
      drawLineMarker: function (g) {
        var k = this.options; var N = k.marker; var M = g.symbolWidth; var y = g.symbolHeight; var I = y / 2; var J = this.chart.renderer; var E = this.legendGroup; g = g.baseline - Math.round(0.3 * g.fontMetrics.b); var D = {}; this.chart.styledMode || (D = { 'stroke-width': k.lineWidth || 0 }, k.dashStyle &&
(D.dashstyle = k.dashStyle)); this.legendLine = J.path(['M', 0, g, 'L', M, g]).addClass('highcharts-graph').attr(D).add(E); N && !1 !== N.enabled && M && (k = Math.min(v(N.radius, I), I), this.symbol.indexOf('url') === 0 && (N = H(N, { width: y, height: y }), k = 0), this.legendSymbol = N = J.symbol(this.symbol, M / 2 - k, g - k, 2 * k, 2 * k, N).addClass('highcharts-point').add(E), N.isMarker = !0)
      }
    }; return k.LegendSymbolMixin
  }); P(A, 'parts/Point.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    ''; var H = g.animObject; var v = g.defined; var K = g.erase; var G =
g.extend; var N = g.fireEvent; var M = g.format; var y = g.getNestedProperty; var I = g.isArray; var J = g.isNumber; var E = g.isObject; var D = g.syncTimeout; var z = g.pick; var t = g.removeEvent; var q = g.uniqueKey; g = (function () {
      function g () { this.colorIndex = this.category = void 0; this.formatPrefix = 'point'; this.id = void 0; this.isNull = !1; this.percentage = this.options = this.name = void 0; this.selected = !1; this.total = this.series = void 0; this.visible = !0; this.x = void 0 }g.prototype.animateBeforeDestroy = function () {
        var h = this; var f = { x: h.startXPos, opacity: 0 }; var a; var l = h.getGraphicalProps(); l.singular.forEach(function (e) {
          a =
e === 'dataLabel'; h[e] = h[e].animate(a ? { x: h[e].startXPos, y: h[e].startYPos, opacity: 0 } : f)
        }); l.plural.forEach(function (a) { h[a].forEach(function (a) { a.element && a.animate(G({ x: h.startXPos }, a.startYPos ? { x: a.startXPos, y: a.startYPos } : {})) }) })
      }; g.prototype.applyOptions = function (h, f) {
        var a = this.series; var l = a.options.pointValKey || a.pointValKey; h = g.prototype.optionsToObject.call(this, h); G(this, h); this.options = this.options ? G(this.options, h) : h; h.group && delete this.group; h.dataLabels && delete this.dataLabels; l && (this.y =
g.prototype.getNestedProperty.call(this, l)); this.formatPrefix = (this.isNull = z(this.isValid && !this.isValid(), this.x === null || !J(this.y))) ? 'null' : 'point'; this.selected && (this.state = 'select'); 'name' in this && typeof f === 'undefined' && a.xAxis && a.xAxis.hasNames && (this.x = a.xAxis.nameToX(this)); typeof this.x === 'undefined' && a && (this.x = typeof f === 'undefined' ? a.autoIncrement(this) : f); return this
      }; g.prototype.destroy = function () {
        function h () {
          if (f.graphic || f.dataLabel || f.dataLabels)t(f), f.destroyElements(); for (m in f) {
            f[m] =
null
          }
        } var f = this; var a = f.series; var l = a.chart; a = a.options.dataSorting; var e = l.hoverPoints; var c = H(f.series.chart.renderer.globalAnimation); var m; f.legendItem && l.legend.destroyItem(f); e && (f.setState(), K(e, f), e.length || (l.hoverPoints = null)); if (f === l.hoverPoint)f.onMouseOut(); a && a.enabled ? (this.animateBeforeDestroy(), D(h, c.duration)) : h(); l.pointCount--
      }; g.prototype.destroyElements = function (h) {
        var f = this; h = f.getGraphicalProps(h); h.singular.forEach(function (a) { f[a] = f[a].destroy() }); h.plural.forEach(function (a) {
          f[a].forEach(function (a) {
            a.element &&
a.destroy()
          }); delete f[a]
        })
      }; g.prototype.firePointEvent = function (h, f, a) { var l = this; var e = this.series.options; (e.point.events[h] || l.options && l.options.events && l.options.events[h]) && l.importEvents(); h === 'click' && e.allowPointSelect && (a = function (a) { l.select && l.select(null, a.ctrlKey || a.metaKey || a.shiftKey) }); N(l, h, f, a) }; g.prototype.getClassName = function () {
        return 'highcharts-point' + (this.selected ? ' highcharts-point-select' : '') + (this.negative ? ' highcharts-negative' : '') + (this.isNull ? ' highcharts-null-point' : '') +
(typeof this.colorIndex !== 'undefined' ? ' highcharts-color-' + this.colorIndex : '') + (this.options.className ? ' ' + this.options.className : '') + (this.zone && this.zone.className ? ' ' + this.zone.className.replace('highcharts-negative', '') : '')
      }; g.prototype.getGraphicalProps = function (h) {
        var f = this; var a = []; var l; var e = { singular: [], plural: [] }; h = h || { graphic: 1, dataLabel: 1 }; h.graphic && a.push('graphic', 'shadowGroup'); h.dataLabel && a.push('dataLabel', 'dataLabelUpper', 'connector'); for (l = a.length; l--;) { var c = a[l]; f[c] && e.singular.push(c) }['dataLabel',
          'connector'].forEach(function (a) { var c = a + 's'; h[a] && f[c] && e.plural.push(c) }); return e
      }; g.prototype.getLabelConfig = function () { return { x: this.category, y: this.y, color: this.color, colorIndex: this.colorIndex, key: this.name || this.category, series: this.series, point: this, percentage: this.percentage, total: this.total || this.stackTotal } }; g.prototype.getNestedProperty = function (h) { if (h) return h.indexOf('custom.') === 0 ? y(h, this.options) : this[h] }; g.prototype.getZone = function () {
        var h = this.series; var f = h.zones; h = h.zoneAxis ||
'y'; var a = 0; var l; for (l = f[a]; this[h] >= l.value;)l = f[++a]; this.nonZonedColor || (this.nonZonedColor = this.color); this.color = l && l.color && !this.options.color ? l.color : this.nonZonedColor; return l
      }; g.prototype.hasNewShapeType = function () { return (this.graphic && (this.graphic.symbolName || this.graphic.element.nodeName)) !== this.shapeType }; g.prototype.init = function (h, f, a) { this.series = h; this.applyOptions(f, a); this.id = v(this.id) ? this.id : q(); this.resolveColor(); h.chart.pointCount++; N(this, 'afterInit'); return this }; g.prototype.optionsToObject =
function (h) { var f = {}; var a = this.series; var l = a.options.keys; var e = l || a.pointArrayMap || ['y']; var c = e.length; var m = 0; var u = 0; if (J(h) || h === null)f[e[0]] = h; else if (I(h)) for (!l && h.length > c && (a = typeof h[0], a === 'string' ? f.name = h[0] : a === 'number' && (f.x = h[0]), m++); u < c;)l && typeof h[m] === 'undefined' || (e[u].indexOf('.') > 0 ? g.prototype.setNestedProperty(f, h[m], e[u]) : f[e[u]] = h[m]), m++, u++; else typeof h === 'object' && (f = h, h.dataLabels && (a._hasPointLabels = !0), h.marker && (a._hasPointMarkers = !0)); return f }; g.prototype.resolveColor = function () {
        var h =
this.series; var f = h.chart.options.chart.colorCount; var a = h.chart.styledMode; delete this.nonZonedColor; a || this.options.color || (this.color = h.color); h.options.colorByPoint ? (a || (f = h.options.colors || h.chart.options.colors, this.color = this.color || f[h.colorCounter], f = f.length), a = h.colorCounter, h.colorCounter++, h.colorCounter === f && (h.colorCounter = 0)) : a = h.colorIndex; this.colorIndex = z(this.colorIndex, a)
      }; g.prototype.setNestedProperty = function (h, f, a) {
        a.split('.').reduce(function (a, e, c, h) {
          a[e] = h.length - 1 === c
            ? f : E(a[e], !0) ? a[e] : {}; return a[e]
        }, h); return h
      }; g.prototype.tooltipFormatter = function (h) { var f = this.series; var a = f.tooltipOptions; var l = z(a.valueDecimals, ''); var e = a.valuePrefix || ''; var c = a.valueSuffix || ''; f.chart.styledMode && (h = f.chart.tooltip.styledModeFormat(h)); (f.pointArrayMap || ['y']).forEach(function (a) { a = '{point.' + a; if (e || c)h = h.replace(RegExp(a + '}', 'g'), e + a + '}' + c); h = h.replace(RegExp(a + '}', 'g'), a + ':,.' + l + 'f}') }); return M(h, { point: this, series: this.series }, f.chart) }; return g
    }()); k.Point = g; return k.Point
  }); P(A,
    'parts/Series.js', [A['mixins/legend-symbol.js'], A['parts/Globals.js'], A['parts/Point.js'], A['parts/Utilities.js']], function (k, g, H, v) {
      ''; var K = v.addEvent; var G = v.animObject; var N = v.arrayMax; var M = v.arrayMin; var y = v.clamp; var I = v.correctFloat; var J = v.defined; var E = v.erase; var D = v.error; var z = v.extend; var t = v.find; var q = v.fireEvent; var r = v.getNestedProperty; var h = v.isArray; var f = v.isFunction; var a = v.isNumber; var l = v.isString; var e = v.merge; var c = v.objectEach; var m = v.pick; var u = v.removeEvent; var L = v.seriesType; var F = v.splat; var w = v.syncTimeout; var p = g.defaultOptions; var C = g.defaultPlotOptions; var O = g.seriesTypes
      var B = g.SVGElement; var d = g.win; g.Series = L('line', null, {
        lineWidth: 2,
        allowPointSelect: !1,
        crisp: !0,
        showCheckbox: !1,
        animation: { duration: 1E3 },
        events: {},
        marker: { enabledThreshold: 2, lineColor: '#ffffff', lineWidth: 0, radius: 4, states: { normal: { animation: !0 }, hover: { animation: { duration: 50 }, enabled: !0, radiusPlus: 2, lineWidthPlus: 1 }, select: { fillColor: '#cccccc', lineColor: '#000000', lineWidth: 2 } } },
        point: { events: {} },
        dataLabels: {
          align: 'center',
          formatter: function () {
            var b = this.series.chart.numberFormatter; return typeof this.y !== 'number'
              ? '' : b(this.y, -1)
          },
          padding: 5,
          style: { fontSize: '11px', fontWeight: 'bold', color: 'contrast', textOutline: '1px contrast' },
          verticalAlign: 'bottom',
          x: 0,
          y: 0
        },
        cropThreshold: 300,
        opacity: 1,
        pointRange: 0,
        softThreshold: !0,
        states: { normal: { animation: !0 }, hover: { animation: { duration: 50 }, lineWidthPlus: 1, marker: {}, halo: { size: 10, opacity: 0.25 } }, select: { animation: { duration: 0 } }, inactive: { animation: { duration: 50 }, opacity: 0.2 } },
        stickyTracking: !0,
        turboThreshold: 1E3,
        findNearestPointBy: 'x'
      }, {
        axisTypes: ['xAxis', 'yAxis'],
        coll: 'series',
        colorCounter: 0,
        cropShoulder: 1,
        directTouch: !1,
        eventsToUnbind: [],
        isCartesian: !0,
        parallelArrays: ['x', 'y'],
        pointClass: H,
        requireSorting: !0,
        sorted: !0,
        init: function (b, a) {
          q(this, 'init', { options: a }); var d = this; var e = b.series; var h; this.eventOptions = this.eventOptions || {}; d.chart = b; d.options = a = d.setOptions(a); d.linkedSeries = []; d.bindAxes(); z(d, { name: a.name, state: '', visible: !1 !== a.visible, selected: !0 === a.selected }); var n = a.events; c(n, function (b, a) {
            f(b) && d.eventOptions[a] !== b && (f(d.eventOptions[a]) && u(d, a, d.eventOptions[a]),
            d.eventOptions[a] = b, K(d, a, b))
          }); if (n && n.click || a.point && a.point.events && a.point.events.click || a.allowPointSelect)b.runTrackerClick = !0; d.getColor(); d.getSymbol(); d.parallelArrays.forEach(function (b) { d[b + 'Data'] || (d[b + 'Data'] = []) }); d.isCartesian && (b.hasCartesianSeries = !0); e.length && (h = e[e.length - 1]); d._i = m(h && h._i, -1) + 1; b.orderSeries(this.insert(e)); a.dataSorting && a.dataSorting.enabled ? d.setDataSortingOptions() : d.points || d.data || d.setData(a.data, !1); q(this, 'afterInit')
        },
        is: function (b) {
          return O[b] &&
this instanceof O[b]
        },
        insert: function (b) { var d = this.options.index; var c; if (a(d)) { for (c = b.length; c--;) if (d >= m(b[c].options.index, b[c]._i)) { b.splice(c + 1, 0, this); break }c === -1 && b.unshift(this); c += 1 } else b.push(this); return m(c, b.length - 1) },
        bindAxes: function () {
          var b = this; var a = b.options; var d = b.chart; var c; q(this, 'bindAxes', null, function () {
            (b.axisTypes || []).forEach(function (e) {
              d[e].forEach(function (d) {
                c = d.options; if (a[e] === c.index || typeof a[e] !== 'undefined' && a[e] === c.id || typeof a[e] === 'undefined' && c.index === 0) {
                  b.insert(d.series),
                  b[e] = d, d.isDirty = !0
                }
              }); b[e] || b.optionalAxis === e || D(18, !0, d)
            })
          }); q(this, 'afterBindAxes')
        },
        updateParallelArrays: function (b, d) { var c = b.series; var e = arguments; var f = a(d) ? function (a) { var e = a === 'y' && c.toYData ? c.toYData(b) : b[a]; c[a + 'Data'][d] = e } : function (b) { Array.prototype[d].apply(c[b + 'Data'], Array.prototype.slice.call(e, 2)) }; c.parallelArrays.forEach(f) },
        hasData: function () { return this.visible && typeof this.dataMax !== 'undefined' && typeof this.dataMin !== 'undefined' || this.visible && this.yData && this.yData.length > 0 },
        autoIncrement: function () {
          var b =
this.options; var a = this.xIncrement; var d; var c = b.pointIntervalUnit; var e = this.chart.time; a = m(a, b.pointStart, 0); this.pointInterval = d = m(this.pointInterval, b.pointInterval, 1); c && (b = new e.Date(a), c === 'day' ? e.set('Date', b, e.get('Date', b) + d) : c === 'month' ? e.set('Month', b, e.get('Month', b) + d) : c === 'year' && e.set('FullYear', b, e.get('FullYear', b) + d), d = b.getTime() - a); this.xIncrement = a + d; return a
        },
        setDataSortingOptions: function () {
          var b = this.options; z(this, { requireSorting: !1, sorted: !1, enabledDataSorting: !0, allowDG: !1 }); J(b.pointRange) ||
(b.pointRange = 1)
        },
        setOptions: function (b) {
          var a = this.chart; var d = a.options; var c = d.plotOptions; var f = a.userOptions || {}; b = e(b); a = a.styledMode; var h = { plotOptions: c, userOptions: b }; q(this, 'setOptions', h); var l = h.plotOptions[this.type]; var u = f.plotOptions || {}; this.userOptions = h.userOptions; f = e(l, c.series, f.plotOptions && f.plotOptions[this.type], b); this.tooltipOptions = e(p.tooltip, p.plotOptions.series && p.plotOptions.series.tooltip, p.plotOptions[this.type].tooltip, d.tooltip.userOptions, c.series && c.series.tooltip, c[this.type].tooltip,
            b.tooltip); this.stickyTracking = m(b.stickyTracking, u[this.type] && u[this.type].stickyTracking, u.series && u.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : f.stickyTracking); l.marker === null && delete f.marker; this.zoneAxis = f.zoneAxis; d = this.zones = (f.zones || []).slice(); !f.negativeColor && !f.negativeFillColor || f.zones || (c = { value: f[this.zoneAxis + 'Threshold'] || f.threshold || 0, className: 'highcharts-negative' }, a || (c.color = f.negativeColor, c.fillColor = f.negativeFillColor), d.push(c)); d.length &&
J(d[d.length - 1].value) && d.push(a ? {} : { color: this.color, fillColor: this.fillColor }); q(this, 'afterSetOptions', { options: f }); return f
        },
        getName: function () { return m(this.options.name, 'Series ' + (this.index + 1)) },
        getCyclic: function (b, a, d) { var c = this.chart; var e = this.userOptions; var f = b + 'Index'; var h = b + 'Counter'; var n = d ? d.length : m(c.options.chart[b + 'Count'], c[b + 'Count']); if (!a) { var p = m(e[f], e['_' + f]); J(p) || (c.series.length || (c[h] = 0), e['_' + f] = p = c[h] % n, c[h] += 1); d && (a = d[p]) } typeof p !== 'undefined' && (this[f] = p); this[b] = a },
        getColor: function () {
          this.chart.styledMode
            ? this.getCyclic('color') : this.options.colorByPoint ? this.options.color = null : this.getCyclic('color', this.options.color || C[this.type].color, this.chart.options.colors)
        },
        getPointsCollection: function () { return (this.hasGroupedData ? this.points : this.data) || [] },
        getSymbol: function () { this.getCyclic('symbol', this.options.marker.symbol, this.chart.options.symbols) },
        findPointIndex: function (b, d) {
          var c = b.id; var e = b.x; var f = this.points; var h; var n = this.options.dataSorting; if (c) var p = this.chart.get(c); else if (this.linkedParent || this.enabledDataSorting) {
            var l =
n && n.matchByName ? 'name' : 'index'; p = t(f, function (a) { return !a.touched && a[l] === b[l] }); if (!p) return
          } if (p) { var m = p && p.index; typeof m !== 'undefined' && (h = !0) } typeof m === 'undefined' && a(e) && (m = this.xData.indexOf(e, d)); m !== -1 && typeof m !== 'undefined' && this.cropped && (m = m >= this.cropStart ? m - this.cropStart : m); !h && f[m] && f[m].touched && (m = void 0); return m
        },
        drawLegendSymbol: k.drawLineMarker,
        updateData: function (b, d) {
          var c = this.options; var e = c.dataSorting; var f = this.points; var h = []; var n; var p; var m; var l = this.requireSorting; var u = b.length === f.length
          var w = !0; this.xIncrement = null; b.forEach(function (b, d) { var p = J(b) && this.pointClass.prototype.optionsToObject.call({ series: this }, b) || {}; var w = p.x; if (p.id || a(w)) { if (w = this.findPointIndex(p, m), w === -1 || typeof w === 'undefined' ? h.push(b) : f[w] && b !== c.data[w] ? (f[w].update(b, !1, null, !1), f[w].touched = !0, l && (m = w + 1)) : f[w] && (f[w].touched = !0), !u || d !== w || e && e.enabled || this.hasDerivedData)n = !0 } else h.push(b) }, this); if (n) for (b = f.length; b--;)(p = f[b]) && !p.touched && p.remove && p.remove(!1, d); else {
            !u || e && e.enabled ? w = !1 : (b.forEach(function (b,
              a) { f[a].update && b !== f[a].y && f[a].update(b, !1, null, !1) }), h.length = 0)
          } f.forEach(function (b) { b && (b.touched = !1) }); if (!w) return !1; h.forEach(function (b) { this.addPoint(b, !1, null, null, !1) }, this); this.xIncrement === null && this.xData && this.xData.length && (this.xIncrement = N(this.xData), this.autoIncrement()); return !0
        },
        setData: function (b, d, c, e) {
          var f = this; var n = f.points; var p = n && n.length || 0; var u; var w = f.options; var x = f.chart; var C = w.dataSorting; var g = null; var r = f.xAxis; g = w.turboThreshold; var F = this.xData; var q = this.yData; var t = (u = f.pointArrayMap) && u.length
          var B = w.keys; var k = 0; var O = 1; var z; b = b || []; u = b.length; d = m(d, !0); C && C.enabled && (b = this.sortData(b)); !1 !== e && u && p && !f.cropped && !f.hasGroupedData && f.visible && !f.isSeriesBoosting && (z = this.updateData(b, c)); if (!z) {
            f.xIncrement = null; f.colorCounter = 0; this.parallelArrays.forEach(function (b) { f[b + 'Data'].length = 0 }); if (g && u > g) {
              if (g = f.getFirstValidPoint(b), a(g)) for (c = 0; c < u; c++)F[c] = this.autoIncrement(), q[c] = b[c]; else if (h(g)) {
                if (t) for (c = 0; c < u; c++)e = b[c], F[c] = e[0], q[c] = e.slice(1, t + 1); else {
                  for (B && (k = B.indexOf('x'), O = B.indexOf('y'),
                  k = k >= 0 ? k : 0, O = O >= 0 ? O : 1), c = 0; c < u; c++)e = b[c], F[c] = e[k], q[c] = e[O]
                }
              } else D(12, !1, x)
            } else for (c = 0; c < u; c++) typeof b[c] !== 'undefined' && (e = { series: f }, f.pointClass.prototype.applyOptions.apply(e, [b[c]]), f.updateParallelArrays(e, c)); q && l(q[0]) && D(14, !0, x); f.data = []; f.options.data = f.userOptions.data = b; for (c = p; c--;)n[c] && n[c].destroy && n[c].destroy(); r && (r.minRange = r.userMinRange); f.isDirty = x.isDirtyBox = !0; f.isDirtyData = !!n; c = !1
          }w.legendType === 'point' && (this.processData(), this.generatePoints()); d && x.redraw(c)
        },
        sortData: function (b) {
          var a = this; var d = a.options.dataSorting.sortKey || 'y'; var c = function (b, a) { return J(a) && b.pointClass.prototype.optionsToObject.call({ series: b }, a) || {} }; b.forEach(function (d, e) { b[e] = c(a, d); b[e].index = e }, this); b.concat().sort(function (b, a) { b = r(d, b); a = r(d, a); return a < b ? -1 : a > b ? 1 : 0 }).forEach(function (b, a) { b.x = a }, this); a.linkedSeries && a.linkedSeries.forEach(function (a) {
            var d = a.options; var e = d.data; d.dataSorting && d.dataSorting.enabled || !e || (e.forEach(function (d, f) {
              e[f] = c(a, d); b[f] && (e[f].x = b[f].x, e[f].index =
f)
            }), a.setData(e, !1))
          }); return b
        },
        getProcessedData: function (b) {
          var a = this.xData; var d = this.yData; var c = a.length; var e = 0; var f = this.xAxis; var h = this.options; var p = h.cropThreshold; var m = b || this.getExtremesFromAll || h.getExtremesFromAll; var l = this.isCartesian; b = f && f.val2lin; h = !(!f || !f.logarithmic); var u = this.requireSorting; if (f) { f = f.getExtremes(); var w = f.min; var C = f.max } if (l && this.sorted && !m && (!p || c > p || this.forceCrop)) {
            if (a[c - 1] < w || a[0] > C)a = [], d = []; else if (this.yData && (a[0] < w || a[c - 1] > C)) {
              e = this.cropData(this.xData, this.yData,
                w, C); a = e.xData; d = e.yData; e = e.start; var g = !0
            }
          } for (p = a.length || 1; --p;) if (c = h ? b(a[p]) - b(a[p - 1]) : a[p] - a[p - 1], c > 0 && (typeof r === 'undefined' || c < r)) var r = c; else c < 0 && u && (D(15, !1, this.chart), u = !1); return { xData: a, yData: d, cropped: g, cropStart: e, closestPointRange: r }
        },
        processData: function (b) {
          var a = this.xAxis; if (this.isCartesian && !this.isDirty && !a.isDirty && !this.yAxis.isDirty && !b) return !1; b = this.getProcessedData(); this.cropped = b.cropped; this.cropStart = b.cropStart; this.processedXData = b.xData; this.processedYData = b.yData
          this.closestPointRange = this.basePointRange = b.closestPointRange
        },
        cropData: function (b, a, d, c, e) { var f = b.length; var h = 0; var n = f; var p; e = m(e, this.cropShoulder); for (p = 0; p < f; p++) if (b[p] >= d) { h = Math.max(0, p - e); break } for (d = p; d < f; d++) if (b[d] > c) { n = d + e; break } return { xData: b.slice(h, n), yData: a.slice(h, n), start: h, end: n } },
        generatePoints: function () {
          var b = this.options; var a = b.data; var d = this.data; var c; var e = this.processedXData; var f = this.processedYData; var h = this.pointClass; var p = e.length; var m = this.cropStart || 0; var l = this.hasGroupedData; b = b.keys; var u = []; var w; d ||
l || (d = [], d.length = a.length, d = this.data = d); b && l && (this.options.keys = !1); for (w = 0; w < p; w++) { var C = m + w; if (l) { var g = (new h()).init(this, [e[w]].concat(F(f[w]))); g.dataGroup = this.groupMap[w]; g.dataGroup.options && (g.options = g.dataGroup.options, z(g, g.dataGroup.options), delete g.dataLabels) } else (g = d[C]) || typeof a[C] === 'undefined' || (d[C] = g = (new h()).init(this, a[C], e[w])); g && (g.index = C, u[w] = g) } this.options.keys = b; if (d && (p !== (c = d.length) || l)) {
            for (w = 0; w < c; w++) {
              w !== m || l || (w += p), d[w] && (d[w].destroyElements(), d[w].plotX =
void 0)
            }
          } this.data = d; this.points = u; q(this, 'afterGeneratePoints')
        },
        getXExtremes: function (b) { return { min: M(b), max: N(b) } },
        getExtremes: function (b, d) {
          var c = this.xAxis; var e = this.yAxis; var f = this.processedXData || this.xData; var n = []; var p = 0; var m = 0; var l = 0; var u = this.requireSorting ? this.cropShoulder : 0; var w = e ? e.positiveValuesOnly : !1; var C; b = b || this.stackedYData || this.processedYData || []; e = b.length; c && (l = c.getExtremes(), m = l.min, l = l.max); for (C = 0; C < e; C++) {
            var g = f[C]; var r = b[C]; var F = (a(r) || h(r)) && (r.length || r > 0 || !w); g = d || this.getExtremesFromAll ||
this.options.getExtremesFromAll || this.cropped || !c || (f[C + u] || g) >= m && (f[C - u] || g) <= l; if (F && g) if (F = r.length) for (;F--;)a(r[F]) && (n[p++] = r[F]); else n[p++] = r
          }b = { dataMin: M(n), dataMax: N(n) }; q(this, 'afterGetExtremes', { dataExtremes: b }); return b
        },
        applyExtremes: function () { var b = this.getExtremes(); this.dataMin = b.dataMin; this.dataMax = b.dataMax; return b },
        getFirstValidPoint: function (b) { for (var a = null, d = b.length, c = 0; a === null && c < d;)a = b[c], c++; return a },
        translate: function () {
          this.processedXData || this.processData(); this.generatePoints()
          var b = this.options; var d = b.stacking; var c = this.xAxis; var e = c.categories; var f = this.enabledDataSorting; var p = this.yAxis; var l = this.points; var u = l.length; var w = !!this.modifyValue; var C; var g = this.pointPlacementToXValue(); var r = !!g; var F = b.threshold; var t = b.startFromThreshold ? F : 0; var B; var k = this.zoneAxis || 'y'; var O = Number.MAX_VALUE; for (C = 0; C < u; C++) {
            var z = l[C]; var L = z.x; var D = z.y; var v = z.low; var E = d && p.stacking && p.stacking.stacks[(this.negStacks && D < (t ? 0 : F) ? '-' : '') + this.stackKey]; p.positiveValuesOnly && D !== null && D <= 0 && (z.isNull = !0); z.plotX = B = I(y(c.translate(L, 0, 0, 0, 1, g, this.type ===
'flags'), -1E5, 1E5)); if (d && this.visible && E && E[L]) { var G = this.getStackIndicator(G, L, this.index); if (!z.isNull) { var M = E[L]; var H = M.points[G.key] } }h(H) && (v = H[0], D = H[1], v === t && G.key === E[L].base && (v = m(a(F) && F, p.min)), p.positiveValuesOnly && v <= 0 && (v = null), z.total = z.stackTotal = M.total, z.percentage = M.total && z.y / M.total * 100, z.stackY = D, this.irregularWidths || M.setOffset(this.pointXOffset || 0, this.barW || 0)); z.yBottom = J(v) ? y(p.translate(v, 0, 1, 0, 1), -1E5, 1E5) : null; w && (D = this.modifyValue(D, z)); z.plotY = typeof D === 'number' &&
Infinity !== D ? y(p.translate(D, 0, 1, 0, 1), -1E5, 1E5) : void 0; z.isInside = this.isPointInside(z); z.clientX = r ? I(c.translate(L, 0, 0, 0, 1, g)) : B; z.negative = z[k] < (b[k + 'Threshold'] || F || 0); z.category = e && typeof e[z.x] !== 'undefined' ? e[z.x] : z.x; if (!z.isNull && !1 !== z.visible) { typeof N !== 'undefined' && (O = Math.min(O, Math.abs(B - N))); var N = B }z.zone = this.zones.length && z.getZone(); !z.graphic && this.group && f && (z.isNew = !0)
          } this.closestPointRangePx = O; q(this, 'afterTranslate')
        },
        getValidPoints: function (b, a, d) {
          var c = this.chart; return (b ||
this.points || []).filter(function (b) { return a && !c.isInsidePlot(b.plotX, b.plotY, c.inverted) ? !1 : !1 !== b.visible && (d || !b.isNull) })
        },
        getClipBox: function (b, a) { var d = this.options; var c = this.chart; var e = c.inverted; var f = this.xAxis; var h = f && this.yAxis; b && !1 === d.clip && h ? b = e ? { y: -c.chartWidth + h.len + h.pos, height: c.chartWidth, width: c.chartHeight, x: -c.chartHeight + f.len + f.pos } : { y: -h.pos, height: c.chartHeight, width: c.chartWidth, x: -f.pos } : (b = this.clipBox || c.clipBox, a && (b.width = c.plotSizeX, b.x = 0)); return a ? { width: b.width, x: b.x } : b },
        setClip: function (b) {
          var a =
this.chart; var d = this.options; var c = a.renderer; var e = a.inverted; var f = this.clipBox; var h = this.getClipBox(b); var p = this.sharedClipKey || ['_sharedClip', b && b.duration, b && b.easing, h.height, d.xAxis, d.yAxis].join(); var m = a[p]; var l = a[p + 'm']; b && (h.width = 0, e && (h.x = a.plotHeight + (!1 !== d.clip ? 0 : a.plotTop))); m ? a.hasLoaded || m.attr(h) : (b && (a[p + 'm'] = l = c.clipRect(e ? a.plotSizeX + 99 : -99, e ? -a.plotLeft : -a.plotTop, 99, e ? a.chartWidth : a.chartHeight)), a[p] = m = c.clipRect(h), m.count = { length: 0 }); b && !m.count[this.index] && (m.count[this.index] = !0, m.count.length +=
1); if (!1 !== d.clip || b) this.group.clip(b || f ? m : a.clipRect), this.markerGroup.clip(l), this.sharedClipKey = p; b || (m.count[this.index] && (delete m.count[this.index], --m.count.length), m.count.length === 0 && p && a[p] && (f || (a[p] = a[p].destroy()), a[p + 'm'] && (a[p + 'm'] = a[p + 'm'].destroy())))
        },
        animate: function (b) {
          var a = this.chart; var d = G(this.options.animation); if (!a.hasRendered) {
            if (b) this.setClip(d); else {
              var c = this.sharedClipKey; b = a[c]; var e = this.getClipBox(d, !0); b && b.animate(e, d); a[c + 'm'] && a[c + 'm'].animate({
                width: e.width + 99,
                x: e.x - (a.inverted ? 0 : 99)
              }, d)
            }
          }
        },
        afterAnimate: function () { this.setClip(); q(this, 'afterAnimate'); this.finishedAnimating = !0 },
        drawPoints: function () {
          var b = this.points; var a = this.chart; var d; var c; var e = this.options.marker; var f = this[this.specialGroup] || this.markerGroup; var h = this.xAxis; var p = m(e.enabled, !h || h.isRadial ? !0 : null, this.closestPointRangePx >= e.enabledThreshold * e.radius); if (!1 !== e.enabled || this._hasPointMarkers) {
            for (d = 0; d < b.length; d++) {
              var l = b[d]; var u = (c = l.graphic) ? 'animate' : 'attr'; var w = l.marker || {}; var C = !!l.marker; if ((p &&
typeof w.enabled === 'undefined' || w.enabled) && !l.isNull && !1 !== l.visible) {
                var g = m(w.symbol, this.symbol); var r = this.markerAttribs(l, l.selected && 'select'); this.enabledDataSorting && (l.startXPos = h.reversed ? -r.width : h.width); var F = !1 !== l.isInside; c ? c[F ? 'show' : 'hide'](F).animate(r) : F && (r.width > 0 || l.hasImage) && (l.graphic = c = a.renderer.symbol(g, r.x, r.y, r.width, r.height, C ? w : e).add(f), this.enabledDataSorting && a.hasRendered && (c.attr({ x: l.startXPos }), u = 'animate')); c && u === 'animate' && c[F ? 'show' : 'hide'](F).animate(r)
                if (c && !a.styledMode)c[u](this.pointAttribs(l, l.selected && 'select')); c && c.addClass(l.getClassName(), !0)
              } else c && (l.graphic = c.destroy())
            }
          }
        },
        markerAttribs: function (b, a) { var d = this.options; var c = d.marker; var e = b.marker || {}; var f = e.symbol || c.symbol; var h = m(e.radius, c.radius); a && (c = c.states[a], a = e.states && e.states[a], h = m(a && a.radius, c && c.radius, h + (c && c.radiusPlus || 0))); b.hasImage = f && f.indexOf('url') === 0; b.hasImage && (h = 0); b = { x: d.crisp ? Math.floor(b.plotX) - h : b.plotX - h, y: b.plotY - h }; h && (b.width = b.height = 2 * h); return b },
        pointAttribs: function (b,
          a) { var d = this.options.marker; var c = b && b.options; var e = c && c.marker || {}; var f = this.color; var h = c && c.color; var p = b && b.color; c = m(e.lineWidth, d.lineWidth); var n = b && b.zone && b.zone.color; b = 1; f = h || n || p || f; h = e.fillColor || d.fillColor || f; f = e.lineColor || d.lineColor || f; a = a || 'normal'; d = d.states[a]; a = e.states && e.states[a] || {}; c = m(a.lineWidth, d.lineWidth, c + m(a.lineWidthPlus, d.lineWidthPlus, 0)); h = a.fillColor || d.fillColor || h; f = a.lineColor || d.lineColor || f; b = m(a.opacity, d.opacity, b); return { stroke: f, 'stroke-width': c, fill: h, opacity: b } },
        destroy: function (b) {
          var a =
this; var e = a.chart; var f = /AppleWebKit\/533/.test(d.navigator.userAgent); var h; var p; var l = a.data || []; var m; var u; q(a, 'destroy'); this.removeEvents(b); (a.axisTypes || []).forEach(function (b) { (u = a[b]) && u.series && (E(u.series, a), u.isDirty = u.forceRedraw = !0) }); a.legendItem && a.chart.legend.destroyItem(a); for (p = l.length; p--;)(m = l[p]) && m.destroy && m.destroy(); a.points = null; v.clearTimeout(a.animationTimeout); c(a, function (b, a) { b instanceof B && !b.survive && (h = f && a === 'group' ? 'hide' : 'destroy', b[h]()) }); e.hoverSeries === a && (e.hoverSeries = null)
          E(e.series, a); e.orderSeries(); c(a, function (d, c) { b && c === 'hcEvents' || delete a[c] })
        },
        getGraphPath: function (b, a, d) {
          var c = this; var e = c.options; var f = e.step; var h; var p = []; var n = []; var l; b = b || c.points; (h = b.reversed) && b.reverse(); (f = { right: 1, center: 2 }[f] || f && 3) && h && (f = 4 - f); b = this.getValidPoints(b, !1, !(e.connectNulls && !a && !d)); b.forEach(function (h, m) {
            var u = h.plotX; var w = h.plotY; var C = b[m - 1]; (h.leftCliff || C && C.rightCliff) && !d && (l = !0); h.isNull && !J(a) && m > 0 ? l = !e.connectNulls : h.isNull && !a ? l = !0 : (m === 0 || l ? m = [['M', h.plotX, h.plotY]] : c.getPointSpline
              ? m = [c.getPointSpline(b, h, m)] : f ? (m = f === 1 ? [['L', C.plotX, w]] : f === 2 ? [['L', (C.plotX + u) / 2, C.plotY], ['L', (C.plotX + u) / 2, w]] : [['L', u, C.plotY]], m.push(['L', u, w])) : m = [['L', u, w]], n.push(h.x), f && (n.push(h.x), f === 2 && n.push(h.x)), p.push.apply(p, m), l = !1)
          }); p.xMap = n; return c.graphPath = p
        },
        drawGraph: function () {
          var b = this; var a = this.options; var d = (this.gappedPath || this.getGraphPath).call(this); var c = this.chart.styledMode; var e = [['graph', 'highcharts-graph']]; c || e[0].push(a.lineColor || this.color || '#cccccc', a.dashStyle); e = b.getZonesGraphs(e)
          e.forEach(function (e, f) { var h = e[0]; var p = b[h]; var n = p ? 'animate' : 'attr'; p ? (p.endX = b.preventGraphAnimation ? null : d.xMap, p.animate({ d: d })) : d.length && (b[h] = p = b.chart.renderer.path(d).addClass(e[1]).attr({ zIndex: 1 }).add(b.group)); p && !c && (h = { stroke: e[2], 'stroke-width': a.lineWidth, fill: b.fillGraph && b.color || 'none' }, e[3] ? h.dashstyle = e[3] : a.linecap !== 'square' && (h['stroke-linecap'] = h['stroke-linejoin'] = 'round'), p[n](h).shadow(f < 2 && a.shadow)); p && (p.startX = d.xMap, p.isArea = d.isArea) })
        },
        getZonesGraphs: function (b) {
          this.zones.forEach(function (a,
            d) { d = ['zone-graph-' + d, 'highcharts-graph highcharts-zone-graph-' + d + ' ' + (a.className || '')]; this.chart.styledMode || d.push(a.color || this.color, a.dashStyle || this.options.dashStyle); b.push(d) }, this); return b
        },
        applyZones: function () {
          var b = this; var a = this.chart; var d = a.renderer; var c = this.zones; var e; var f; var h = this.clips || []; var p; var l = this.graph; var u = this.area; var w = Math.max(a.chartWidth, a.chartHeight); var C = this[(this.zoneAxis || 'y') + 'Axis']; var g = a.inverted; var r; var F; var q; var t = !1; var B; var k; if (c.length && (l || u) && C && typeof C.min !== 'undefined') {
            var z = C.reversed; var O =
C.horiz; l && !this.showLine && l.hide(); u && u.hide(); var L = C.getExtremes(); c.forEach(function (c, n) {
              e = z ? O ? a.plotWidth : 0 : O ? 0 : C.toPixels(L.min) || 0; e = y(m(f, e), 0, w); f = y(Math.round(C.toPixels(m(c.value, L.max), !0) || 0), 0, w); t && (e = f = C.toPixels(L.max)); r = Math.abs(e - f); F = Math.min(e, f); q = Math.max(e, f); C.isXAxis ? (p = { x: g ? q : F, y: 0, width: r, height: w }, O || (p.x = a.plotHeight - p.x)) : (p = { x: 0, y: g ? q : F, width: w, height: r }, O && (p.y = a.plotWidth - p.y)); g && d.isVML && (p = C.isXAxis ? { x: 0, y: z ? F : q, height: p.width, width: a.chartWidth } : {
                x: p.y - a.plotLeft -
a.spacingBox.x,
                y: 0,
                width: p.height,
                height: a.chartHeight
              }); h[n] ? h[n].animate(p) : h[n] = d.clipRect(p); B = b['zone-area-' + n]; k = b['zone-graph-' + n]; l && k && k.clip(h[n]); u && B && B.clip(h[n]); t = c.value > L.max; b.resetZones && f === 0 && (f = void 0)
            }); this.clips = h
          } else b.visible && (l && l.show(!0), u && u.show(!0))
        },
        invertGroups: function (b) {
          function a () {
            ['group', 'markerGroup'].forEach(function (a) {
              d[a] && (c.renderer.isVML && d[a].attr({ width: d.yAxis.len, height: d.xAxis.len }), d[a].width = d.yAxis.len, d[a].height = d.xAxis.len, d[a].invert(d.isRadialSeries
                ? !1 : b))
            })
          } var d = this; var c = d.chart; d.xAxis && (d.eventsToUnbind.push(K(c, 'resize', a)), a(), d.invertGroups = a)
        },
        plotGroup: function (b, a, d, c, e) {
          var f = this[b]; var h = !f; h && (this[b] = f = this.chart.renderer.g().attr({ zIndex: c || 0.1 }).add(e)); f.addClass('highcharts-' + a + ' highcharts-series-' + this.index + ' highcharts-' + this.type + '-series ' + (J(this.colorIndex) ? 'highcharts-color-' + this.colorIndex + ' ' : '') + (this.options.className || '') + (f.hasClass('highcharts-tracker') ? ' highcharts-tracker' : ''), !0); f.attr({ visibility: d })[h ? 'attr'
            : 'animate'](this.getPlotBox()); return f
        },
        getPlotBox: function () { var b = this.chart; var a = this.xAxis; var d = this.yAxis; b.inverted && (a = d, d = this.xAxis); return { translateX: a ? a.left : b.plotLeft, translateY: d ? d.top : b.plotTop, scaleX: 1, scaleY: 1 } },
        removeEvents: function (b) { b ? this.eventsToUnbind.length && (this.eventsToUnbind.forEach(function (b) { b() }), this.eventsToUnbind.length = 0) : u(this) },
        render: function () {
          var b = this; var a = b.chart; var d = b.options; var c = !b.finishedAnimating && a.renderer.isSVG && G(d.animation).duration; var e = b.visible ? 'inherit'
            : 'hidden'; var f = d.zIndex; var h = b.hasRendered; var p = a.seriesGroup; var l = a.inverted; q(this, 'render'); var m = b.plotGroup('group', 'series', e, f, p); b.markerGroup = b.plotGroup('markerGroup', 'markers', e, f, p); c && b.animate && b.animate(!0); m.inverted = b.isCartesian || b.invertable ? l : !1; b.drawGraph && (b.drawGraph(), b.applyZones()); b.visible && b.drawPoints(); b.drawDataLabels && b.drawDataLabels(); b.redrawPoints && b.redrawPoints(); b.drawTracker && !1 !== b.options.enableMouseTracking && b.drawTracker(); b.invertGroups(l); !1 === d.clip || b.sharedClipKey ||
h || m.clip(a.clipRect); c && b.animate && b.animate(); h || (b.animationTimeout = w(function () { b.afterAnimate() }, c || 0)); b.isDirty = !1; b.hasRendered = !0; q(b, 'afterRender')
        },
        redraw: function () { var b = this.chart; var a = this.isDirty || this.isDirtyData; var d = this.group; var c = this.xAxis; var e = this.yAxis; d && (b.inverted && d.attr({ width: b.plotWidth, height: b.plotHeight }), d.animate({ translateX: m(c && c.left, b.plotLeft), translateY: m(e && e.top, b.plotTop) })); this.translate(); this.render(); a && delete this.kdTree },
        kdAxisArray: ['clientX', 'plotY'],
        searchPoint: function (b,
          a) { var d = this.xAxis; var c = this.yAxis; var e = this.chart.inverted; return this.searchKDTree({ clientX: e ? d.len - b.chartY + d.pos : b.chartX - d.pos, plotY: e ? c.len - b.chartX + c.pos : b.chartY - c.pos }, a, b) },
        buildKDTree: function (b) {
          function a (b, c, e) { var f; if (f = b && b.length) { var h = d.kdAxisArray[c % e]; b.sort(function (b, a) { return b[h] - a[h] }); f = Math.floor(f / 2); return { point: b[f], left: a(b.slice(0, f), c + 1, e), right: a(b.slice(f + 1), c + 1, e) } } } this.buildingKdTree = !0; var d = this; var c = d.options.findNearestPointBy.indexOf('y') > -1 ? 2 : 1; delete d.kdTree
          w(function () { d.kdTree = a(d.getValidPoints(null, !d.directTouch), c, c); d.buildingKdTree = !1 }, d.options.kdNow || b && b.type === 'touchstart' ? 0 : 1)
        },
        searchKDTree: function (b, a, d) {
          function c (b, a, d, n) {
            var l = a.point; var m = e.kdAxisArray[d % n]; var u = l; var w = J(b[f]) && J(l[f]) ? Math.pow(b[f] - l[f], 2) : null; var C = J(b[h]) && J(l[h]) ? Math.pow(b[h] - l[h], 2) : null; C = (w || 0) + (C || 0); l.dist = J(C) ? Math.sqrt(C) : Number.MAX_VALUE; l.distX = J(w) ? Math.sqrt(w) : Number.MAX_VALUE; m = b[m] - l[m]; C = m < 0 ? 'left' : 'right'; w = m < 0 ? 'right' : 'left'; a[C] && (C = c(b, a[C], d + 1,
              n), u = C[p] < u[p] ? C : l); a[w] && Math.sqrt(m * m) < u[p] && (b = c(b, a[w], d + 1, n), u = b[p] < u[p] ? b : u); return u
          } var e = this; var f = this.kdAxisArray[0]; var h = this.kdAxisArray[1]; var p = a ? 'distX' : 'dist'; a = e.options.findNearestPointBy.indexOf('y') > -1 ? 2 : 1; this.kdTree || this.buildingKdTree || this.buildKDTree(d); if (this.kdTree) return c(b, this.kdTree, a, a)
        },
        pointPlacementToXValue: function () { var b = this.options; var d = b.pointRange; var c = this.xAxis; b = b.pointPlacement; b === 'between' && (b = c.reversed ? -0.5 : 0.5); return a(b) ? b * m(d, c.pointRange) : 0 },
        isPointInside: function (b) {
          return typeof b.plotY !==
'undefined' && typeof b.plotX !== 'undefined' && b.plotY >= 0 && b.plotY <= this.yAxis.len && b.plotX >= 0 && b.plotX <= this.xAxis.len
        }
      }); ''
    }); P(A, 'parts/Stacking.js', [A['parts/Axis.js'], A['parts/Globals.js'], A['parts/StackingAxis.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    var K = v.correctFloat; var G = v.defined; var N = v.destroyObjectProperties; var M = v.format; var y = v.pick; ''; v = g.Chart; var I = g.Series; var J = (function () {
      function g (g, k, t, q, r) {
        var h = g.chart.inverted; this.axis = g; this.isNegative = t; this.options = k = k || {}; this.x = q; this.total =
null; this.points = {}; this.stack = r; this.rightCliff = this.leftCliff = 0; this.alignOptions = { align: k.align || (h ? t ? 'left' : 'right' : 'center'), verticalAlign: k.verticalAlign || (h ? 'middle' : t ? 'bottom' : 'top'), y: k.y, x: k.x }; this.textAlign = k.textAlign || (h ? t ? 'right' : 'left' : 'center')
      }g.prototype.destroy = function () { N(this, this.axis) }; g.prototype.render = function (g) {
        var k = this.axis.chart; var t = this.options; var q = t.format; q = q ? M(q, this, k) : t.formatter.call(this); this.label ? this.label.attr({ text: q, visibility: 'hidden' }) : (this.label = k.renderer.label(q,
          null, null, t.shape, null, null, t.useHTML, !1, 'stack-labels'), q = { r: t.borderRadius || 0, text: q, rotation: t.rotation, padding: y(t.padding, 5), visibility: 'hidden' }, k.styledMode || (q.fill = t.backgroundColor, q.stroke = t.borderColor, q['stroke-width'] = t.borderWidth, this.label.css(t.style)), this.label.attr(q), this.label.added || this.label.add(g)); this.label.labelrank = k.plotHeight
      }; g.prototype.setOffset = function (g, k, t, q, r) {
        var h = this.axis; var f = h.chart; q = h.translate(h.stacking.usePercentage ? 100 : q || this.total, 0, 0, 0, 1); t = h.translate(t || 0); t = G(q) && Math.abs(q - t); g = y(r, f.xAxis[0].translate(this.x)) + g; h = G(q) && this.getStackBox(f, this, g, q, k, t, h); k = this.label; t = this.isNegative; g = y(this.options.overflow, 'justify') === 'justify'; var a = this.textAlign; k && h && (r = k.getBBox(), q = k.padding, a = a === 'left' ? f.inverted ? -q : q : a === 'right' ? r.width : f.inverted && a === 'center' ? r.width / 2 : f.inverted ? t ? r.width + q : -q : r.width / 2, t = f.inverted ? r.height / 2 : t ? -q : r.height, this.alignOptions.x = y(this.options.x, 0), this.alignOptions.y = y(this.options.y, 0), h.x -= a, h.y -= t, k.align(this.alignOptions,
          null, h), f.isInsidePlot(k.alignAttr.x + a - this.alignOptions.x, k.alignAttr.y + t - this.alignOptions.y) ? k.show() : (k.alignAttr.y = -9999, g = !1), g && I.prototype.justifyDataLabel.call(this.axis, k, this.alignOptions, k.alignAttr, r, h), k.attr({ x: k.alignAttr.x, y: k.alignAttr.y }), y(!g && this.options.crop, !0) && ((f = f.isInsidePlot(k.x - q + k.width, k.y) && f.isInsidePlot(k.x + q, k.y)) || k.hide()))
      }; g.prototype.getStackBox = function (g, k, t, q, r, h, f) {
        var a = k.axis.reversed; var l = g.inverted; var e = f.height + f.pos - (l ? g.plotLeft : g.plotTop); k = k.isNegative &&
!a || !k.isNegative && a; return { x: l ? k ? q - f.right : q - h + f.pos - g.plotLeft : t + g.xAxis[0].transB - g.plotLeft, y: l ? f.height - t - r : k ? e - q - h : e - q, width: l ? h : r, height: l ? r : h }
      }; return g
    }()); v.prototype.getStacks = function () {
      var g = this; var k = g.inverted; g.yAxis.forEach(function (g) { g.stacking && g.stacking.stacks && g.hasVisibleSeries && (g.stacking.oldStacks = g.stacking.stacks) }); g.series.forEach(function (z) {
        var t = z.xAxis && z.xAxis.options || {}; !z.options.stacking || !0 !== z.visible && !1 !== g.options.chart.ignoreHiddenSeries || (z.stackKey = [z.type,
          y(z.options.stack, ''), k ? t.top : t.left, k ? t.height : t.width].join())
      })
    }; H.compose(k); I.prototype.setStackedPoints = function () {
      if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
        var g = this.processedXData; var k = this.processedYData; var z = []; var t = k.length; var q = this.options; var r = q.threshold; var h = y(q.startFromThreshold && r, 0); var f = q.stack; q = q.stacking; var a = this.stackKey; var l = '-' + a; var e = this.negStacks; var c = this.yAxis; var m = c.stacking.stacks; var u = c.stacking.oldStacks; var L; var F; c.stacking.stacksTouched += 1; for (F =
0; F < t; F++) {
          var w = g[F]; var p = k[F]; var C = this.getStackIndicator(C, w, this.index); var O = C.key; var B = (L = e && p < (h ? 0 : r)) ? l : a; m[B] || (m[B] = {}); m[B][w] || (u[B] && u[B][w] ? (m[B][w] = u[B][w], m[B][w].total = null) : m[B][w] = new J(c, c.options.stackLabels, L, w, f)); B = m[B][w]; p !== null ? (B.points[O] = B.points[this.index] = [y(B.cumulative, h)], G(B.cumulative) || (B.base = O), B.touched = c.stacking.stacksTouched, C.index > 0 && !1 === this.singleStacks && (B.points[O][0] = B.points[this.index + ',' + w + ',0'][0])) : B.points[O] = B.points[this.index] = null
          q === 'percent' ? (L = L ? a : l, e && m[L] && m[L][w] ? (L = m[L][w], B.total = L.total = Math.max(L.total, B.total) + Math.abs(p) || 0) : B.total = K(B.total + (Math.abs(p) || 0))) : B.total = K(B.total + (p || 0)); B.cumulative = y(B.cumulative, h) + (p || 0); p !== null && (B.points[O].push(B.cumulative), z[F] = B.cumulative)
        }q === 'percent' && (c.stacking.usePercentage = !0); this.stackedYData = z; c.stacking.oldStacks = {}
      }
    }; I.prototype.modifyStacks = function () {
      var g = this; var k = g.stackKey; var z = g.yAxis.stacking.stacks; var t = g.processedXData; var q; var r = g.options.stacking; g[r + 'Stacker'] &&
[k, '-' + k].forEach(function (h) { for (var f = t.length, a, l; f--;) if (a = t[f], q = g.getStackIndicator(q, a, g.index, h), l = (a = z[h] && z[h][a]) && a.points[q.key])g[r + 'Stacker'](l, a, f) })
    }; I.prototype.percentStacker = function (g, k, z) { k = k.total ? 100 / k.total : 0; g[0] = K(g[0] * k); g[1] = K(g[1] * k); this.stackedYData[z] = g[1] }; I.prototype.getStackIndicator = function (g, k, z, t) { !G(g) || g.x !== k || t && g.key !== t ? g = { x: k, index: 0, key: t } : g.index++; g.key = [z, k, g.index].join(); return g }; g.StackItem = J; return g.StackItem
  }); P(A, 'parts/Dynamics.js', [A['parts/Globals.js'],
    A['parts/Point.js'], A['parts/Time.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    var K = v.addEvent; var G = v.animate; var N = v.createElement; var M = v.css; var y = v.defined; var I = v.erase; var J = v.error; var E = v.extend; var D = v.fireEvent; var z = v.isArray; var t = v.isNumber; var q = v.isObject; var r = v.isString; var h = v.merge; var f = v.objectEach; var a = v.pick; var l = v.relativeLength; var e = v.setAnimation; var c = v.splat; var m = k.Axis; v = k.Chart; var u = k.Series; var L = k.seriesTypes; k.cleanRecursively = function (a, c) {
      var e = {}; f(a, function (f, h) {
        if (q(a[h], !0) && !a.nodeType && c[h]) {
          f = k.cleanRecursively(a[h], c[h]), Object.keys(f).length &&
(e[h] = f)
        } else if (q(a[h]) || a[h] !== c[h])e[h] = a[h]
      }); return e
    }; E(v.prototype, {
      addSeries: function (c, e, f) { var h; var p = this; c && (e = a(e, !0), D(p, 'addSeries', { options: c }, function () { h = p.initSeries(c); p.isDirtyLegend = !0; p.linkSeries(); h.enabledDataSorting && h.setData(c.data, !1); D(p, 'afterAddSeries', { series: h }); e && p.redraw(f) })); return h },
      addAxis: function (a, c, e, f) { return this.createAxis(c ? 'xAxis' : 'yAxis', { axis: a, redraw: e, animation: f }) },
      addColorAxis: function (a, c, e) {
        return this.createAxis('colorAxis', {
          axis: a,
          redraw: c,
          animation: e
        })
      },
      createAxis: function (e, f) { var p = this.options; var l = e === 'colorAxis'; var u = f.redraw; var w = f.animation; f = h(f.axis, { index: this[e].length, isX: e === 'xAxis' }); var d = l ? new k.ColorAxis(this, f) : new m(this, f); p[e] = c(p[e] || {}); p[e].push(f); l && (this.isDirtyLegend = !0, this.axes.forEach(function (b) { b.series = [] }), this.series.forEach(function (b) { b.bindAxes(); b.isDirtyData = !0 })); a(u, !0) && this.redraw(w); return d },
      showLoading: function (c) {
        var e = this; var f = e.options; var h = e.loadingDiv; var l = f.loading; var m = function () {
          h && M(h, {
            left: e.plotLeft +
'px',
            top: e.plotTop + 'px',
            width: e.plotWidth + 'px',
            height: e.plotHeight + 'px'
          })
        }; h || (e.loadingDiv = h = N('div', { className: 'highcharts-loading highcharts-loading-hidden' }, null, e.container), e.loadingSpan = N('span', { className: 'highcharts-loading-inner' }, null, h), K(e, 'redraw', m)); h.className = 'highcharts-loading'; e.loadingSpan.innerHTML = a(c, f.lang.loading, ''); e.styledMode || (M(h, E(l.style, { zIndex: 10 })), M(e.loadingSpan, l.labelStyle), e.loadingShown || (M(h, { opacity: 0, display: '' }), G(h, { opacity: l.style.opacity || 0.5 }, {
          duration: l.showDuration ||
0
        }))); e.loadingShown = !0; m()
      },
      hideLoading: function () { var a = this.options; var c = this.loadingDiv; c && (c.className = 'highcharts-loading highcharts-loading-hidden', this.styledMode || G(c, { opacity: 0 }, { duration: a.loading.hideDuration || 100, complete: function () { M(c, { display: 'none' }) } })); this.loadingShown = !1 },
      propsRequireDirtyBox: 'backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow'.split(' '),
      propsRequireReflow: 'margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft'.split(' '),
      propsRequireUpdateSeries: 'chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip'.split(' '),
      collectionsWithUpdate: ['xAxis', 'yAxis', 'zAxis', 'series'],
      update: function (e, m, p, u) {
        var w = this; var g = { credits: 'addCredits', title: 'setTitle', subtitle: 'setSubtitle', caption: 'setCaption' }; var d; var b; var n; var C = e.isResponsiveOptions; var q = []; D(w, 'update', { options: e }); C || w.setResponsive(!1, !0); e = k.cleanRecursively(e, w.options); h(!0, w.userOptions, e); if (d = e.chart) {
          h(!0, w.options.chart, d); 'className' in
d && w.setClassName(d.className); 'reflow' in d && w.setReflow(d.reflow); if ('inverted' in d || 'polar' in d || 'type' in d) { w.propFromSeries(); var F = !0 }'alignTicks' in d && (F = !0); f(d, function (a, d) { w.propsRequireUpdateSeries.indexOf('chart.' + d) !== -1 && (b = !0); w.propsRequireDirtyBox.indexOf(d) !== -1 && (w.isDirtyBox = !0); C || w.propsRequireReflow.indexOf(d) === -1 || (n = !0) }); !w.styledMode && 'style' in d && w.renderer.setStyle(d.style)
        }!w.styledMode && e.colors && (this.options.colors = e.colors); e.plotOptions && h(!0, this.options.plotOptions,
          e.plotOptions); e.time && this.time === k.time && (this.time = new H(e.time)); f(e, function (a, d) { if (w[d] && typeof w[d].update === 'function')w[d].update(a, !1); else if (typeof w[g[d]] === 'function')w[g[d]](a); d !== 'chart' && w.propsRequireUpdateSeries.indexOf(d) !== -1 && (b = !0) }); this.collectionsWithUpdate.forEach(function (b) {
          if (e[b]) {
            if (b === 'series') { var d = []; w[b].forEach(function (b, c) { b.options.isInternal || d.push(a(b.options.index, c)) }) }c(e[b]).forEach(function (a, c) {
              (c = y(a.id) && w.get(a.id) || w[b][d ? d[c] : c]) && c.coll ===
b && (c.update(a, !1), p && (c.touched = !0)); !c && p && w.collectionsWithInit[b] && (w.collectionsWithInit[b][0].apply(w, [a].concat(w.collectionsWithInit[b][1] || []).concat([!1])).touched = !0)
            }); p && w[b].forEach(function (b) { b.touched || b.options.isInternal ? delete b.touched : q.push(b) })
          }
        }); q.forEach(function (b) { b.remove && b.remove(!1) }); F && w.axes.forEach(function (b) { b.update({}, !1) }); b && w.getSeriesOrderByLinks().forEach(function (b) { b.chart && b.update({}, !1) }, this); e.loading && h(!0, w.options.loading, e.loading); F = d && d.width
        d = d && d.height; r(d) && (d = l(d, F || w.chartWidth)); n || t(F) && F !== w.chartWidth || t(d) && d !== w.chartHeight ? w.setSize(F, d, u) : a(m, !0) && w.redraw(u); D(w, 'afterUpdate', { options: e, redraw: m, animation: u })
      },
      setSubtitle: function (a, c) { this.applyDescription('subtitle', a); this.layOutTitles(c) },
      setCaption: function (a, c) { this.applyDescription('caption', a); this.layOutTitles(c) }
    }); v.prototype.collectionsWithInit = { xAxis: [v.prototype.addAxis, [!0]], yAxis: [v.prototype.addAxis, [!1]], series: [v.prototype.addSeries] }; E(g.prototype, {
      update: function (c,
        e, f, h) {
        function p () {
          l.applyOptions(c); var h = b && l.hasDummyGraphic; h = l.y === null ? !h : h; b && h && (l.graphic = b.destroy(), delete l.hasDummyGraphic); q(c, !0) && (b && b.element && c && c.marker && typeof c.marker.symbol !== 'undefined' && (l.graphic = b.destroy()), c && c.dataLabels && l.dataLabel && (l.dataLabel = l.dataLabel.destroy()), l.connector && (l.connector = l.connector.destroy())); n = l.index; d.updateParallelArrays(l, n); u.data[n] = q(u.data[n], !0) || q(c, !0) ? l.options : a(c, u.data[n]); d.isDirty = d.isDirtyData = !0; !d.fixedBox && d.hasCartesianSeries &&
(m.isDirtyBox = !0); u.legendType === 'point' && (m.isDirtyLegend = !0); e && m.redraw(f)
        } var l = this; var d = l.series; var b = l.graphic; var n; var m = d.chart; var u = d.options; e = a(e, !0); !1 === h ? p() : l.firePointEvent('update', { options: c }, p)
      },
      remove: function (a, c) { this.series.removePoint(this.series.data.indexOf(this), a, c) }
    }); E(u.prototype, {
      addPoint: function (c, e, f, h, l) {
        var p = this.options; var d = this.data; var b = this.chart; var n = this.xAxis; n = n && n.hasNames && n.names; var m = p.data; var u = this.xData; var w; e = a(e, !0); var g = { series: this }; this.pointClass.prototype.applyOptions.apply(g,
          [c]); var C = g.x; var r = u.length; if (this.requireSorting && C < u[r - 1]) for (w = !0; r && u[r - 1] > C;)r--; this.updateParallelArrays(g, 'splice', r, 0, 0); this.updateParallelArrays(g, r); n && g.name && (n[C] = g.name); m.splice(r, 0, c); w && (this.data.splice(r, 0, null), this.processData()); p.legendType === 'point' && this.generatePoints(); f && (d[0] && d[0].remove ? d[0].remove(!1) : (d.shift(), this.updateParallelArrays(g, 'shift'), m.shift())); !1 !== l && D(this, 'addPoint', { point: g }); this.isDirtyData = this.isDirty = !0; e && b.redraw(h)
      },
      removePoint: function (c,
        f, h) { var p = this; var l = p.data; var m = l[c]; var d = p.points; var b = p.chart; var n = function () { d && d.length === l.length && d.splice(c, 1); l.splice(c, 1); p.options.data.splice(c, 1); p.updateParallelArrays(m || { series: p }, 'splice', c, 1); m && m.destroy(); p.isDirty = !0; p.isDirtyData = !0; f && b.redraw() }; e(h, b); f = a(f, !0); m ? m.firePointEvent('remove', null, n) : n() },
      remove: function (c, e, f, h) { function p () { l.destroy(h); l.remove = null; d.isDirtyLegend = d.isDirtyBox = !0; d.linkSeries(); a(c, !0) && d.redraw(e) } var l = this; var d = l.chart; !1 !== f ? D(l, 'remove', null, p) : p() },
      update: function (c, e) {
        c = k.cleanRecursively(c, this.userOptions); D(this, 'update', { options: c }); var f = this; var l = f.chart; var m = f.userOptions; var u = f.initialType || f.type; var d = c.type || m.type || l.options.chart.type; var b = !(this.hasDerivedData || c.dataGrouping || d && d !== this.type || typeof c.pointStart !== 'undefined' || c.pointInterval || c.pointIntervalUnit || c.keys); var n = L[u].prototype; var w; var g = ['group', 'markerGroup', 'dataLabelsGroup', 'transformGroup']; var r = ['eventOptions', 'navigatorSeries', 'baseSeries']; var q = f.finishedAnimating && { animation: !1 }; var t =
{}; b && (r.push('data', 'isDirtyData', 'points', 'processedXData', 'processedYData', 'xIncrement', '_hasPointMarkers', '_hasPointLabels', 'mapMap', 'mapData', 'minY', 'maxY', 'minX', 'maxX'), !1 !== c.visible && r.push('area', 'graph'), f.parallelArrays.forEach(function (b) { r.push(b + 'Data') }), c.data && (c.dataSorting && E(f.options.dataSorting, c.dataSorting), this.setData(c.data, !1))); c = h(m, q, { index: typeof m.index === 'undefined' ? f.index : m.index, pointStart: a(m.pointStart, f.xData[0]) }, !b && { data: f.options.data }, c); b && c.data && (c.data =
f.options.data); r = g.concat(r); r.forEach(function (b) { r[b] = f[b]; delete f[b] }); f.remove(!1, null, !1, !0); for (w in n)f[w] = void 0; L[d || u] ? E(f, L[d || u].prototype) : J(17, !0, l, { missingModuleFor: d || u }); r.forEach(function (b) { f[b] = r[b] }); f.init(l, c); if (b && this.points) {
          var F = f.options; !1 === F.visible ? (t.graphic = 1, t.dataLabel = 1) : f._hasPointLabels || (d = F.marker, n = F.dataLabels, d && (!1 === d.enabled || 'symbol' in d) && (t.graphic = 1), n && !1 === n.enabled && (t.dataLabel = 1)); this.points.forEach(function (b) {
            b && b.series && (b.resolveColor(),
            Object.keys(t).length && b.destroyElements(t), !1 === F.showInLegend && b.legendItem && l.legend.destroyItem(b))
          }, this)
        }c.zIndex !== m.zIndex && g.forEach(function (b) { f[b] && f[b].attr({ zIndex: c.zIndex }) }); f.initialType = u; l.linkSeries(); D(this, 'afterUpdate'); a(e, !0) && l.redraw(b ? void 0 : !1)
      },
      setName: function (a) { this.name = this.options.name = this.userOptions.name = a; this.chart.isDirtyLegend = !0 }
    }); E(m.prototype, {
      update: function (c, e) {
        var p = this.chart; var l = c && c.events || {}; c = h(this.userOptions, c); p.options[this.coll].indexOf &&
(p.options[this.coll][p.options[this.coll].indexOf(this.userOptions)] = c); f(p.options[this.coll].events, function (a, c) { typeof l[c] === 'undefined' && (l[c] = void 0) }); this.destroy(!0); this.init(p, E(c, { events: l })); p.isDirtyBox = !0; a(e, !0) && p.redraw()
      },
      remove: function (c) {
        for (var e = this.chart, f = this.coll, h = this.series, l = h.length; l--;)h[l] && h[l].remove(!1); I(e.axes, this); I(e[f], this); z(e.options[f]) ? e.options[f].splice(this.options.index, 1) : delete e.options[f]; e[f].forEach(function (a, d) {
          a.options.index = a.userOptions.index =
d
        }); this.destroy(); e.isDirtyBox = !0; a(c, !0) && e.redraw()
      },
      setTitle: function (a, c) { this.update({ title: a }, c) },
      setCategories: function (a, c) { this.update({ categories: a }, c) }
    })
  }); P(A, 'parts/AreaSeries.js', [A['parts/Globals.js'], A['parts/Color.js'], A['mixins/legend-symbol.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    var K = g.parse; var G = v.objectEach; var N = v.pick; g = v.seriesType; var M = k.Series; g('area', 'line', { softThreshold: !1, threshold: 0 }, {
      singleStacks: !1,
      getStackPoints: function (g) {
        var k = []; var y = []; var v = this.xAxis; var D = this.yAxis
        var z = D.stacking.stacks[this.stackKey]; var t = {}; var q = this.index; var r = D.series; var h = r.length; var f = N(D.options.reversedStacks, !0) ? 1 : -1; var a; g = g || this.points; if (this.options.stacking) {
          for (a = 0; a < g.length; a++)g[a].leftNull = g[a].rightNull = void 0, t[g[a].x] = g[a]; G(z, function (a, c) { a.total !== null && y.push(c) }); y.sort(function (a, c) { return a - c }); var l = r.map(function (a) { return a.visible }); y.forEach(function (e, c) {
            var m = 0; var u; var g; if (t[e] && !t[e].isNull) {
              k.push(t[e]), [-1, 1].forEach(function (m) {
                var w = m === 1 ? 'rightNull' : 'leftNull'; var p = 0; var C = z[y[c + m]]
                if (C) for (a = q; a >= 0 && a < h;)u = C.points[a], u || (a === q ? t[e][w] = !0 : l[a] && (g = z[e].points[a]) && (p -= g[1] - g[0])), a += f; t[e][m === 1 ? 'rightCliff' : 'leftCliff'] = p
              })
            } else { for (a = q; a >= 0 && a < h;) { if (u = z[e].points[a]) { m = u[1]; break }a += f }m = D.translate(m, 0, 1, 0, 1); k.push({ isNull: !0, plotX: v.translate(e, 0, 0, 0, 1), x: e, plotY: m, yBottom: m }) }
          })
        } return k
      },
      getGraphPath: function (g) {
        var k = M.prototype.getGraphPath; var y = this.options; var v = y.stacking; var D = this.yAxis; var z; var t = []; var q = []; var r = this.index; var h = D.stacking.stacks[this.stackKey]; var f = y.threshold; var a = Math.round(D.getThreshold(y.threshold))
        y = N(y.connectNulls, v === 'percent'); var l = function (e, l, m) { var u = g[e]; e = v && h[u.x].points[r]; var p = u[m + 'Null'] || 0; m = u[m + 'Cliff'] || 0; u = !0; if (m || p) { var C = (p ? e[0] : e[1]) + m; var k = e[0] + m; u = !!p } else !v && g[l] && g[l].isNull && (C = k = f); typeof C !== 'undefined' && (q.push({ plotX: c, plotY: C === null ? a : D.getThreshold(C), isNull: u, isCliff: !0 }), t.push({ plotX: c, plotY: k === null ? a : D.getThreshold(k), doCurve: !1 })) }; g = g || this.points; v && (g = this.getStackPoints(g)); for (z = 0; z < g.length; z++) {
          v || (g[z].leftCliff = g[z].rightCliff = g[z].leftNull =
g[z].rightNull = void 0); var e = g[z].isNull; var c = N(g[z].rectPlotX, g[z].plotX); var m = N(g[z].yBottom, a); if (!e || y)y || l(z, z - 1, 'left'), e && !v && y || (q.push(g[z]), t.push({ x: z, plotX: c, plotY: m })), y || l(z, z + 1, 'right')
        }z = k.call(this, q, !0, !0); t.reversed = !0; e = k.call(this, t, !0, !0); (m = e[0]) && m[0] === 'M' && (e[0] = ['L', m[1], m[2]]); e = z.concat(e); k = k.call(this, q, !1, y); e.xMap = z.xMap; this.areaPath = e; return k
      },
      drawGraph: function () {
        this.areaPath = []; M.prototype.drawGraph.apply(this); var g = this; var k = this.areaPath; var v = this.options; var E = [['area',
          'highcharts-area', this.color, v.fillColor]]; this.zones.forEach(function (k, z) { E.push(['zone-area-' + z, 'highcharts-area highcharts-zone-area-' + z + ' ' + k.className, k.color || g.color, k.fillColor || v.fillColor]) }); E.forEach(function (y) {
          var z = y[0]; var t = g[z]; var q = t ? 'animate' : 'attr'; var r = {}; t ? (t.endX = g.preventGraphAnimation ? null : k.xMap, t.animate({ d: k })) : (r.zIndex = 0, t = g[z] = g.chart.renderer.path(k).addClass(y[1]).add(g.group), t.isArea = !0); g.chart.styledMode || (r.fill = N(y[3], K(y[2]).setOpacity(N(v.fillOpacity, 0.75)).get()))
          t[q](r); t.startX = k.xMap; t.shiftUnit = v.step ? 2 : 1
        })
      },
      drawLegendSymbol: H.drawRectangle
    }); ''
  }); P(A, 'parts/SplineSeries.js', [A['parts/Utilities.js']], function (k) {
    var g = k.pick; k = k.seriesType; k('spline', 'line', {}, {
      getPointSpline: function (k, v, K) {
        var G = v.plotX || 0; var N = v.plotY || 0; var M = k[K - 1]; K = k[K + 1]; if (M && !M.isNull && !1 !== M.doCurve && !v.isCliff && K && !K.isNull && !1 !== K.doCurve && !v.isCliff) {
          k = M.plotY || 0; var y = K.plotX || 0; K = K.plotY || 0; var I = 0; var J = (1.5 * G + (M.plotX || 0)) / 2.5; var E = (1.5 * N + k) / 2.5; y = (1.5 * G + y) / 2.5; var D = (1.5 *
N + K) / 2.5; y !== J && (I = (D - E) * (y - G) / (y - J) + N - D); E += I; D += I; E > k && E > N ? (E = Math.max(k, N), D = 2 * N - E) : E < k && E < N && (E = Math.min(k, N), D = 2 * N - E); D > K && D > N ? (D = Math.max(K, N), E = 2 * N - D) : D < K && D < N && (D = Math.min(K, N), E = 2 * N - D); v.rightContX = y; v.rightContY = D
        }v = ['C', g(M.rightContX, M.plotX, 0), g(M.rightContY, M.plotY, 0), g(J, G, 0), g(E, N, 0), G, N]; M.rightContX = M.rightContY = void 0; return v
      }
    }); ''
  }); P(A, 'parts/AreaSplineSeries.js', [A['parts/Globals.js'], A['mixins/legend-symbol.js'], A['parts/Utilities.js']], function (k, g, H) {
    H = H.seriesType; var v =
k.seriesTypes.area.prototype; H('areaspline', 'spline', k.defaultPlotOptions.area, { getStackPoints: v.getStackPoints, getGraphPath: v.getGraphPath, drawGraph: v.drawGraph, drawLegendSymbol: g.drawRectangle }); ''
  }); P(A, 'parts/ColumnSeries.js', [A['parts/Globals.js'], A['parts/Color.js'], A['mixins/legend-symbol.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    ''; var K = g.parse; var G = v.animObject; var N = v.clamp; var M = v.defined; var y = v.extend; var I = v.isNumber; var J = v.merge; var E = v.pick; g = v.seriesType; var D = k.Series; g('column', 'line', {
      borderRadius: 0,
      groupPadding: 0.2,
      marker: null,
      pointPadding: 0.1,
      minPointLength: 0,
      cropThreshold: 50,
      pointRange: null,
      states: { hover: { halo: !1, brightness: 0.1 }, select: { color: '#cccccc', borderColor: '#000000' } },
      dataLabels: { align: null, verticalAlign: null, y: null },
      softThreshold: !1,
      startFromThreshold: !0,
      stickyTracking: !1,
      tooltip: { distance: 6 },
      threshold: 0,
      borderColor: '#ffffff'
    }, {
      cropShoulder: 0,
      directTouch: !0,
      trackerGroups: ['group', 'dataLabelsGroup'],
      negStacks: !0,
      init: function () {
        D.prototype.init.apply(this, arguments); var g = this; var k = g.chart
        k.hasRendered && k.series.forEach(function (k) { k.type === g.type && (k.isDirty = !0) })
      },
      getColumnMetrics: function () {
        var g = this; var k = g.options; var q = g.xAxis; var r = g.yAxis; var h = q.options.reversedStacks; h = q.reversed && !h || !q.reversed && h; var f; var a = {}; var l = 0; !1 === k.grouping ? l = 1 : g.chart.series.forEach(function (c) {
          var e = c.yAxis; var h = c.options; if (c.type === g.type && (c.visible || !g.chart.options.chart.ignoreHiddenSeries) && r.len === e.len && r.pos === e.pos) {
            if (h.stacking) { f = c.stackKey; typeof a[f] === 'undefined' && (a[f] = l++); var m = a[f] } else {
              !1 !== h.grouping &&
(m = l++)
            } c.columnIndex = m
          }
        }); var e = Math.min(Math.abs(q.transA) * (q.ordinal && q.ordinal.slope || k.pointRange || q.closestPointRange || q.tickInterval || 1), q.len); var c = e * k.groupPadding; var m = (e - 2 * c) / (l || 1); k = Math.min(k.maxPointWidth || q.len, E(k.pointWidth, m * (1 - 2 * k.pointPadding))); g.columnMetrics = { width: k, offset: (m - k) / 2 + (c + ((g.columnIndex || 0) + (h ? 1 : 0)) * m - e / 2) * (h ? -1 : 1) }; return g.columnMetrics
      },
      crispCol: function (g, k, q, r) {
        var h = this.chart; var f = this.borderWidth; var a = -(f % 2 ? 0.5 : 0); f = f % 2 ? 0.5 : 1; h.inverted && h.renderer.isVML && (f += 1); this.options.crisp &&
(q = Math.round(g + q) + a, g = Math.round(g) + a, q -= g); r = Math.round(k + r) + f; a = Math.abs(k) <= 0.5 && r > 0.5; k = Math.round(k) + f; r -= k; a && r && (--k, r += 1); return { x: g, y: k, width: q, height: r }
      },
      translate: function () {
        var g = this; var k = g.chart; var q = g.options; var r = g.dense = g.closestPointRange * g.xAxis.transA < 2; r = g.borderWidth = E(q.borderWidth, r ? 0 : 1); var h = g.xAxis; var f = g.yAxis; var a = q.threshold; var l = g.translatedThreshold = f.getThreshold(a); var e = E(q.minPointLength, 5); var c = g.getColumnMetrics(); var m = c.width; var u = g.barW = Math.max(m, 1 + 2 * r); var L = g.pointXOffset = c.offset; var F = g.dataMin
        var w = g.dataMax; k.inverted && (l -= 0.5); q.pointPadding && (u = Math.ceil(u)); D.prototype.translate.apply(g); g.points.forEach(function (c) {
          var p = E(c.yBottom, l); var r = 999 + Math.abs(p); var q = m; var d = c.plotX; r = N(c.plotY, -r, f.len + r); var b = c.plotX + L; var n = u; var x = Math.min(r, p); var t = Math.max(r, p) - x; if (e && Math.abs(t) < e) { t = e; var z = !f.reversed && !c.negative || f.reversed && c.negative; I(a) && I(w) && c.y === a && w <= a && (f.min || 0) < a && F !== w && (z = !z); x = Math.abs(x - l) > e ? p - e : l - (z ? e : 0) }M(c.options.pointWidth) && (q = n = Math.ceil(c.options.pointWidth), b -= Math.round((q -
m) / 2)); c.barX = b; c.pointWidth = q; c.tooltipPos = k.inverted ? [f.len + f.pos - k.plotLeft - r, h.len + h.pos - k.plotTop - (d || 0) - L - n / 2, t] : [b + n / 2, r + f.pos - k.plotTop, t]; c.shapeType = g.pointClass.prototype.shapeType || 'rect'; c.shapeArgs = g.crispCol.apply(g, c.isNull ? [b, l, n, 0] : [b, x, n, t])
        })
      },
      getSymbol: k.noop,
      drawLegendSymbol: H.drawRectangle,
      drawGraph: function () { this.group[this.dense ? 'addClass' : 'removeClass']('highcharts-dense-data') },
      pointAttribs: function (g, k) {
        var q = this.options; var r = this.pointAttrToOptions || {}; var h = r.stroke ||
'borderColor'; var f = r['stroke-width'] || 'borderWidth'; var a = g && g.color || this.color; var l = g && g[h] || q[h] || this.color || a; var e = g && g[f] || q[f] || this[f] || 0; r = g && g.options.dashStyle || q.dashStyle; var c = E(g && g.opacity, q.opacity, 1); if (g && this.zones.length) { var m = g.getZone(); a = g.options.color || m && (m.color || g.nonZonedColor) || this.color; m && (l = m.borderColor || l, r = m.dashStyle || r, e = m.borderWidth || e) }k && g && (g = J(q.states[k], g.options.states && g.options.states[k] || {}), k = g.brightness, a = g.color || typeof k !== 'undefined' && K(a).brighten(g.brightness).get() ||
a, l = g[h] || l, e = g[f] || e, r = g.dashStyle || r, c = E(g.opacity, c)); h = { fill: a, stroke: l, 'stroke-width': e, opacity: c }; r && (h.dashstyle = r); return h
      },
      drawPoints: function () {
        var g = this; var k = this.chart; var q = g.options; var r = k.renderer; var h = q.animationLimit || 250; var f; g.points.forEach(function (a) {
          var l = a.graphic; var e = !!l; var c = l && k.pointCount < h ? 'animate' : 'attr'; if (I(a.plotY) && a.y !== null) {
            f = a.shapeArgs; l && a.hasNewShapeType() && (l = l.destroy()); g.enabledDataSorting && (a.startXPos = g.xAxis.reversed ? -(f ? f.width : 0) : g.xAxis.width); l || (a.graphic = l = r[a.shapeType](f).add(a.group ||
g.group)) && g.enabledDataSorting && k.hasRendered && k.pointCount < h && (l.attr({ x: a.startXPos }), e = !0, c = 'animate'); if (l && e)l[c](J(f)); if (q.borderRadius)l[c]({ r: q.borderRadius }); k.styledMode || l[c](g.pointAttribs(a, a.selected && 'select')).shadow(!1 !== a.allowShadow && q.shadow, null, q.stacking && !q.borderRadius); l.addClass(a.getClassName(), !0)
          } else l && (a.graphic = l.destroy())
        })
      },
      animate: function (g) {
        var k = this; var q = this.yAxis; var r = k.options; var h = this.chart.inverted; var f = {}; var a = h ? 'translateX' : 'translateY'; if (g) {
          f.scaleY = 0.001, g = N(q.toPixels(r.threshold),
            q.pos, q.pos + q.len), h ? f.translateX = g - q.len : f.translateY = g, k.clipBox && k.setClip(), k.group.attr(f)
        } else { var l = k.group.attr(a); k.group.animate({ scaleY: 1 }, y(G(k.options.animation), { step: function (e, c) { k.group && (f[a] = l + c.pos * (q.pos - l), k.group.attr(f)) } })) }
      },
      remove: function () { var g = this; var k = g.chart; k.hasRendered && k.series.forEach(function (k) { k.type === g.type && (k.isDirty = !0) }); D.prototype.remove.apply(g, arguments) }
    }); ''
  }); P(A, 'parts/BarSeries.js', [A['parts/Utilities.js']], function (k) {
    k = k.seriesType; k('bar', 'column',
      null, { inverted: !0 }); ''
  }); P(A, 'parts/ScatterSeries.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.addEvent; g = g.seriesType; var v = k.Series; g('scatter', 'line', { lineWidth: 0, findNearestPointBy: 'xy', jitter: { x: 0, y: 0 }, marker: { enabled: !0 }, tooltip: { headerFormat: '<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>', pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>' } }, {
      sorted: !1,
      requireSorting: !1,
      noSharedTooltip: !0,
      trackerGroups: ['group',
        'markerGroup', 'dataLabelsGroup'],
      takeOrdinalPosition: !1,
      drawGraph: function () { this.options.lineWidth && v.prototype.drawGraph.call(this) },
      applyJitter: function () {
        var g = this; var k = this.options.jitter; var v = this.points.length; k && this.points.forEach(function (G, y) {
          ['x', 'y'].forEach(function (I, J) {
            var E = 'plot' + I.toUpperCase(); if (k[I] && !G.isNull) {
              var D = g[I + 'Axis']; var z = k[I] * D.transA; if (D && !D.isLog) {
                var t = Math.max(0, G[E] - z); D = Math.min(D.len, G[E] + z); J = 1E4 * Math.sin(y + J * v); G[E] = t + (D - t) * (J - Math.floor(J)); I === 'x' && (G.clientX =
G.plotX)
              }
            }
          })
        })
      }
    }); H(v, 'afterTranslate', function () { this.applyJitter && this.applyJitter() }); ''
  }); P(A, 'mixins/centered-series.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.isNumber; var v = g.pick; var K = g.relativeLength; var G = k.deg2rad; k.CenteredSeriesMixin = {
      getCenter: function () {
        var g = this.options; var k = this.chart; var y = 2 * (g.slicedOffset || 0); var G = k.plotWidth - 2 * y; var J = k.plotHeight - 2 * y; var E = g.center; var D = Math.min(G, J); var z = g.size; var t = g.innerSize || 0; typeof z === 'string' && (z = parseFloat(z)); typeof t === 'string' && (t = parseFloat(t))
        g = [v(E[0], '50%'), v(E[1], '50%'), v(z && z < 0 ? void 0 : g.size, '100%'), v(t && t < 0 ? void 0 : g.innerSize || 0, '0%')]; k.angular && (g[3] = 0); for (E = 0; E < 4; ++E)z = g[E], k = E < 2 || E === 2 && /%$/.test(z), g[E] = K(z, [G, J, D, g[2]][E]) + (k ? y : 0); g[3] > g[2] && (g[3] = g[2]); return g
      },
      getStartAndEndRadians: function (g, k) { g = H(g) ? g : 0; k = H(k) && k > g && k - g < 360 ? k : g + 360; return { start: G * (g + -90), end: G * (k + -90) } }
    }
  }); P(A, 'parts/PieSeries.js', [A['parts/Globals.js'], A['mixins/legend-symbol.js'], A['parts/Point.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    var K =
v.addEvent; var G = v.clamp; var A = v.defined; var M = v.fireEvent; var y = v.isNumber; var I = v.merge; var J = v.pick; var E = v.relativeLength; var D = v.seriesType; var z = v.setAnimation; v = k.CenteredSeriesMixin; var t = v.getStartAndEndRadians; var q = k.noop; var r = k.Series; D('pie', 'line', {
      center: [null, null],
      clip: !1,
      colorByPoint: !0,
      dataLabels: { allowOverlap: !0, connectorPadding: 5, connectorShape: 'fixedOffset', crookDistance: '70%', distance: 30, enabled: !0, formatter: function () { return this.point.isNull ? void 0 : this.point.name }, softConnector: !0, x: 0 },
      fillColor: void 0,
      ignoreHiddenPoint: !0,
      inactiveOtherPoints: !0,
      legendType: 'point',
      marker: null,
      size: null,
      showInLegend: !1,
      slicedOffset: 10,
      stickyTracking: !1,
      tooltip: { followPointer: !0 },
      borderColor: '#ffffff',
      borderWidth: 1,
      lineWidth: void 0,
      states: { hover: { brightness: 0.1 } }
    }, {
      isCartesian: !1,
      requireSorting: !1,
      directTouch: !0,
      noSharedTooltip: !0,
      trackerGroups: ['group', 'dataLabelsGroup'],
      axisTypes: [],
      pointAttribs: k.seriesTypes.column.prototype.pointAttribs,
      animate: function (h) {
        var f = this; var a = f.points; var l = f.startAngleRad; h || a.forEach(function (a) {
          var c = a.graphic
          var e = a.shapeArgs; c && e && (c.attr({ r: J(a.startR, f.center && f.center[3] / 2), start: l, end: l }), c.animate({ r: e.r, start: e.start, end: e.end }, f.options.animation))
        })
      },
      hasData: function () { return !!this.processedXData.length },
      updateTotals: function () { var h; var f = 0; var a = this.points; var l = a.length; var e = this.options.ignoreHiddenPoint; for (h = 0; h < l; h++) { var c = a[h]; f += e && !c.visible ? 0 : c.isNull ? 0 : c.y } this.total = f; for (h = 0; h < l; h++)c = a[h], c.percentage = f > 0 && (c.visible || !e) ? c.y / f * 100 : 0, c.total = f },
      generatePoints: function () {
        r.prototype.generatePoints.call(this)
        this.updateTotals()
      },
      getX: function (h, f, a) { var l = this.center; var e = this.radii ? this.radii[a.index] : l[2] / 2; h = Math.asin(G((h - l[1]) / (e + a.labelDistance), -1, 1)); return l[0] + (f ? -1 : 1) * Math.cos(h) * (e + a.labelDistance) + (a.labelDistance > 0 ? (f ? -1 : 1) * this.options.dataLabels.padding : 0) },
      translate: function (h) {
        this.generatePoints(); var f = 0; var a = this.options; var l = a.slicedOffset; var e = l + (a.borderWidth || 0); var c = t(a.startAngle, a.endAngle); var g = this.startAngleRad = c.start; c = (this.endAngleRad = c.end) - g; var u = this.points; var k = a.dataLabels.distance
        a = a.ignoreHiddenPoint; var r; var w = u.length; h || (this.center = h = this.getCenter()); for (r = 0; r < w; r++) {
          var p = u[r]; var C = g + f * c; if (!a || p.visible)f += p.percentage / 100; var q = g + f * c; p.shapeType = 'arc'; p.shapeArgs = { x: h[0], y: h[1], r: h[2] / 2, innerR: h[3] / 2, start: Math.round(1E3 * C) / 1E3, end: Math.round(1E3 * q) / 1E3 }; p.labelDistance = J(p.options.dataLabels && p.options.dataLabels.distance, k); p.labelDistance = E(p.labelDistance, p.shapeArgs.r); this.maxLabelDistance = Math.max(this.maxLabelDistance || 0, p.labelDistance); q = (q + C) / 2; q > 1.5 * Math.PI
            ? q -= 2 * Math.PI : q < -Math.PI / 2 && (q += 2 * Math.PI); p.slicedTranslation = { translateX: Math.round(Math.cos(q) * l), translateY: Math.round(Math.sin(q) * l) }; var B = Math.cos(q) * h[2] / 2; var d = Math.sin(q) * h[2] / 2; p.tooltipPos = [h[0] + 0.7 * B, h[1] + 0.7 * d]; p.half = q < -Math.PI / 2 || q > Math.PI / 2 ? 1 : 0; p.angle = q; C = Math.min(e, p.labelDistance / 5); p.labelPosition = {
            natural: { x: h[0] + B + Math.cos(q) * p.labelDistance, y: h[1] + d + Math.sin(q) * p.labelDistance },
            final: {},
            alignment: p.labelDistance < 0 ? 'center' : p.half ? 'right' : 'left',
            connectorPosition: {
              breakAt: {
                x: h[0] +
B + Math.cos(q) * C,
                y: h[1] + d + Math.sin(q) * C
              },
              touchingSliceAt: { x: h[0] + B, y: h[1] + d }
            }
          }
        }M(this, 'afterTranslate')
      },
      drawEmpty: function () { var h = this.options; if (this.total === 0) { var f = this.center[0]; var a = this.center[1]; this.graph || (this.graph = this.chart.renderer.circle(f, a, 0).addClass('highcharts-graph').add(this.group)); this.graph.animate({ 'stroke-width': h.borderWidth, cx: f, cy: a, r: this.center[2] / 2, fill: h.fillColor || 'none', stroke: h.color || '#cccccc' }, this.options.animation) } else this.graph && (this.graph = this.graph.destroy()) },
      redrawPoints: function () {
        var h = this; var f = h.chart; var a = f.renderer; var l; var e; var c; var g; var u = h.options.shadow; this.drawEmpty(); !u || h.shadowGroup || f.styledMode || (h.shadowGroup = a.g('shadow').attr({ zIndex: -1 }).add(h.group)); h.points.forEach(function (m) {
          var k = {}; e = m.graphic; if (!m.isNull && e) {
            g = m.shapeArgs; l = m.getTranslate(); if (!f.styledMode) { var w = m.shadowGroup; u && !w && (w = m.shadowGroup = a.g('shadow').add(h.shadowGroup)); w && w.attr(l); c = h.pointAttribs(m, m.selected && 'select') }m.delayedRendering ? (e.setRadialReference(h.center).attr(g).attr(l),
            f.styledMode || e.attr(c).attr({ 'stroke-linejoin': 'round' }).shadow(u, w), m.delayedRendering = !1) : (e.setRadialReference(h.center), f.styledMode || I(!0, k, c), I(!0, k, g, l), e.animate(k)); e.attr({ visibility: m.visible ? 'inherit' : 'hidden' }); e.addClass(m.getClassName())
          } else e && (m.graphic = e.destroy())
        })
      },
      drawPoints: function () {
        var h = this.chart.renderer; this.points.forEach(function (f) {
          f.graphic && f.hasNewShapeType() && (f.graphic = f.graphic.destroy()); f.graphic || (f.graphic = h[f.shapeType](f.shapeArgs).add(f.series.group),
          f.delayedRendering = !0)
        })
      },
      searchPoint: q,
      sortByAngle: function (h, f) { h.sort(function (a, h) { return typeof a.angle !== 'undefined' && (h.angle - a.angle) * f }) },
      drawLegendSymbol: g.drawRectangle,
      getCenter: v.getCenter,
      getSymbol: q,
      drawGraph: null
    }, {
      init: function () { H.prototype.init.apply(this, arguments); var h = this; h.name = J(h.name, 'Slice'); var f = function (a) { h.slice(a.type === 'select') }; K(h, 'select', f); K(h, 'unselect', f); return h },
      isValid: function () { return y(this.y) && this.y >= 0 },
      setVisible: function (h, f) {
        var a = this; var l = a.series
        var e = l.chart; var c = l.options.ignoreHiddenPoint; f = J(f, c); h !== a.visible && (a.visible = a.options.visible = h = typeof h === 'undefined' ? !a.visible : h, l.options.data[l.data.indexOf(a)] = a.options, ['graphic', 'dataLabel', 'connector', 'shadowGroup'].forEach(function (c) { if (a[c])a[c][h ? 'show' : 'hide'](!0) }), a.legendItem && e.legend.colorizeItem(a, h), h || a.state !== 'hover' || a.setState(''), c && (l.isDirty = !0), f && e.redraw())
      },
      slice: function (h, f, a) {
        var l = this.series; z(a, l.chart); J(f, !0); this.sliced = this.options.sliced = A(h) ? h : !this.sliced
        l.options.data[l.data.indexOf(this)] = this.options; this.graphic && this.graphic.animate(this.getTranslate()); this.shadowGroup && this.shadowGroup.animate(this.getTranslate())
      },
      getTranslate: function () { return this.sliced ? this.slicedTranslation : { translateX: 0, translateY: 0 } },
      haloPath: function (h) { var f = this.shapeArgs; return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(f.x, f.y, f.r + h, f.r + h, { innerR: f.r - 1, start: f.start, end: f.end }) },
      connectorShapes: {
        fixedOffset: function (h, f, a) {
          var l = f.breakAt
          f = f.touchingSliceAt; return [['M', h.x, h.y], a.softConnector ? ['C', h.x + (h.alignment === 'left' ? -5 : 5), h.y, 2 * l.x - f.x, 2 * l.y - f.y, l.x, l.y] : ['L', l.x, l.y], ['L', f.x, f.y]]
        },
        straight: function (h, f) { f = f.touchingSliceAt; return [['M', h.x, h.y], ['L', f.x, f.y]] },
        crookedLine: function (h, f, a) {
          f = f.touchingSliceAt; var l = this.series; var e = l.center[0]; var c = l.chart.plotWidth; var g = l.chart.plotLeft; l = h.alignment; var u = this.shapeArgs.r; a = E(a.crookDistance, 1); c = l === 'left' ? e + u + (c + g - e - u) * (1 - a) : g + (e - u) * a; a = ['L', c, h.y]; e = !0; if (l === 'left' ? c > h.x || c <
f.x : c < h.x || c > f.x)e = !1; h = [['M', h.x, h.y]]; e && h.push(a); h.push(['L', f.x, f.y]); return h
        }
      },
      getConnectorPath: function () { var h = this.labelPosition; var f = this.series.options.dataLabels; var a = f.connectorShape; var l = this.connectorShapes; l[a] && (a = l[a]); return a.call(this, { x: h.final.x, y: h.final.y, alignment: h.alignment }, h.connectorPosition, f) }
    }); ''
  }); P(A, 'parts/DataLabels.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.animObject; var v = g.arrayMax; var A = g.clamp; var G = g.defined; var N = g.extend; var M = g.fireEvent; var y = g.format
    var I = g.isArray; var J = g.merge; var E = g.objectEach; var D = g.pick; var z = g.relativeLength; var t = g.splat; var q = g.stableSort; g = k.noop; var r = k.Series; var h = k.seriesTypes; k.distribute = function (f, a, h) {
      function e (a, c) { return a.target - c.target } var c; var l = !0; var g = f; var r = []; var t = 0; var w = g.reducedLen || a; for (c = f.length; c--;)t += f[c].size; if (t > w) { q(f, function (a, c) { return (c.rank || 0) - (a.rank || 0) }); for (t = c = 0; t <= w;)t += f[c].size, c++; r = f.splice(c - 1, f.length) }q(f, e); for (f = f.map(function (a) { return { size: a.size, targets: [a.target], align: D(a.align, 0.5) } }); l;) {
        for (c =
f.length; c--;)l = f[c], t = (Math.min.apply(0, l.targets) + Math.max.apply(0, l.targets)) / 2, l.pos = A(t - l.size * l.align, 0, a - l.size); c = f.length; for (l = !1; c--;)c > 0 && f[c - 1].pos + f[c - 1].size > f[c].pos && (f[c - 1].size += f[c].size, f[c - 1].targets = f[c - 1].targets.concat(f[c].targets), f[c - 1].align = 0.5, f[c - 1].pos + f[c - 1].size > a && (f[c - 1].pos = a - f[c - 1].size), f.splice(c, 1), l = !0)
      }g.push.apply(g, r); c = 0; f.some(function (e) {
        var f = 0; if (e.targets.some(function () {
          g[c].pos = e.pos + f; if (typeof h !== 'undefined' && Math.abs(g[c].pos - g[c].target) > h) {
            return g.slice(0,
              c + 1).forEach(function (a) { delete a.pos }), g.reducedLen = (g.reducedLen || a) - 0.1 * a, g.reducedLen > 0.1 * a && k.distribute(g, a, h), !0
          } f += g[c].size; c++
        })) return !0
      }); q(g, e)
    }; r.prototype.drawDataLabels = function () {
      function f (a, b) { var d = b.filter; return d ? (b = d.operator, a = a[d.property], d = d.value, b === '>' && a > d || b === '<' && a < d || b === '>=' && a >= d || b === '<=' && a <= d || b === '==' && a == d || b === '===' && a === d ? !0 : !1) : !0 } function a (a, b) {
        var d = []; var c; if (I(a) && !I(b))d = a.map(function (a) { return J(a, b) }); else if (I(b) && !I(a)) {
          d = b.map(function (b) {
            return J(a,
              b)
          })
        } else if (I(a) || I(b)) for (c = Math.max(a.length, b.length); c--;)d[c] = J(a[c], b[c]); else d = J(a, b); return d
      } var h = this; var e = h.chart; var c = h.options; var g = c.dataLabels; var u = h.points; var k; var r = h.hasRendered || 0; var w = H(c.animation).duration; var p = Math.min(w, 200); var C = !e.renderer.forExport && D(g.defer, p > 0); var q = e.renderer; g = a(a(e.options.plotOptions && e.options.plotOptions.series && e.options.plotOptions.series.dataLabels, e.options.plotOptions && e.options.plotOptions[h.type] && e.options.plotOptions[h.type].dataLabels), g); M(this, 'drawDataLabels')
      if (I(g) || g.enabled || h._hasPointLabels) {
        var B = h.plotGroup('dataLabelsGroup', 'data-labels', C && !r ? 'hidden' : 'inherit', g.zIndex || 6); C && (B.attr({ opacity: +r }), r || setTimeout(function () { var a = h.dataLabelsGroup; a && (h.visible && B.show(!0), a[c.animation ? 'animate' : 'attr']({ opacity: 1 }, { duration: p })) }, w - p)); u.forEach(function (d) {
          k = t(a(g, d.dlOptions || d.options && d.options.dataLabels)); k.forEach(function (b, a) {
            var p = b.enabled && (!d.isNull || d.dataLabelOnNull) && f(d, b); var g = d.dataLabels ? d.dataLabels[a] : d.dataLabel; var l = d.connectors
              ? d.connectors[a] : d.connector; var m = D(b.distance, d.labelDistance); var n = !g; if (p) {
              var u = d.getLabelConfig(); var w = D(b[d.formatPrefix + 'Format'], b.format); u = G(w) ? y(w, u, e) : (b[d.formatPrefix + 'Formatter'] || b.formatter).call(u, b); w = b.style; var k = b.rotation; e.styledMode || (w.color = D(b.color, w.color, h.color, '#000000'), w.color === 'contrast' ? (d.contrastColor = q.getContrast(d.color || h.color), w.color = !G(m) && b.inside || m < 0 || c.stacking ? d.contrastColor : '#000000') : delete d.contrastColor, c.cursor && (w.cursor = c.cursor)); var r = {
                r: b.borderRadius ||
0,
                rotation: k,
                padding: b.padding,
                zIndex: 1
              }; e.styledMode || (r.fill = b.backgroundColor, r.stroke = b.borderColor, r['stroke-width'] = b.borderWidth); E(r, function (b, a) { typeof b === 'undefined' && delete r[a] })
            }!g || p && G(u) ? p && G(u) && (g ? r.text = u : (d.dataLabels = d.dataLabels || [], g = d.dataLabels[a] = k ? q.text(u, 0, -9999, b.useHTML).addClass('highcharts-data-label') : q.label(u, 0, -9999, b.shape, null, null, b.useHTML, null, 'data-label'), a || (d.dataLabel = g), g.addClass(' highcharts-data-label-color-' + d.colorIndex + ' ' + (b.className || '') +
(b.useHTML ? ' highcharts-tracker' : ''))), g.options = b, g.attr(r), e.styledMode || g.css(w).shadow(b.shadow), g.added || g.add(B), b.textPath && !b.useHTML && (g.setTextPath(d.getDataLabelPath && d.getDataLabelPath(g) || d.graphic, b.textPath), d.dataLabelPath && !b.textPath.enabled && (d.dataLabelPath = d.dataLabelPath.destroy())), h.alignDataLabel(d, g, b, null, n)) : (d.dataLabel = d.dataLabel && d.dataLabel.destroy(), d.dataLabels && (d.dataLabels.length === 1 ? delete d.dataLabels : delete d.dataLabels[a]), a || delete d.dataLabel, l && (d.connector =
d.connector.destroy(), d.connectors && (d.connectors.length === 1 ? delete d.connectors : delete d.connectors[a])))
          })
        })
      }M(this, 'afterDrawDataLabels')
    }; r.prototype.alignDataLabel = function (f, a, h, e, c) {
      var g = this; var l = this.chart; var k = this.isCartesian && l.inverted; var r = this.enabledDataSorting; var w = D(f.dlBox && f.dlBox.centerX, f.plotX, -9999); var p = D(f.plotY, -9999); var C = a.getBBox(); var q = h.rotation; var t = h.align; var d = l.isInsidePlot(w, Math.round(p), k); var b = D(h.overflow, r ? 'none' : 'justify') === 'justify'; var n = this.visible && !1 !== f.visible && (f.series.forceDL ||
r && !b || d || h.inside && e && l.isInsidePlot(w, k ? e.x + 1 : e.y + e.height - 1, k)); var x = function (e) { r && g.xAxis && !b && g.setDataLabelStartPos(f, a, c, d, e) }; if (n) {
        var v = l.renderer.fontMetrics(l.styledMode ? void 0 : h.style.fontSize, a).b; e = N({ x: k ? this.yAxis.len - p : w, y: Math.round(k ? this.xAxis.len - w : p), width: 0, height: 0 }, e); N(h, { width: C.width, height: C.height }); q ? (b = !1, w = l.renderer.rotCorr(v, q), w = { x: e.x + h.x + e.width / 2 + w.x, y: e.y + h.y + { top: 0, middle: 0.5, bottom: 1 }[h.verticalAlign] * e.height }, x(w), a[c ? 'attr' : 'animate'](w).attr({ align: t }),
        x = (q + 720) % 360, x = x > 180 && x < 360, t === 'left' ? w.y -= x ? C.height : 0 : t === 'center' ? (w.x -= C.width / 2, w.y -= C.height / 2) : t === 'right' && (w.x -= C.width, w.y -= x ? 0 : C.height), a.placed = !0, a.alignAttr = w) : (x(e), a.align(h, null, e), w = a.alignAttr); b && e.height >= 0 ? this.justifyDataLabel(a, h, w, C, e, c) : D(h.crop, !0) && (n = l.isInsidePlot(w.x, w.y) && l.isInsidePlot(w.x + C.width, w.y + C.height)); if (h.shape && !q)a[c ? 'attr' : 'animate']({ anchorX: k ? l.plotWidth - f.plotY : f.plotX, anchorY: k ? l.plotHeight - f.plotX : f.plotY })
      }c && r && (a.placed = !1); n || r && !b || (a.hide(!0),
      a.placed = !1)
    }; r.prototype.setDataLabelStartPos = function (f, a, h, e, c) { var g = this.chart; var l = g.inverted; var k = this.xAxis; var r = k.reversed; var w = l ? a.height / 2 : a.width / 2; f = (f = f.pointWidth) ? f / 2 : 0; k = l ? c.x : r ? -w - f : k.width - w + f; c = l ? r ? this.yAxis.height - w + f : -w - f : c.y; a.startXPos = k; a.startYPos = c; e ? a.visibility === 'hidden' && (a.show(), a.attr({ opacity: 0 }).animate({ opacity: 1 })) : a.attr({ opacity: 1 }).animate({ opacity: 0 }, void 0, a.hide); g.hasRendered && (h && a.attr({ x: a.startXPos, y: a.startYPos }), a.placed = !0) }; r.prototype.justifyDataLabel = function (f,
      a, h, e, c, g) { var l = this.chart; var m = a.align; var k = a.verticalAlign; var w = f.box ? 0 : f.padding || 0; var p = h.x + w; if (p < 0) { m === 'right' ? (a.align = 'left', a.inside = !0) : a.x = -p; var r = !0 }p = h.x + e.width - w; p > l.plotWidth && (m === 'left' ? (a.align = 'right', a.inside = !0) : a.x = l.plotWidth - p, r = !0); p = h.y + w; p < 0 && (k === 'bottom' ? (a.verticalAlign = 'top', a.inside = !0) : a.y = -p, r = !0); p = h.y + e.height - w; p > l.plotHeight && (k === 'top' ? (a.verticalAlign = 'bottom', a.inside = !0) : a.y = l.plotHeight - p, r = !0); r && (f.placed = !g, f.align(a, null, c)); return r }; h.pie && (h.pie.prototype.dataLabelPositioners =
{ radialDistributionY: function (f) { return f.top + f.distributeBox.pos }, radialDistributionX: function (f, a, h, e) { return f.getX(h < a.top + 2 || h > a.bottom - 2 ? e : h, a.half, a) }, justify: function (f, a, h) { return h[0] + (f.half ? -1 : 1) * (a + f.labelDistance) }, alignToPlotEdges: function (f, a, h, e) { f = f.getBBox().width; return a ? f + e : h - f - e }, alignToConnectors: function (f, a, h, e) { var c = 0; var g; f.forEach(function (a) { g = a.dataLabel.getBBox().width; g > c && (c = g) }); return a ? c + e : h - c - e } }, h.pie.prototype.drawDataLabels = function () {
      var f = this; var a = f.data; var h; var e =
f.chart; var c = f.options.dataLabels || {}; var g = c.connectorPadding; var u; var q = e.plotWidth; var t = e.plotHeight; var w = e.plotLeft; var p = Math.round(e.chartWidth / 3); var C; var y = f.center; var B = y[2] / 2; var d = y[1]; var b; var n; var x; var z; var E = [[], []]; var I; var H; var A; var M; var K = [0, 0, 0, 0]; var N = f.dataLabelPositioners; var P; f.visible && (c.enabled || f._hasPointLabels) && (a.forEach(function (b) { b.dataLabel && b.visible && b.dataLabel.shortened && (b.dataLabel.attr({ width: 'auto' }).css({ width: 'auto', textOverflow: 'clip' }), b.dataLabel.shortened = !1) }), r.prototype.drawDataLabels.apply(f), a.forEach(function (b) {
        b.dataLabel &&
(b.visible ? (E[b.half].push(b), b.dataLabel._pos = null, !G(c.style.width) && !G(b.options.dataLabels && b.options.dataLabels.style && b.options.dataLabels.style.width) && b.dataLabel.getBBox().width > p && (b.dataLabel.css({ width: Math.round(0.7 * p) + 'px' }), b.dataLabel.shortened = !0)) : (b.dataLabel = b.dataLabel.destroy(), b.dataLabels && b.dataLabels.length === 1 && delete b.dataLabels))
      }), E.forEach(function (a, p) {
        var l = a.length; var m = []; var u; if (l) {
          f.sortByAngle(a, p - 0.5); if (f.maxLabelDistance > 0) {
            var r = Math.max(0, d - B - f.maxLabelDistance)
            var C = Math.min(d + B + f.maxLabelDistance, e.plotHeight); a.forEach(function (b) { b.labelDistance > 0 && b.dataLabel && (b.top = Math.max(0, d - B - b.labelDistance), b.bottom = Math.min(d + B + b.labelDistance, e.plotHeight), u = b.dataLabel.getBBox().height || 21, b.distributeBox = { target: b.labelPosition.natural.y - b.top + u / 2, size: u, rank: b.y }, m.push(b.distributeBox)) }); r = C + u - r; k.distribute(m, r, r / 5)
          } for (M = 0; M < l; M++) {
            h = a[M]; x = h.labelPosition; b = h.dataLabel; A = !1 === h.visible ? 'hidden' : 'inherit'; H = r = x.natural.y; m && G(h.distributeBox) && (typeof h.distributeBox.pos ===
'undefined' ? A = 'hidden' : (z = h.distributeBox.size, H = N.radialDistributionY(h))); delete h.positionIndex; if (c.justify)I = N.justify(h, B, y); else switch (c.alignTo) { case 'connectors':I = N.alignToConnectors(a, p, q, w); break; case 'plotEdges':I = N.alignToPlotEdges(b, p, q, w); break; default:I = N.radialDistributionX(f, h, H, r) }b._attr = { visibility: A, align: x.alignment }; P = h.options.dataLabels || {}; b._pos = { x: I + D(P.x, c.x) + ({ left: g, right: -g }[x.alignment] || 0), y: H + D(P.y, c.y) - 10 }; x.final.x = I; x.final.y = H; D(c.crop, !0) &&
(n = b.getBBox().width, r = null, I - n < g && p === 1 ? (r = Math.round(n - I + g), K[3] = Math.max(r, K[3])) : I + n > q - g && p === 0 && (r = Math.round(I + n - q + g), K[1] = Math.max(r, K[1])), H - z / 2 < 0 ? K[0] = Math.max(Math.round(-H + z / 2), K[0]) : H + z / 2 > t && (K[2] = Math.max(Math.round(H + z / 2 - t), K[2])), b.sideOverflow = r)
          }
        }
      }), v(K) === 0 || this.verifyDataLabelOverflow(K)) && (this.placeDataLabels(), this.points.forEach(function (a) {
        P = J(c, a.options.dataLabels); if (u = D(P.connectorWidth, 1)) {
          var d; C = a.connector; if ((b = a.dataLabel) && b._pos && a.visible && a.labelDistance > 0) {
            A =
b._attr.visibility; if (d = !C)a.connector = C = e.renderer.path().addClass('highcharts-data-label-connector  highcharts-color-' + a.colorIndex + (a.className ? ' ' + a.className : '')).add(f.dataLabelsGroup), e.styledMode || C.attr({ 'stroke-width': u, stroke: P.connectorColor || a.color || '#666666' }); C[d ? 'attr' : 'animate']({ d: a.getConnectorPath() }); C.attr('visibility', A)
          } else C && (a.connector = C.destroy())
        }
      }))
    }, h.pie.prototype.placeDataLabels = function () {
      this.points.forEach(function (f) {
        var a = f.dataLabel; var h; a && f.visible && ((h = a._pos)
          ? (a.sideOverflow && (a._attr.width = Math.max(a.getBBox().width - a.sideOverflow, 0), a.css({ width: a._attr.width + 'px', textOverflow: (this.options.dataLabels.style || {}).textOverflow || 'ellipsis' }), a.shortened = !0), a.attr(a._attr), a[a.moved ? 'animate' : 'attr'](h), a.moved = !0) : a && a.attr({ y: -9999 })); delete f.distributeBox
      }, this)
    }, h.pie.prototype.alignDataLabel = g, h.pie.prototype.verifyDataLabelOverflow = function (f) {
      var a = this.center; var h = this.options; var e = h.center; var c = h.minSize || 80; var g = h.size !== null; if (!g) {
        if (e[0] !== null) {
          var u =
Math.max(a[2] - Math.max(f[1], f[3]), c)
        } else u = Math.max(a[2] - f[1] - f[3], c), a[0] += (f[3] - f[1]) / 2; e[1] !== null ? u = A(u, c, a[2] - Math.max(f[0], f[2])) : (u = A(u, c, a[2] - f[0] - f[2]), a[1] += (f[0] - f[2]) / 2); u < a[2] ? (a[2] = u, a[3] = Math.min(z(h.innerSize || 0, u), u), this.translate(a), this.drawDataLabels && this.drawDataLabels()) : g = !0
      } return g
    }); h.column && (h.column.prototype.alignDataLabel = function (f, a, h, e, c) {
      var g = this.chart.inverted; var l = f.series; var k = f.dlBox || f.shapeArgs; var q = D(f.below, f.plotY > D(this.translatedThreshold, l.yAxis.len)); var w =
D(h.inside, !!this.options.stacking); k && (e = J(k), e.y < 0 && (e.height += e.y, e.y = 0), k = e.y + e.height - l.yAxis.len, k > 0 && k < e.height && (e.height -= k), g && (e = { x: l.yAxis.len - e.y - e.height, y: l.xAxis.len - e.x - e.width, width: e.height, height: e.width }), w || (g ? (e.x += q ? 0 : e.width, e.width = 0) : (e.y += q ? e.height : 0, e.height = 0))); h.align = D(h.align, !g || w ? 'center' : q ? 'right' : 'left'); h.verticalAlign = D(h.verticalAlign, g || w ? 'middle' : q ? 'top' : 'bottom'); r.prototype.alignDataLabel.call(this, f, a, h, e, c); h.inside && f.contrastColor && a.css({ color: f.contrastColor })
    })
  })
  P(A, 'modules/overlapping-datalabels.src.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var H = g.addEvent; var v = g.fireEvent; var A = g.isArray; var G = g.objectEach; var N = g.pick; k = k.Chart; H(k, 'render', function () {
      var g = []; (this.labelCollectors || []).forEach(function (k) { g = g.concat(k()) }); (this.yAxis || []).forEach(function (k) { k.stacking && k.options.stackLabels && !k.options.stackLabels.allowOverlap && G(k.stacking.stacks, function (k) { G(k, function (k) { g.push(k.label) }) }) }); (this.series || []).forEach(function (k) {
        var v =
k.options.dataLabels; k.visible && (!1 !== v.enabled || k._hasPointLabels) && (k.nodes || k.points).forEach(function (k) { k.visible && (A(k.dataLabels) ? k.dataLabels : k.dataLabel ? [k.dataLabel] : []).forEach(function (v) { var y = v.options; v.labelrank = N(y.labelrank, k.labelrank, k.shapeArgs && k.shapeArgs.height); y.allowOverlap || g.push(v) }) })
      }); this.hideOverlappingLabels(g)
    }); k.prototype.hideOverlappingLabels = function (g) {
      var k = this; var G = g.length; var J = k.renderer; var E; var D; var z; var t = !1; var q = function (f) {
        var a; var h = f.box ? 0 : f.padding || 0; var e = a = 0; var c; if (f &&
(!f.alignAttr || f.placed)) { var g = f.alignAttr || { x: f.attr('x'), y: f.attr('y') }; var u = f.parentGroup; f.width || (a = f.getBBox(), f.width = a.width, f.height = a.height, a = J.fontMetrics(null, f.element).h); var k = f.width - 2 * h; (c = { left: '0', center: '0.5', right: '1' }[f.alignValue]) ? e = +c * k : Math.round(f.x) !== f.translateX && (e = f.x - f.translateX); return { x: g.x + (u.translateX || 0) + h - e, y: g.y + (u.translateY || 0) + h - a, width: f.width - 2 * h, height: f.height - 2 * h } }
      }; for (D = 0; D < G; D++) if (E = g[D])E.oldOpacity = E.opacity, E.newOpacity = 1, E.absoluteBox = q(E)
      g.sort(function (f, a) { return (a.labelrank || 0) - (f.labelrank || 0) }); for (D = 0; D < G; D++) { var r = (q = g[D]) && q.absoluteBox; for (E = D + 1; E < G; ++E) { var h = (z = g[E]) && z.absoluteBox; !r || !h || q === z || q.newOpacity === 0 || z.newOpacity === 0 || h.x > r.x + r.width || h.x + h.width < r.x || h.y > r.y + r.height || h.y + h.height < r.y || ((q.labelrank < z.labelrank ? q : z).newOpacity = 0) } }g.forEach(function (f) {
        if (f) {
          var a = f.newOpacity; f.oldOpacity !== a && (f.alignAttr && f.placed ? (f[a ? 'removeClass' : 'addClass']('highcharts-data-label-hidden'), t = !0, f.alignAttr.opacity =
a, f[f.isOld ? 'animate' : 'attr'](f.alignAttr, null, function () { k.styledMode || f.css({ pointerEvents: a ? 'auto' : 'none' }); f.visibility = a ? 'inherit' : 'hidden'; f.placed = !!a }), v(k, 'afterHideOverlappingLabel')) : f.attr({ opacity: a })); f.isOld = !0
        }
      }); t && v(k, 'afterHideAllOverlappingLabels')
    }
  }); P(A, 'parts/Interaction.js', [A['parts/Globals.js'], A['parts/Legend.js'], A['parts/Point.js'], A['parts/Utilities.js']], function (k, g, H, v) {
    var A = v.addEvent; var G = v.createElement; var N = v.css; var M = v.defined; var y = v.extend; var I = v.fireEvent; var J = v.isArray; var E = v.isFunction
    var D = v.isNumber; var z = v.isObject; var t = v.merge; var q = v.objectEach; var r = v.pick; v = k.Chart; var h = k.defaultOptions; var f = k.defaultPlotOptions; var a = k.hasTouch; var l = k.Series; var e = k.seriesTypes; var c = k.svg; var m = k.TrackerMixin = {
      drawTrackerPoint: function () {
        var c = this; var e = c.chart; var f = e.pointer; var h = function (a) { var c = f.getPointFromEvent(a); typeof c !== 'undefined' && (f.isDirectTouch = !0, c.onMouseOver(a)) }; var g; c.points.forEach(function (a) {
          g = J(a.dataLabels) ? a.dataLabels : a.dataLabel ? [a.dataLabel] : []; a.graphic && (a.graphic.element.point = a); g.forEach(function (c) {
            c.div
              ? c.div.point = a : c.element.point = a
          })
        }); c._hasTracking || (c.trackerGroups.forEach(function (g) { if (c[g]) { c[g].addClass('highcharts-tracker').on('mouseover', h).on('mouseout', function (a) { f.onTrackerMouseOut(a) }); if (a)c[g].on('touchstart', h); !e.styledMode && c.options.cursor && c[g].css(N).css({ cursor: c.options.cursor }) } }), c._hasTracking = !0); I(this, 'afterDrawTracker')
      },
      drawTrackerGraph: function () {
        var e = this; var f = e.options; var h = f.trackByArea; var g = [].concat(h ? e.areaPath : e.graphPath); var p = e.chart; var l = p.pointer; var m = p.renderer; var k = p.options.tooltip.snap
        var d = e.tracker; var b = function (b) { if (p.hoverSeries !== e)e.onMouseOver() }; var n = 'rgba(192,192,192,' + (c ? 0.0001 : 0.002) + ')'; d ? d.attr({ d: g }) : e.graph && (e.tracker = m.path(g).attr({ visibility: e.visible ? 'visible' : 'hidden', zIndex: 2 }).addClass(h ? 'highcharts-tracker-area' : 'highcharts-tracker-line').add(e.group), p.styledMode || e.tracker.attr({ 'stroke-linecap': 'round', 'stroke-linejoin': 'round', stroke: n, fill: h ? n : 'none', 'stroke-width': e.graph.strokeWidth() + (h ? 0 : 2 * k) }), [e.tracker, e.markerGroup].forEach(function (d) {
          d.addClass('highcharts-tracker').on('mouseover',
            b).on('mouseout', function (b) { l.onTrackerMouseOut(b) }); f.cursor && !p.styledMode && d.css({ cursor: f.cursor }); if (a)d.on('touchstart', b)
        })); I(this, 'afterDrawTracker')
      }
    }; e.column && (e.column.prototype.drawTracker = m.drawTrackerPoint); e.pie && (e.pie.prototype.drawTracker = m.drawTrackerPoint); e.scatter && (e.scatter.prototype.drawTracker = m.drawTrackerPoint); y(g.prototype, {
      setItemEvents: function (a, c, e) {
        var f = this; var h = f.chart.renderer.boxWrapper; var g = a instanceof H; var l = 'highcharts-legend-' + (g ? 'point' : 'series') + '-active'
        var m = f.chart.styledMode; (e ? [c, a.legendSymbol] : [a.legendGroup]).forEach(function (d) {
          if (d) {
            d.on('mouseover', function () { a.visible && f.allItems.forEach(function (b) { a !== b && b.setState('inactive', !g) }); a.setState('hover'); a.visible && h.addClass(l); m || c.css(f.options.itemHoverStyle) }).on('mouseout', function () { f.chart.styledMode || c.css(t(a.visible ? f.itemStyle : f.itemHiddenStyle)); f.allItems.forEach(function (b) { a !== b && b.setState('', !g) }); h.removeClass(l); a.setState() }).on('click', function (b) {
              var d = function () {
                a.setVisible &&
a.setVisible(); f.allItems.forEach(function (b) { a !== b && b.setState(a.visible ? 'inactive' : '', !g) })
              }; h.removeClass(l); b = { browserEvent: b }; a.firePointEvent ? a.firePointEvent('legendItemClick', b, d) : I(a, 'legendItemClick', b, d)
            })
          }
        })
      },
      createCheckboxForItem: function (a) {
        a.checkbox = G('input', { type: 'checkbox', className: 'highcharts-legend-checkbox', checked: a.selected, defaultChecked: a.selected }, this.options.itemCheckboxStyle, this.chart.container); A(a.checkbox, 'click', function (c) {
          I(a.series || a, 'checkboxClick', {
            checked: c.target.checked,
            item: a
          }, function () { a.select() })
        })
      }
    }); y(v.prototype, {
      showResetZoom: function () { function a () { c.zoomOut() } var c = this; var e = h.lang; var f = c.options.chart.resetZoomButton; var g = f.theme; var l = g.states; var m = f.relativeTo === 'chart' || f.relativeTo === 'spaceBox' ? null : 'plotBox'; I(this, 'beforeShowResetZoom', null, function () { c.resetZoomButton = c.renderer.button(e.resetZoom, null, null, a, g, l && l.hover).attr({ align: f.position.align, title: e.resetZoomTitle }).addClass('highcharts-reset-zoom').add().align(f.position, !1, m) }); I(this, 'afterShowResetZoom') },
      zoomOut: function () { I(this, 'selection', { resetSelection: !0 }, this.zoom) },
      zoom: function (a) {
        var c = this; var e; var f = c.pointer; var h = !1; var g = c.inverted ? f.mouseDownX : f.mouseDownY; !a || a.resetSelection ? (c.axes.forEach(function (a) { e = a.zoom() }), f.initiated = !1) : a.xAxis.concat(a.yAxis).forEach(function (a) { var d = a.axis; var b = c.inverted ? d.left : d.top; var p = c.inverted ? b + d.width : b + d.height; var l = d.isXAxis; var m = !1; if (!l && g >= b && g <= p || l || !M(g))m = !0; f[l ? 'zoomX' : 'zoomY'] && m && (e = d.zoom(a.min, a.max), d.displayBtn && (h = !0)) }); var l = c.resetZoomButton; h && !l
          ? c.showResetZoom() : !h && z(l) && (c.resetZoomButton = l.destroy()); e && c.redraw(r(c.options.chart.animation, a && a.animation, c.pointCount < 100))
      },
      pan: function (a, c) {
        var e = this; var f = e.hoverPoints; var h = e.options.chart; var g = e.options.mapNavigation && e.options.mapNavigation.enabled; var l; c = typeof c === 'object' ? c : { enabled: c, type: 'x' }; h && h.panning && (h.panning = c); var m = c.type; I(this, 'pan', { originalEvent: a }, function () {
          f && f.forEach(function (b) { b.setState() }); var d = [1]; m === 'xy' ? d = [1, 0] : m === 'y' && (d = [0]); d.forEach(function (b) {
            var d = e[b
              ? 'xAxis' : 'yAxis'][0]; var c = d.options; var f = d.horiz; var h = a[f ? 'chartX' : 'chartY']; f = f ? 'mouseDownX' : 'mouseDownY'; var p = e[f]; var u = (d.pointRange || 0) / 2; var w = d.reversed && !e.inverted || !d.reversed && e.inverted ? -1 : 1; var r = d.getExtremes(); var C = d.toValue(p - h, !0) + u * w; w = d.toValue(p + d.len - h, !0) - u * w; var q = w < C; p = q ? w : C; C = q ? C : w; var t = d.hasVerticalPanning(); var B = d.panningState; d.series.forEach(function (a) {
              if (t && !b && (!B || B.isDirty)) {
                var d = a.getProcessedData(!0); a = a.getExtremes(d.yData, !0); B || (B = { startMin: Number.MAX_VALUE, startMax: -Number.MAX_VALUE })
                D(a.dataMin) && D(a.dataMax) && (B.startMin = Math.min(a.dataMin, B.startMin), B.startMax = Math.max(a.dataMax, B.startMax))
              }
            }); w = Math.min(k.pick(B === null || void 0 === B ? void 0 : B.startMin, r.dataMin), u ? r.min : d.toValue(d.toPixels(r.min) - d.minPixelPadding)); u = Math.max(k.pick(B === null || void 0 === B ? void 0 : B.startMax, r.dataMax), u ? r.max : d.toValue(d.toPixels(r.max) + d.minPixelPadding)); d.panningState = B; if (!c.ordinal) {
              c = w - p; c > 0 && (C += c, p = w); c = C - u; c > 0 && (C = u, p -= c); if (d.series.length && p !== r.min && C !== r.max && b || B && p >= w && C <= u) {
                d.setExtremes(p,
                  C, !1, !1, { trigger: 'pan' }), e.resetZoomButton || g || !m.match('y') || (e.showResetZoom(), d.displayBtn = !1), l = !0
              }e[f] = h
            }
          }); l && e.redraw(!1); N(e.container, { cursor: 'move' })
        })
      }
    }); y(H.prototype, {
      select: function (a, c) {
        var e = this; var f = e.series; var h = f.chart; this.selectedStaging = a = r(a, !e.selected); e.firePointEvent(a ? 'select' : 'unselect', { accumulate: c }, function () {
          e.selected = e.options.selected = a; f.options.data[f.data.indexOf(e)] = e.options; e.setState(a && 'select'); c || h.getSelectedPoints().forEach(function (a) {
            var c = a.series; a.selected &&
a !== e && (a.selected = a.options.selected = !1, c.options.data[c.data.indexOf(a)] = a.options, a.setState(h.hoverPoints && c.options.inactiveOtherPoints ? 'inactive' : ''), a.firePointEvent('unselect'))
          })
        }); delete this.selectedStaging
      },
      onMouseOver: function (a) { var c = this.series.chart; var e = c.pointer; a = a ? e.normalize(a) : e.getChartCoordinatesFromPoint(this, c.inverted); e.runPointActions(a, this) },
      onMouseOut: function () {
        var a = this.series.chart; this.firePointEvent('mouseOut'); this.series.options.inactiveOtherPoints || (a.hoverPoints ||
[]).forEach(function (a) { a.setState() }); a.hoverPoints = a.hoverPoint = null
      },
      importEvents: function () { if (!this.hasImportedEvents) { var a = this; var c = t(a.series.options.point, a.options).events; a.events = c; q(c, function (c, e) { E(c) && A(a, e, c) }); this.hasImportedEvents = !0 } },
      setState: function (a, c) {
        var e = this.series; var h = this.state; var g = e.options.states[a || 'normal'] || {}; var l = f[e.type].marker && e.options.marker; var m = l && !1 === l.enabled; var k = l && l.states && l.states[a || 'normal'] || {}; var d = !1 === k.enabled; var b = e.stateMarkerGraphic; var n = this.marker || {}; var u =
e.chart; var q = e.halo; var t; var v = l && e.markerAttribs; a = a || ''; if (!(a === this.state && !c || this.selected && a !== 'select' || !1 === g.enabled || a && (d || m && !1 === k.enabled) || a && n.states && n.states[a] && !1 === n.states[a].enabled)) {
          this.state = a; v && (t = e.markerAttribs(this, a)); if (this.graphic) {
            h && this.graphic.removeClass('highcharts-point-' + h); a && this.graphic.addClass('highcharts-point-' + a); if (!u.styledMode) {
              var z = e.pointAttribs(this, a); var D = r(u.options.chart.animation, g.animation); e.options.inactiveOtherPoints && z.opacity && ((this.dataLabels ||
[]).forEach(function (a) { a && a.animate({ opacity: z.opacity }, D) }), this.connector && this.connector.animate({ opacity: z.opacity }, D)); this.graphic.animate(z, D)
            }t && this.graphic.animate(t, r(u.options.chart.animation, k.animation, l.animation)); b && b.hide()
          } else {
            if (a && k) {
              h = n.symbol || e.symbol; b && b.currentSymbol !== h && (b = b.destroy()); if (t) if (b)b[c ? 'animate' : 'attr']({ x: t.x, y: t.y }); else h && (e.stateMarkerGraphic = b = u.renderer.symbol(h, t.x, t.y, t.width, t.height).add(e.markerGroup), b.currentSymbol = h); !u.styledMode && b && b.attr(e.pointAttribs(this,
                a))
            }b && (b[a && this.isInside ? 'show' : 'hide'](), b.element.point = this)
          }a = g.halo; g = (b = this.graphic || b) && b.visibility || 'inherit'; a && a.size && b && g !== 'hidden' && !this.isCluster ? (q || (e.halo = q = u.renderer.path().add(b.parentGroup)), q.show()[c ? 'animate' : 'attr']({ d: this.haloPath(a.size) }), q.attr({ class: 'highcharts-halo highcharts-color-' + r(this.colorIndex, e.colorIndex) + (this.className ? ' ' + this.className : ''), visibility: g, zIndex: -1 }), q.point = this, u.styledMode || q.attr(y({ fill: this.color || e.color, 'fill-opacity': a.opacity },
            a.attributes))) : q && q.point && q.point.haloPath && q.animate({ d: q.point.haloPath(0) }, null, q.hide); I(this, 'afterSetState')
        }
      },
      haloPath: function (a) { return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a) }
    }); y(l.prototype, {
      onMouseOver: function () { var a = this.chart; var c = a.hoverSeries; a.pointer.setHoverChartIndex(); if (c && c !== this)c.onMouseOut(); this.options.events.mouseOver && I(this, 'mouseOver'); this.setState('hover'); a.hoverSeries = this },
      onMouseOut: function () {
        var a = this.options
        var c = this.chart; var e = c.tooltip; var f = c.hoverPoint; c.hoverSeries = null; if (f)f.onMouseOut(); this && a.events.mouseOut && I(this, 'mouseOut'); !e || this.stickyTracking || e.shared && !this.noSharedTooltip || e.hide(); c.series.forEach(function (a) { a.setState('', !0) })
      },
      setState: function (a, c) {
        var e = this; var f = e.options; var h = e.graph; var g = f.inactiveOtherPoints; var l = f.states; var m = f.lineWidth; var d = f.opacity; var b = r(l[a || 'normal'] && l[a || 'normal'].animation, e.chart.options.chart.animation); f = 0; a = a || ''; if (e.state !== a && ([e.group, e.markerGroup, e.dataLabelsGroup].forEach(function (b) {
          b &&
(e.state && b.removeClass('highcharts-series-' + e.state), a && b.addClass('highcharts-series-' + a))
        }), e.state = a, !e.chart.styledMode)) { if (l[a] && !1 === l[a].enabled) return; a && (m = l[a].lineWidth || m + (l[a].lineWidthPlus || 0), d = r(l[a].opacity, d)); if (h && !h.dashstyle) for (l = { 'stroke-width': m }, h.animate(l, b); e['zone-graph-' + f];)e['zone-graph-' + f].attr(l), f += 1; g || [e.group, e.markerGroup, e.dataLabelsGroup, e.labelBySeries].forEach(function (a) { a && a.animate({ opacity: d }, b) }) }c && g && e.points && e.setAllPointsToState(a)
      },
      setAllPointsToState: function (a) {
        this.points.forEach(function (c) {
          c.setState &&
c.setState(a)
        })
      },
      setVisible: function (a, c) {
        var e = this; var f = e.chart; var h = e.legendItem; var g = f.options.chart.ignoreHiddenSeries; var l = e.visible; var m = (e.visible = a = e.options.visible = e.userOptions.visible = typeof a === 'undefined' ? !l : a) ? 'show' : 'hide'; ['group', 'dataLabelsGroup', 'markerGroup', 'tracker', 'tt'].forEach(function (a) { if (e[a])e[a][m]() }); if (f.hoverSeries === e || (f.hoverPoint && f.hoverPoint.series) === e)e.onMouseOut(); h && f.legend.colorizeItem(e, a); e.isDirty = !0; e.options.stacking && f.series.forEach(function (a) {
          a.options.stacking &&
a.visible && (a.isDirty = !0)
        }); e.linkedSeries.forEach(function (d) { d.setVisible(a, !1) }); g && (f.isDirtyBox = !0); I(e, m); !1 !== c && f.redraw()
      },
      show: function () { this.setVisible(!0) },
      hide: function () { this.setVisible(!1) },
      select: function (a) { this.selected = a = this.options.selected = typeof a === 'undefined' ? !this.selected : a; this.checkbox && (this.checkbox.checked = a); I(this, a ? 'select' : 'unselect') },
      drawTracker: m.drawTrackerGraph
    })
  }); P(A, 'parts/Responsive.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var A =
g.find; var v = g.isArray; var K = g.isObject; var G = g.merge; var N = g.objectEach; var M = g.pick; var y = g.splat; var I = g.uniqueKey; k = k.Chart; k.prototype.setResponsive = function (g, k) {
      var v = this.options.responsive; var z = []; var t = this.currentResponsive; !k && v && v.rules && v.rules.forEach(function (g) { typeof g._id === 'undefined' && (g._id = I()); this.matchResponsiveRule(g, z) }, this); k = G.apply(0, z.map(function (g) { return A(v.rules, function (k) { return k._id === g }).chartOptions })); k.isResponsiveOptions = !0; z = z.toString() || void 0; z !== (t && t.ruleIds) && (t && this.update(t.undoOptions,
        g, !0), z ? (t = this.currentOptions(k), t.isResponsiveOptions = !0, this.currentResponsive = { ruleIds: z, mergedOptions: k, undoOptions: t }, this.update(k, g, !0)) : this.currentResponsive = void 0)
    }; k.prototype.matchResponsiveRule = function (g, k) { var v = g.condition; (v.callback || function () { return this.chartWidth <= M(v.maxWidth, Number.MAX_VALUE) && this.chartHeight <= M(v.maxHeight, Number.MAX_VALUE) && this.chartWidth >= M(v.minWidth, 0) && this.chartHeight >= M(v.minHeight, 0) }).call(this) && k.push(g._id) }; k.prototype.currentOptions = function (g) {
      function k (g,
        q, r, h) { var f; N(g, function (a, g) { if (!h && D.collectionsWithUpdate.indexOf(g) > -1) for (a = y(a), r[g] = [], f = 0; f < a.length; f++)q[g][f] && (r[g][f] = {}, k(a[f], q[g][f], r[g][f], h + 1)); else K(a) ? (r[g] = v(a) ? [] : {}, k(a, q[g] || {}, r[g], h + 1)) : r[g] = typeof q[g] === 'undefined' ? null : q[g] }) } var D = this; var z = {}; k(g, this.options, z, 0); return z
    }
  }); P(A, 'masters/highcharts.src.js', [A['parts/Globals.js']], function (k) { return k }); P(A, 'parts/NavigatorAxis.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var A = k.isTouchDevice; var v =
g.addEvent; var K = g.correctFloat; var G = g.defined; var N = g.isNumber; var M = g.pick; var y = (function () { function g (g) { this.axis = g }g.prototype.destroy = function () { this.axis = void 0 }; g.prototype.toFixedRange = function (g, k, v, z) { var t = this.axis; var q = t.chart; q = q && q.fixedRange; var r = (t.pointRange || 0) / 2; g = M(v, t.translate(g, !0, !t.horiz)); k = M(z, t.translate(k, !0, !t.horiz)); t = q && (k - g) / q; G(v) || (g = K(g + r)); G(z) || (k = K(k - r)); t > 0.7 && t < 1.3 && (z ? g = k - q : k = g + q); N(g) && N(k) || (g = k = void 0); return { min: g, max: k } }; return g }()); return (function () {
      function g () {}g.compose =
function (g) {
  g.keepProps.push('navigatorAxis'); v(g, 'init', function () { this.navigatorAxis || (this.navigatorAxis = new y(this)) }); v(g, 'zoom', function (g) {
    var k = this.chart.options; var v = k.navigator; var t = this.navigatorAxis; var q = k.chart.pinchType; var r = k.rangeSelector; k = k.chart.zoomType; this.isXAxis && (v && v.enabled || r && r.enabled) && (k === 'y' ? g.zoomed = !1 : (!A && k === 'xy' || A && q === 'xy') && this.options.range && (v = t.previousZoom, G(g.newMin) ? t.previousZoom = [this.min, this.max] : v && (g.newMin = v[0], g.newMax = v[1], t.previousZoom = void 0))); typeof g.zoomed !==
'undefined' && g.preventDefault()
  })
}; g.AdditionsClass = y; return g
    }())
  }); P(A, 'parts/ScrollbarAxis.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var A = g.addEvent; var v = g.defined; var K = g.pick; return (function () {
      function g () {}g.compose = function (g, G) {
        A(g, 'afterInit', function () {
          var g = this; g.options && g.options.scrollbar && g.options.scrollbar.enabled && (g.options.scrollbar.vertical = !g.horiz, g.options.startOnTick = g.options.endOnTick = !1, g.scrollbar = new G(g.chart.renderer, g.options.scrollbar, g.chart),
          A(g.scrollbar, 'changed', function (y) {
            var G = K(g.options && g.options.min, g.min); var E = K(g.options && g.options.max, g.max); var D = v(g.dataMin) ? Math.min(G, g.min, g.dataMin) : G; var z = (v(g.dataMax) ? Math.max(E, g.max, g.dataMax) : E) - D; v(G) && v(E) && (g.horiz && !g.reversed || !g.horiz && g.reversed ? (G = D + z * this.to, D += z * this.from) : (G = D + z * (1 - this.from), D += z * (1 - this.to)), K(this.options.liveRedraw, k.svg && !k.isTouchDevice && !this.chart.isBoosting) || y.DOMType === 'mouseup' || !v(y.DOMType) ? g.setExtremes(D, G, !0, y.DOMType !== 'mousemove', y) : this.setRange(this.from,
              this.to))
          }))
        }); A(g, 'afterRender', function () {
          var g = Math.min(K(this.options.min, this.min), this.min, K(this.dataMin, this.min)); var k = Math.max(K(this.options.max, this.max), this.max, K(this.dataMax, this.max)); var G = this.scrollbar; var E = this.axisTitleMargin + (this.titleOffset || 0); var D = this.chart.scrollbarsOffsets; var z = this.options.margin || 0; G && (this.horiz ? (this.opposite || (D[1] += E), G.position(this.left, this.top + this.height + 2 + D[1] - (this.opposite ? z : 0), this.width, this.height), this.opposite || (D[1] += z), E = 1) : (this.opposite && (D[0] +=
E), G.position(this.left + this.width + 2 + D[0] - (this.opposite ? 0 : z), this.top, this.width, this.height), this.opposite && (D[0] += z), E = 0), D[E] += G.size + G.options.margin, isNaN(g) || isNaN(k) || !v(this.min) || !v(this.max) || this.min === this.max ? G.setRange(0, 1) : (D = (this.min - g) / (k - g), g = (this.max - g) / (k - g), this.horiz && !this.reversed || !this.horiz && this.reversed ? G.setRange(D, g) : G.setRange(1 - g, 1 - D)))
        }); A(g, 'afterGetOffset', function () {
          var g = this.horiz ? 2 : 1; var k = this.scrollbar; k && (this.chart.scrollbarsOffsets = [0, 0], this.chart.axisOffset[g] +=
k.size + k.options.margin)
        })
      }; return g
    }())
  }); P(A, 'parts/Scrollbar.js', [A['parts/Axis.js'], A['parts/Globals.js'], A['parts/ScrollbarAxis.js'], A['parts/Utilities.js']], function (k, g, A, v) {
    var H = v.addEvent; var G = v.correctFloat; var N = v.defined; var M = v.destroyObjectProperties; var y = v.fireEvent; var I = v.merge; var J = v.pick; var E = v.removeEvent; v = g.defaultOptions; var D = g.hasTouch; var z = g.isTouchDevice; var t = g.swapXY = function (g, h) { h && g.forEach(function (f) { for (var a = f.length, h, e = 0; e < a; e += 2)h = f[e + 1], typeof h === 'number' && (f[e + 1] = f[e + 2], f[e + 2] = h) }); return g }
    var q = (function () {
      function g (h, f, a) { this._events = []; this.from = this.chartY = this.chartX = 0; this.scrollbar = this.group = void 0; this.scrollbarButtons = []; this.scrollbarGroup = void 0; this.scrollbarLeft = 0; this.scrollbarRifles = void 0; this.scrollbarStrokeWidth = 1; this.to = this.size = this.scrollbarTop = 0; this.track = void 0; this.trackBorderWidth = 1; this.userOptions = {}; this.y = this.x = 0; this.chart = a; this.options = f; this.renderer = a.renderer; this.init(h, f, a) }g.prototype.addEvents = function () {
        var h = this.options.inverted ? [1, 0] : [0,
          1]; var f = this.scrollbarButtons; var a = this.scrollbarGroup.element; var g = this.track.element; var e = this.mouseDownHandler.bind(this); var c = this.mouseMoveHandler.bind(this); var m = this.mouseUpHandler.bind(this); h = [[f[h[0]].element, 'click', this.buttonToMinClick.bind(this)], [f[h[1]].element, 'click', this.buttonToMaxClick.bind(this)], [g, 'click', this.trackClick.bind(this)], [a, 'mousedown', e], [a.ownerDocument, 'mousemove', c], [a.ownerDocument, 'mouseup', m]]; D && h.push([a, 'touchstart', e], [a.ownerDocument, 'touchmove', c], [a.ownerDocument, 'touchend',
          m]); h.forEach(function (a) { H.apply(null, a) }); this._events = h
      }; g.prototype.buttonToMaxClick = function (h) { var f = (this.to - this.from) * J(this.options.step, 0.2); this.updatePosition(this.from + f, this.to + f); y(this, 'changed', { from: this.from, to: this.to, trigger: 'scrollbar', DOMEvent: h }) }; g.prototype.buttonToMinClick = function (h) { var f = G(this.to - this.from) * J(this.options.step, 0.2); this.updatePosition(G(this.from - f), G(this.to - f)); y(this, 'changed', { from: this.from, to: this.to, trigger: 'scrollbar', DOMEvent: h }) }; g.prototype.cursorToScrollbarPosition =
function (h) { var f = this.options; f = f.minWidth > this.calculatedWidth ? f.minWidth : 0; return { chartX: (h.chartX - this.x - this.xOffset) / (this.barWidth - f), chartY: (h.chartY - this.y - this.yOffset) / (this.barWidth - f) } }; g.prototype.destroy = function () { var h = this.chart.scroller; this.removeEvents(); ['track', 'scrollbarRifles', 'scrollbar', 'scrollbarGroup', 'group'].forEach(function (f) { this[f] && this[f].destroy && (this[f] = this[f].destroy()) }, this); h && this === h.scrollbar && (h.scrollbar = null, M(h.scrollbarButtons)) }; g.prototype.drawScrollbarButton =
function (h) {
  var f = this.renderer; var a = this.scrollbarButtons; var g = this.options; var e = this.size; var c = f.g().add(this.group); a.push(c); c = f.rect().addClass('highcharts-scrollbar-button').add(c); this.chart.styledMode || c.attr({ stroke: g.buttonBorderColor, 'stroke-width': g.buttonBorderWidth, fill: g.buttonBackgroundColor }); c.attr(c.crisp({ x: -0.5, y: -0.5, width: e + 1, height: e + 1, r: g.buttonBorderRadius }, c.strokeWidth())); c = f.path(t([['M', e / 2 + (h ? -1 : 1), e / 2 - 3], ['L', e / 2 + (h ? -1 : 1), e / 2 + 3], ['L', e / 2 + (h ? 2 : -2), e / 2]], g.vertical)).addClass('highcharts-scrollbar-arrow').add(a[h])
  this.chart.styledMode || c.attr({ fill: g.buttonArrowColor })
}; g.prototype.init = function (h, f, a) { this.scrollbarButtons = []; this.renderer = h; this.userOptions = f; this.options = I(g.defaultOptions, f); this.chart = a; this.size = J(this.options.size, this.options.height); f.enabled && (this.render(), this.addEvents()) }; g.prototype.mouseDownHandler = function (h) {
        h = this.chart.pointer.normalize(h); h = this.cursorToScrollbarPosition(h); this.chartX = h.chartX; this.chartY = h.chartY; this.initPositions = [this.from, this.to]; this.grabbedCenter =
!0
      }; g.prototype.mouseMoveHandler = function (h) { var f = this.chart.pointer.normalize(h); var a = this.options.vertical ? 'chartY' : 'chartX'; var g = this.initPositions || []; !this.grabbedCenter || h.touches && h.touches[0][a] === 0 || (f = this.cursorToScrollbarPosition(f)[a], a = this[a], a = f - a, this.hasDragged = !0, this.updatePosition(g[0] + a, g[1] + a), this.hasDragged && y(this, 'changed', { from: this.from, to: this.to, trigger: 'scrollbar', DOMType: h.type, DOMEvent: h })) }; g.prototype.mouseUpHandler = function (h) {
        this.hasDragged && y(this, 'changed', {
          from: this.from,
          to: this.to,
          trigger: 'scrollbar',
          DOMType: h.type,
          DOMEvent: h
        }); this.grabbedCenter = this.hasDragged = this.chartX = this.chartY = null
      }; g.prototype.position = function (h, f, a, g) {
        var e = this.options.vertical; var c = 0; var l = this.rendered ? 'animate' : 'attr'; this.x = h; this.y = f + this.trackBorderWidth; this.width = a; this.xOffset = this.height = g; this.yOffset = c; e ? (this.width = this.yOffset = a = c = this.size, this.xOffset = f = 0, this.barWidth = g - 2 * a, this.x = h += this.options.margin) : (this.height = this.xOffset = g = f = this.size, this.barWidth = a - 2 * g, this.y += this.options.margin)
        this.group[l]({ translateX: h, translateY: this.y }); this.track[l]({ width: a, height: g }); this.scrollbarButtons[1][l]({ translateX: e ? 0 : a - f, translateY: e ? g - c : 0 })
      }; g.prototype.removeEvents = function () { this._events.forEach(function (h) { E.apply(null, h) }); this._events.length = 0 }; g.prototype.render = function () {
        var h = this.renderer; var f = this.options; var a = this.size; var g = this.chart.styledMode; var e; this.group = e = h.g('scrollbar').attr({ zIndex: f.zIndex, translateY: -99999 }).add(); this.track = h.rect().addClass('highcharts-scrollbar-track').attr({
          x: 0,
          r: f.trackBorderRadius || 0,
          height: a,
          width: a
        }).add(e); g || this.track.attr({ fill: f.trackBackgroundColor, stroke: f.trackBorderColor, 'stroke-width': f.trackBorderWidth }); this.trackBorderWidth = this.track.strokeWidth(); this.track.attr({ y: -this.trackBorderWidth % 2 / 2 }); this.scrollbarGroup = h.g().add(e); this.scrollbar = h.rect().addClass('highcharts-scrollbar-thumb').attr({ height: a, width: a, r: f.barBorderRadius || 0 }).add(this.scrollbarGroup); this.scrollbarRifles = h.path(t([['M', -3, a / 4], ['L', -3, 2 * a / 3], ['M', 0, a / 4], ['L',
          0, 2 * a / 3], ['M', 3, a / 4], ['L', 3, 2 * a / 3]], f.vertical)).addClass('highcharts-scrollbar-rifles').add(this.scrollbarGroup); g || (this.scrollbar.attr({ fill: f.barBackgroundColor, stroke: f.barBorderColor, 'stroke-width': f.barBorderWidth }), this.scrollbarRifles.attr({ stroke: f.rifleColor, 'stroke-width': 1 })); this.scrollbarStrokeWidth = this.scrollbar.strokeWidth(); this.scrollbarGroup.translate(-this.scrollbarStrokeWidth % 2 / 2, -this.scrollbarStrokeWidth % 2 / 2); this.drawScrollbarButton(0); this.drawScrollbarButton(1)
      }; g.prototype.setRange =
function (h, f) {
  var a = this.options; var g = a.vertical; var e = a.minWidth; var c = this.barWidth; var m; var k = !this.rendered || this.hasDragged || this.chart.navigator && this.chart.navigator.hasDragged ? 'attr' : 'animate'; if (N(c)) {
    h = Math.max(h, 0); var r = Math.ceil(c * h); this.calculatedWidth = m = G(c * Math.min(f, 1) - r); m < e && (r = (c - e + m) * h, m = e); e = Math.floor(r + this.xOffset + this.yOffset); c = m / 2 - 0.5; this.from = h; this.to = f; g ? (this.scrollbarGroup[k]({ translateY: e }), this.scrollbar[k]({ height: m }), this.scrollbarRifles[k]({ translateY: c }), this.scrollbarTop = e,
    this.scrollbarLeft = 0) : (this.scrollbarGroup[k]({ translateX: e }), this.scrollbar[k]({ width: m }), this.scrollbarRifles[k]({ translateX: c }), this.scrollbarLeft = e, this.scrollbarTop = 0); m <= 12 ? this.scrollbarRifles.hide() : this.scrollbarRifles.show(!0); !1 === a.showFull && (h <= 0 && f >= 1 ? this.group.hide() : this.group.show()); this.rendered = !0
  }
}; g.prototype.trackClick = function (h) {
        var f = this.chart.pointer.normalize(h); var a = this.to - this.from; var g = this.y + this.scrollbarTop; var e = this.x + this.scrollbarLeft; this.options.vertical && f.chartY >
g || !this.options.vertical && f.chartX > e ? this.updatePosition(this.from + a, this.to + a) : this.updatePosition(this.from - a, this.to - a); y(this, 'changed', { from: this.from, to: this.to, trigger: 'scrollbar', DOMEvent: h })
      }; g.prototype.update = function (h) { this.destroy(); this.init(this.chart.renderer, I(!0, this.options, h), this.chart) }; g.prototype.updatePosition = function (h, f) { f > 1 && (h = G(1 - G(f - h)), f = 1); h < 0 && (f = G(f - h), h = 0); this.from = h; this.to = f }; g.defaultOptions = {
        height: z ? 20 : 14,
        barBorderRadius: 0,
        buttonBorderRadius: 0,
        liveRedraw: void 0,
        margin: 10,
        minWidth: 6,
        step: 0.2,
        zIndex: 3,
        barBackgroundColor: '#cccccc',
        barBorderWidth: 1,
        barBorderColor: '#cccccc',
        buttonArrowColor: '#333333',
        buttonBackgroundColor: '#e6e6e6',
        buttonBorderColor: '#cccccc',
        buttonBorderWidth: 1,
        rifleColor: '#333333',
        trackBackgroundColor: '#f2f2f2',
        trackBorderColor: '#f2f2f2',
        trackBorderWidth: 1
      }; return g
    }()); g.Scrollbar || (v.scrollbar = I(!0, q.defaultOptions, v.scrollbar), g.Scrollbar = q, A.compose(k, q)); return g.Scrollbar
  }); P(A, 'parts/Navigator.js', [A['parts/Axis.js'], A['parts/Color.js'],
    A['parts/Globals.js'], A['parts/NavigatorAxis.js'], A['parts/Scrollbar.js'], A['parts/Utilities.js']], function (k, g, A, v, K, G) {
    g = g.parse; var H = G.addEvent; var M = G.clamp; var y = G.correctFloat; var I = G.defined; var J = G.destroyObjectProperties; var E = G.erase; var D = G.extend; var z = G.find; var t = G.isArray; var q = G.isNumber; var r = G.merge; var h = G.pick; var f = G.removeEvent; var a = G.splat; G = A.Chart; var l = A.defaultOptions; var e = A.hasTouch; var c = A.isTouchDevice; var m = A.Series; var u = function (a) {
      for (var c = [], e = 1; e < arguments.length; e++)c[e - 1] = arguments[e]; c = [].filter.call(c, q); if (c.length) {
        return Math[a].apply(0,
          c)
      }
    }; var L = typeof A.seriesTypes.areaspline === 'undefined' ? 'line' : 'areaspline'; D(l, {
      navigator: {
        height: 40,
        margin: 25,
        maskInside: !0,
        handles: { width: 7, height: 15, symbols: ['navigator-handle', 'navigator-handle'], enabled: !0, lineWidth: 1, backgroundColor: '#f2f2f2', borderColor: '#999999' },
        maskFill: g('#6685c2').setOpacity(0.3).get(),
        outlineColor: '#cccccc',
        outlineWidth: 1,
        series: {
          type: L,
          fillOpacity: 0.05,
          lineWidth: 1,
          compare: null,
          dataGrouping: {
            approximation: 'average',
            enabled: !0,
            groupPixelWidth: 2,
            smoothed: !0,
            units: [['millisecond',
              [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ['second', [1, 2, 5, 10, 15, 30]], ['minute', [1, 2, 5, 10, 15, 30]], ['hour', [1, 2, 3, 4, 6, 8, 12]], ['day', [1, 2, 3, 4]], ['week', [1, 2, 3]], ['month', [1, 3, 6]], ['year', null]]
          },
          dataLabels: { enabled: !1, zIndex: 2 },
          id: 'highcharts-navigator-series',
          className: 'highcharts-navigator-series',
          lineColor: null,
          marker: { enabled: !1 },
          threshold: null
        },
        xAxis: {
          overscroll: 0,
          className: 'highcharts-navigator-xaxis',
          tickLength: 0,
          lineWidth: 0,
          gridLineColor: '#e6e6e6',
          gridLineWidth: 1,
          tickPixelInterval: 200,
          labels: {
            align: 'left',
            style: { color: '#999999' },
            x: 3,
            y: -4
          },
          crosshair: !1
        },
        yAxis: { className: 'highcharts-navigator-yaxis', gridLineWidth: 0, startOnTick: !1, endOnTick: !1, minPadding: 0.1, maxPadding: 0.1, labels: { enabled: !1 }, crosshair: !1, title: { text: null }, tickLength: 0, tickWidth: 0 }
      }
    }); A.Renderer.prototype.symbols['navigator-handle'] = function (a, c, e, f, h) { a = h.width / 2; c = Math.round(a / 3) + 0.5; h = h.height || 0; return [['M', -a - 1, 0.5], ['L', a, 0.5], ['L', a, h + 0.5], ['L', -a - 1, h + 0.5], ['L', -a - 1, 0.5], ['M', -c, 4], ['L', -c, h - 3], ['M', c - 1, 4], ['L', c - 1, h - 3]] }; var F = (function () {
      function g (a) {
        this.zoomedMin =
this.zoomedMax = this.yAxis = this.xAxis = this.top = this.size = this.shades = this.rendered = this.range = this.outlineHeight = this.outline = this.opposite = this.navigatorSize = this.navigatorSeries = this.navigatorOptions = this.navigatorGroup = this.navigatorEnabled = this.left = this.height = this.handles = this.chart = this.baseSeries = void 0; this.init(a)
      }g.prototype.drawHandle = function (a, c, e, f) {
        var d = this.navigatorOptions.handles.height; this.handles[c][f](e ? {
          translateX: Math.round(this.left + this.height / 2),
          translateY: Math.round(this.top +
parseInt(a, 10) + 0.5 - d)
        } : { translateX: Math.round(this.left + parseInt(a, 10)), translateY: Math.round(this.top + this.height / 2 - d / 2 - 1) })
      }; g.prototype.drawOutline = function (a, c, e, f) {
        var d = this.navigatorOptions.maskInside; var b = this.outline.strokeWidth(); var h = b / 2; var g = b % 2 / 2; b = this.outlineHeight; var p = this.scrollbarHeight || 0; var l = this.size; var m = this.left - p; var k = this.top; e ? (m -= h, e = k + c + g, c = k + a + g, g = [['M', m + b, k - p - g], ['L', m + b, e], ['L', m, e], ['L', m, c], ['L', m + b, c], ['L', m + b, k + l + p]], d && g.push(['M', m + b, e - h], ['L', m + b, c + h])) : (a += m + p - g, c += m + p - g,
        k += h, g = [['M', m, k], ['L', a, k], ['L', a, k + b], ['L', c, k + b], ['L', c, k], ['L', m + l + 2 * p, k]], d && g.push(['M', a - h, k], ['L', c + h, k])); this.outline[f]({ d: g })
      }; g.prototype.drawMasks = function (a, c, e, f) { var d = this.left; var b = this.top; var h = this.height; if (e) { var g = [d, d, d]; var p = [b, b + a, b + c]; var m = [h, h, h]; var l = [a, c - a, this.size - c] } else g = [d, d + a, d + c], p = [b, b, b], m = [a, c - a, this.size - c], l = [h, h, h]; this.shades.forEach(function (a, b) { a[f]({ x: g[b], y: p[b], width: m[b], height: l[b] }) }) }; g.prototype.renderElements = function () {
        var a = this; var c = a.navigatorOptions
        var e = c.maskInside; var f = a.chart; var d = f.renderer; var b; var h = { cursor: f.inverted ? 'ns-resize' : 'ew-resize' }; a.navigatorGroup = b = d.g('navigator').attr({ zIndex: 8, visibility: 'hidden' }).add(); [!e, e, !e].forEach(function (e, g) { a.shades[g] = d.rect().addClass('highcharts-navigator-mask' + (g === 1 ? '-inside' : '-outside')).add(b); f.styledMode || a.shades[g].attr({ fill: e ? c.maskFill : 'rgba(0,0,0,0)' }).css(g === 1 && h) }); a.outline = d.path().addClass('highcharts-navigator-outline').add(b); f.styledMode || a.outline.attr({
          'stroke-width': c.outlineWidth,
          stroke: c.outlineColor
        }); c.handles.enabled && [0, 1].forEach(function (e) { c.handles.inverted = f.inverted; a.handles[e] = d.symbol(c.handles.symbols[e], -c.handles.width / 2 - 1, 0, c.handles.width, c.handles.height, c.handles); a.handles[e].attr({ zIndex: 7 - e }).addClass('highcharts-navigator-handle highcharts-navigator-handle-' + ['left', 'right'][e]).add(b); if (!f.styledMode) { var g = c.handles; a.handles[e].attr({ fill: g.backgroundColor, stroke: g.borderColor, 'stroke-width': g.lineWidth }).css(h) } })
      }; g.prototype.update = function (a) {
        (this.series ||
[]).forEach(function (a) { a.baseSeries && delete a.baseSeries.navigatorSeries }); this.destroy(); r(!0, this.chart.options.navigator, this.options, a); this.init(this.chart)
      }; g.prototype.render = function (a, c, e, f) {
        var d = this.chart; var b = this.scrollbarHeight; var g; var p = this.xAxis; var m = p.pointRange || 0; var l = p.navigatorAxis.fake ? d.xAxis[0] : p; var k = this.navigatorEnabled; var r; var w = this.rendered; var u = d.inverted; var C = d.xAxis[0].minRange; var t = d.xAxis[0].options.maxRange; if (!this.hasDragged || I(e)) {
          a = y(a - m / 2); c = y(c + m / 2); if (!q(a) || !q(c)) {
            if (w) {
              e =
0, f = h(p.width, l.width)
            } else return
          } this.left = h(p.left, d.plotLeft + b + (u ? d.plotWidth : 0)); this.size = r = g = h(p.len, (u ? d.plotHeight : d.plotWidth) - 2 * b); d = u ? b : g + 2 * b; e = h(e, p.toPixels(a, !0)); f = h(f, p.toPixels(c, !0)); q(e) && Infinity !== Math.abs(e) || (e = 0, f = d); a = p.toValue(e, !0); c = p.toValue(f, !0); var B = Math.abs(y(c - a)); B < C ? this.grabbedLeft ? e = p.toPixels(c - C - m, !0) : this.grabbedRight && (f = p.toPixels(a + C + m, !0)) : I(t) && y(B - m) > t && (this.grabbedLeft ? e = p.toPixels(c - t - m, !0) : this.grabbedRight && (f = p.toPixels(a + t + m, !0))); this.zoomedMax =
M(Math.max(e, f), 0, r); this.zoomedMin = M(this.fixedWidth ? this.zoomedMax - this.fixedWidth : Math.min(e, f), 0, r); this.range = this.zoomedMax - this.zoomedMin; r = Math.round(this.zoomedMax); e = Math.round(this.zoomedMin); k && (this.navigatorGroup.attr({ visibility: 'visible' }), w = w && !this.hasDragged ? 'animate' : 'attr', this.drawMasks(e, r, u, w), this.drawOutline(e, r, u, w), this.navigatorOptions.handles.enabled && (this.drawHandle(e, 0, u, w), this.drawHandle(r, 1, u, w))); this.scrollbar && (u ? (u = this.top - b, l = this.left - b + (k || !l.opposite ? 0
            : (l.titleOffset || 0) + l.axisTitleMargin), b = g + 2 * b) : (u = this.top + (k ? this.height : -b), l = this.left - b), this.scrollbar.position(l, u, d, b), this.scrollbar.setRange(this.zoomedMin / (g || 1), this.zoomedMax / (g || 1))); this.rendered = !0
        }
      }; g.prototype.addMouseEvents = function () {
        var a = this; var c = a.chart; var f = c.container; var h = []; var d; var b; a.mouseMoveHandler = d = function (b) { a.onMouseMove(b) }; a.mouseUpHandler = b = function (b) { a.onMouseUp(b) }; h = a.getPartsEvents('mousedown'); h.push(H(c.renderTo, 'mousemove', d), H(f.ownerDocument, 'mouseup', b)); e && (h.push(H(c.renderTo,
          'touchmove', d), H(f.ownerDocument, 'touchend', b)), h.concat(a.getPartsEvents('touchstart'))); a.eventsToUnbind = h; a.series && a.series[0] && h.push(H(a.series[0].xAxis, 'foundExtremes', function () { c.navigator.modifyNavigatorAxisExtremes() }))
      }; g.prototype.getPartsEvents = function (a) { var c = this; var e = []; ['shades', 'handles'].forEach(function (f) { c[f].forEach(function (d, b) { e.push(H(d.element, a, function (a) { c[f + 'Mousedown'](a, b) })) }) }); return e }; g.prototype.shadesMousedown = function (a, c) {
        a = this.chart.pointer.normalize(a)
        var e = this.chart; var f = this.xAxis; var d = this.zoomedMin; var b = this.left; var h = this.size; var g = this.range; var m = a.chartX; e.inverted && (m = a.chartY, b = this.top); if (c === 1) this.grabbedCenter = m, this.fixedWidth = g, this.dragOffset = m - d; else {
          a = m - b - g / 2; if (c === 0)a = Math.max(0, a); else if (c === 2 && a + g >= h) if (a = h - g, this.reversedExtremes) { a -= g; var p = this.getUnionExtremes().dataMin } else var l = this.getUnionExtremes().dataMax; a !== d && (this.fixedWidth = g, c = f.navigatorAxis.toFixedRange(a, a + g, p, l), I(c.min) && e.xAxis[0].setExtremes(Math.min(c.min, c.max),
            Math.max(c.min, c.max), !0, null, { trigger: 'navigator' }))
        }
      }; g.prototype.handlesMousedown = function (a, c) { this.chart.pointer.normalize(a); a = this.chart; var e = a.xAxis[0]; var f = this.reversedExtremes; c === 0 ? (this.grabbedLeft = !0, this.otherHandlePos = this.zoomedMax, this.fixedExtreme = f ? e.min : e.max) : (this.grabbedRight = !0, this.otherHandlePos = this.zoomedMin, this.fixedExtreme = f ? e.max : e.min); a.fixedRange = null }; g.prototype.onMouseMove = function (a) {
        var e = this; var f = e.chart; var g = e.left; var d = e.navigatorSize; var b = e.range; var m = e.dragOffset; var l = f.inverted
        a.touches && a.touches[0].pageX === 0 || (a = f.pointer.normalize(a), f = a.chartX, l && (g = e.top, f = a.chartY), e.grabbedLeft ? (e.hasDragged = !0, e.render(0, 0, f - g, e.otherHandlePos)) : e.grabbedRight ? (e.hasDragged = !0, e.render(0, 0, e.otherHandlePos, f - g)) : e.grabbedCenter && (e.hasDragged = !0, f < m ? f = m : f > d + m - b && (f = d + m - b), e.render(0, 0, f - m, f - m + b)), e.hasDragged && e.scrollbar && h(e.scrollbar.options.liveRedraw, A.svg && !c && !this.chart.isBoosting) && (a.DOMType = a.type, setTimeout(function () { e.onMouseUp(a) }, 0)))
      }; g.prototype.onMouseUp = function (a) {
        var c =
this.chart; var e = this.xAxis; var f = this.scrollbar; var d = a.DOMEvent || a; var b = c.inverted; var h = this.rendered && !this.hasDragged ? 'animate' : 'attr'; var g = Math.round(this.zoomedMax); var m = Math.round(this.zoomedMin); if (this.hasDragged && (!f || !f.hasDragged) || a.trigger === 'scrollbar') {
          f = this.getUnionExtremes(); if (this.zoomedMin === this.otherHandlePos) var l = this.fixedExtreme; else if (this.zoomedMax === this.otherHandlePos) var p = this.fixedExtreme; this.zoomedMax === this.size && (p = this.reversedExtremes ? f.dataMin : f.dataMax); this.zoomedMin === 0 && (l =
this.reversedExtremes ? f.dataMax : f.dataMin); e = e.navigatorAxis.toFixedRange(this.zoomedMin, this.zoomedMax, l, p); I(e.min) && c.xAxis[0].setExtremes(Math.min(e.min, e.max), Math.max(e.min, e.max), !0, this.hasDragged ? !1 : null, { trigger: 'navigator', triggerOp: 'navigator-drag', DOMEvent: d })
        }a.DOMType !== 'mousemove' && a.DOMType !== 'touchmove' && (this.grabbedLeft = this.grabbedRight = this.grabbedCenter = this.fixedWidth = this.fixedExtreme = this.otherHandlePos = this.hasDragged = this.dragOffset = null); this.navigatorEnabled && (this.shades &&
this.drawMasks(m, g, b, h), this.outline && this.drawOutline(m, g, b, h), this.navigatorOptions.handles.enabled && Object.keys(this.handles).length === this.handles.length && (this.drawHandle(m, 0, b, h), this.drawHandle(g, 1, b, h)))
      }; g.prototype.removeEvents = function () { this.eventsToUnbind && (this.eventsToUnbind.forEach(function (a) { a() }), this.eventsToUnbind = void 0); this.removeBaseSeriesEvents() }; g.prototype.removeBaseSeriesEvents = function () {
        var a = this.baseSeries || []; this.navigatorEnabled && a[0] && (!1 !== this.navigatorOptions.adaptToUpdatedData &&
a.forEach(function (a) { f(a, 'updatedData', this.updatedDataHandler) }, this), a[0].xAxis && f(a[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes))
      }; g.prototype.init = function (a) {
        var c = a.options; var e = c.navigator; var f = e.enabled; var d = c.scrollbar; var b = d.enabled; c = f ? e.height : 0; var g = b ? d.height : 0; this.handles = []; this.shades = []; this.chart = a; this.setBaseSeries(); this.height = c; this.scrollbarHeight = g; this.scrollbarEnabled = b; this.navigatorEnabled = f; this.navigatorOptions = e; this.scrollbarOptions = d; this.outlineHeight = c + g; this.opposite =
h(e.opposite, !(f || !a.inverted)); var m = this; f = m.baseSeries; d = a.xAxis.length; b = a.yAxis.length; var l = f && f[0] && f[0].xAxis || a.xAxis[0] || { options: {} }; a.isDirtyBox = !0; m.navigatorEnabled ? (m.xAxis = new k(a, r({ breaks: l.options.breaks, ordinal: l.options.ordinal }, e.xAxis, { id: 'navigator-x-axis', yAxis: 'navigator-y-axis', isX: !0, type: 'datetime', index: d, isInternal: !0, offset: 0, keepOrdinalPadding: !0, startOnTick: !1, endOnTick: !1, minPadding: 0, maxPadding: 0, zoomEnabled: !1 }, a.inverted ? { offsets: [g, 0, -g, 0], width: c } : {
          offsets: [0,
            -g, 0, g],
          height: c
        })), m.yAxis = new k(a, r(e.yAxis, { id: 'navigator-y-axis', alignTicks: !1, offset: 0, index: b, isInternal: !0, zoomEnabled: !1 }, a.inverted ? { width: c } : { height: c })), f || e.series.data ? m.updateNavigatorSeries(!1) : a.series.length === 0 && (m.unbindRedraw = H(a, 'beforeRedraw', function () { a.series.length > 0 && !m.series && (m.setBaseSeries(), m.unbindRedraw()) })), m.reversedExtremes = a.inverted && !m.xAxis.reversed || !a.inverted && m.xAxis.reversed, m.renderElements(), m.addMouseEvents()) : (m.xAxis = {
          chart: a,
          navigatorAxis: { fake: !0 },
          translate: function (b, d) { var c = a.xAxis[0]; var e = c.getExtremes(); var f = c.len - 2 * g; var h = u('min', c.options.min, e.dataMin); c = u('max', c.options.max, e.dataMax) - h; return d ? b * c / f + h : f * (b - h) / c },
          toPixels: function (a) { return this.translate(a) },
          toValue: function (a) { return this.translate(a, !0) }
        }, m.xAxis.navigatorAxis.axis = m.xAxis, m.xAxis.navigatorAxis.toFixedRange = v.AdditionsClass.prototype.toFixedRange.bind(m.xAxis.navigatorAxis)); a.options.scrollbar.enabled && (a.scrollbar = m.scrollbar = new K(a.renderer, r(a.options.scrollbar, {
          margin: m.navigatorEnabled
            ? 0 : 10,
          vertical: a.inverted
        }), a), H(m.scrollbar, 'changed', function (b) { var d = m.size; var c = d * this.to; d *= this.from; m.hasDragged = m.scrollbar.hasDragged; m.render(0, 0, d, c); (a.options.scrollbar.liveRedraw || b.DOMType !== 'mousemove' && b.DOMType !== 'touchmove') && setTimeout(function () { m.onMouseUp(b) }) })); m.addBaseSeriesEvents(); m.addChartEvents()
      }; g.prototype.getUnionExtremes = function (a) {
        var c = this.chart.xAxis[0]; var e = this.xAxis; var f = e.options; var d = c.options; var b; a && c.dataMin === null || (b = {
          dataMin: h(f && f.min, u('min', d.min, c.dataMin,
            e.dataMin, e.min)),
          dataMax: h(f && f.max, u('max', d.max, c.dataMax, e.dataMax, e.max))
        }); return b
      }; g.prototype.setBaseSeries = function (a, c) {
        var e = this.chart; var f = this.baseSeries = []; a = a || e.options && e.options.navigator.baseSeries || (e.series.length ? z(e.series, function (a) { return !a.options.isInternal }).index : 0); (e.series || []).forEach(function (d, b) { d.options.isInternal || !d.options.showInNavigator && (b !== a && d.options.id !== a || !1 === d.options.showInNavigator) || f.push(d) }); this.xAxis && !this.xAxis.navigatorAxis.fake && this.updateNavigatorSeries(!0,
          c)
      }; g.prototype.updateNavigatorSeries = function (c, e) {
        var g = this; var m = g.chart; var d = g.baseSeries; var b; var p; var k = g.navigatorOptions.series; var u; var w = { enableMouseTracking: !1, index: null, linkedTo: null, group: 'nav', padXAxis: !1, xAxis: 'navigator-x-axis', yAxis: 'navigator-y-axis', showInLegend: !1, stacking: void 0, isInternal: !0, states: { inactive: { opacity: 1 } } }; var q = g.series = (g.series || []).filter(function (a) {
          var b = a.baseSeries; return d.indexOf(b) < 0 ? (b && (f(b, 'updatedData', g.updatedDataHandler), delete b.navigatorSeries), a.chart && a.destroy(),
          !1) : !0
        }); d && d.length && d.forEach(function (a) {
          var c = a.navigatorSeries; var f = D({ color: a.color, visible: a.visible }, t(k) ? l.navigator.series : k); c && !1 === g.navigatorOptions.adaptToUpdatedData || (w.name = 'Navigator ' + d.length, b = a.options || {}, u = b.navigatorOptions || {}, p = r(b, w, f, u), p.pointRange = h(f.pointRange, u.pointRange, l.plotOptions[p.type || 'line'].pointRange), f = u.data || f.data, g.hasNavigatorData = g.hasNavigatorData || !!f, p.data = f || b.data && b.data.slice(0), c && c.options ? c.update(p, e) : (a.navigatorSeries = m.initSeries(p),
          a.navigatorSeries.baseSeries = a, q.push(a.navigatorSeries)))
        }); if (k.data && (!d || !d.length) || t(k))g.hasNavigatorData = !1, k = a(k), k.forEach(function (a, b) { w.name = 'Navigator ' + (q.length + 1); p = r(l.navigator.series, { color: m.series[b] && !m.series[b].options.isInternal && m.series[b].color || m.options.colors[b] || m.options.colors[0] }, w, a); p.data = a.data; p.data && (g.hasNavigatorData = !0, q.push(m.initSeries(p))) }); c && this.addBaseSeriesEvents()
      }; g.prototype.addBaseSeriesEvents = function () {
        var a = this; var c = a.baseSeries || []; c[0] &&
c[0].xAxis && H(c[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes); c.forEach(function (c) {
          H(c, 'show', function () { this.navigatorSeries && this.navigatorSeries.setVisible(!0, !1) }); H(c, 'hide', function () { this.navigatorSeries && this.navigatorSeries.setVisible(!1, !1) }); !1 !== this.navigatorOptions.adaptToUpdatedData && c.xAxis && H(c, 'updatedData', this.updatedDataHandler); H(c, 'remove', function () {
            this.navigatorSeries && (E(a.series, this.navigatorSeries), I(this.navigatorSeries.options) && this.navigatorSeries.remove(!1),
            delete this.navigatorSeries)
          })
        }, this)
      }; g.prototype.getBaseSeriesMin = function (a) { return this.baseSeries.reduce(function (a, c) { return Math.min(a, c.xData ? c.xData[0] : a) }, a) }; g.prototype.modifyNavigatorAxisExtremes = function () { var a = this.xAxis; var c; typeof a.getExtremes !== 'undefined' && (!(c = this.getUnionExtremes(!0)) || c.dataMin === a.min && c.dataMax === a.max || (a.min = c.dataMin, a.max = c.dataMax)) }; g.prototype.modifyBaseAxisExtremes = function () {
        var a = this.chart.navigator; var c = this.getExtremes(); var e = c.dataMin; var f = c.dataMax; c =
c.max - c.min; var d = a.stickToMin; var b = a.stickToMax; var g = h(this.options.overscroll, 0); var m = a.series && a.series[0]; var l = !!this.setExtremes; if (!this.eventArgs || this.eventArgs.trigger !== 'rangeSelectorButton') { if (d) { var k = e; var u = k + c }b && (u = f + g, d || (k = Math.max(e, u - c, a.getBaseSeriesMin(m && m.xData ? m.xData[0] : -Number.MAX_VALUE)))); l && (d || b) && q(k) && (this.min = this.userMin = k, this.max = this.userMax = u) }a.stickToMin = a.stickToMax = null
      }; g.prototype.updatedDataHandler = function () {
        var a = this.chart.navigator; var c = this.navigatorSeries; var e =
a.getBaseSeriesMin(this.xData[0]); a.stickToMax = a.reversedExtremes ? Math.round(a.zoomedMin) === 0 : Math.round(a.zoomedMax) >= Math.round(a.size); a.stickToMin = q(this.xAxis.min) && this.xAxis.min <= e && (!this.chart.fixedRange || !a.stickToMax); c && !a.hasNavigatorData && (c.options.pointStart = this.xData[0], c.setData(this.options.data, !1, null, !1))
      }; g.prototype.addChartEvents = function () {
        this.eventsToUnbind || (this.eventsToUnbind = []); this.eventsToUnbind.push(H(this.chart, 'redraw', function () {
          var a = this.navigator; var c = a && (a.baseSeries &&
a.baseSeries[0] && a.baseSeries[0].xAxis || this.xAxis[0]); c && a.render(c.min, c.max)
        }), H(this.chart, 'getMargins', function () { var a = this.navigator; var c = a.opposite ? 'plotTop' : 'marginBottom'; this.inverted && (c = a.opposite ? 'marginRight' : 'plotLeft'); this[c] = (this[c] || 0) + (a.navigatorEnabled || !this.inverted ? a.outlineHeight : 0) + a.navigatorOptions.margin }))
      }; g.prototype.destroy = function () {
        this.removeEvents(); this.xAxis && (E(this.chart.xAxis, this.xAxis), E(this.chart.axes, this.xAxis)); this.yAxis && (E(this.chart.yAxis, this.yAxis),
        E(this.chart.axes, this.yAxis)); (this.series || []).forEach(function (a) { a.destroy && a.destroy() }); 'series xAxis yAxis shades outline scrollbarTrack scrollbarRifles scrollbarGroup scrollbar navigatorGroup rendered'.split(' ').forEach(function (a) { this[a] && this[a].destroy && this[a].destroy(); this[a] = null }, this); [this.handles].forEach(function (a) { J(a) }, this)
      }; return g
    }()); A.Navigator || (A.Navigator = F, v.compose(k), H(G, 'beforeShowResetZoom', function () {
      var a = this.options; var e = a.navigator; var f = a.rangeSelector; if ((e &&
e.enabled || f && f.enabled) && (!c && a.chart.zoomType === 'x' || c && a.chart.pinchType === 'x')) return !1
    }), H(G, 'beforeRender', function () { var a = this.options; if (a.navigator.enabled || a.scrollbar.enabled) this.scroller = this.navigator = new F(this) }), H(G, 'afterSetChartSize', function () {
      var a = this.legend; var c = this.navigator; if (c) {
        var e = a && a.options; var f = c.xAxis; var g = c.yAxis; var d = c.scrollbarHeight; this.inverted ? (c.left = c.opposite ? this.chartWidth - d - c.height : this.spacing[3] + d, c.top = this.plotTop + d) : (c.left = this.plotLeft + d,
        c.top = c.navigatorOptions.top || this.chartHeight - c.height - d - this.spacing[2] - (this.rangeSelector && this.extraBottomMargin ? this.rangeSelector.getHeight() : 0) - (e && e.verticalAlign === 'bottom' && e.enabled && !e.floating ? a.legendHeight + h(e.margin, 10) : 0) - (this.titleOffset ? this.titleOffset[2] : 0)); f && g && (this.inverted ? f.options.left = g.options.left = c.left : f.options.top = g.options.top = c.top, f.setAxisSize(), g.setAxisSize())
      }
    }), H(G, 'update', function (a) {
      var c = a.options.navigator || {}; var e = a.options.scrollbar || {}; this.navigator ||
this.scroller || !c.enabled && !e.enabled || (r(!0, this.options.navigator, c), r(!0, this.options.scrollbar, e), delete a.options.navigator, delete a.options.scrollbar)
    }), H(G, 'afterUpdate', function (a) { this.navigator || this.scroller || !this.options.navigator.enabled && !this.options.scrollbar.enabled || (this.scroller = this.navigator = new F(this), h(a.redraw, !0) && this.redraw(a.animation)) }), H(G, 'afterAddSeries', function () { this.navigator && this.navigator.setBaseSeries(null, !1) }), H(m, 'afterUpdate', function () {
      this.chart.navigator &&
!this.options.isInternal && this.chart.navigator.setBaseSeries(null, !1)
    }), G.prototype.callbacks.push(function (a) { var c = a.navigator; c && a.xAxis[0] && (a = a.xAxis[0].getExtremes(), c.render(a.min, a.max)) })); A.Navigator = F; return A.Navigator
  }); P(A, 'parts/OrdinalAxis.js', [A['parts/Axis.js'], A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g, A) {
    var v = A.addEvent; var H = A.css; var G = A.defined; var N = A.pick; var M = A.timeUnits; A = g.Chart; var y = g.Series; var I = (function () {
      function k (g) { this.index = {}; this.axis = g }k.prototype.getExtendedPositions =
function () {
  var k = this; var v = k.axis; var t = v.constructor.prototype; var q = v.chart; var r = v.series[0].currentDataGrouping; var h = k.index; var f = r ? r.count + r.unitName : 'raw'; var a = v.options.overscroll; var l = v.getExtremes(); var e; h || (h = k.index = {}); if (!h[f]) {
    var c = { series: [], chart: q, getExtremes: function () { return { min: l.dataMin, max: l.dataMax + a } }, options: { ordinal: !0 }, ordinal: {}, ordinal2lin: t.ordinal2lin, val2lin: t.val2lin }; c.ordinal.axis = c; v.series.forEach(function (a) {
      e = { xAxis: c, xData: a.xData.slice(), chart: q, destroyGroupedData: g.noop, getProcessedData: g.Series.prototype.getProcessedData }
      e.xData = e.xData.concat(k.getOverscrollPositions()); e.options = { dataGrouping: r ? { enabled: !0, forced: !0, approximation: 'open', units: [[r.unitName, [r.count]]] } : { enabled: !1 } }; a.processData.apply(e); c.series.push(e)
    }); v.beforeSetTickPositions.apply(c); h[f] = c.ordinal.positions
  } return h[f]
}; k.prototype.getGroupIntervalFactor = function (g, k, t) {
        t = t.processedXData; var q = t.length; var r = []; var h = this.groupIntervalFactor; if (!h) {
          for (h = 0; h < q - 1; h++)r[h] = t[h + 1] - t[h]; r.sort(function (f, a) { return f - a }); r = r[Math.floor(q / 2)]; g = Math.max(g,
            t[0]); k = Math.min(k, t[q - 1]); this.groupIntervalFactor = h = q * r / (k - g)
        } return h
      }; k.prototype.getOverscrollPositions = function () { var g = this.axis; var k = g.options.overscroll; var t = this.overscrollPointsRange; var q = []; var r = g.dataMax; if (G(t)) for (q.push(r); r <= g.dataMax + k;)r += t, q.push(r); return q }; k.prototype.postProcessTickInterval = function (g) { var k = this.axis; var t = this.slope; return t ? k.options.breaks ? k.closestPointRange || g : g / (t / k.closestPointRange) : g }; return k
    }()); var J = (function () {
      function g () {}g.compose = function (g, k, t) {
        g.keepProps.push('ordinal')
        var q = g.prototype; q.beforeSetTickPositions = function () {
          var g = this.ordinal; var h = []; var f; var a = !1; var l = this.getExtremes(); var e = l.min; var c = l.max; var m; var k = this.isXAxis && !!this.options.breaks; l = this.options.ordinal; var q = Number.MAX_VALUE; var t = this.chart.options.chart.ignoreHiddenSeries; var w; if (l || k) {
            this.series.forEach(function (a, c) {
              f = []; if (!(t && !1 === a.visible || !1 === a.takeOrdinalPosition && !k) && (h = h.concat(a.processedXData), p = h.length, h.sort(function (a, b) { return a - b }), q = Math.min(q, N(a.closestPointRange, q)), p)) {
                for (c = 0; c < p - 1;) {
                  h[c] !==
h[c + 1] && f.push(h[c + 1]), c++
                }f[0] !== h[0] && f.unshift(h[0]); h = f
              }a.isSeriesBoosting && (w = !0)
            }); w && (h.length = 0); var p = h.length; if (p > 2) { var C = h[1] - h[0]; for (m = p - 1; m-- && !a;)h[m + 1] - h[m] !== C && (a = !0); !this.options.keepOrdinalPadding && (h[0] - e > C || c - h[h.length - 1] > C) && (a = !0) } else this.options.overscroll && (p === 2 ? q = h[1] - h[0] : p === 1 ? (q = this.options.overscroll, h = [h[0], h[0] + q]) : q = g.overscrollPointsRange); a ? (this.options.overscroll && (g.overscrollPointsRange = q, h = h.concat(g.getOverscrollPositions())), g.positions = h, C = this.ordinal2lin(Math.max(e,
              h[0]), !0), m = Math.max(this.ordinal2lin(Math.min(c, h[h.length - 1]), !0), 1), g.slope = c = (c - e) / (m - C), g.offset = e - C * c) : (g.overscrollPointsRange = N(this.closestPointRange, g.overscrollPointsRange), g.positions = this.ordinal.slope = g.offset = void 0)
          } this.isOrdinal = l && a; g.groupIntervalFactor = null
        }; g.prototype.getTimeTicks = function (g, h, f, a, l, e, c) {
          void 0 === l && (l = []); void 0 === e && (e = 0); var m = 0; var k; var r; var q = {}; var w = []; var p = -Number.MAX_VALUE; var t = this.options.tickPixelInterval; var v = this.chart.time; var B = []; if (!this.options.ordinal && !this.options.breaks ||
!l || l.length < 3 || typeof h === 'undefined') return v.getTimeTicks.apply(v, arguments); var d = l.length; for (k = 0; k < d; k++) { var b = k && l[k - 1] > f; l[k] < h && (m = k); if (k === d - 1 || l[k + 1] - l[k] > 5 * e || b) { if (l[k] > p) { for (r = v.getTimeTicks(g, l[m], l[k], a); r.length && r[0] <= p;)r.shift(); r.length && (p = r[r.length - 1]); B.push(w.length); w = w.concat(r) }m = k + 1 } if (b) break }r = r.info; if (c && r.unitRange <= M.hour) {
            k = w.length - 1; for (m = 1; m < k; m++) if (v.dateFormat('%d', w[m]) !== v.dateFormat('%d', w[m - 1])) { q[w[m]] = 'day'; var n = !0 }n && (q[w[0]] = 'day'); r.higherRanks =
q
          }r.segmentStarts = B; w.info = r; if (c && G(t)) { m = B = w.length; n = []; var x; for (v = []; m--;)k = this.translate(w[m]), x && (v[m] = x - k), n[m] = x = k; v.sort(); v = v[Math.floor(v.length / 2)]; v < 0.6 * t && (v = null); m = w[B - 1] > f ? B - 1 : B; for (x = void 0; m--;)k = n[m], B = Math.abs(x - k), x && B < 0.8 * t && (v === null || B < 0.8 * v) ? (q[w[m]] && !q[w[m + 1]] ? (B = m + 1, x = k) : B = m, w.splice(B, 1)) : x = k } return w
        }; q.lin2val = function (g, h) {
          var f = this.ordinal; var a = f.positions; if (a) {
            var l = f.slope; var e = f.offset; f = a.length - 1; if (h) {
              if (g < 0)g = a[0]; else if (g > f)g = a[f]; else {
                f = Math.floor(g); var c = g -
f
              }
            } else for (;f--;) if (h = l * f + e, g >= h) { l = l * (f + 1) + e; c = (g - h) / (l - h); break } return typeof c !== 'undefined' && typeof a[f] !== 'undefined' ? a[f] + (c ? c * (a[f + 1] - a[f]) : 0) : g
          } return g
        }; q.val2lin = function (g, h) { var f = this.ordinal; var a = f.positions; if (a) { var l = a.length; var e; for (e = l; e--;) if (a[e] === g) { var c = e; break } for (e = l - 1; e--;) if (g > a[e] || e === 0) { g = (g - a[e]) / (a[e + 1] - a[e]); c = e + g; break }h = h ? c : f.slope * (c || 0) + f.offset } else h = g; return h }; q.ordinal2lin = q.val2lin; v(g, 'afterInit', function () { this.ordinal || (this.ordinal = new I(this)) }); v(g, 'foundExtremes',
          function () { this.isXAxis && G(this.options.overscroll) && this.max === this.dataMax && (!this.chart.mouseIsDown || this.isInternal) && (!this.eventArgs || this.eventArgs && this.eventArgs.trigger !== 'navigator') && (this.max += this.options.overscroll, !this.isInternal && G(this.userMin) && (this.min += this.options.overscroll)) }); v(g, 'afterSetScale', function () { this.horiz && !this.isDirty && (this.isDirty = this.isOrdinal && this.chart.navigator && !this.chart.navigator.adaptToUpdatedData) }); v(k, 'pan', function (g) {
          var h = this.xAxis[0]; var f =
h.options.overscroll; var a = g.originalEvent.chartX; var l = this.options.chart && this.options.chart.panning; var e = !1; if (l && l.type !== 'y' && h.options.ordinal && h.series.length) {
            var c = this.mouseDownX; var m = h.getExtremes(); var k = m.dataMax; var r = m.min; var q = m.max; var w = this.hoverPoints; var p = h.closestPointRange || h.ordinal && h.ordinal.overscrollPointsRange; c = (c - a) / (h.translationSlope * (h.ordinal.slope || p)); var t = { ordinal: { positions: h.ordinal.getExtendedPositions() } }; p = h.lin2val; var v = h.val2lin; if (!t.ordinal.positions)e = !0; else if (Math.abs(c) > 1) {
              w &&
w.forEach(function (a) { a.setState() }); if (c < 0) { w = t; var B = h.ordinal.positions ? h : t } else w = h.ordinal.positions ? h : t, B = t; t = B.ordinal.positions; k > t[t.length - 1] && t.push(k); this.fixedRange = q - r; c = h.navigatorAxis.toFixedRange(null, null, p.apply(w, [v.apply(w, [r, !0]) + c, !0]), p.apply(B, [v.apply(B, [q, !0]) + c, !0])); c.min >= Math.min(m.dataMin, r) && c.max <= Math.max(k, q) + f && h.setExtremes(c.min, c.max, !0, !1, { trigger: 'pan' }); this.mouseDownX = a; H(this.container, { cursor: 'move' })
            }
          } else e = !0; e || l && /y/.test(l.type) ? f && (h.max = h.dataMax +
f) : g.preventDefault()
        }); v(t, 'updatedData', function () { var g = this.xAxis; g && g.options.ordinal && delete g.ordinal.index })
      }; return g
    }()); J.compose(k, A, y); return J
  }); P(A, 'modules/broken-axis.src.js', [A['parts/Axis.js'], A['parts/Globals.js'], A['parts/Utilities.js'], A['parts/Stacking.js']], function (k, g, A, v) {
    var H = A.addEvent; var G = A.find; var N = A.fireEvent; var M = A.isArray; var y = A.isNumber; var I = A.pick; var J = g.Series; var E = (function () {
      function g (g) { this.hasBreaks = !1; this.axis = g }g.isInBreak = function (g, k) {
        var q = g.repeat || Infinity; var r = g.from
        var h = g.to - g.from; k = k >= r ? (k - r) % q : q - (r - k) % q; return g.inclusive ? k <= h : k < h && k !== 0
      }; g.lin2Val = function (k) { var t = this.brokenAxis; t = t && t.breakArray; if (!t) return k; var q; for (q = 0; q < t.length; q++) { var r = t[q]; if (r.from >= k) break; else r.to < k ? k += r.len : g.isInBreak(r, k) && (k += r.len) } return k }; g.val2Lin = function (k) { var t = this.brokenAxis; t = t && t.breakArray; if (!t) return k; var q = k; var r; for (r = 0; r < t.length; r++) { var h = t[r]; if (h.to <= k)q -= h.len; else if (h.from >= k) break; else if (g.isInBreak(h, k)) { q -= k - h.from; break } } return q }; g.prototype.findBreakAt =
function (g, k) { return G(k, function (k) { return k.from < g && g < k.to }) }; g.prototype.isInAnyBreak = function (k, t) { var q = this.axis; var r = q.options.breaks; var h = r && r.length; var f; if (h) { for (;h--;) if (g.isInBreak(r[h], k)) { var a = !0; f || (f = I(r[h].showPoints, !q.isXAxis)) } var l = a && t ? a && !f : a } return l }; g.prototype.setBreaks = function (v, t) {
        var q = this; var r = q.axis; var h = M(v) && !!v.length; r.isDirty = q.hasBreaks !== h; q.hasBreaks = h; r.options.breaks = r.userOptions.breaks = v; r.forceRedraw = !0; r.series.forEach(function (f) { f.isDirty = !0 }); h || r.val2lin !== g.val2Lin ||
(delete r.val2lin, delete r.lin2val); h && (r.userOptions.ordinal = !1, r.lin2val = g.lin2Val, r.val2lin = g.val2Lin, r.setExtremes = function (f, a, h, e, c) { if (q.hasBreaks) { for (var g, l = this.options.breaks; g = q.findBreakAt(f, l);)f = g.to; for (;g = q.findBreakAt(a, l);)a = g.from; a < f && (a = f) }k.prototype.setExtremes.call(this, f, a, h, e, c) }, r.setAxisTranslation = function (f) {
          k.prototype.setAxisTranslation.call(this, f); q.unitLength = null; if (q.hasBreaks) {
            f = r.options.breaks || []; var a = []; var h = []; var e = 0; var c; var m = r.userMin || r.min; var u = r.userMax || r.max
            var t = I(r.pointRangePadding, 0); var v; f.forEach(function (a) { c = a.repeat || Infinity; g.isInBreak(a, m) && (m += a.to % c - m % c); g.isInBreak(a, u) && (u -= u % c - a.from % c) }); f.forEach(function (e) { p = e.from; for (c = e.repeat || Infinity; p - c > m;)p -= c; for (;p < m;)p += c; for (v = p; v < u; v += c)a.push({ value: v, move: 'in' }), a.push({ value: v + (e.to - e.from), move: 'out', size: e.breakSize }) }); a.sort(function (a, c) { return a.value === c.value ? (a.move === 'in' ? 0 : 1) - (c.move === 'in' ? 0 : 1) : a.value - c.value }); var w = 0; var p = m; a.forEach(function (a) {
              w += a.move === 'in' ? 1 : -1; w ===
1 && a.move === 'in' && (p = a.value); w === 0 && (h.push({ from: p, to: a.value, len: a.value - p - (a.size || 0) }), e += a.value - p - (a.size || 0))
            }); r.breakArray = q.breakArray = h; q.unitLength = u - m - e + t; N(r, 'afterBreaks'); r.staticScale ? r.transA = r.staticScale : q.unitLength && (r.transA *= (u - r.min + t) / q.unitLength); t && (r.minPixelPadding = r.transA * r.minPointOffset); r.min = m; r.max = u
          }
        }); I(t, !0) && r.chart.redraw()
      }; return g
    }()); g = (function () {
      function g () {}g.compose = function (g, k) {
        g.keepProps.push('brokenAxis'); var q = J.prototype; q.drawBreaks = function (g,
          h) { var f = this; var a = f.points; var k; var e; var c; var m; if (g && g.brokenAxis && g.brokenAxis.hasBreaks) { var u = g.brokenAxis; h.forEach(function (h) { k = u && u.breakArray || []; e = g.isXAxis ? g.min : I(f.options.threshold, g.min); a.forEach(function (a) { m = I(a['stack' + h.toUpperCase()], a[h]); k.forEach(function (f) { if (y(e) && y(m)) { c = !1; if (e < f.from && m > f.to || e > f.from && m < f.from)c = 'pointBreak'; else if (e < f.from && m > f.from && m < f.to || e > f.from && m > f.to && m < f.from)c = 'pointInBreak'; c && N(g, c, { point: a, brk: f }) } }) }) }) } }; q.gappedPath = function () {
          var g = this.currentDataGrouping
          var h = g && g.gapSize; g = this.options.gapSize; var f = this.points.slice(); var a = f.length - 1; var k = this.yAxis; var e; if (g && a > 0) for (this.options.gapUnit !== 'value' && (g *= this.basePointRange), h && h > g && h >= this.basePointRange && (g = h), e = void 0; a--;)e && !1 !== e.visible || (e = f[a + 1]), h = f[a], !1 !== e.visible && !1 !== h.visible && (e.x - h.x > g && (e = (h.x + e.x) / 2, f.splice(a + 1, 0, { isNull: !0, x: e }), k.stacking && this.options.stacking && (e = k.stacking.stacks[this.stackKey][e] = new v(k, k.options.stackLabels, !1, e, this.stack), e.total = 0)), e = h); return this.getGraphPath(f)
        }
        H(g, 'init', function () { this.brokenAxis || (this.brokenAxis = new E(this)) }); H(g, 'afterInit', function () { typeof this.brokenAxis !== 'undefined' && this.brokenAxis.setBreaks(this.options.breaks, !1) }); H(g, 'afterSetTickPositions', function () { var g = this.brokenAxis; if (g && g.hasBreaks) { var h = this.tickPositions; var f = this.tickPositions.info; var a = []; var k; for (k = 0; k < h.length; k++)g.isInAnyBreak(h[k]) || a.push(h[k]); this.tickPositions = a; this.tickPositions.info = f } }); H(g, 'afterSetOptions', function () {
          this.brokenAxis && this.brokenAxis.hasBreaks &&
(this.options.ordinal = !1)
        }); H(k, 'afterGeneratePoints', function () { var g = this.options.connectNulls; var h = this.points; var f = this.xAxis; var a = this.yAxis; if (this.isDirty) for (var k = h.length; k--;) { var e = h[k]; var c = !(e.y === null && !1 === g) && (f && f.brokenAxis && f.brokenAxis.isInAnyBreak(e.x, !0) || a && a.brokenAxis && a.brokenAxis.isInAnyBreak(e.y, !0)); e.visible = c ? !1 : !1 !== e.options.visible } }); H(k, 'afterRender', function () { this.drawBreaks(this.xAxis, ['x']); this.drawBreaks(this.yAxis, I(this.pointArrayMap, ['y'])) })
      }; return g
    }()); g.compose(k,
      J); return g
  }); P(A, 'masters/modules/broken-axis.src.js', [], function () {}); P(A, 'parts/DataGrouping.js', [A['parts/DateTimeAxis.js'], A['parts/Globals.js'], A['parts/Point.js'], A['parts/Tooltip.js'], A['parts/Utilities.js']], function (k, g, A, v, K) {
    ''; var G = K.addEvent; var H = K.arrayMax; var M = K.arrayMin; var y = K.correctFloat; var I = K.defined; var J = K.error; var E = K.extend; var D = K.format; var z = K.isNumber; var t = K.merge; var q = K.pick; var r = g.Axis; var h = g.defaultPlotOptions; K = g.Series; var f = g.approximations = {
      sum: function (a) {
        var c = a.length; if (!c && a.hasNulls) var e = null
        else if (c) for (e = 0; c--;)e += a[c]; return e
      },
      average: function (a) { var c = a.length; a = f.sum(a); z(a) && c && (a = y(a / c)); return a },
      averages: function () { var a = []; [].forEach.call(arguments, function (c) { a.push(f.average(c)) }); return typeof a[0] === 'undefined' ? void 0 : a },
      open: function (a) { return a.length ? a[0] : a.hasNulls ? null : void 0 },
      high: function (a) { return a.length ? H(a) : a.hasNulls ? null : void 0 },
      low: function (a) { return a.length ? M(a) : a.hasNulls ? null : void 0 },
      close: function (a) { return a.length ? a[a.length - 1] : a.hasNulls ? null : void 0 },
      ohlc: function (a, c, e, g) { a = f.open(a); c = f.high(c); e = f.low(e); g = f.close(g); if (z(a) || z(c) || z(e) || z(g)) return [a, c, e, g] },
      range: function (a, c) { a = f.low(a); c = f.high(c); if (z(a) || z(c)) return [a, c]; if (a === null && c === null) return null }
    }; var a = function (a, c, e, g) {
      var h = this; var d = h.data; var b = h.options && h.options.data; var m = []; var k = []; var l = []; var p = a.length; var u = !!c; var r = []; var q = h.pointArrayMap; var w = q && q.length; var v = ['x'].concat(q || ['y']); var C = 0; var F = 0; var y; g = typeof g === 'function' ? g : f[g] ? f[g] : f[h.getDGApproximation && h.getDGApproximation() || 'average']; w ? q.forEach(function () { r.push([]) })
        : r.push([]); var A = w || 1; for (y = 0; y <= p && !(a[y] >= e[0]); y++);for (y; y <= p; y++) {
        for (;typeof e[C + 1] !== 'undefined' && a[y] >= e[C + 1] || y === p;) {
          var D = e[C]; h.dataGroupInfo = { start: h.cropStart + F, length: r[0].length }; var G = g.apply(h, r); h.pointClass && !I(h.dataGroupInfo.options) && (h.dataGroupInfo.options = t(h.pointClass.prototype.optionsToObject.call({ series: h }, h.options.data[h.cropStart + F])), v.forEach(function (a) { delete h.dataGroupInfo.options[a] })); typeof G !== 'undefined' && (m.push(D), k.push(G), l.push(h.dataGroupInfo)); F =
y; for (D = 0; D < A; D++)r[D].length = 0, r[D].hasNulls = !1; C += 1; if (y === p) break
        } if (y === p) break; if (q) for (D = h.cropStart + y, G = d && d[D] || h.pointClass.prototype.applyOptions.apply({ series: h }, [b[D]]), D = 0; D < w; D++) { var L = G[q[D]]; z(L) ? r[D].push(L) : L === null && (r[D].hasNulls = !0) } else D = u ? c[y] : null, z(D) ? r[0].push(D) : D === null && (r[0].hasNulls = !0)
      } return { groupedXData: m, groupedYData: k, groupMap: l }
    }; var l = { approximations: f, groupData: a }; var e = K.prototype; var c = e.processData; var m = e.generatePoints; var u = {
      groupPixelWidth: 2,
      dateTimeLabelFormats: {
        millisecond: ['%A, %b %e, %H:%M:%S.%L',
          '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
        second: ['%A, %b %e, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
        minute: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
        hour: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
        day: ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
        week: ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
        month: ['%B %Y', '%B', '-%B %Y'],
        year: ['%Y', '%Y', '-%Y']
      }
    }; var L = {
      line: {},
      spline: {},
      area: {},
      areaspline: {},
      arearange: {},
      column: { groupPixelWidth: 10 },
      columnrange: { groupPixelWidth: 10 },
      candlestick: { groupPixelWidth: 10 },
      ohlc: { groupPixelWidth: 5 }
    }; var F = g.defaultDataGroupingUnits = [['millisecond', [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ['second', [1, 2, 5, 10, 15, 30]], ['minute', [1, 2, 5, 10, 15, 30]], ['hour', [1, 2, 3, 4, 6, 8, 12]], ['day', [1]], ['week', [1]], ['month', [1, 3, 6]], ['year', null]]; e.getDGApproximation = function () { return this.is('arearange') ? 'range' : this.is('ohlc') ? 'ohlc' : this.is('column') ? 'sum' : 'average' }; e.groupData = a; e.processData = function () {
      var a = this.chart; var f = this.options.dataGrouping; var h = !1 !== this.allowDG &&
f && q(f.enabled, a.options.isStock); var g = this.visible || !a.options.chart.ignoreHiddenSeries; var m; var d = this.currentDataGrouping; var b = !1; this.forceCrop = h; this.groupPixelWidth = null; this.hasProcessed = !0; h && !this.requireSorting && (this.requireSorting = b = !0); h = !1 === c.apply(this, arguments) || !h; b && (this.requireSorting = !1); if (!h) {
        this.destroyGroupedData(); h = f.groupAll ? this.xData : this.processedXData; var l = f.groupAll ? this.yData : this.processedYData; var u = a.plotSizeX; a = this.xAxis; var r = a.options.ordinal; var t = this.groupPixelWidth = a.getGroupPixelWidth &&
a.getGroupPixelWidth(); if (t) {
          this.isDirty = m = !0; this.points = null; b = a.getExtremes(); var v = b.min; b = b.max; r = r && a.ordinal && a.ordinal.getGroupIntervalFactor(v, b, this) || 1; t = t * (b - v) / u * r; u = a.getTimeTicks(k.AdditionsClass.prototype.normalizeTimeTickInterval(t, f.units || F), Math.min(v, h[0]), Math.max(b, h[h.length - 1]), a.options.startOfWeek, h, this.closestPointRange); l = e.groupData.apply(this, [h, l, u, f.approximation]); h = l.groupedXData; r = l.groupedYData; var y = 0; if (f.smoothed && h.length) {
            var z = h.length - 1; for (h[z] = Math.min(h[z],
              b); z-- && z > 0;)h[z] += t / 2; h[0] = Math.max(h[0], v)
          } for (z = 1; z < u.length; z++)u.info.segmentStarts && u.info.segmentStarts.indexOf(z) !== -1 || (y = Math.max(u[z] - u[z - 1], y)); v = u.info; v.gapSize = y; this.closestPointRange = u.info.totalRange; this.groupMap = l.groupMap; if (I(h[0]) && h[0] < a.min && g) { if (!I(a.options.min) && a.min <= a.dataMin || a.min === a.dataMin)a.min = Math.min(h[0], a.min); a.dataMin = Math.min(h[0], a.dataMin) }f.groupAll && (f = this.cropData(h, r, a.min, a.max, 1), h = f.xData, r = f.yData); this.processedXData = h; this.processedYData =
r
        } else this.groupMap = null; this.hasGroupedData = m; this.currentDataGrouping = v; this.preventGraphAnimation = (d && d.totalRange) !== (v && v.totalRange)
      }
    }; e.destroyGroupedData = function () { this.groupedData && (this.groupedData.forEach(function (a, c) { a && (this.groupedData[c] = a.destroy ? a.destroy() : null) }, this), this.groupedData.length = 0) }; e.generatePoints = function () { m.apply(this); this.destroyGroupedData(); this.groupedData = this.hasGroupedData ? this.points : null }; G(A, 'update', function () {
      if (this.dataGroup) {
        return J(24, !1, this.series.chart),
        !1
      }
    }); G(v, 'headerFormatter', function (a) {
      var c = this.chart; var e = c.time; var f = a.labelConfig; var h = f.series; var d = h.tooltipOptions; var b = h.options.dataGrouping; var g = d.xDateFormat; var m = h.xAxis; var k = d[(a.isFooter ? 'footer' : 'header') + 'Format']; if (m && m.options.type === 'datetime' && b && z(f.key)) {
        var l = h.currentDataGrouping; b = b.dateTimeLabelFormats || u.dateTimeLabelFormats; if (l) if (d = b[l.unitName], l.count === 1)g = d[0]; else { g = d[1]; var r = d[2] } else !g && b && (g = this.getXDateFormat(f, d, m)); g = e.dateFormat(g, f.key); r && (g += e.dateFormat(r, f.key + l.totalRange -
1)); h.chart.styledMode && (k = this.styledModeFormat(k)); a.text = D(k, { point: E(f.point, { key: g }), series: h }, c); a.preventDefault()
      }
    }); G(K, 'destroy', e.destroyGroupedData); G(K, 'afterSetOptions', function (a) { a = a.options; var c = this.type; var e = this.chart.options.plotOptions; var f = h[c].dataGrouping; var g = this.useCommonDataGrouping && u; if (L[c] || g)f || (f = t(u, L[c])), a.dataGrouping = t(g, f, e.series && e.series.dataGrouping, e[c].dataGrouping, this.userOptions.dataGrouping) }); G(r, 'afterSetScale', function () {
      this.series.forEach(function (a) {
        a.hasProcessed =
!1
      })
    }); r.prototype.getGroupPixelWidth = function () { var a = this.series; var c = a.length; var e; var f = 0; var h = !1; var d; for (e = c; e--;)(d = a[e].options.dataGrouping) && (f = Math.max(f, q(d.groupPixelWidth, u.groupPixelWidth))); for (e = c; e--;)(d = a[e].options.dataGrouping) && a[e].hasProcessed && (c = (a[e].processedXData || a[e].data).length, a[e].groupPixelWidth || c > this.chart.plotSizeX / f || c && d.forced) && (h = !0); return h ? f : 0 }; r.prototype.setDataGrouping = function (a, c) {
      var e; c = q(c, !0); a || (a = { forced: !1, units: null }); if (this instanceof r) {
        for (e = this.series.length; e--;) {
          this.series[e].update({ dataGrouping: a },
            !1)
        }
      } else this.chart.options.series.forEach(function (c) { c.dataGrouping = a }, !1); this.ordinal && (this.ordinal.slope = void 0); c && this.chart.redraw()
    }; g.dataGrouping = l; ''; return l
  }); P(A, 'parts/OHLCSeries.js', [A['parts/Globals.js'], A['parts/Point.js'], A['parts/Utilities.js']], function (k, g, A) {
    A = A.seriesType; var v = k.seriesTypes; A('ohlc', 'column', {
      lineWidth: 1,
      tooltip: { pointFormat: '<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>' },
      threshold: null,
      states: { hover: { lineWidth: 3 } },
      stickyTracking: !0
    }, {
      directTouch: !1,
      pointArrayMap: ['open', 'high', 'low', 'close'],
      toYData: function (g) { return [g.open, g.high, g.low, g.close] },
      pointValKey: 'close',
      pointAttrToOptions: { stroke: 'color', 'stroke-width': 'lineWidth' },
      init: function () { v.column.prototype.init.apply(this, arguments); this.options.stacking = void 0 },
      pointAttribs: function (g, k) {
        k = v.column.prototype.pointAttribs.call(this, g, k); var A = this.options; delete k.fill; !g.options.color && A.upColor && g.open < g.close &&
(k.stroke = A.upColor); return k
      },
      translate: function () { var g = this; var k = g.yAxis; var A = !!g.modifyValue; var H = ['plotOpen', 'plotHigh', 'plotLow', 'plotClose', 'yBottom']; v.column.prototype.translate.apply(g); g.points.forEach(function (v) { [v.open, v.high, v.low, v.close, v.low].forEach(function (y, G) { y !== null && (A && (y = g.modifyValue(y)), v[H[G]] = k.toPixels(y, !0)) }); v.tooltipPos[1] = v.plotHigh + k.pos - g.chart.plotTop }) },
      drawPoints: function () {
        var g = this; var k = g.chart; var v = function (g, k, v) {
          var y = g[0]; g = g[1]; typeof y[2] === 'number' && (y[2] = Math.max(v +
k, y[2])); typeof g[2] === 'number' && (g[2] = Math.min(v - k, g[2]))
        }; g.points.forEach(function (A) {
          var y = A.graphic; var G = !y; if (typeof A.plotY !== 'undefined') {
            y || (A.graphic = y = k.renderer.path().add(g.group)); k.styledMode || y.attr(g.pointAttribs(A, A.selected && 'select')); var H = y.strokeWidth(); var E = H % 2 / 2; var D = Math.round(A.plotX) - E; var z = Math.round(A.shapeArgs.width / 2); var t = [['M', D, Math.round(A.yBottom)], ['L', D, Math.round(A.plotHigh)]]; if (A.open !== null) {
              var q = Math.round(A.plotOpen) + E; t.push(['M', D, q], ['L', D - z, q]); v(t,
                H / 2, q)
            }A.close !== null && (q = Math.round(A.plotClose) + E, t.push(['M', D, q], ['L', D + z, q]), v(t, H / 2, q)); y[G ? 'attr' : 'animate']({ d: t }).addClass(A.getClassName(), !0)
          }
        })
      },
      animate: null
    }, { getClassName: function () { return g.prototype.getClassName.call(this) + (this.open < this.close ? ' highcharts-point-up' : ' highcharts-point-down') } }); ''
  }); P(A, 'parts/CandlestickSeries.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var A = g.merge; g = g.seriesType; var v = k.defaultPlotOptions; var K = k.seriesTypes; g('candlestick',
      'ohlc', A(v.column, { states: { hover: { lineWidth: 2 } }, tooltip: v.ohlc.tooltip, threshold: null, lineColor: '#000000', lineWidth: 1, upColor: '#ffffff', stickyTracking: !0 }), {
        pointAttribs: function (g, k) {
          var v = K.column.prototype.pointAttribs.call(this, g, k); var y = this.options; var A = g.open < g.close; var G = y.lineColor || this.color; v['stroke-width'] = y.lineWidth; v.fill = g.options.color || (A ? y.upColor || this.color : this.color); v.stroke = g.options.lineColor || (A ? y.upLineColor || G : G); k && (g = y.states[k], v.fill = g.color || v.fill, v.stroke = g.lineColor ||
v.stroke, v['stroke-width'] = g.lineWidth || v['stroke-width']); return v
        },
        drawPoints: function () {
          var g = this; var k = g.chart; var v = g.yAxis.reversed; g.points.forEach(function (y) {
            var A = y.graphic; var G = !A; if (typeof y.plotY !== 'undefined') {
              A || (y.graphic = A = k.renderer.path().add(g.group)); g.chart.styledMode || A.attr(g.pointAttribs(y, y.selected && 'select')).shadow(g.options.shadow); var E = A.strokeWidth() % 2 / 2; var D = Math.round(y.plotX) - E; var z = y.plotOpen; var t = y.plotClose; var q = Math.min(z, t); z = Math.max(z, t); var r = Math.round(y.shapeArgs.width /
2); t = v ? z !== y.yBottom : Math.round(q) !== Math.round(y.plotHigh); var h = v ? Math.round(q) !== Math.round(y.plotHigh) : z !== y.yBottom; q = Math.round(q) + E; z = Math.round(z) + E; E = []; E.push(['M', D - r, z], ['L', D - r, q], ['L', D + r, q], ['L', D + r, z], ['Z'], ['M', D, q], ['L', D, t ? Math.round(v ? y.yBottom : y.plotHigh) : q], ['M', D, z], ['L', D, h ? Math.round(v ? y.plotHigh : y.yBottom) : z]); A[G ? 'attr' : 'animate']({ d: E }).addClass(y.getClassName(), !0)
            }
          })
        }
      }); ''
  }); P(A, 'mixins/on-series.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    var A =
g.defined; var v = g.stableSort; var K = k.seriesTypes; return {
      getPlotBox: function () { return k.Series.prototype.getPlotBox.call(this.options.onSeries && this.chart.get(this.options.onSeries) || this) },
      translate: function () {
        K.column.prototype.translate.apply(this); var g = this; var k = g.options; var H = g.chart; var y = g.points; var I = y.length - 1; var J; var E = k.onSeries; E = E && H.get(E); k = k.onKey || 'y'; var D = E && E.options.step; var z = E && E.points; var t = z && z.length; var q = H.inverted; var r = g.xAxis; var h = g.yAxis; var f = 0; var a; if (E && E.visible && t) {
          f = (E.pointXOffset || 0) + (E.barW || 0) / 2; H = E.currentDataGrouping
          var l = z[t - 1].x + (H ? H.totalRange : 0); v(y, function (a, c) { return a.x - c.x }); for (k = 'plot' + k[0].toUpperCase() + k.substr(1); t-- && y[I];) { var e = z[t]; H = y[I]; H.y = e.y; if (e.x <= H.x && typeof e[k] !== 'undefined') { if (H.x <= l && (H.plotY = e[k], e.x < H.x && !D && (a = z[t + 1]) && typeof a[k] !== 'undefined')) { var c = (H.x - e.x) / (a.x - e.x); H.plotY += c * (a[k] - e[k]); H.y += c * (a.y - e.y) }I--; t++; if (I < 0) break } }
        }y.forEach(function (a, c) {
          a.plotX += f; if (typeof a.plotY === 'undefined' || q) {
            a.plotX >= 0 && a.plotX <= r.len ? q ? (a.plotY = r.translate(a.x, 0, 1, 0, 1), a.plotX = A(a.y)
              ? h.translate(a.y, 0, 0, 0, 1) : 0) : a.plotY = (r.opposite ? 0 : g.yAxis.len) + r.offset : a.shapeArgs = {}
          } if ((J = y[c - 1]) && J.plotX === a.plotX) { typeof J.stackIndex === 'undefined' && (J.stackIndex = 0); var e = J.stackIndex + 1 }a.stackIndex = e
        }); this.onSeries = E
      }
    }
  }); P(A, 'parts/FlagsSeries.js', [A['parts/Globals.js'], A['parts/Utilities.js'], A['mixins/on-series.js']], function (k, g, A) {
    function v (g) {
      q[g + 'pin'] = function (h, f, a, k, e) {
        var c = e && e.anchorX; e = e && e.anchorY; g === 'circle' && k > a && (h -= Math.round((k - a) / 2), a = k); var m = q[g](h, f, a, k); if (c && e) {
          var l =
c; g === 'circle' ? l = h + a / 2 : (h = m[0], a = m[1], h[0] === 'M' && a[0] === 'L' && (l = (h[1] + a[1]) / 2)); m.push(['M', l, f > e ? f : f + k], ['L', c, e]); m = m.concat(q.circle(c - 1, e - 1, 2, 2))
        } return m
      }
    } var H = g.addEvent; var G = g.defined; var N = g.isNumber; var M = g.merge; var y = g.objectEach; var I = g.seriesType; var J = g.wrap; g = k.noop; var E = k.Renderer; var D = k.Series; var z = k.TrackerMixin; var t = k.VMLRenderer; var q = k.SVGRenderer.prototype.symbols; I('flags', 'column', {
      pointRange: 0,
      allowOverlapX: !1,
      shape: 'flag',
      stackDistance: 12,
      textAlign: 'center',
      tooltip: { pointFormat: '{point.text}<br/>' },
      threshold: null,
      y: -30,
      fillColor: '#ffffff',
      lineWidth: 1,
      states: { hover: { lineColor: '#000000', fillColor: '#ccd6eb' } },
      style: { fontSize: '11px', fontWeight: 'bold' }
    }, {
      sorted: !1,
      noSharedTooltip: !0,
      allowDG: !1,
      takeOrdinalPosition: !1,
      trackerGroups: ['markerGroup'],
      forceCrop: !0,
      init: D.prototype.init,
      pointAttribs: function (g, h) {
        var f = this.options; var a = g && g.color || this.color; var k = f.lineColor; var e = g && g.lineWidth; g = g && g.fillColor || f.fillColor; h && (g = f.states[h].fillColor, k = f.states[h].lineColor, e = f.states[h].lineWidth); return {
          fill: g || a,
          stroke: k ||
a,
          'stroke-width': e || f.lineWidth || 0
        }
      },
      translate: A.translate,
      getPlotBox: A.getPlotBox,
      drawPoints: function () {
        var g = this.points; var h = this.chart; var f = h.renderer; var a = h.inverted; var l = this.options; var e = l.y; var c; var m = this.yAxis; var u = {}; var q = []; for (c = g.length; c--;) {
          var t = g[c]; var w = (a ? t.plotY : t.plotX) > this.xAxis.len; var p = t.plotX; var v = t.stackIndex; var z = t.options.shape || l.shape; var B = t.plotY; typeof B !== 'undefined' && (B = t.plotY + e - (typeof v !== 'undefined' && v * l.stackDistance)); t.anchorX = v ? void 0 : t.plotX; var d = v ? void 0 : t.plotY; var b = z !==
'flag'; v = t.graphic; typeof B !== 'undefined' && p >= 0 && !w ? (v || (v = t.graphic = f.label('', null, null, z, null, null, l.useHTML), h.styledMode || v.attr(this.pointAttribs(t)).css(M(l.style, t.style)), v.attr({ align: b ? 'center' : 'left', width: l.width, height: l.height, 'text-align': l.textAlign }).addClass('highcharts-point').add(this.markerGroup), t.graphic.div && (t.graphic.div.point = t), h.styledMode || v.shadow(l.shadow), v.isNew = !0), p > 0 && (p -= v.strokeWidth() % 2), z = { y: B, anchorY: d }, l.allowOverlapX && (z.x = p, z.anchorX = t.anchorX), v.attr({
            text: t.options.title ||
l.title || 'A'
          })[v.isNew ? 'attr' : 'animate'](z), l.allowOverlapX || (u[t.plotX] ? u[t.plotX].size = Math.max(u[t.plotX].size, v.width) : u[t.plotX] = { align: b ? 0.5 : 0, size: v.width, target: p, anchorX: p }), t.tooltipPos = [p, B + m.pos - h.plotTop]) : v && (t.graphic = v.destroy())
        }l.allowOverlapX || (y(u, function (a) { a.plotX = a.anchorX; q.push(a) }), k.distribute(q, a ? m.len : this.xAxis.len, 100), g.forEach(function (a) {
          var b = a.graphic && u[a.plotX]; b && (a.graphic[a.graphic.isNew ? 'attr' : 'animate']({ x: b.pos + b.align * b.size, anchorX: a.anchorX }), G(b.pos)
            ? a.graphic.isNew = !1 : (a.graphic.attr({ x: -9999, anchorX: -9999 }), a.graphic.isNew = !0))
        })); l.useHTML && J(this.markerGroup, 'on', function (a) { return k.SVGElement.prototype.on.apply(a.apply(this, [].slice.call(arguments, 1)), [].slice.call(arguments, 1)) })
      },
      drawTracker: function () {
        var g = this.points; z.drawTrackerPoint.apply(this); g.forEach(function (h) {
          var f = h.graphic; f && H(f.element, 'mouseover', function () {
            h.stackIndex > 0 && !h.raised && (h._y = f.y, f.attr({ y: h._y - 8 }), h.raised = !0); g.forEach(function (a) {
              a !== h && a.raised && a.graphic &&
(a.graphic.attr({ y: a._y }), a.raised = !1)
            })
          })
        })
      },
      animate: function (g) { g && this.setClip() },
      setClip: function () { D.prototype.setClip.apply(this, arguments); !1 !== this.options.clip && this.sharedClipKey && this.markerGroup.clip(this.chart[this.sharedClipKey]) },
      buildKDTree: g,
      invertGroups: g
    }, { isValid: function () { return N(this.y) || typeof this.y === 'undefined' } }); q.flag = function (g, h, f, a, k) {
      var e = k && k.anchorX || g; k = k && k.anchorY || h; var c = q.circle(e - 1, k - 1, 2, 2); c.push(['M', e, k], ['L', g, h + a], ['L', g, h], ['L', g + f, h], ['L', g + f, h +
a], ['L', g, h + a], ['Z']); return c
    }; v('circle'); v('square'); E === t && ['circlepin', 'flag', 'squarepin'].forEach(function (g) { t.prototype.symbols[g] = q[g] }); ''
  }); P(A, 'parts/RangeSelector.js', [A['parts/Globals.js'], A['parts/Utilities.js']], function (k, g) {
    function A (a) { this.init(a) } var v = g.addEvent; var K = g.createElement; var G = g.css; var N = g.defined; var M = g.destroyObjectProperties; var y = g.discardElement; var I = g.extend; var J = g.fireEvent; var E = g.isNumber; var D = g.merge; var z = g.objectEach; var t = g.pick; var q = g.pInt; var r = g.splat; var h = k.Axis; g = k.Chart; var f = k.defaultOptions
    I(f, { rangeSelector: { verticalAlign: 'top', buttonTheme: { width: 28, height: 18, padding: 2, zIndex: 7 }, floating: !1, x: 0, y: 0, height: void 0, inputPosition: { align: 'right', x: 0, y: 0 }, buttonPosition: { align: 'left', x: 0, y: 0 }, labelStyle: { color: '#666666' } } }); f.lang = D(f.lang, { rangeSelectorZoom: 'Zoom', rangeSelectorFrom: 'From', rangeSelectorTo: 'To' }); A.prototype = {
      clickButton: function (a, f) {
        var e = this.chart; var c = this.buttonOptions[a]; var g = e.xAxis[0]; var k = e.scroller && e.scroller.getUnionExtremes() || g || {}; var l = k.dataMin; var q = k.dataMax; var w = g && Math.round(Math.min(g.max,
          t(q, g.max))); var p = c.type; k = c._range; var C; var y = c.dataGrouping; if (l !== null && q !== null) {
          e.fixedRange = k; y && (this.forcedDataGrouping = !0, h.prototype.setDataGrouping.call(g || { chart: this.chart }, y, !1), this.frozenStates = c.preserveDataGrouping); if (p === 'month' || p === 'year') if (g) { p = { range: c, max: w, chart: e, dataMin: l, dataMax: q }; var B = g.minFromRange.call(p); E(p.newMax) && (w = p.newMax) } else k = c; else if (k)B = Math.max(w - k, l), w = Math.min(B + k, q); else if (p === 'ytd') {
            if (g) {
              typeof q === 'undefined' && (l = Number.MAX_VALUE, q = Number.MIN_VALUE,
              e.series.forEach(function (a) { a = a.xData; l = Math.min(a[0], l); q = Math.max(a[a.length - 1], q) }), f = !1), w = this.getYTDExtremes(q, l, e.time.useUTC), B = C = w.min, w = w.max
            } else { this.deferredYTDClick = a; return }
          } else p === 'all' && g && (B = l, w = q); B += c._offsetMin; w += c._offsetMax; this.setSelected(a); if (g)g.setExtremes(B, w, t(f, 1), null, { trigger: 'rangeSelectorButton', rangeSelectorButton: c }); else { var d = r(e.options.xAxis)[0]; var b = d.range; d.range = k; var n = d.min; d.min = C; v(e, 'load', function () { d.range = b; d.min = n }) }
        }
      },
      setSelected: function (a) {
        this.selected =
this.options.selected = a
      },
      defaultButtons: [{ type: 'month', count: 1, text: '1m' }, { type: 'month', count: 3, text: '3m' }, { type: 'month', count: 6, text: '6m' }, { type: 'ytd', text: 'YTD' }, { type: 'year', count: 1, text: '1y' }, { type: 'all', text: 'All' }],
      init: function (a) {
        var f = this; var e = a.options.rangeSelector; var c = e.buttons || [].concat(f.defaultButtons); var g = e.selected; var h = function () { var a = f.minInput; var c = f.maxInput; a && a.blur && J(a, 'blur'); c && c.blur && J(c, 'blur') }; f.chart = a; f.options = e; f.buttons = []; f.buttonOptions = c; this.unMouseDown = v(a.container,
          'mousedown', h); this.unResize = v(a, 'resize', h); c.forEach(f.computeButtonRange); typeof g !== 'undefined' && c[g] && this.clickButton(g, !1); v(a, 'load', function () { a.xAxis && a.xAxis[0] && v(a.xAxis[0], 'setExtremes', function (c) { this.max - this.min !== a.fixedRange && c.trigger !== 'rangeSelectorButton' && c.trigger !== 'updatedData' && f.forcedDataGrouping && !f.frozenStates && this.setDataGrouping(!1, !1) }) })
      },
      updateButtonStates: function () {
        var a = this; var f = this.chart; var e = f.xAxis[0]; var c = Math.round(e.max - e.min); var g = !e.hasVisibleSeries; var h = f.scroller &&
f.scroller.getUnionExtremes() || e; var k = h.dataMin; var q = h.dataMax; f = a.getYTDExtremes(q, k, f.time.useUTC); var r = f.min; var p = f.max; var t = a.selected; var v = E(t); var B = a.options.allButtonsEnabled; var d = a.buttons; a.buttonOptions.forEach(function (b, f) {
          var h = b._range; var m = b.type; var l = b.count || 1; var n = d[f]; var u = 0; var w = b._offsetMax - b._offsetMin; b = f === t; var C = h > q - k; var y = h < e.minRange; var z = !1; var A = !1; h = h === c; (m === 'month' || m === 'year') && c + 36E5 >= 864E5 * { month: 28, year: 365 }[m] * l - w && c - 36E5 <= 864E5 * { month: 31, year: 366 }[m] * l + w ? h = !0 : m === 'ytd' ? (h = p - r + w === c, z = !b) : m === 'all' && (h =
e.max - e.min >= q - k, A = !b && v && h); m = !B && (C || y || A || g); l = b && h || h && !v && !z || b && a.frozenStates; m ? u = 3 : l && (v = !0, u = 2); n.state !== u && (n.setState(u), u === 0 && t === f && a.setSelected(null))
        })
      },
      computeButtonRange: function (a) { var f = a.type; var e = a.count || 1; var c = { millisecond: 1, second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5 }; if (c[f])a._range = c[f] * e; else if (f === 'month' || f === 'year')a._range = 864E5 * { month: 30, year: 365 }[f] * e; a._offsetMin = t(a.offsetMin, 0); a._offsetMax = t(a.offsetMax, 0); a._range += a._offsetMax - a._offsetMin },
      setInputValue: function (a,
        f) { var e = this.chart.options.rangeSelector; var c = this.chart.time; var g = this[a + 'Input']; N(f) && (g.previousValue = g.HCTime, g.HCTime = f); g.value = c.dateFormat(e.inputEditDateFormat || '%Y-%m-%d', g.HCTime); this[a + 'DateBox'].attr({ text: c.dateFormat(e.inputDateFormat || '%b %e, %Y', g.HCTime) }) },
      showInput: function (a) { var f = this.inputGroup; var e = this[a + 'DateBox']; G(this[a + 'Input'], { left: f.translateX + e.x + 'px', top: f.translateY + 'px', width: e.width - 2 + 'px', height: e.height - 2 + 'px', border: '2px solid silver' }) },
      hideInput: function (a) {
        G(this[a +
'Input'], { border: 0, width: '1px', height: '1px' }); this.setInputValue(a)
      },
      drawInput: function (a) {
        function g () {
          var a = p.value; var d = (r.inputDateParser || Date.parse)(a); var b = c.xAxis[0]; var f = c.scroller && c.scroller.xAxis ? c.scroller.xAxis : b; var g = f.dataMin; f = f.dataMax; d !== p.previousValue && (p.previousValue = d, E(d) || (d = a.split('-'), d = Date.UTC(q(d[0]), q(d[1]) - 1, q(d[2]))), E(d) && (c.time.useUTC || (d += 6E4 * (new Date()).getTimezoneOffset()), w ? d > e.maxInput.HCTime ? d = void 0 : d < g && (d = g) : d < e.minInput.HCTime ? d = void 0 : d > f && (d = f), typeof d !==
'undefined' && b.setExtremes(w ? d : b.min, w ? b.max : d, void 0, void 0, { trigger: 'rangeSelectorInput' })))
        } var e = this; var c = e.chart; var h = c.renderer.style || {}; var u = c.renderer; var r = c.options.rangeSelector; var t = e.div; var w = a === 'min'; var p; var v; var y = this.inputGroup; this[a + 'Label'] = v = u.label(f.lang[w ? 'rangeSelectorFrom' : 'rangeSelectorTo'], this.inputGroup.offset).addClass('highcharts-range-label').attr({ padding: 2 }).add(y); y.offset += v.width + 5; this[a + 'DateBox'] = u = u.label('', y.offset).addClass('highcharts-range-input').attr({
          padding: 2,
          width: r.inputBoxWidth ||
90,
          height: r.inputBoxHeight || 17,
          'text-align': 'center'
        }).on('click', function () { e.showInput(a); e[a + 'Input'].focus() }); c.styledMode || u.attr({ stroke: r.inputBoxBorderColor || '#cccccc', 'stroke-width': 1 }); u.add(y); y.offset += u.width + (w ? 10 : 0); this[a + 'Input'] = p = K('input', { name: a, className: 'highcharts-range-selector', type: 'text' }, { top: c.plotTop + 'px' }, t); c.styledMode || (v.css(D(h, r.labelStyle)), u.css(D({ color: '#333333' }, h, r.inputStyle)), G(p, I({
          position: 'absolute',
          border: 0,
          width: '1px',
          height: '1px',
          padding: 0,
          textAlign: 'center',
          fontSize: h.fontSize,
          fontFamily: h.fontFamily,
          top: '-9999em'
        }, r.inputStyle))); p.onfocus = function () { e.showInput(a) }; p.onblur = function () { p === k.doc.activeElement && g(); e.hideInput(a); p.blur() }; p.onchange = g; p.onkeypress = function (a) { a.keyCode === 13 && g() }
      },
      getPosition: function () { var a = this.chart; var f = a.options.rangeSelector; a = f.verticalAlign === 'top' ? a.plotTop - a.axisOffset[0] : 0; return { buttonTop: a + f.buttonPosition.y, inputTop: a + f.inputPosition.y - 10 } },
      getYTDExtremes: function (a, f, e) {
        var c = this.chart.time; var g = new c.Date(a)
        var h = c.get('FullYear', g); e = e ? c.Date.UTC(h, 0, 1) : +new c.Date(h, 0, 1); f = Math.max(f || 0, e); g = g.getTime(); return { max: Math.min(a || g, g), min: f }
      },
      render: function (a, g) {
        var e = this; var c = e.chart; var h = c.renderer; var k = c.container; var l = c.options; var q = l.exporting && !1 !== l.exporting.enabled && l.navigation && l.navigation.buttonOptions; var r = f.lang; var p = e.div; var v = l.rangeSelector; var y = t(l.chart.style && l.chart.style.zIndex, 0) + 1; l = v.floating; var B = e.buttons; p = e.inputGroup; var d = v.buttonTheme; var b = v.buttonPosition; var n = v.inputPosition; var x = v.inputEnabled; var z = d && d.states
        var A = c.plotLeft; var D = e.buttonGroup; var E; var G = e.options.verticalAlign; var H = c.legend; var I = H && H.options; var J = b.y; var M = n.y; var N = c.hasLoaded; var P = N ? 'animate' : 'attr'; var T = 0; var S = 0; if (!1 !== v.enabled) {
          e.rendered || (e.group = E = h.g('range-selector-group').attr({ zIndex: 7 }).add(), e.buttonGroup = D = h.g('range-selector-buttons').add(E), e.zoomText = h.text(r.rangeSelectorZoom, 0, 15).add(D), c.styledMode || (e.zoomText.css(v.labelStyle), d['stroke-width'] = t(d['stroke-width'], 0)), e.buttonOptions.forEach(function (a, b) {
            B[b] = h.button(a.text, 0, 0, function (c) {
              var d =
a.events && a.events.click; var f; d && (f = d.call(a, c)); !1 !== f && e.clickButton(b); e.isActive = !0
            }, d, z && z.hover, z && z.select, z && z.disabled).attr({ 'text-align': 'center' }).add(D)
          }), !1 !== x && (e.div = p = K('div', null, { position: 'relative', height: 0, zIndex: y }), k.parentNode.insertBefore(p, k), e.inputGroup = p = h.g('input-group').add(E), p.offset = 0, e.drawInput('min'), e.drawInput('max'))); e.zoomText[P]({ x: t(A + b.x, A) }); var da = t(A + b.x, A) + e.zoomText.getBBox().width + 5; e.buttonOptions.forEach(function (a, b) {
            B[b][P]({ x: da }); da += B[b].width +
t(v.buttonSpacing, 5)
          }); A = c.plotLeft - c.spacing[3]; e.updateButtonStates(); q && this.titleCollision(c) && G === 'top' && b.align === 'right' && b.y + D.getBBox().height - 12 < (q.y || 0) + q.height && (T = -40); k = b.x - c.spacing[3]; b.align === 'right' ? k += T - A : b.align === 'center' && (k -= A / 2); D.align({ y: b.y, width: D.getBBox().width, align: b.align, x: k }, !0, c.spacingBox); e.group.placed = N; e.buttonGroup.placed = N; !1 !== x && (T = q && this.titleCollision(c) && G === 'top' && n.align === 'right' && n.y - p.getBBox().height - 12 < (q.y || 0) + q.height + c.spacing[0] ? -40 : 0,
          n.align === 'left' ? k = A : n.align === 'right' && (k = -Math.max(c.axisOffset[1], -T)), p.align({ y: n.y, width: p.getBBox().width, align: n.align, x: n.x + k - 2 }, !0, c.spacingBox), q = p.alignAttr.translateX + p.alignOptions.x - T + p.getBBox().x + 2, k = p.alignOptions.width, r = D.alignAttr.translateX + D.getBBox().x, A = D.getBBox().width + 20, (n.align === b.align || r + A > q && q + k > r && J < M + p.getBBox().height) && p.attr({ translateX: p.alignAttr.translateX + (c.axisOffset[1] >= -T ? 0 : -T), translateY: p.alignAttr.translateY + D.getBBox().height + 10 }), e.setInputValue('min',
            a), e.setInputValue('max', g), e.inputGroup.placed = N); e.group.align({ verticalAlign: G }, !0, c.spacingBox); a = e.group.getBBox().height + 20; g = e.group.alignAttr.translateY; G === 'bottom' && (H = I && I.verticalAlign === 'bottom' && I.enabled && !I.floating ? H.legendHeight + t(I.margin, 10) : 0, a = a + H - 20, S = g - a - (l ? 0 : v.y) - (c.titleOffset ? c.titleOffset[2] : 0) - 10); if (G === 'top')l && (S = 0), c.titleOffset && c.titleOffset[0] && (S = c.titleOffset[0]), S += c.margin[0] - c.spacing[0] || 0; else if (G === 'middle') {
            if (M === J)S = M < 0 ? g + void 0 : g; else if (M || J) {
              S = M < 0 ||
J < 0 ? S - Math.min(M, J) : g - a + NaN
            }
          } e.group.translate(v.x, v.y + Math.floor(S)); !1 !== x && (e.minInput.style.marginTop = e.group.translateY + 'px', e.maxInput.style.marginTop = e.group.translateY + 'px'); e.rendered = !0
        }
      },
      getHeight: function () { var a = this.options; var f = this.group; var e = a.y; var c = a.buttonPosition.y; var g = a.inputPosition.y; if (a.height) return a.height; a = f ? f.getBBox(!0).height + 13 + e : 0; f = Math.min(g, c); if (g < 0 && c < 0 || g > 0 && c > 0)a += Math.abs(f); return a },
      titleCollision: function (a) { return !(a.options.title.text || a.options.subtitle.text) },
      update: function (a) { var f = this.chart; D(!0, f.options.rangeSelector, a); this.destroy(); this.init(f); f.rangeSelector.render() },
      destroy: function () { var a = this; var f = a.minInput; var e = a.maxInput; a.unMouseDown(); a.unResize(); M(a.buttons); f && (f.onfocus = f.onblur = f.onchange = null); e && (e.onfocus = e.onblur = e.onchange = null); z(a, function (c, e) { c && e !== 'chart' && (c.destroy ? c.destroy() : c.nodeType && y(this[e])); c !== A.prototype[e] && (a[e] = null) }, this) }
    }; h.prototype.minFromRange = function () {
      var a = this.range; var f = a.type; var e = this.max; var c = this.chart.time
      var g = function (a, e) { var g = f === 'year' ? 'FullYear' : 'Month'; var h = new c.Date(a); var k = c.get(g, h); c.set(g, h, k + e); k === c.get(g, h) && c.set('Date', h, 0); return h.getTime() - a }; if (E(a)) { var h = e - a; var k = a } else h = e + g(e, -a.count), this.chart && (this.chart.fixedRange = e - h); var q = t(this.dataMin, Number.MIN_VALUE); E(h) || (h = q); h <= q && (h = q, typeof k === 'undefined' && (k = g(h, a.count)), this.newMax = Math.min(h + k, this.dataMax)); E(e) || (h = void 0); return h
    }; k.RangeSelector || (v(g, 'afterGetContainer', function () {
      this.options.rangeSelector.enabled &&
(this.rangeSelector = new A(this))
    }), v(g, 'beforeRender', function () { var a = this.axes; var f = this.rangeSelector; f && (E(f.deferredYTDClick) && (f.clickButton(f.deferredYTDClick), delete f.deferredYTDClick), a.forEach(function (a) { a.updateNames(); a.setScale() }), this.getAxisMargins(), f.render(), a = f.options.verticalAlign, f.options.floating || (a === 'bottom' ? this.extraBottomMargin = !0 : a !== 'middle' && (this.extraTopMargin = !0))) }), v(g, 'update', function (a) {
      var f = a.options.rangeSelector; a = this.rangeSelector; var e = this.extraBottomMargin
      var c = this.extraTopMargin; f && f.enabled && !N(a) && (this.options.rangeSelector.enabled = !0, this.rangeSelector = new A(this)); this.extraTopMargin = this.extraBottomMargin = !1; a && (a.render(), f = f && f.verticalAlign || a.options && a.options.verticalAlign, a.options.floating || (f === 'bottom' ? this.extraBottomMargin = !0 : f !== 'middle' && (this.extraTopMargin = !0)), this.extraBottomMargin !== e || this.extraTopMargin !== c) && (this.isDirtyBox = !0)
    }), v(g, 'render', function () {
      var a = this.rangeSelector; a && !a.options.floating && (a.render(), a = a.options.verticalAlign,
      a === 'bottom' ? this.extraBottomMargin = !0 : a !== 'middle' && (this.extraTopMargin = !0))
    }), v(g, 'getMargins', function () { var a = this.rangeSelector; a && (a = a.getHeight(), this.extraTopMargin && (this.plotTop += a), this.extraBottomMargin && (this.marginBottom += a)) }), g.prototype.callbacks.push(function (a) {
      function f () {
        e = a.xAxis[0].getExtremes(); g = a.legend; k = c === null || void 0 === c ? void 0 : c.options.verticalAlign; E(e.min) && c.render(e.min, e.max); c && g.display && k === 'top' && k === g.options.verticalAlign && (h = D(a.spacingBox), h.y = g.options.layout ===
'vertical' ? a.plotTop : h.y + c.getHeight(), g.group.placed = !1, g.align(h))
      } var e; var c = a.rangeSelector; var g; var h; var k; if (c) { var q = v(a.xAxis[0], 'afterSetExtremes', function (a) { c.render(a.min, a.max) }); var r = v(a, 'redraw', f); f() }v(a, 'destroy', function () { c && (r(), q()) })
    }), k.RangeSelector = A)
  }); P(A, 'parts/StockChart.js', [A['parts/Axis.js'], A['parts/Globals.js'], A['parts/Point.js'], A['parts/Utilities.js']], function (k, g, A, v) {
    var H = v.addEvent; var G = v.arrayMax; var N = v.arrayMin; var M = v.clamp; var y = v.defined; var I = v.extend; var J = v.find; var E = v.format
    var D = v.isNumber; var z = v.isString; var t = v.merge; var q = v.pick; var r = v.splat; var h = g.Chart; v = g.Series; var f = g.SVGRenderer; var a = v.prototype; var l = a.init; var e = a.processData; var c = A.prototype.tooltipFormatter; g.StockChart = g.stockChart = function (a, c, e) {
      var f = z(a) || a.nodeName; var k = arguments[f ? 1 : 0]; var m = k; var l = k.series; var u = g.getOptions(); var v; var d = q(k.navigator && k.navigator.enabled, u.navigator.enabled, !0); k.xAxis = r(k.xAxis || {}).map(function (a, c) {
        return t({ minPadding: 0, maxPadding: 0, overscroll: 0, ordinal: !0, title: { text: null }, labels: { overflow: 'justify' }, showLastLabel: !0 },
          u.xAxis, u.xAxis && u.xAxis[c], a, { type: 'datetime', categories: null }, d ? { startOnTick: !1, endOnTick: !1 } : null)
      }); k.yAxis = r(k.yAxis || {}).map(function (a, c) { v = q(a.opposite, !0); return t({ labels: { y: -2 }, opposite: v, showLastLabel: !(!a.categories && a.type !== 'category'), title: { text: null } }, u.yAxis, u.yAxis && u.yAxis[c], a) }); k.series = null; k = t({
        chart: { panning: { enabled: !0, type: 'x' }, pinchType: 'x' },
        navigator: { enabled: d },
        scrollbar: { enabled: q(u.scrollbar.enabled, !0) },
        rangeSelector: { enabled: q(u.rangeSelector.enabled, !0) },
        title: { text: null },
        tooltip: { split: q(u.tooltip.split, !0), crosshairs: !0 },
        legend: { enabled: !1 }
      }, k, { isStock: !0 }); k.series = m.series = l; return f ? new h(a, k, e) : new h(k, c)
    }; H(v, 'setOptions', function (a) { var c; this.chart.options.isStock && (this.is('column') || this.is('columnrange') ? c = { borderWidth: 0, shadow: !1 } : this.is('scatter') || this.is('sma') || (c = { marker: { enabled: !1, radius: 2 } }), c && (a.plotOptions[this.type] = t(a.plotOptions[this.type], c))) }); H(k, 'autoLabelAlign', function (a) {
      var c = this.chart; var e = this.options; c = c._labelPanes = c._labelPanes ||
{}; var f = this.options.labels; this.chart.options.isStock && this.coll === 'yAxis' && (e = e.top + ',' + e.height, !c[e] && f.enabled && (f.x === 15 && (f.x = 0), typeof f.align === 'undefined' && (f.align = 'right'), c[e] = this, a.align = 'right', a.preventDefault()))
    }); H(k, 'destroy', function () { var a = this.chart; var c = this.options && this.options.top + ',' + this.options.height; c && a._labelPanes && a._labelPanes[c] === this && delete a._labelPanes[c] }); H(k, 'getPlotLinePath', function (a) {
      function c (a) {
        var b = a === 'xAxis' ? 'yAxis' : 'xAxis'; a = e.options[b]; return D(a)
          ? [g[b][a]] : z(a) ? [g.get(a)] : f.map(function (a) { return a[b] })
      } var e = this; var f = this.isLinked && !this.series ? this.linkedParent.series : this.series; var g = e.chart; var h = g.renderer; var k = e.left; var m = e.top; var l; var d; var b; var n; var r = []; var t = []; var v = a.translatedValue; var A = a.value; var E = a.force; if (g.options.isStock && !1 !== a.acrossPanes && e.coll === 'xAxis' || e.coll === 'yAxis') {
        a.preventDefault(); t = c(e.coll); var G = e.isXAxis ? g.yAxis : g.xAxis; G.forEach(function (a) {
          if (y(a.options.id) ? a.options.id.indexOf('navigator') === -1 : 1) {
            var b = a.isXAxis ? 'yAxis' : 'xAxis'; b = y(a.options[b])
              ? g[b][a.options[b]] : g[b][0]; e === b && t.push(a)
          }
        }); var H = t.length ? [] : [e.isXAxis ? g.yAxis[0] : g.xAxis[0]]; t.forEach(function (a) { H.indexOf(a) !== -1 || J(H, function (b) { return b.pos === a.pos && b.len === a.len }) || H.push(a) }); var I = q(v, e.translate(A, null, null, a.old)); D(I) && (e.horiz ? H.forEach(function (a) { var c; d = a.pos; n = d + a.len; l = b = Math.round(I + e.transB); E !== 'pass' && (l < k || l > k + e.width) && (E ? l = b = M(l, k, k + e.width) : c = !0); c || r.push(['M', l, d], ['L', b, n]) }) : H.forEach(function (a) {
          var c; l = a.pos; b = l + a.len; d = n = Math.round(m + e.height -
I); E !== 'pass' && (d < m || d > m + e.height) && (E ? d = n = M(d, m, m + e.height) : c = !0); c || r.push(['M', l, d], ['L', b, n])
        })); a.path = r.length > 0 ? h.crispPolyLine(r, a.lineWidth || 1) : null
      }
    }); f.prototype.crispPolyLine = function (a, c) { for (var e = 0; e < a.length; e += 2) { var f = a[e]; var g = a[e + 1]; f[1] === g[1] && (f[1] = g[1] = Math.round(f[1]) - c % 2 / 2); f[2] === g[2] && (f[2] = g[2] = Math.round(f[2]) + c % 2 / 2) } return a }; H(k, 'afterHideCrosshair', function () { this.crossLabel && (this.crossLabel = this.crossLabel.hide()) }); H(k, 'afterDrawCrosshair', function (a) {
      var c, e; if (y(this.crosshair.label) &&
this.crosshair.label.enabled && this.cross) {
        var f = this.chart; var g = this.logarithmic; var h = this.options.crosshair.label; var k = this.horiz; var m = this.opposite; var l = this.left; var d = this.top; var b = this.crossLabel; var n = h.format; var r = ''; var t = this.options.tickPosition === 'inside'; var v = !1 !== this.crosshair.snap; var z = 0; var A = a.e || this.cross && this.cross.e; var D = a.point; a = this.min; var G = this.max; g && (a = g.lin2log(a), G = g.lin2log(G)); g = k ? 'center' : m ? this.labelAlign === 'right' ? 'right' : 'left' : this.labelAlign === 'left' ? 'left' : 'center'; b || (b = this.crossLabel = f.renderer.label(null,
          null, null, h.shape || 'callout').addClass('highcharts-crosshair-label' + (this.series[0] && ' highcharts-color-' + this.series[0].colorIndex)).attr({ align: h.align || g, padding: q(h.padding, 8), r: q(h.borderRadius, 3), zIndex: 2 }).add(this.labelGroup), f.styledMode || b.attr({ fill: h.backgroundColor || this.series[0] && this.series[0].color || '#666666', stroke: h.borderColor || '', 'stroke-width': h.borderWidth || 0 }).css(I({ color: '#ffffff', fontWeight: 'normal', fontSize: '11px', textAlign: 'center' }, h.style))); k ? (g = v ? D.plotX + l : A.chartX,
        d += m ? 0 : this.height) : (g = m ? this.width + l : 0, d = v ? D.plotY + d : A.chartY); n || h.formatter || (this.dateTime && (r = '%b %d, %Y'), n = '{value' + (r ? ':' + r : '') + '}'); r = v ? D[this.isXAxis ? 'x' : 'y'] : this.toValue(k ? A.chartX : A.chartY); b.attr({ text: n ? E(n, { value: r }, f) : h.formatter.call(this, r), x: g, y: d, visibility: r < a || r > G ? 'hidden' : 'visible' }); h = b.getBBox(); if (k) { if (t && !m || !t && m)d = b.y - h.height } else d = b.y - h.height / 2; k ? (c = l - h.x, e = l + this.width - h.x) : (c = this.labelAlign === 'left' ? l : 0, e = this.labelAlign === 'right' ? l + this.width : f.chartWidth); b.translateX <
c && (z = c - b.translateX); b.translateX + h.width >= e && (z = -(b.translateX + h.width - e)); b.attr({ x: g + z, y: d, anchorX: k ? g : this.opposite ? 0 : f.chartWidth, anchorY: k ? this.opposite ? f.chartHeight : 0 : d + h.height / 2 })
      }
    }); a.init = function () { l.apply(this, arguments); this.setCompare(this.options.compare) }; a.setCompare = function (a) {
      this.modifyValue = a === 'value' || a === 'percent' ? function (c, e) {
        var f = this.compareValue; return typeof c !== 'undefined' && typeof f !== 'undefined' ? (c = a === 'value' ? c - f : c / f * 100 - (this.options.compareBase === 100 ? 0 : 100),
        e && (e.change = c), c) : 0
      } : null; this.userOptions.compare = a; this.chart.hasRendered && (this.isDirty = !0)
    }; a.processData = function (a) {
      var c; var f = -1; var g = !0 === this.options.compareStart ? 0 : 1; e.apply(this, arguments); if (this.xAxis && this.processedYData) {
        var h = this.processedXData; var k = this.processedYData; var m = k.length; this.pointArrayMap && (f = this.pointArrayMap.indexOf(this.options.pointValKey || this.pointValKey || 'y')); for (c = 0; c < m - g; c++) {
          var l = k[c] && f > -1 ? k[c][f] : k[c]; if (D(l) && h[c + g] >= this.xAxis.min && l !== 0) {
            this.compareValue =
l; break
          }
        }
      }
    }; H(v, 'afterGetExtremes', function (a) { a = a.dataExtremes; if (this.modifyValue && a) { var c = [this.modifyValue(a.dataMin), this.modifyValue(a.dataMax)]; a.dataMin = N(c); a.dataMax = G(c) } }); k.prototype.setCompare = function (a, c) { this.isXAxis || (this.series.forEach(function (c) { c.setCompare(a) }), q(c, !0) && this.chart.redraw()) }; A.prototype.tooltipFormatter = function (a) {
      var e = this.series.chart.numberFormatter; a = a.replace('{point.change}', (this.change > 0 ? '+' : '') + e(this.change, q(this.series.tooltipOptions.changeDecimals,
        2))); return c.apply(this, [a])
    }; H(v, 'render', function () {
      var a = this.chart; if (!(a.is3d && a.is3d() || a.polar) && this.xAxis && !this.xAxis.isRadial) {
        var c = this.yAxis.len; if (this.xAxis.axisLine) { var e = a.plotTop + a.plotHeight - this.yAxis.pos - this.yAxis.len; var f = Math.floor(this.xAxis.axisLine.strokeWidth() / 2); e >= 0 && (c -= Math.max(f - e, 0)) }!this.clipBox && this.animate ? (this.clipBox = t(a.clipBox), this.clipBox.width = this.xAxis.len, this.clipBox.height = c) : a[this.sharedClipKey] && (a[this.sharedClipKey].animate({
          width: this.xAxis.len,
          height: c
        }), a[this.sharedClipKey + 'm'] && a[this.sharedClipKey + 'm'].animate({ width: this.xAxis.len }))
      }
    }); H(h, 'update', function (a) { a = a.options; 'scrollbar' in a && this.navigator && (t(!0, this.options.scrollbar, a.scrollbar), this.navigator.update({}, !1), delete a.scrollbar) })
  }); P(A, 'masters/modules/stock.src.js', [], function () {}); P(A, 'masters/highstock.src.js', [A['masters/highcharts.src.js']], function (k) { k.product = 'Highstock'; return k }); A['masters/highstock.src.js']._modules = A; return A['masters/highstock.src.js']
})
// # sourceMappingURL=highstock.js.map
