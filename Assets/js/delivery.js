// Foursquare API
const FOURSQUARE_API_SERVER = "https://api.foursquare.com";
const FOURSQUARE_SEARCH_API = "/v2/venues/search";
const FOURSQUARE_CLIENT_ID = "VT3I5R4QZ1YUEHNVHGUKIW1ARP1GWIRBCR4WIJ1JF2TBEY3O";
const FOURSQUARE_CLIENT_SECRET =
  "5P0PFJJHDH2SMT3HFOQ2EKZXODJPBNQCQTSA4MYV1PM5UW34";

// Yelp API
const YELP_API_SERVER = "https://api.yelp.com";
const YELP_SEARCH_API = "/v3/businesses/search";
const YELP_API_KEY =
  "8jWJ9apB_OyS-ZUbLamBcg-z73aohgWKVXJD9YO1dk_k4zUomzLlhg5ys8WsinIBcNvUq_bv2IE6sciYZN1EyIQmeuSMDGWOFFvEuna481l4r4gQT7Y3pL3Q9k2EYHYx";

// Elements
const restaurantList = $("#restaurantList");
const restaurantSelection = $("#restaurantSelection");

// Variables
var cityObj = {
  cityName: "",
  cityDisplayName: "",
  cityLatitude: "",
  cityLongitude: "",
  cityVenueCategoryName: "",
  cityVenueCategoryShortName: "",
  cityVenues: [],
};

var venuesObj = {
  venueName: "",
  venueAddress: "",
  venueCity: "",
  venueState: "",
  venuePostalCode: "",
  venueCountry: "",
  venueDeliveryId: "",
  venueDeliveryProviderName: "",
};

// Show message
function showMessage(message) {
  console.log(message);
}

// Get food information
function getFoodInformation() {
  //
  //
}

// Get delivery information
function getDeliveryInformation() {
  //
  var apiURL = FOURSQUARE_API_SERVER + FOURSQUARE_SEARCH_API;
  apiURL = apiURL + "?near=Overland Park,KS&query=Wendys&v=20210424";
  apiURL = apiURL + "&client_id=" + FOURSQUARE_CLIENT_ID;
  apiURL = apiURL + "&client_secret=" + FOURSQUARE_CLIENT_SECRET;
  //
  fetch(apiURL)
    //
    .then(function (response) {
      //
      if (response.ok) {
        //
        return response.json();
        //
      } else {
        //
        // Handle no response error
        //
        showMessage("Could not retrieve any data");
        //
      }
      //
    })
    .then(function (data) {
      //
      // Store city object
      //
      // console.log(data);
      //
      cityObj = {
        cityName: "",
        cityDisplayName: "",
        cityLatitude: "",
        cityLongitude: "",
        cityVenueCategoryName: "",
        cityVenueCategoryShortName: "",
        cityVenues: [],
      };
      //
      cityObj.cityName = data.response.geocode.feature.name;
      cityObj.cityDisplayName = data.response.geocode.feature.displayName;
      cityObj.cityLatitude = data.response.geocode.feature.geometry.center.lat;
      cityObj.cityLongitude = data.response.geocode.feature.geometry.center.lng;
      cityObj.cityVenueCategoryName =
        data.response.venues[0].categories[0].name;
      cityObj.cityVenueCategoryShortName =
        data.response.venues[0].categories[0].shortName;
      //
      // Store city venues
      //
      for (var i = 0, l = data.response.venues.length; i < l; i++) {
        //
        venuesObj = {
          venueName: "",
          venueAddress: "",
          venueCity: "",
          venueState: "",
          venuePostalCode: "",
          venueCountry: "",
          venueDeliveryId: "",
          venueDeliveryProviderName: "",
        };
        //
        venuesObj.venueName = data.response.venues[i].name;
        venuesObj.venueAddress = data.response.venues[i].location.address;
        venuesObj.venueCity = data.response.venues[i].location.city;
        venuesObj.venueState = data.response.venues[i].location.state;
        venuesObj.venuePostalCode = data.response.venues[i].location.postalCode;
        venuesObj.venueCountry = data.response.venues[i].location.country;
        //
        // Some venues have no delivery, so check for that
        //
        if (data.response.venues[i].hasOwnProperty("delivery")) {
          //
          venuesObj.venueDeliveryId = data.response.venues[i].delivery.id;
          venuesObj.venueDeliveryProviderName =
            data.response.venues[i].delivery.provider.name;
          //
        } else {
          //
          venuesObj.venueDeliveryId = "";
          venuesObj.venueDeliveryProviderName = "";
          //
        }
        //
        cityObj.cityVenues.push(venuesObj);
        //
      }
      //
      renderDeliveryInformation();
      //
    })
    .catch(function (error) {
      //
      // Handle other errors
      //
      showMessage(`Error: ${error}`);
      //
    });
  //
}

// Render delivery information
function renderDeliveryInformation() {
  //
  var tableEl,
    tableHeaderEl,
    tableBodyEl,
    tableRowEl,
    tableColEl,
    tableCaptionEl,
    tableButtonEl;
  //
  tableEl = $("<table>");
  tableEl.addClass("table table-hover");
  //
  // tableCaptionEl = $("<caption>");
  // tableCaptionEl.text("List of restaurants");
  // tableCaptionEl.appendTo(tableEl);
  //
  tableHeaderEl = $("<thead>");
  tableRowEl = $("<tr>");
  //
  // #
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  tableColEl.text("#");
  tableColEl.appendTo(tableRowEl);
  //
  // Restaurant name
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  tableColEl.text("Restaurant Name");
  tableColEl.appendTo(tableRowEl);
  //
  // Category
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  tableColEl.text("Category");
  tableColEl.appendTo(tableRowEl);
  //
  // Address
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  tableColEl.text("Address");
  tableColEl.appendTo(tableRowEl);
  //
  // City
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  tableColEl.text("City");
  tableColEl.appendTo(tableRowEl);
  //
  tableRowEl.appendTo(tableHeaderEl);
  //
  tableHeaderEl.appendTo(tableEl);
  //
  tableBodyEl = $("<tbody>");
  //
  for (var i = 0, l = cityObj.cityVenues.length; i < l; i++) {
    //
    tableRowEl = $("<tr>");
    //
    tableColEl = $("<td>");
    tableColEl.attr("scope", "row");
    tableColEl.addClass("py-4");
    tableColEl.text(i + 1);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(cityObj.cityVenues[i].venueName);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(cityObj.cityVenueCategoryName);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    //
    tableButtonEl = $("<button>");
    tableButtonEl.attr("name", cityObj.cityVenues[i].venueName);
    tableButtonEl.attr("category", cityObj.cityVenueCategoryName);
    //
    if (cityObj.cityVenues[i].venueDeliveryProviderName != "") {
      //
      tableButtonEl.attr("delivery", "Y");
      tableButtonEl.attr("contact", " ");
      //
    } else {
      //
      tableButtonEl.attr("delivery", "N");
      tableButtonEl.attr("contact", "N");
      //
    }
    //
    tableButtonEl.attr("address", cityObj.cityVenues[i].venueAddress);
    //
    tableButtonEl.addClass("btn btn-link text-info");
    tableButtonEl.text(cityObj.cityVenues[i].venueAddress);
    tableButtonEl.appendTo(tableColEl);
    //
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(cityObj.cityVenues[i].venueCity);
    tableColEl.appendTo(tableRowEl);
    //
    tableRowEl.appendTo(tableBodyEl);
    //
  }
  //
  tableBodyEl.appendTo(tableEl);
  //
  tableEl.appendTo(restaurantList);
  //
}

// Render restaurant information
function renderRestaurantInformation() {
  //
  $("#venueName").text($(this).attr("name"));
  $("#cityVenueCategoryName").text($(this).attr("category"));
  $("#venueAddress").text($(this).attr("address"));
  $("#venueDeliveryYN").text($(this).attr("delivery"));
  $("#venueDeliveryNoContact").text($(this).attr("contact"));
  //
}

// Get city venue by selection
function getCityVenueBySelection() {
  //
  console.log($(this));
  //
}

// Event listeners
// restaurantList.on("click", "button", getCityVenueBySelection);
restaurantList.on("click", "button", renderRestaurantInformation);

// Rock & Roll
//getFoodInformation();
getDeliveryInformation();

//
// Get delivery information
function YELPgetDeliveryInformation(headers) {
  //
  var apiURL =
    YELP_API_SERVER + YELP_SEARCH_API + "?term=mexican&location=66221&price=3";
  //
  var headers = {
    method: "GET",
    // mode: "no-cors",
    header: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Host: YELP_API_SERVER,
      Authorization: "Bearer " + YELP_API_KEY,
    },
  };
  //
  fetch(apiURL, headers)
    //
    .then(function (response) {
      //
      if (response.ok) {
        //
        return response.json();
        //
      } else {
        //
        // Handle no response error
        //
        showMessage("Could not retrieve any data");
        //
      }
      //
    })
    .then(function (data) {
      //
      // Clear the cityWeather object
      //
      console.log(data);
      //
    })
    .catch(function (error) {
      //
      // Handle other errors
      //
      showMessage(`Error: ${error}`);
      //
    });
  //
}
