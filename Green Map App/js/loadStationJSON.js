/**
 * Created by marty on 5/31/14.
 */
var blueStations={};
var greenStations={};
var expoStations= {};
var goldStation = {};
function loadStationJSON ()

{


    blueStations=$.getJSON('JSON/blueline.json');
    greenStations=$.getJSON('JSON/greenline.json');
    expoStations=$.getJSON('JSON/expoline.json');
    goldStation=$.getJSON('JSON/goldline.json');
    console.log(blueStations);

}





