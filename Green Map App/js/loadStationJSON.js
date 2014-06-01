/**
 * Created by marty on 5/31/14.
 */
var blueStations=[];
var greenStations=[];
var expoStations= [];
var goldStations = [];
var rplineStations = [];

function loadStationJSON () {
    $.getJSON('JSON/blueline.json', function(result){
        result.data.forEach(function(st) {
            console.log(st);
            blueStations.push(parseStation(st));
        });
    });
    $.getJSON('JSON/greenline.json', function(result){
        result.data.forEach(function(st) {
            greenStations.push(parseStation(st));
        });
    });
    $.getJSON('JSON/expoline.json', function(result){
        result.data.forEach(function(st) {
            expoStations.push(parseStation(st));
        });
    });
    $.getJSON('JSON/goldline.json', function(result){
        result.data.forEach(function(st) {
            goldStations.push(parseStation(st));
        });
    });
    $.getJSON('JSON/rplines.json', function(result){
        result.data.forEach(function(st) {
            rplineStations.push(parseStation(st));
        });
    });
}

function getStationCoords(callback) {
    loadStationJSON();
    setTimeout(function() {
        var all = [];
        all.push.apply(all, blueStations);
        all.push.apply(all, greenStations);
        all.push.apply(all, expoStations);
        all.push.apply(all, goldStations);
        all.push.apply(all, rplineStations);
        callback(all);
    }, 100);
}

function parseStation(stationArr) {
    return { latitude: stationArr[13], longitude:stationArr[12]};
}

function markStations(map) {
    getStationCoords(function(stations) {
        stations.forEach(function(station) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(station.latitude, station.longitude),
                map: map,
                title:"LA Metro Station",
                icon: 'images/train-map-icon.png'
            });
        });
    });
}
