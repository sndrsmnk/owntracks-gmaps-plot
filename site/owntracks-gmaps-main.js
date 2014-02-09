var map;
var markers = [];

function initialize() {
    var Utrecht = new google.maps.LatLng(52.0833037517657, 5.1107025146484375);
    var mapOptions = {
        zoom: 14,
        center: Utrecht
//      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, 'manual');
    });
}

// Add a marker to the map and push to the array.
function addMarker(location, title, icon) {
    if (!icon) {
        icon = 'px/red_MarkerF.png';
    }
    var marker = new google.maps.Marker({
        position: location,
        title: title,
        icon: icon,
        map: map
    });
    markers.push(marker);
}

// Loads/filters markers from data
function displayMarkers() {
    var allowAcc = document.getElementById("allowacc").value;
    if (!allowAcc) {
        allowAcc = 150;
    }

    // reset all markers
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];

    var skipcnt = 0; // info

    // display markers where acc < allowAcc
    for (var i = 0; i < owntracksMarkers.length; i++) {
        var tval1 = parseFloat(owntracksMarkers[i]['acc']);
        var tval2 = parseFloat(allowAcc);
        if (tval1 <= tval2) {
            if      (owntracksMarkers[i]['acc'] <= 25)  { marker = 'px/darkgreen_MarkerA.png'; }
            else if (owntracksMarkers[i]['acc'] <= 50)  { marker = 'px/green_MarkerB.png'; }
            else if (owntracksMarkers[i]['acc'] <= 75)  { marker = 'px/yellow_MarkerC.png'; }
            else if (owntracksMarkers[i]['acc'] <= 100) { marker = 'px/orange_MarkerD.png'; }
            else if (owntracksMarkers[i]['acc'] <= 150) { marker = 'px/pink_MarkerE.png'; }
            else if (owntracksMarkers[i]['acc'] >  150) { marker = 'px/red_MarkerF.png'; }

            var title = owntracksMarkers[i]['tst'] + ' (' + owntracksMarkers[i]['acc'] + ')';

            LatLng = new google.maps.LatLng(owntracksMarkers[i]['lat'], owntracksMarkers[i]['lon']);
            addMarker(LatLng, title, marker);
        } else {
            skipcnt = skipcnt + 1
        }
    }

    // display info
    document.getElementById("skipcnt").innerHTML = skipcnt;
}
