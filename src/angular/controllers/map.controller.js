// Mapbox doesn't need its own var - it automatically attaches to Leaflet's L.
require('mapbox.js');
// Use Awesome Markers lib to produce font-icon map markers
require('drmonty-leaflet-awesome-markers');
// Marker clustering
require('leaflet.markercluster');

var VersionControl = require('./../../utility/leaflet-version-control.js');

// Configurable cluster icon colors.
require('./../../utility/leaflet-divicon-color.js');

var controllers = angular.module('controllers');

controllers.controller('MapCtrl', ['$scope', '$rootScope', '$location', '$translate', 'SiteSpecificConfig', 'Search','_', 'Language', 'Markers', 'Map', function ($scope, $rootScope, $location, $translate, SiteSpecificConfig, Search, _, Language, Markers, Map) {
    // Initialize the map, using Affinity Bridge's mapbox account.
    var map = L.mapbox.map('mapContainer', null, { minZoom: 3 });
    Map.set(map);

    L.mapbox.accessToken = SiteSpecificConfig.mapboxAccessToken;

    if (SiteSpecificConfig.mapTileAPI === null || SiteSpecificConfig.mapTileAPI === undefined) {
        L.mapbox.tileLayer('affinitybridge.ia7h38nj').addTo(map);
    } else {
        L.tileLayer(SiteSpecificConfig.mapTileAPI).addTo(map);
    }

    // Add version number to map corner.
    map.addControl(new VersionControl(SiteSpecificConfig.version));

    map.locate()
        .on('locationfound', function(e) {
            var myIcon = L.divIcon({ className: 'you-are-here' });
            myIcon.options.iconSize = [15, 35];
            var locationMarker = L.marker(e.latlng, { icon: myIcon }).addTo(map);
            $translate('YOU_ARE_HERE').then(function (text) {
                var myIconPopup = L.popup({ offset: [0, -20] })
                    .setContent(text);
                locationMarker.bindPopup(myIconPopup);
            });
        })
        .on('locationerror', function(e) {
            console.info(e.message);
        });

    // On initial load see if we have bounding box info on the query string.
    // If yes, use it and then unset it.
    // If no, we'll user the points to fix to zoom.
    var parameters = $location.search();
    if (_.has(parameters, 'bbox')){
        var bbox = JSON.parse(decodeURI(parameters.bbox));
        delete parameters.bbox;
        map.fitBounds([[bbox._northEast.lat, bbox._northEast.lng], [bbox._southWest.lat, bbox._southWest.lng]]);
    }

    /* TODO: Make a inputs dynamic
    *
    *   1. Need users location input
    *   2. Need proximity radius
    */

        // Geolocation object to input user's location and the selected locations
        // var geoLocationObject = {
        //     latitude: 35.7333333333333,
        //     longitude: 30.2,
        //     radius: 1000000
        // }

        // Filter by proximity
        // Search.filterByProxmity(geoLocationObject);

    // Initialize the empty layer for the markers, and add it to the map.
    var clusterLayer = new L.MarkerClusterGroup({
        zoomToBoundsOnClick: false,
        spiderfyDistanceMultiplier: 2,
        showCoverageOnHover: false,
        iconCreateFunction: function(cluster) {
            var childCount = cluster.getChildCount();

            var c = ' marker-cluster-';
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }

            return new L.DivIcon.CustomColor({
                html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40),
                clusterCount: childCount,
                clusterColors: SiteSpecificConfig.clusterColors
            });
        }
    }).addTo(map);
    // When user clicks on a cluster, zoom directly to its bounds.  If we don't do this,
    // they have to click repeatedly to zoom in enough for the cluster to spiderfy.
    clusterLayer.on('clusterclick', function (a) {
        // Close any popups that are open already. This helps if we came via "show on map" link,
        // which spawns an unbound popup.
        map.closePopup();
        // If the markers in this cluster are all in the same place, spiderfy on click.
        var bounds = a.layer.getBounds();
        if (bounds._northEast.equals(bounds._southWest)) {
            a.layer.spiderfy();
        } else {
            // If the markers in this cluster are NOT all in the same place, zoom in on them.
            a.layer.zoomToBounds();
        }
    });
    $scope.$on('markers.add', function (event, marker) {
        marker.addTo(clusterLayer);
    });

    // TODO: don't make global but needed now for use in search controller
    var polygonLayer = L.geoJson();

    // TODO temporarily removed.
    if (SiteSpecificConfig.includePolygons) {
        map.addLayer(polygonLayer);
    }

    jQuery.getJSON( "polygons.json", function( polygonData ) {
        // Create the polygon layer and add to the map.
        polygonLayer.addData(polygonData);

        polygonLayer.getLayers().forEach(function(f) {
            f.setStyle({
                opacity: 0.3
            });

            L.DomEvent.addListener(f, 'mouseover', function(e) {
                //if(this._activeFilters.indexOf(polygonLayer.getLayerId(e.target)) < 0) {
                    e.target.setStyle({
                        opacity: 0.5
                    });
                //}
            }, this);

            L.DomEvent.addListener(f, 'mouseout', function(e) {
                //if(this._activeFilters.indexOf(polygonLayer.getLayerId(e.target)) < 0) {
                    e.target.setStyle({
                        opacity: 0.3
                    });
                //}
            }, this);
        });
    });

    $rootScope.$on('FILTER_CHANGED', function(event, results) {
        // Clear all the map markers.
        clusterLayer.clearLayers();

        if (results.length > 0) {
            // Loop through the filtered results, adding the markers back to the map.
            results.forEach(function (feature) {
                // Add the filtered markers back to the map's data layer
                feature.marker.addTo(clusterLayer);
            });

            if (typeof bbox !== 'undefined'){
              bbox = undefined;
            } else {
              map.fitBounds(clusterLayer.getBounds(), { maxZoom: 13 });
            }
        }
    });

    // Doing some stuff for the results views here because this controller is active
    // for the whole application
    var mc = $('#mapContainer');

    // if the user is on mobile and has the map only partly showing, when they start to scroll
    // we want to hide the map and show the whole results container since it's too small to try to user
    // when the map is showing
    $("#serviceList").scroll(_.throttle(function() {
        if (!mc.hasClass('map-hide')) {
            window.toggleMap();
        }
    }, 10));

    // HACK: using a global here so we can use an onclick="toggleMap()"
    window.toggleMap = function () {
        mc.toggleClass('map-hide');
        map.invalidateSize();
    }
}]);
