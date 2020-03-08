
var geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(geoURL, function (data) {
  createFeatures(data.features);
});


var legendColor = [
  "#92ed42",
  "#ceed42",
  "#fad419",
  "#fab319",
  "#fa7719",
  "#fa4219"
];

function createFeatures(earthquakeData) {
  function onEachEarthquake(feature, layer) {
    layer.bindPopup(`<h3> ${feature.properties.place} </h3><hr><p> 
      Magnitude: ${feature.properties.mag}</p>`);
  }

  function circleSize(feature) {
    var style = {
      radius: feature.properties.mag * 5,
      fillOpacity: 0.8,
      fillColor: legendColor[Math.floor(parseInt(feature.properties.mag))],
      color: "brown",
      weight: 0.5
    }
    return style;
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, layer) {
      return L.circleMarker(layer, circleSize(feature));
    },
    onEachFeature: onEachEarthquake
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    // "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    // Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  createLegend(myMap);
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

function createLegend(myMap) {
// Set up the legend
var legend = L.control({ position: "bottomleft" });
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");

  // Create lists and svgs for colors to legend
  div.innerHTML = `<h3>Magnitude</h3>
  <ul>
  <li>
  <svg width="22" height="20">
    <rect width="20" height="20" style="fill:${legendColor[0]};"/>
  </svg>0-1</li>
  <li>  
  <svg width="22" height="20">
    <rect width="20" height="20" style="fill:${legendColor[1]};"/>
  </svg>1-2</li>
  <li>
  <svg width="22" height="20">
    <rect width="20" height="20" style="fill:${legendColor[2]};"/>
  </svg>2-3</li>
  <li>
  <svg width="22" height="20">
    <rect width="20" height="20" style="fill:${legendColor[3]};"/>
  </svg>3-4</li>
  <li>
  <svg width="22" height="20">
    <rect width="20" height="20" style="fill:${legendColor[4]};"/>
  </svg>4-5</li>
  <li>
  <svg width="22" height="20">
    <rect width="20" height="20" style="fill:${legendColor[5]};"/>
  </svg>5+</li>
  </ul>`

  return div;
};

// Adding legend to the map
legend.addTo(myMap);
}
