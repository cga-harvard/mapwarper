

//function used with osm mapnik tiles
function osm_getTileURL(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    var limit = Math.pow(2, z);

    if (y < 0 || y >= limit) {
        return OpenLayers.Util.getImagesLocation() + "404.png";
    } else {
        x = ((x % limit) + limit) % limit;
        return this.url + z + "/" + x + "/" + y + "." + this.type;
    }
}
//use with
function get_tilesathome_osm_url (bounds) {
    var res = this.map.getResolution();
    var x = Math.round ((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round ((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    var limit = Math.pow(2, z);

    if (y < 0 || y >= limit)
    {
        return null;
    }
    else
    {
        x = ((x % limit) + limit) % limit;
        var path = z + "/" + x + "/" + y + "." + this.type;
        var url = this.url;
        url="http://tah.openstreetmap.org/Tiles/tile/"
        if (url instanceof Array) {
            url = this.selectUrl(path, url);
        }
        return url + path;
    }
}

var osma = new OpenLayers.Layer.TMS(
    "Osmarender",
    ["http://a.tah.openstreetmap.org/Tiles/tile/", "http://b.tah.openstreetmap.org/Tiles/tile/", "http://c.tah.openstreetmap.org/Tiles/tile/"],
    {
        type:'png',
        getURL: get_tilesathome_osm_url,
        displayOutsideMaxExtent: true
    }, {
        'buffer':1
    } );

var mapnik = new OpenLayers.Layer.TMS("OSM Mapnik", "http://tile.openstreetmap.org/", {
    type: 'png',
    getURL: osm_getTileURL,
    displayOutsideMaxExtent: true,
    transitionEffect: 'resize',
    attribution: '<a href="http://www.openstreetmap.org/">OpenStreetMap</a>'
});


var jpl_wms = new OpenLayers.Layer.WMS("NASA Landsat 7", "http://t1.hypercube.telascience.org/cgi-bin/landsat7", {
    layers: "landsat7"
});

var oamlayer = new OpenLayers.Layer.WMS( "OpenAerialMap",
   "http://openaerialmap.org/wms/",
   {layers: "world"}, { gutter: 15, buffer:0});

var googleSat = new OpenLayers.Layer.Google( "Google Satellite", {type: G_SATELLITE_MAP, 'sphericalMercator': true});
var googleMaps = new OpenLayers.Layer.Google( "Google Streets", { 'sphericalMercator': true});
var googleHybrid = new OpenLayers.Layer.Google("Google Hybrid", {type: G_HYBRID_MAP, 'sphericalMercator': true});

/*********************************************************/
/* Code for displaying Ditu/China version of Google Maps */
/*********************************************************/

  var dituProj = new google.maps.MercatorProjection(20);

  dituProj.fromLatLngToPixel = function(latlng, zoom) {
    //newLatLng = new google.maps.LatLng(latlng.lat() + 0.00143, latlng.lng() + 0.00613);
    //newLatLng = new google.maps.LatLng(latlng.lat(), latlng.lng());
    //return (G_NORMAL_MAP.getProjection()).fromLatLngToPixel(newLatLng, zoom);
    return (G_NORMAL_MAP.getProjection()).fromLatLngToPixel(latlng, zoom);
  }

  dituProj.fromPixelToLatLng = function(pixel, zoom, unbounded) {
    if (isNaN(pixel.x) || isNaN(pixel.x)) {
      // En caso de llamada con parametros incorrectos!
      alert("Pixel: " + pixel + ", zoom: " + zoom + ", unbounded: " + unbounded);
      return map.getCenter();
    }
    var dituLatLng;
    if (unbounded === undefined) {
      dituLatLng = (G_NORMAL_MAP.getProjection()).fromPixelToLatLng(pixel, zoom);
    }
    else {
      dituLatLng = (G_NORMAL_MAP.getProjection()).fromPixelToLatLng(pixel, zoom, unbounded);
    }
    //newLatLng = new google.maps.LatLng(dituLatLng.lat() - 0.00143, dituLatLng.lng() - 0.00613);
    newLatLng = new google.maps.LatLng(dituLatLng.lat());

    return newLatLng;
  }


  dituGetTileUrl = function(a, b){
    //b = this.maxResolution() - b;
    b = b;
   
    var server = (a.x + a.y) % 4;
    //return "http://mt" + server + ".google.cn/mt?v=cn1.0&hl=zh-CN&x=" + a.x + "&y=" + a.y + "&zoom=" + b;
    return "http://mt" + server + ".google.cn/vt/lyrs=m@170000000&hl=zh-CN&x=" + a.x + "&y=" + a.y + "&z=" + b + "&s=Galil";
  } 
  

  var tilelayers = [new google.maps.TileLayer(new google.maps.CopyrightCollection("Map: http://ditu.google.cn"), 1, 20)];
  tilelayers[0].getTileUrl = dituGetTileUrl;
  tilelayers[0].getCopyright = function(a,b) {
    return {prefix:"Map: ", copyrightTexts:["http://ditu.google.cn"]};
  }
  
var dituMap = new google.maps.MapType(tilelayers, dituProj, "DITU", {errorMessage:"Error loading images from Google DITU"});
var dituStreet = new OpenLayers.Layer.Google( "China Streets", {type:dituMap, 'sphericalMercator': true});
