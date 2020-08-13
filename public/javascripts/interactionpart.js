//Scripts to get interaction partners
//Run on browser console after page loaded

function csvJSON (csv) {
    var lines = csv.split('\n')
    var result = []
    var headers = lines[0].split(',')
    for (var i = 1; i < lines.length; i++) {
      var obj = {}
      var currentline = lines[i].split(',')
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]
      }
      result.push(obj)
    }
    return JSON.stringify(result)
  }

  downloadCSVFromJson = (filename, arrayOfJson) => {
    // convert JSON to CSV
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(arrayOfJson[0])
    let csv = arrayOfJson.map(row => header.map(fieldName => 
    JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    csv = csv.join('\r\n')
  
    // Create link and download
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv));
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
var interactionPartners = []

var numCluster = $("#allclusters").children().length
for(var j = 1; j <= numCluster; j++){
    url = `${process.env.BACKEND}/${window.location.pathname.split('/')[1]}/cluster${j}.csv`;
    axios({
        method: 'get',
        url: url,
    })
    .then(function (response) {
        var clusters = csvJSON(response.data)
        clusters = JSON.parse(clusters)
        for (var i = 0; i < clusters.length; i++) {
            url = `${process.env.BACKEND}/${window.location.pathname.split('/')[1]}/${clusters[i]["pdb id"]}/${clusters[i]["pdb chain"]}/${clusters[i]["Cluster"]}/interactions`;
            axios({
                method: 'get',
                url: url,
            })
            .then(function (response) {
                if(response.data.initialParams["PDB"] != 0){
                    for(var k=0; k< Object.keys(response.data.initialParams["PDB"]).length; k++){
                      interactionPartners.push(response.data.initialParams["PDB"][k])
                    }
                }
            })
        }
    })
    console.log(interactionPartners)
}

  this.downloadCSVFromJson(`interactionPartners.csv`, this.interactionPartners)

