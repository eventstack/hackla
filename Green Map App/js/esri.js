/**
 * Created by gavin on 5/31/14.
 */
function reverseGeocode(latitude, longitude, callback) {
    var loc = longitude + "," + latitude;
    var url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=" + loc + "&distance=100&f=json";
    $.ajax({
        url: url,
        headers:
        {
            "Accept": "application/json"
        }
    }).success(function(response){callback(response)}).error(function(data) {
        console.log("error");
        $("#response").text(data.responseText);
    });
}

function geocode(address,callback) {
    var url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine="+address+"&f=json&outFields=Loc_name";

    $.ajax({
        url: url,
        headers:
        {
            "Accept": "application/json"
        }
    }).success(function(response){callback(response)}).error(function(data) {
        console.log("error");
        $("#response").text(data.responseText);
    });
}