// Elements
const topDiv = $("#map");
const bottomDiv = $("#bottomDiv");
const inputDiv = $("#inputDiv");
const buttonDiv = $("#results");
const searchButton = $("#searchButton");

//places API
const CLIENT_ID = "0VET4EDLZ1PWXH3DJ5EPT2IPRJHAWAYHPHFB2PLJQEQDCJNV";
const CLIENT_SECRET = "BANDE4Y5UCVVVFXYIAGZJVFA0JLMPRMIBAMK2G4ECFYAWJL0";

const credentials = {
  "x-app-id": "3a3f663b",
  "x-app-key": "dcb0f2394e224dd571c331c9f7960d2a",
};

var Url = "https://trackapi.nutritionix.com/v2/locations";
var center = {};
var searchTextInput = $("#searchText").val().trim();
var descriptionInput = $("#description").val().trim();

var zipCodeInput = $("#zipcode").val().trim();
var radiusInput = $("#radius").val().trim();

var map;
var service;
var infowindow;

function initMap() {
  let coordinates = {
    lat: 0.0,
    long: 0.0,
  };
  if (navigator.geolocation) {
    //If we can get the location...we change the coordinates WHERE YOU ACTUALLY ARE
    navigator.geolocation.getCurrentPosition(function (position) {
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      renderMap(coordinates);
    });
  } else {
    //DEFAULT LOCATION
    renderMap(coordinates);
  }
}

function renderMap(coordinates) {
  const city = new google.maps.LatLng(coordinates.lat, coordinates.long);
  map = new google.maps.Map(document.getElementById("map"), {
    center: city,
    zoom: 15,
  });
  var request = {
    location: city,
    radius: "5000", // meters
    type: ["restaurant"],
    openNow: true,
    fields: [
      "name",
      "business_status",
      "icon",
      "types",
      "rating",
      "reviews",
      "formatted_phone_number",
      "address_component",
      "opening_hours",
      "geometry",
      "vicinity",
      "website",
      "url",
      "address_components",
      "price_level",
      "reviews",
    ],
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    console.log(results);
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}
function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

// Event Listener
searchButton.on("click", renderMap);

// need to create a div with the
// location logo-location name-location distance-location address
// Get API Function
// function getApi() {
//   //
//   var searchText = $("#searchText").val().trim();
//   var description = $("#description").val().trim();

//   var zipCode = $("#zipcode").val().trim();
//   var radius = $("#radius").val().trim();
//   //

//   var userInput = {
//     type: searchText,
//     foodDescription: description,
//     zipCodeInput: zipCode,
//     radiusInput: radius,
//   };

//   //
//   if (userInput.radiusInput === "") {
//     alert("You have not inputted a mile radius!");
//     window.location.reload();
//   }
//   console.log(userInput);
//   //
//   searchText = $("#searchText").val("");
//   description = $("#description").val("");
//   zipCode = $("#zipcode").val("");
//   radius = $("#radius").val("");

//   //
//   $.ajax({
//     url: Url,
//     headers: credentials,
//     method: "GET",
//     contentType: "application/json",
//     data: {
//       ll: centerObj.lat + "," + centerObj.lng,
//       distance: userInput.radiusInput + "mi",
//       limit: 20,
//     },
//   }).then(function (response) {
//     var brand_ids = response.locations.map(function (location) {
//       return location.brand_ids;
//     });
//     console.log(response);
//   });
// }
