var ghgData = [];
var milesDriven = [];

function loadGhgData() {
    $.getJSON('JSON/ghg-emissions.json', function(result){
        result.data.forEach(function(st) {
            ghgData.push({"year": st[8], "ghgTons": st[10]});
        });
    });
}

function loadMilesDrivenData() {
    $.getJSON('JSON/miles-driven.json', function(result){
        result.data.forEach(function(st) {
            milesDriven.push({"year": st[8], "milesDriven": st[10]});
        });
    });
}

loadGhgData();
loadMilesDrivenData();

function getFunFact() {
    var category = Math.floor(2 * Math.random());

    if (category == 0) {

        var randomIndex = Math.floor(Math.random() * ghgData.length);
        console.log(randomIndex);
        var datum = ghgData[randomIndex];
        return "Did you know LA operations produced " + datum.ghgTons + " tons of CO2 in " + datum.year + "?";

    } else {

        var randomIndex = Math.floor(Math.random() * milesDriven.length);
        console.log(randomIndex);
        var datum = milesDriven[randomIndex];
        return "Did you know " + datum.milesDriven + " miles were driven on LA roads in " + datum.year + "?";

    }
}