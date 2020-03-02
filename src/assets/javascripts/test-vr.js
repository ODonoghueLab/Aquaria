function exportGLTF(){
  
var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); 
  
function save( blob, filename ) {
link.href = URL.createObjectURL( blob );
link.download = filename;
link.click();
// URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString( text, filename ) {
save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}
function saveArrayBuffer( buffer, filename ) {
save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}


// var exporter = new GLTFExporter();
var exporter = new GLTFExporter();

console.log("THIS IS WIDGET.SOUPWIDGET", AQUARIA.panel3d.embededJolecule.soupWidget.displayMeshes);
console.log("THIS IS GLTFEXPORTER", exporter);

exporter.parse( Object.values(AQUARIA.panel3d.embededJolecule.soupWidget.displayMeshes), function ( gltf ) {
console.log( "THIS IS GLTF", gltf );
//   if ( gltf instanceof ArrayBuffer ) {
//     saveArrayBuffer( gltf, 'scene.glb' );
// } else {
//     var output = JSON.stringify( gltf, null, 2 );
//     console.log( output );
//     saveString( output, 'scene.gltf' );
// }
}, true);
}
window.addEventListener("click", () => exportGLTF())
// var values = JSON.stringify(Object.values(AQUARIA.panel3d.embededJolecule.soupWidget.displayMeshes), null, 2);
// saveString(values, 'scene.txt'); 
