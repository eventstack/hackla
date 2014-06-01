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
    }).success(callback).error(function(data) {
        console.log("error");
        $("#response").text(data.responseText);
    });
}

function geocode(callback) {
    var url = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=380%20New%20York%20St%2C%20Redlands&f=json&outSR=%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D&outFields=Loc_name";

    $.ajax({
        url: url,
        headers:
        {
            "Accept": "application/json"
        }
    }).success(callback).error(function(data) {
        console.log("error");
        $("#response").text(data.responseText);
    });
}