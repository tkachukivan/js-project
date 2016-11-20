function initMap() {
    var location = {lat: 37.4792202, lng: -122.146705};

    var map = new google.maps.Map(document.getElementsByClassName('map')[0], {
        zoom: 14,
        center: location
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Save me'
    });
    
    var contentString = '<div class="map-info">Save Me</div>';
    
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    
    infowindow.open(map, marker);
}

window.onload = function() {
    initMap();
}