var ghgData = [];

function loadGhgData() {
    $.getJSON('JSON/ghg-emissions.json', function(result){
        result.data.forEach(function(st) {
            console.log(st);
            ghgData.push({"year": st[8], "ghgTons": st[10]});
        });
    });
}

loadGhgData();

function getFunFact() {
    var randomIndex = Math.floor(Math.random() * ghgData.length);
    console.log(randomIndex);
    var datum = ghgData[randomIndex];
    return "Did you know LA operations produced " + datum.ghgTons + " tons of CO2 in " + datum.year;
}