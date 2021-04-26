const credentials = {
  "x-app-id": "3a3f663b",
  "x-app-key": "dcb0f2394e224dd571c331c9f7960d2a",
};

var Url = "https://trackapi.nutritionix.com/v2/search/instant";
var center = {};

var city;
var map;
var service;
var infowindow;

var coordinates = {
  lat: 39.099724,
  lng: -94.578331,
};

var postalCode = {
  zip: "",
  name: "",
  lat: "",
  lng: "",
  country: "",
};

// Event Listener
searchButton.on("click", renderMap);

// need to create a div with the
// location logo-location name-location distance-location address
// searchButton.on("click", getApi());
// // Get API Function
function getApi() {
  //

  var queryInput = $("#description").val().trim();

  var zipCode = $("#zipcode").val().trim();
  var radius = $("#radius").val().trim();
  //
  console.log(queryInput);

  //

  //
  $.ajax({
    url: Url,
    headers: credentials,
    method: "GET",
    contentType: "application/json",
  }).then(function (response) {
    console.log(response);
  });
}
