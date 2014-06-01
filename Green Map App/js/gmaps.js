/**
 * Created by marty on 5/31/14.
 */
var Gmap = {};
Gmap.initialized = false;
Gmap.markers= [];
var map = null;

Gmap.geocoder={};

var rad = 0;
var emissions = 0;
var dist_in_miles = 0;
var locations = [];
var stationIndex = 0;
var secondLegIndex = 0;
var originAddress = "13320 Beach Ave 90292";
var destAddress = "Dodger Stadium";
var firstLegs = [];
var secondLegs = [];
var directionsDisplay;
var directionsDisplay2;
var allowedToSendReqest=true;


Gmap.loadMapScript = function() {

    if (Gmap.initialized)
        return;
    Gmap.initialized = true;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDDwSi-69znhkOsJq6Ok_g9tmi8Z-Y1Odg&sensor=FALSE&callback=Gmap.initialize";
    document.body.appendChild(script);
}

Gmap.initialize = function() {


    Gmap.geocoder = new google.maps.Geocoder();
    Gmap.bounds = new google.maps.LatLngBounds();

    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(33.992339, -118.442277),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("green-map"), mapOptions);


    var input = /** @type {HTMLInputElement} */(
        document.getElementById('search-box'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }




    //refresh map every 5 minutes


}
Gmap.directionsService=null;


var i = 0;
function resetVars()
{
     rad = 0;
    emissions = 0;
     dist_in_miles = 0;
     locations = [];
     stationIndex = 0;
     secondLegIndex = 0;
     originAddress = "13320 Beach Ave 90292";
     destAddress = "Dodger Stadium";
     firstLegs = [];
     secondLegs = [];
     directionsDisplay;
     directionsDisplay2;
}
Gmap.calcRouter=function () {

    setTimeout(function(){
        $("#waitButton").hide(500) ;
        $("#routeButton").show(500)

    }, 8000);
    $("#routeButton").hide(500) ;
    $("#waitButton").show(500) ;
    try {
        resetVars();
        directionsDisplay.setMap(null);
        directionsDisplay2.setMap(null);
        console.log("here");
    }
    catch(e)
    {

    }
   originAddress = document.getElementById("start-address").value;
   destAddress = document.getElementById("end-address").value;
    Gmap.directionsService= new google.maps.DirectionsService();

    getEvcLocations(function(chargeStationData) {
        console.log(chargeStationData);
        locations = chargeStationData.locations;
        stationIndex = 0;

        routeNext();
    });
}
function routeComparator(a,b) {
    return getResultDistance(a) - getResultDistance(b);
}

function routeNext() {
    var location = locations[stationIndex];
    var chargeStationAddress = location.address + " " + location.zipcode;
    console.log(chargeStationAddress);
    getDrivingDirections(originAddress, chargeStationAddress, function(result) {
        console.log("got directions to charging station " + chargeStationAddress);
        console.log(result.routes[0].legs[0].distance.text);

        firstLegs.push(result);
        stationIndex++;

        if (stationIndex >= locations.length) {
            console.log("number of firstLegs=" + firstLegs.length);

            // sort by distance of first leg
            firstLegs.sort(routeComparator);

            firstLegs.forEach(function(firstLeg) {
                console.log("dist=" + getResultDistance(firstLeg));
            });

            routeSecondLeg();
        } else {
            routeNext();
        }
    });
}

function routeSecondLeg() {
    console.log("routing second leg");

    var secondLegOrigin = firstLegs[secondLegIndex];
    var secondLegOriginAddress = secondLegOrigin.routes[0].legs[0].end_address;
    console.log(secondLegOriginAddress);
    getTransitDirections(secondLegOriginAddress, destAddress, function(result) {
        console.log("second leg from " + secondLegOriginAddress);

        if (result != null) {
            console.log(result.routes[0].legs[0].distance.text);
            secondLegs.push(result);
        } else {
            secondLegs.push({});
        }
        secondLegIndex++;

        if (secondLegIndex >= firstLegs.length) {
            mapRoutes2();
        } else {
            routeSecondLeg();
        }
    });
}

function mapRoutes2() {
    console.log("maproutes2");

    var minDist = 999999;
    var minIndex = -1;
    var i;
    for (i = 0;i<firstLegs.length;i++) {
        if (isValidDirectionResult(firstLegs[i]) && isValidDirectionResult(secondLegs[i])) {
            console.log("dist leg1=" + getResultDistance(firstLegs[i]) + " leg2=" + getResultDistance(secondLegs[i]));

            var dist = getResultDistance(firstLegs[i]) + getResultDistance(secondLegs[i]);
            if (dist < minDist) {
                minDist = dist;
                minIndex = i;
            }
        }
    }

    if (minIndex != -1) {

        if(typeof directionsDisplay == 'undefined')
        directionsDisplay = new google.maps.DirectionsRenderer();

        directionsDisplay.setMap(map);
        directionsDisplay.setDirections(firstLegs[minIndex]);

        if(typeof directionsDisplay2 == 'undefined')
        directionsDisplay2 = new google.maps.DirectionsRenderer();

        directionsDisplay2.setMap(map);
        directionsDisplay2.setDirections(secondLegs[minIndex]);

        var firstLegMiles= getResultDistance(firstLegs[minIndex])*0.000621371;
        var secondLegMiles=getResultDistance(secondLegs[minIndex])*0.000621371;

        var carEmissions=calculateEmissionsForCar((firstLegMiles+secondLegMiles));
        console.log("first leg ="+ firstLegMiles);
        console.log("second leg ="+ secondLegMiles);
        console.log("car ="+ carEmissions);

        var emissionsSaved =0;
        if($('#evCheckBox').is(':checked') ) {
            emissionsSaved += calculateEmissionsForCar(firstLegMiles);
            console.log("ev saved ="+ emissions);
        }
        var carSecondLeg=calculateEmissionsForCar(secondLegMiles);
        var lightRailSecondLeg=calculateEmissionsForLightRail(secondLegMiles);

        emissionsSaved+=carSecondLeg.toFixed(4)-lightRailSecondLeg.toFixed(4);
        console.log(emissionsSaved);

        $("#savingsText").text("Estimated Green House Gas Savings(kg of CO2):"+(emissionsSaved).toFixed(2));

    }
}


function isValidDirectionResult(result) {
    return result != null && result.routes != null && result.routes.length > 0 && result.routes[0].legs != null && result.routes[0].legs.length > 0;
}

function getResultDistance(result) {
    return result.routes[0].legs[0].distance.value;
}


function geoError() {
    alert("Geocoder failed.");
}
function geoSuccess(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    //alert("lat:" + lat + " lng:" + lng);
    Gmap.addMarker(position.coords.latitude,position.coords.longitude,"Staring location You are here");
    var latLng= new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    map.panTo(latLng);
    Gmap.geocoder.geocode({'latLng': latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                console.log(results[1]);
                $("#start-address").val(results[1].formatted_address);

            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}
function boundsChanged()
{
    bounds=map.getBounds();
    rad =  google.maps.geometry.spherical.computeDistanceBetween(bounds.getNorthEast(),bounds.getSouthWest());
    rad = convertMeterstoMiles(rad);

}









/**
 * Add a marker to the map.
 *
 * @param latitude
 * @param longitude
 * @param infoContent
 * @return markerIndex
 */
Gmap.addMarker = function(latitude, longitude, infoContent) {
    console.log("adding marker @ " + latitude + ", " + longitude);
    var latlng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        meta: infoContent
    });
    var onMarkerClick = function() {
        var marker = this;
        var latLng = marker.getPosition();
        Gmap.infoWindow.setContent(marker.meta);
        Gmap.infoWindow.open(map, marker);


    };
    Gmap.markers.push(marker);
    google.maps.event.addListener(marker, 'click', onMarkerClick);
    Gmap.bounds.extend(marker.position);
    //map.fitBounds(Gmap.bounds);
    return Gmap.markers.length - 1;
}


Gmap.doMarkerClick = function(markerIndex) {
    var marker = markers[markerIndex];
    var latLng = marker.getPosition();
    Gmap.infoWindow.setContent(marker.meta);
    Gmap.infoWindow.open(map, marker);
}

Gmap.clearMarkers = function() {
    Gmap.bounds = new google.maps.LatLngBounds();
    if (Gmap.markers) {
        for (i in Gmap.markers) {
            Gmap.markers[i].setMap(null);
        }
        Gmap.markers.length = 0;
    }
}

Gmap.getCurrentCoordinates = function() {
    return map.center;
}

Gmap.gotoCoordinate = function(lat,lng) {
    Gmap.clearMarkers();
    var position = new google.maps.LatLng(lat, lng);
    map.setCenter(position);
    map.setZoom(18);
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });
    Gmap.markers.push(marker);
}

Gmap.setCenter = function(lat,lng) {
    var position = new google.maps.LatLng(lat, lng);
    map.setCenter(position);
    map.setZoom(18);
}




function convertMeterstoMiles(meters)
{
    return meters/1609.344;
}

