var colorList = [
    , '#002BFF'
    , '#00FFE8'
    , '#42FF00'
    , '#B6FF00'
    , '#D8FF00'
    , '#F3FF00'
    , '#FF8700'
    , '#FF4D00'
    , '#FF0000'
  ]


var queryEarthquakesUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
var queryTechtonicPlatesUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

// Perform two GETs in sequence, first for the earthquake
d3.json(queryEarthquakesUrl, function(earthquakeResponse) {
  // And then for the techtonicPlates
  d3.json(queryTechtonicPlatesUrl, function(techtonicResponse) {
    // After we get both responses, send the earthquakeResponse.features object 
    // and all of the techtonicResponse to the createFeatures function
    createFeatures(earthquakeResponse.features, techtonicResponse);
  });
})

function createFeatures(earthquakeData, techtonicData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place time and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title + "</h3><hr>" 
    + "<p>" + new Date(feature.properties.time) + "</p>"
    );
  }

  // Ascertain the fillColor based on the magnitude
  function fillColor (mag) {
    if (mag > 7.0) {
      return colorList[8]  
    }
    else if (mag > 6.0) {
      return colorList[7]
    }
    else if (mag > 5.0) {
      return colorList[6]
    }
    else if (mag > 4.0) {
      return colorList[5]
    }
    else if (mag > 3.0) {
      return colorList[4]
    }
    else if (mag > 2.0) {
      return colorList[3]
    }
    else if (mag > 1.0) {
      return colorList[2]
    }
    else if (mag > 0.0) {
      return colorList[1]
    }
    else {
      return colorList[0]
    }
  }

  //function to draw the circles
  function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: feature.properties.mag * 3,
      fillColor: fillColor(feature.properties.mag),
      color: "#000",
      weight: 0.2,
      opacity: 1,
      fillOpacity: 1
    });
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // use pointToLayer to draw the circles
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer
    , onEachFeature: onEachFeature
  });

  //Define the techtonic plates layer
  var techtonic = L.geoJSON(techtonicData, {
    style: {
      "color": colorList[7],
      "weight": 5,
      "opacity": 0.65
    }
  })

  // Define streetmap and darkmap layers
  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 16,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 16,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetMap,
    "Satellite": satelliteMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
    , Techtonic: techtonic
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satelliteMap, earthquakes, techtonic]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earthquake Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + 0 + "</div>" +
        "<div class=\"max\">" + (colorList.length - 1) + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    colorList.forEach(color => {
      labels.push("<li style=\"background-color: " + color + "\"></li>");
    });

    div.innerHTML += "<ul> " + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

}
