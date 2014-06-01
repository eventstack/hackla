
        var apiKey = "a5b4e76c1a59227e4b31fde1a67ec8b341cab5ce";
        var secret = "fbc44ca55774915214ad92f17061f001b8fddfc6";
        var baseUrl = "https://api.evconnect.com/v4";

        function getEvcLocations(callback) {
            var url = baseUrl + "/locations";

            var ts = moment().toISOString();
            var headers = "X-EVC-Timestamp: " + ts;

            headers += "<br/>X-EVC-API-Key: " + apiKey;
            var hash = CryptoJS.HmacSHA256(ts, secret).toString(CryptoJS.enc.Base64);
            headers += "<br/>X-EVC-API-Signature: " + hash;

            var format = $("#format").val();
            headers += "<br/>Accept: " + format;

            $.ajax({
                url: url,
                headers:
                {
                    "X-EVC-Timestamp": ts,
                    "X-EVC-API-Key": apiKey,
                    "X-EVC-API-Signature": hash,
                    "Accept": format
                }
            }).success(callback).error(function(data) {
                console.log("error");
                $("#response").text(data.responseText);
            });
        }

        function geocodeWithCallback(address, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( {'address': address },
                function(data, status) {
                    if (data.length > 0) {
                        callback({ latitude: data[0].geometry.location.lat(), longitude: data[0].geometry.location.lng() }, data[0].formatted_address);
                    } else {
                        callback();
                    }
                }
            );
        }

        function getDrivingDirections(startAddress, endAddress, callback) {
            var directionsService = new google.maps.DirectionsService();
            var request = {
                origin:startAddress,
                destination:endAddress,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    console.log(result);
                    callback(result);
                }
            });
        }

        function getTransitDirections(startAddress, endAddress, callback) {
            var directionsService = new google.maps.DirectionsService();
            var request = {
                origin:startAddress,
                destination:endAddress,
                travelMode: google.maps.TravelMode.TRANSIT
            };
            directionsService.route(request, function(result, status) {
                console.log(status);
                if (status == google.maps.DirectionsStatus.OK) {
                    console.log(result);
                    callback(result);
                } else {
                    callback(null);
                }
            });
        }