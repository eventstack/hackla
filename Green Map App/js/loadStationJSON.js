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
function returnTop5Stations(origin,callback)
{

    getStationCoords(function(stations)
    {

        stations.sort(function(a,b){
           // console.log(a.latitude + " "+origin.latitude);
            var p1 = new google.maps.LatLng(origin);
            var p2 = new google.maps.LatLng(a);

            var distA= calcDistance(p1,p2);

            a.distanceFromOrgin=distA;

            var p3 = new google.maps.LatLng(origin);
            var p4 = new google.maps.LatLng(b);

            var distB= calcDistance(p3,p4);

            b.distanceFromOrgin=distB;

           // console.log(a.distanceFromOrgin+" - "+ b.distanceFromOrgin);
            return distB-distA;

        });
        //console.log(stations.length);
       callback(stations.slice(0,5));

    });
}
function calcDistance(p1, p2){
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000);
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
function getDistanceFromOriginToStations(origin) {
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
