
var AquariaError = function(name, message) {
  this.name = name;
	this.message = message || "";
}


function errorCreator(name) {
  return function (message) {
    return new AquariaError (name, message || "A generic error has occurred");
  }
} 

// add new error categories here
var ErrorCategories = [
     "MatchingStructures",
     "GenerateViewer"
];


ErrorCategories.forEach(function (cat) {
  module.exports[cat] = errorCreator(cat + "Error");
});

module.exports.AquariaError = AquariaError;

