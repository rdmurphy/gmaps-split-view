var staticLng = -99.84;
var zoom = 6;

var map_optionsL = {
  center: new google.maps.LatLng(31.25, -99.84),
  zoom: zoom,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  streetViewControl: false
};

var map_optionsR = {
  center: new google.maps.LatLng(31.25, -99.84),
  zoom: zoom,
  disableDefaultUI: true,
  mapTypeControl: true,
  mapTypeId: google.maps.MapTypeId.HYBRID,
  streetViewControl: false
};

var mapL = new google.maps.Map(document.getElementById("map_left"), map_optionsL);
var mapR = new google.maps.Map(document.getElementById("map_right"), map_optionsR);

var mapIsMoving = false;

var mapMover = function(a, b) {
  if (mapIsMoving) { return; }
  mapIsMoving = true;

  var lng,
      newZoom = a.getZoom(),
      otherZoom = b.getZoom(),
      bounds = a.getBounds(),
      southWest = bounds.getSouthWest(),
      northEast = bounds.getNorthEast(),
      center = a.getCenter(),
      lat = center.lat();

  if (a == mapL) {
    lng = ((southWest.lng() + northEast.lng()) / 2) - (southWest.lng() - northEast.lng());
  } else {
    lng = ((southWest.lng() + northEast.lng()) / 2) + (southWest.lng() - northEast.lng());
  };

  b.setCenter(new google.maps.LatLng(lat, lng));
  if (newZoom !== otherZoom) {
    b.setZoom(newZoom);
  };
  mapIsMoving = false;
};

google.maps.event.addListenerOnce(mapR, "tilesloaded", function() {
   var lng,
      bounds = mapL.getBounds(),
      southWest = bounds.getSouthWest(),
      center = mapL.getCenter(),
      distance = center.lng() - southWest.lng(),
      lat = center.lat();

  var lngL = staticLng - distance;
  var lngR = staticLng + distance;

  mapL.setCenter(new google.maps.LatLng(lat, lngL));
  mapR.setCenter(new google.maps.LatLng(lat, lngR));

  google.maps.event.addListener(mapL, "center_changed", function() {
    mapMover(mapL, mapR);
  });

  google.maps.event.addListener(mapR, "center_changed", function() {
    mapMover(mapR, mapL);
  });

  google.maps.event.addListener(mapL, "zoom_changed", function() {
    window.setTimeout(function() {
      mapMover(mapL, mapR);
    });
  });

  google.maps.event.addListener(mapR, "zoom_changed", function() {
    mapMover(mapR, mapL);
  });

  google.maps.event.addListener(mapR, "maptypeid_changed", function() {
    mapL.setMapTypeId(mapR.getMapTypeId());
  });
});