var map;
var markers = [];
var owntracksMarkers = [];
var anim_t;

function initialize() {
    var Utrecht = new google.maps.LatLng(52.0833037517657, 5.1107025146484375);
    var mapOptions = {
        zoom: 13,
        center: Utrecht
//      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, 'manual');
    });
}

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

function displayMarkers() {
    var acc = document.getElementById("acc").value;
    if (!acc) { acc = 150; }
    
    var min_tst = document.getElementById("min_tst").value;
    if (!min_tst) { min_tst = '1970-01-01'; }

    var max_tst = document.getElementById("max_tst").value;
    if (!max_tst) { max_tst = '2037-12-31'; }

    var xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp=new XMLHttpRequest();
    } else {
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        displayMarkers_cont(xmlhttp.responseText);
      }
    }
    xmlhttp.open('GET', 'owntracks-gmaps-data.pl?acc=' + acc + '&min_tst=' + min_tst + '&max_tst=' + max_tst, true);
    xmlhttp.send();
}


function displayMarkers_cont(jsondata) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
   
    var owntracksMarkers = JSON.parse(jsondata);
    for (var i = 0; i < owntracksMarkers.length; i++) {
        if      (owntracksMarkers[i]['acc'] <= 25)  { marker = 'px/darkgreen_MarkerA.png'; }
        else if (owntracksMarkers[i]['acc'] <= 50)  { marker = 'px/green_MarkerB.png'; }
        else if (owntracksMarkers[i]['acc'] <= 75)  { marker = 'px/yellow_MarkerC.png'; }
        else if (owntracksMarkers[i]['acc'] <= 100) { marker = 'px/orange_MarkerD.png'; }
        else if (owntracksMarkers[i]['acc'] <= 150) { marker = 'px/pink_MarkerE.png'; }
        else if (owntracksMarkers[i]['acc'] >  150) { marker = 'px/red_MarkerF.png'; }

        var title = owntracksMarkers[i]['tst'] + ' (' + owntracksMarkers[i]['acc'] + ')';

        LatLng = new google.maps.LatLng(owntracksMarkers[i]['lat'], owntracksMarkers[i]['lon']);
        addMarker(LatLng, title, marker);
    }
}


function animateMarkers(idx) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
   
    var new_idx = idx + 1;
    markers[idx].setMap(map);

    if (new_idx < markers.length) {
        anim_t = setTimeout(function(){animateMarkers(new_idx)}, 500);
    } else {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
}
