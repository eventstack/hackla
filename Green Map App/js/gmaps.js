/**
 * Created by marty on 5/31/14.
 */
var Gmap = {};
Gmap.initialized = false;
var map = null;
Gmap.markers = [];
Gmap.accessibleLocations=[];
Gmap.bounds;
Gmap.infoWindow;
var currentLocationLoad=true;
var bounds;
var currentBoundsDistance;
var rad = 0;
var pricingPolicy;
var searchBox;
var all_stations = true;
var my_stations = false;
var avail_stations = false;
var rad_all = true;
var rad_1_mile = false;
var rad_5_miles= false;
var rad_10_miles= false;
var power_1 = true;
var power_2 = true;
var power_3= true;
var handicap = false;
var boundsListener;
var search = false;
var timeout;

Gmap.loadMapScript = function() {
    if (Gmap.initialized)
        return;
    Gmap.initialized = true;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDDwSi-69znhkOsJq6Ok_g9tmi8Z-Y1Odg&sensor=true&callback=Gmap.initialize&libraries=geometry";
    document.body.appendChild(script);
}

Gmap.initialize = function() {
    Gmap.bounds = new google.maps.LatLngBounds();

    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(33.992339, -118.442277),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("station-map"), mapOptions);
    Gmap.infoWindow = new google.maps.InfoWindow;
    google.maps.event.addListener(map, 'click', function() {
        Gmap.infoWindow.close();
    });
    google.maps.event.addListener(map, 'dragend', function() {  } );
    google.maps.event.addListener(map, 'idle', function() {
        boundsChanged()
    });

    var input = /** @type {HTMLInputElement} */(
        document.getElementById('search-box'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    setUpMapSearch();

    showCurrentLocation();
    getAccessibleLocations();
    //refresh map every 5 minutes
    timeout = setTimeout(getAccessibleLocations, 300000);

}
function boundsChanged()
{
    bounds=map.getBounds();
    rad =  google.maps.geometry.spherical.computeDistanceBetween(bounds.getNorthEast(),bounds.getSouthWest());
    rad = convertMeterstoMiles(rad);

}




function clearSearch()
{
    $("#search-criteria").slideUp(500);
    getAccessibleLocations();
    //refresh map every 5 minutes
    timeout = setTimeout(getAccessibleLocations, 300000);
    $("#pac-input").val('');
    boundsListener =google.maps.event.addListener(map, 'idle', function() {
        boundsChanged()
    });
    search=false;
}
function doSearch()
{

}
function processSearchResults(locations)
{
    Gmap.clearMarkers();
    Gmap.populateMap(locations);

}


function getAccessibleLocations()
{
    DriverOps.getAccessibleLocationsForUser(Gmap.setAccessibleLocation) ;
}

function getLocations (  ) {
    var center= map.getCenter();
    // console.log(center)
    DriverOps.getLocations ( Gmap.populateMap,center.lat(),center.lng(),rad) ;
    return false ;
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
Gmap.populateMap = function( locations) {
    for ( var i = 0 ; i < locations.length ; ++ i ) {

        var location = locations[ i ] ;

        Gmap.addLocation( location ) ;

    }
    // console.log(Gmap.accessibleLocations);
    if(currentLocationLoad)
    {
        // console.log("in location load view")

    }
    return false ;
}

Gmap.setShowLocationPane = function(locationData)
{
    // $("#location-view").slide
}

Gmap.setAccessibleLocation = function(locations)
{
    // console.log(locations);
    Gmap.accessibleLocations=locations;
    getLocations();

}
Gmap.addLocation = function(location) {
    //console.log("adding marker @ " + location.latitude + ", " + location.longitude);
    var latlng = new google.maps.LatLng(location.latitude, location.longitude);
    var icon;
    if(Gmap.accessibleLocations.indexOf(location.id)>-1)
    {

        if(location.availableStationCount>0)
            icon ='/assets/images/available-location-marker.png'
        else
            icon ='/assets/images/in-use-location-marker.png'
    }
    else
    {
        icon ='/assets/images/unavailable-location-marker.png'
    }

    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        meta: location.name ,
        icon:icon,
        id:location.id
    });
    var onMarkerClick = function() {
        var marker = this;
        var latLng = marker.getPosition();
        Gmap.infoWindow.setContent(marker.meta);
        Gmap.infoWindow.open(map, marker);

        $("#station-map" ).css("width", $("#location-pane").width());
        $("#station-map" ).css("height", $("#location-pane").height());
        google.maps.event.trigger(map, 'resize');

        var isPrivate = "true";

        //enables pout of network view for location
        if(Gmap.accessibleLocations.indexOf(location.id)>-1 )

        {
            isPrivate = "false";
        }
        if($(window).width()<480)
        {
            document.location.href="/location?id="+this.id+"&isPrivate="+isPrivate;
        }
        else
        {
            //document.location.href="/location?id="+this.id;
            $("#location-pane").show('slide',{direction:'right'},500);



            StationView.locationPaneData (this.id,isPrivate);
        }
        var currCenter = map.getCenter();

        map.panTo(currCenter);
    };
    Gmap.markers.push(marker);
    google.maps.event.addListener(marker, 'click', onMarkerClick);
    Gmap.bounds.extend(marker.position);
    if(search)
    {
        map.fitBounds(Gmap.bounds);
    }
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

function mapCoordinates(coords) {
    Gmap.clearMarkers();
    Gmap.bounds = new google.maps.LatLngBounds();

    for(i in coords) {
        var marker = new google.maps.Marker({
            position: coords[i],
            map: map
        });
        Gmap.markers.push(marker);
        Gmap.bounds.extend(marker.position);
    }
    map.fitBounds(Gmap.bounds);

    showCurrentLocation();
}

function showCurrentLocation() {
    var myloc = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22,22),
            new google.maps.Point(0,18),
            new google.maps.Point(11,11)),
        shadow: null,
        zIndex: 999,
        map: map
    });

    var me;
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log("in getcurrentpos");
            me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            myloc.setPosition(me);
            Gmap.bounds.extend(myloc.position);
            map.fitBounds(Gmap.bounds);
            map.setCenter(me);
            map.setZoom(15);
            map.panTo(me);

        }, function(){//alert('Error Getting Location');
        });
    }
    console.log("myloc");
    console.log(myloc);
    return myloc;
}
function convertMeterstoMiles(meters)
{
    return meters/1609.344;
}

