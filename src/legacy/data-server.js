export default class DataServer {

    constructor(url, id) {
        this.url = url;
        this.pdbId = id;
    }

    getProteinData(callback) {
        fetch(this.url).then(res => res.text()).then(pdbText => callback({ pdbId: this.pdbId, pdbText }));
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