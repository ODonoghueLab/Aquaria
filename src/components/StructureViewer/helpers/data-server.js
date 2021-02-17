import axios from 'axios'
import pako from './pako'
export default class DataServer {

    constructor(url, id) {
        this.url = url;
        this.pdbId = id;
    }

    getProteinData(callback) {
        // fetch(this.url).then(res => res.text()).then(pdbText => callback({ pdbId: this.pdbId, pdbText }));
        axios({
			method: 'get',
			url: this.url,
			responseType: 'arraybuffer',
			'accept-encoding': 'gzip'
		  }).then(function(response){
            const pdbText = pako.inflate(response.data, {to:"string"});
            callback({ pdbId: window.AQUARIA.currentMember.pdb_id , pdbText })
			}).catch(function (error){
                window.AQUARIA.panel3d.blankApplet(true, 'PDB not available. Try the next <a href="' +  window.location.href + '">matching structure </a>')
                console.log("PDB not found")
            })
    }

    getViews (callback) {
        callback([]);
    }

    saveViews (views, callback) {
        callback();
    }

    deleteView (viewId, callback) {
        callback()
    }
}

export { DataServer }