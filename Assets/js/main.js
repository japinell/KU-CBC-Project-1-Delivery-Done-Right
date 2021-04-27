// Nutritionix API
const NUT_API_SERVER = "https://api.nutritionix.com";
const NUT_API_END_POINT = "/v1-1/search";
const NUT_API_KEY = "dcb0f2394e224dd571c331c9f7960d2a";
const NUT_API_ID = "3a3f663b";

// Open Weather Map API
const OWEATHER_API_SERVER = "https://api.openweathermap.org";
const OWEATHER_API_WEATHER = "/data/2.5/weather";
const OWEATHER_API_ZIP = "/geo/1.0/zip";
const OWEATHER_API_REV = "/geo/1.0/reverse";
const OWEATHER_API_KEY = "9dc0ecf3100ca1f98d7b3462ccb6b3df";

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

// Google API
const CLIENT_ID = "0VET4EDLZ1PWXH3DJ5EPT2IPRJHAWAYHPHFB2PLJQEQDCJNV";
const CLIENT_SECRET = "BANDE4Y5UCVVVFXYIAGZJVFA0JLMPRMIBAMK2G4ECFYAWJL0";
//
const credentials = {
  "x-app-id": "3a3f663b",
  "x-app-key": "dcb0f2394e224dd571c331c9f7960d2a",
};

// Elements
const topDiv = $("#map");
const bottomDiv = $("#bottomDiv");
const inputDiv = $("#inputDiv");
const buttonDiv = $("#results");
const searchButton = $("#searchButton");
const venueListName = $("#venueListName");
//
const venuesList = $("#venuesList");
const restaurantSelection = $("#restaurantSelection");

//

var center = {};

var queryInput = $("#description").val().trim();

var zipCodeInput = $("#zipcode").val().trim();
var radiusInput = $("#radius").val().trim();

var city;
var map;
var service;
var infowindow;

var coordinates = {
  lat: 0.0,
  lng: 0.0,
};

var postalCode = {
  code: "",
  name: "",
  lat: "",
  lng: "",
  country: "",
};

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
  venueId: "",
  venueName: "",
  venueAddress: "",
  venueCity: "",
  venueState: "",
  venuePostalCode: "",
  venueCountry: "",
  venueCategoryId: "",
  venueCategoryName: "",
  venueDeliveryId: "",
  venueDeliveryProviderName: "",
  venueIcon: "",
};

var search = {
  postalCode: "",
  cityName: "",
  state: "",
  radius: "",
  foodType: "",
  query: "",
};

// Show message
function showMessage(message) {
  //
  console.log(message);
  $("#exampleModalCenter").modal("show", {
    keyboard: true,
    focus: true,
  });
  //
}

// Get location by postal code
function getLocationByPostalCode(postal) {
  //
  var apiURL = OWEATHER_API_SERVER + OWEATHER_API_ZIP;
  apiURL = apiURL + "?zip=" + postal;
  apiURL = apiURL + "&appid=" + OWEATHER_API_KEY;
  //
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiURL, false);
  xhr.send();
  //
  return JSON.parse(xhr.response);
  //
}

// Get location by coordinates
function getLocationByCoordinates(lat, lng) {
  //
  var apiURL = OWEATHER_API_SERVER + OWEATHER_API_REV;
  apiURL = apiURL + "?lat=" + lat;
  apiURL = apiURL + "&lon=" + lng;
  apiURL = apiURL + "&limit=1";
  apiURL = apiURL + "&appid=" + OWEATHER_API_KEY;
  //
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiURL, false);
  xhr.send();
  //
  return JSON.parse(xhr.response);
  //
}

//
function initMap() {
  //
  if (navigator.geolocation) {
    // If we can get the location...we change the coordinates WHERE YOU ACTUALLY ARE
    navigator.geolocation.getCurrentPosition(function (position) {
      //
      coordinates.lat = position.coords.latitude;
      coordinates.lng = position.coords.longitude;
      //
      renderMap();

      //
    });
  } else {
    //
    renderMap();
    //
  }
  //
}

//
function renderMap() {
  //
  var rad, zip, qry;
  //
  zipCodeInput = $("#zipcode").val().trim();
  radiusInput = $("#radius").val().trim();
  queryInput = $("#description").val().trim();
  //
  if (zipCodeInput === "") {
    //
    zip = getLocationByCoordinates(coordinates.lat, coordinates.lng);
    city = new google.maps.LatLng(coordinates.lat, coordinates.lng);
    //
    search.postalCode = "";
    search.cityName = zip[0].name;
    search.state = zip[0].state;
    //
  } else {
    //
    zip = getLocationByPostalCode(zipCodeInput);
    city = new google.maps.LatLng(zip.lat, zip.lon);
    //
    search.postalCode = zip.code;
    search.cityName = zip.name;
    search.state = zip.country;
    //
  }
  //
  rad = radiusInput === "" ? 5000 : radiusInput;
  qry = queryInput === "" ? "" : queryInput;
  //
  search.radius = rad;

  search.query = qry;
  //
  getDeliveryInformation(
    search.cityName + "," + search.state,
    search.radius,
    search.query
  );
  //
  map = new google.maps.Map(document.getElementById("map"), {
    center: city,
    zoom: 15,
  });
  //
  var request = {
    location: city,
    radius: rad, // meters
    keyword: search.query,
    type: ["restaurant"],
    // name: "Wendy's",
    openNow: true,
    fields: [
      "name",
      /*"business_status",
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
        "reviews",*/
    ],
  };
  //
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
  //
}

// Create markers for each place
function callback(results, status) {
  //
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //
    for (var i = 0; i < results.length; i++) {
      //
      createMarker(results[i]);
      //console.log(results[i]);
      //
    }
    //
  }
  //
}

// Create infoWindow
function createMarker(place) {
  //
  if (!place.geometry || !place.geometry.location) return;
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
  });

  //
  google.maps.event.addListener(marker, "click", () => {
    //
    infowindow = new google.maps.InfoWindow({
      content: place.name,
    });
    //
    infowindow.open(map, marker);
    //
  });
  //
}

// Get delivery information
function getDeliveryInformation(city, radius, query) {
  //
  var apiURL = FOURSQUARE_API_SERVER + FOURSQUARE_SEARCH_API;
  apiURL = apiURL + "?near=" + city;
  apiURL = apiURL + "&radius=" + radius;
  apiURL = apiURL + "&categoryId=4d4b7105d754a06374d81259"; // Food
  apiURL = apiURL + "&query=" + query;
  apiURL = apiURL + "&v=20210424";
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
      if (data.response.venues.length > 0) {
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
        cityObj.cityDisplayName = data.response.geocode.feature.highlightedName;
        cityObj.cityLatitude =
          data.response.geocode.feature.geometry.center.lat;
        cityObj.cityLongitude =
          data.response.geocode.feature.geometry.center.lng;
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
            venueId: "",
            venueName: "",
            venueAddress: "",
            venueCity: "",
            venueState: "",
            venuePostalCode: "",
            venueCountry: "",
            venueCategoryId: "",
            venueCategoryName: "",
            venueDeliveryId: "",
            venueDeliveryProviderName: "",
            venueIcon: "",
          };
          //
          venuesObj.venueId = data.response.venues[i].id;
          venuesObj.venueName = data.response.venues[i].name;
          venuesObj.venueAddress = data.response.venues[i].location.address;
          venuesObj.venueCity = data.response.venues[i].location.city;
          venuesObj.venueState = data.response.venues[i].location.state;
          venuesObj.venuePostalCode =
            data.response.venues[i].location.postalCode;
          venuesObj.venueCountry = data.response.venues[i].location.country;
          //
          if (
            data.response.venues[i].hasOwnProperty("categories") &&
            data.response.venues[i].categories.length > 0
          ) {
            //
            venuesObj.venueCategoryId =
              data.response.venues[i].categories[0].id;
            venuesObj.venueCategoryName =
              data.response.venues[i].categories[0].shortName;
            //
          } else {
            //
            venuesObj.venueCategoryId = "";
            venuesObj.venueCategoryName = "";
            //
          }
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
          if (
            data.response.venues[i].hasOwnProperty("categories") &&
            data.response.venues[i].categories.length > 0 &&
            data.response.venues[i].categories[0].hasOwnProperty("icon")
          ) {
            //
            venuesObj.venueIcon =
              data.response.venues[i].categories[0].icon.prefix +
              "32" +
              data.response.venues[i].categories[0].icon.suffix;
            //
          } else {
            //
            venuesObj.venueIcon = "";
            //
          }
          //
          cityObj.cityVenues.push(venuesObj);
          //
        }
        //
        renderDeliveryInformation();
        //
      } else {
        //
        showMessage(`No data retrieved for that venue`);
        //
      }
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
    tableButtonEl,
    tableImgEl;
  //
  venuesList.empty();
  //
  venueListName.html(" - " + cityObj.cityDisplayName);
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
  tableColEl.addClass("text-center");
  tableColEl.text("#");
  tableColEl.appendTo(tableRowEl);
  //
  // Icon
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  // tableColEl.addClass("col-1");
  tableColEl.text("");
  tableColEl.appendTo(tableRowEl);
  //
  // Name
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  // tableColEl.addClass("col-4");
  tableColEl.text("Venue Name");
  tableColEl.appendTo(tableRowEl);
  //
  // Category
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  // tableColEl.addClass("col-2");
  tableColEl.text("Category");
  tableColEl.appendTo(tableRowEl);
  //
  // Address
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  // tableColEl.addClass("col-2");
  tableColEl.text("Address");
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
    tableColEl.addClass("py-4 text-right");
    tableColEl.text(i + 1);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-2");
    //
    if (cityObj.cityVenues[i].venueIcon !== "") {
      //
      tableButtonEl = $("<button>");
      tableButtonEl.attr("id", cityObj.cityVenues[i].venueId);
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
      tableButtonEl.addClass("btn btn-info");
      //
      tableImgEl = $("<img>");
      tableImgEl.attr("src", cityObj.cityVenues[i].venueIcon);
      tableImgEl.addClass("bg-info");
      tableImgEl.appendTo(tableButtonEl);
      //
      tableButtonEl.appendTo(tableColEl);
      //
    }
    //
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(cityObj.cityVenues[i].venueName);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(cityObj.cityVenues[i].venueCategoryName);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(cityObj.cityVenues[i].venueAddress);
    tableColEl.appendTo(tableRowEl);
    //
    tableRowEl.appendTo(tableBodyEl);
    //
  }
  //
  tableBodyEl.appendTo(tableEl);
  //
  tableEl.appendTo(venuesList);
  //
}

// Render venue information
function renderVenueInformation() {
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
// venuesList.on("click", "button", getCityVenueBySelection);
searchButton.on("click", renderMap);
venuesList.on("click", "button", renderVenueInformation);

// Rock & Roll
//getDeliveryInformation();
function getApi() {
  //

  //
  $.ajax({
    url: "https://trackapi.nutritionix.com/v2/locations",
    headers: credentials,
    method: "GET",
    contentType: "application/json",
    data: {
      ll: center.lat + "," + center.lng,
      distance: "5km",
      limit: 20,
    },
  })
    .then(function (response) {
      var brand_ids = response.locations.map(function (location) {
        return location.brand_id;
      });

      console.log(response);

      return $.ajax({
        url: "https://trackapi.nutritionix.com/v2/search/instant",
        headers: credentials,
        method: "GET",
        contentType: "application/json",
        data: {
          query: "salad",
          branded: true,
          self: false,
          common: false,
          brand_ids: JSON.stringify(brand_ids),
        },
      });
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (response) {
      console.error(response);
      $("#error").show().JSONView(response.responseJSON);
    });
}

//$("#exampleModalCenter").modal({ show: false });

$("#showModal").click(function () {
  $("#exampleModalCenter").modal({ show: true });
});
