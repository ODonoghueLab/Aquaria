var LRU = require('lru-cache')
var URL = require('../../../utils/url')

var TopTen = function (id, MAX_SIZE) {
  var that = this
  this.id = id
  if (URL.getUrlParameter('clearCache')) {
	  localStorage.removeItem(this.id)
  }
  var existing = localStorage.getItem(this.id)
  this.cache = new LRU(MAX_SIZE)
  if (existing === null) {
  } else {
    var entries = JSON.parse(existing)
    entries.forEach(function (entry) {
		  that.cache.set(entry.key, entry.value)
    })
  }
}

TopTen.prototype.submitFired = function (name, primary_accession, pdb_id) {
  var last = { name: name, primary_accession: primary_accession, pdb_id: pdb_id }
  this.cache.set(primary_accession + pdb_id, last)
  this.save()
}

TopTen.prototype.save = function () {
  var saveArray = []
  this.cache.forEach(function (value, key) {
    saveArray.push({ key: key, value: value })
  })
  var savedText = JSON.stringify(saveArray)
  console.log('TopTen.save', saveArray)
  localStorage.setItem(this.id, savedText)
}

TopTen.prototype.getAll = function () {
  var ret = []
  this.cache.forEach(function (value) {
	  ret.push(value)
  })
  return ret
}

TopTen.prototype.savePDB = function (primary_acccession, pdb) {
  var store = {}
  store.primary_acccession = primary_acccession
  store.pdb = pdb
  this.cache.push(store)
}

TopTen.prototype.previousLookup = function (primary_accession) {
  var pdb = false
  this.cache.forEach(function (value) {
    if (value.primary_accession == primary_accession) {
      pdb = value.pdb_id
    }
  })
  return pdb
}

TopTen.prototype.previousLookupByName = function (name) {
  var pdb = false
  this.cache.forEach(function (value) {
    if (value.name == name) {
      pdb = value.pdb_id
    }
  })
  return pdb
}

TopTen.prototype.updatePDB = function (primary_accession, pdb) {
  this.cache.forEach(function (value) {
    if (value.primary_accession == primary_accession) {
      value.pdb_id = pdb
    }
  })
  this.save()
}

module.exports = TopTen
