//
// Nutritionix API
//
const NUT_API_SERVER = "https://api.nutritionix.com";
const NUT_API_END_POINT = "/v1-1/search";
const NUT_API_KEY = "dcb0f2394e224dd571c331c9f7960d2a";
const NUT_API_ID = "3a3f663b";
//
// Open Weather Map API
//
const OWEATHER_API_SERVER = "https://api.openweathermap.org";
const OWEATHER_API_WEATHER = "/data/2.5/weather";
const OWEATHER_API_ZIP = "/geo/1.0/zip";
const OWEATHER_API_REV = "/geo/1.0/reverse";
const OWEATHER_API_KEY = "9dc0ecf3100ca1f98d7b3462ccb6b3df";
//
// Foursquare API
//
const FOURSQUARE_API_SERVER = "https://api.foursquare.com";
const FOURSQUARE_SEARCH_API = "/v2/venues/search";
const FOURSQUARE_CLIENT_ID = "VT3I5R4QZ1YUEHNVHGUKIW1ARP1GWIRBCR4WIJ1JF2TBEY3O";
const FOURSQUARE_CLIENT_SECRET =
  "5P0PFJJHDH2SMT3HFOQ2EKZXODJPBNQCQTSA4MYV1PM5UW34";
//
// Yelp API
//
const YELP_API_SERVER = "https://api.yelp.com";
const YELP_SEARCH_API = "/v3/businesses/search";
const YELP_API_KEY =
  "8jWJ9apB_OyS-ZUbLamBcg-z73aohgWKVXJD9YO1dk_k4zUomzLlhg5ys8WsinIBcNvUq_bv2IE6sciYZN1EyIQmeuSMDGWOFFvEuna481l4r4gQT7Y3pL3Q9k2EYHYx";
//
// Google API
//
const CLIENT_ID = "0VET4EDLZ1PWXH3DJ5EPT2IPRJHAWAYHPHFB2PLJQEQDCJNV";
const CLIENT_SECRET = "BANDE4Y5UCVVVFXYIAGZJVFA0JLMPRMIBAMK2G4ECFYAWJL0";
//
// Nutritionix API
//
const NUTRITIONIX_API_SERVER = "https://trackapi.nutritionix.com";
const NUTRITIONIX_LOCATIONS_API = "/v2/locations";
const NUTRITIONIX_INSTANT_API = "/v2/search/instant";
const NUTRITIONIX_APP_ID = "3a3f663b";
const NUTRITIONIX_APP_KEY = "dcb0f2394e224dd571c331c9f7960d2a";
const credentials = {
  "x-app-id": "3a3f663b",
  "x-app-key": "dcb0f2394e224dd571c331c9f7960d2a",
};
//
// Elements
//
const topDiv = $("#map");
const inputDiv = $("#inputDiv");
const buttonDiv = $("#results");
const brandedDiv = $("#branded");
const searchButton = $("#searchButton");
const venueListName = $("#venueListName");
//
const venuesList = $("#venuesList");
const venueInformation = $("#venueInformation");
const nutritionInformation = $("#nutritionInformation");
//
// Variables
//
var queryInput = $("#description").val().trim();
var zipCodeInput = $("#zipcode").val().trim();
var radiusInput = $("#radius").val().trim();
//
var city;
var map;
var service;
var infowindow;
var center = {};
var coordinates = {
  lat: 0.0,
  lng: 0.0,
};
//
var postalCode = {
  code: "",
  name: "",
  lat: "",
  lng: "",
  country: "",
};
//
// Object variables
//
var cityObj = {
  cityName: "",
  cityDisplayName: "",
  cityLatitude: "",
  cityLongitude: "",
  cityVenueCategoryName: "",
  cityVenueCategoryShortName: "",
  cityVenues: [],
};
//
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
//
var brandedObj = {
  restaurantName: "",
  restaurantItemName: "",
  foodName: "",
  foodCalories: "",
  nixItemId: "",
  photoEl: "",
  servingSize: "",
  servingUnit: "",
  brandedFoods: [],
};
//
var commonObj = {
  foodName: "",
  foodCalories: "",
  nixItemId: "",
  photoEl: "",
  servingSize: "",
  servingUnit: "",
};
//
var search = {
  postalCode: "",
  cityName: "",
  state: "",
  radius: "",
  foodType: "",
  query: "",
};
//
// Show message
//
function showMessage(message) {
  //
  console.log(message);
  $("#exampleModalCenter").modal("show", {
    keyboard: true,
    focus: true,
  });
  //
}
//
// Get location by postal code
//
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
//
// Get location by coordinates
//
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
// Initialize Google map
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
// Render Google map
//
function renderMap() {
  //
  var cty, rad, zip, qry;
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
    search.postalCode = zip.code;
    city = new google.maps.LatLng(zip.lat, zip.lon);
    //
    zip = getLocationByCoordinates(zip.lat, zip.lon);
    //
    search.cityName = zip[0].name;
    search.state = zip[0].state;
    //
  }
  //
  rad = radiusInput === "" ? 5000 : radiusInput;
  qry = queryInput === "" ? "" : queryInput;
  //
  search.radius = rad;
  search.query = qry;
  //
  //Nutrition API Call
  //
  $.ajax({
    url: NUTRITIONIX_API_SERVER + NUTRITIONIX_LOCATIONS_API, // "https://trackapi.nutritionix.com/v2/locations",
    headers: {
      "x-app-id": NUTRITIONIX_APP_ID,
      "x-app-key": NUTRITIONIX_APP_KEY,
    }, // credentials,
    method: "GET",
    contentType: "application/json",
    data: {
      ll: zip[0].lat + "," + zip[0].lon,
      distance: search.radius + "m",
      limit: 50,
    },
    //
  })
    .then(function (response) {
      //
      var brand_ids = response.locations.map(function (location) {
        return location.brand_id;
      });

      console.log(response);
      var locations = [];
      var locationsObj = {};
      for (var i = 0, l = response.locations.length; i < l; i++) {
        locationsObj = {
          restaurantName: "",
          restaurantAddress: "",
          restaurantCity: "",
          restaurantState: "",
          restaurantZip: "",
          restaurantLat: "",
          restaurantLng: "",
          distanceAway: "",
          phoneNumber: "",
          nixBrandId: "",
        };
        locationsObj.restaurantName = response.locations[i].name;
        locationsObj.restaurantAddress = response.locations[i].address;
        locationsObj.restaurantCity = response.locations[i].city;
        locationsObj.restaurantState = response.locations[i].state;
        locationsObj.restaurantZip = response.locations[i].zip;
        locationsObj.restaurantLat = response.locations[i].lat;
        locationsObj.restaurantLng = response.locations[i].lng;
        locationsObj.distanceAway = response.locations[i].distance_km;
        locationsObj.phoneNumber = response.locations[i].phone;
        locationsObj.nixBrandId = response.locations[i].brand_id;

        locations.push(locationsObj);
      }

      console.log("Locations Info:", locations);
      return $.ajax({
        url: NUTRITIONIX_API_SERVER + NUTRITIONIX_INSTANT_API, // "https://trackapi.nutritionix.com/v2/search/instant",
        headers: {
          "x-app-id": NUTRITIONIX_APP_ID,
          "x-app-key": NUTRITIONIX_APP_KEY,
        }, // credentials,
        method: "GET",
        contentType: "application/json",
        data: {
          query: queryInput || "salad", // default
          branded: true,
          self: false,
          common: true,
          common_restaurant: true,
          detailed: true,
          claims: true,
          branded_food_name_only: true,
          brand_ids: JSON.stringify(brand_ids),
        },
      });
      //
    })
    .then(function (data) {
      //
      //console.log(data);
      var restaurants = [];
      //
      for (var i = 0, l = data.branded.length; i < l; i++) {
        //
        brandedObj = {
          restaurantName: "",
          restaurantAddress: "",
          restaurantItemName: "",
          foodName: "",
          foodCalories: "",
          nixItemId: "",
          nixBrandId: "",
          photoEl: "",
          servingSize: "",
          servingUnit: "",
        };
        //
        brandedObj.restaurantName = data.branded[i].brand_name;
        brandedObj.restaurantItemName = data.branded[i].brand_name_item_name;
        brandedObj.foodName = data.branded[i].food_name;
        brandedObj.foodCalories = data.branded[i].nf_calories;
        brandedObj.nixItemId = data.branded[i].nix_item_id;
        brandedObj.nixBrandId = data.branded[i].nix_brand_id;
        brandedObj.photoEl = data.branded[i].photo.thumb;
        brandedObj.servingSize = data.branded[i].serving_qty;
        brandedObj.servingUnit = data.branded[i].serving_unit;
        //
        restaurants.push(brandedObj);
        //
      }

      var commonFoods = [];
      for (var i = 0, l = data.common.length; i < l; i++) {
        commonObj = {
          foodName: "",
          foodCalories: "",
          nixItemId: "",
          photoEl: "",
          servingSize: "",
          servingUnit: "",
        };
        commonObj.foodName = data.common[i].food_name;
        commonObj.photoEl = data.common[i].photo.thumb;
        commonObj.servingSize = data.common[i].serving_qty;
        commonObj.servingUnit = data.common[i].serving_unit;

        commonFoods.push(commonObj);
      }
      renderBrandedNutrition(restaurants, commonFoods);
    })
    .catch(function (response) {
      //
      //console.error(response);
      $("#nutritionInformation").html().response;
      //
    });
  //

  getDeliveryInformation(
    //
    search.cityName + "," + search.state,
    search.radius,
    search.query
    //
  );
  //
  map = new google.maps.Map(document.getElementById("map"), {
    center: city,
    zoom: 15,
  });
  //
  var request = {
    location: city,
    radius: search.radius, // meters
    keyword: search.query,
    type: ["restaurant"],
    // name: "Wendy's",
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
//
// Create markers for each place
//
function callback(results, status) {
  console.log(results);
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
function renderBrandedNutrition(restaurants, commonFoods) {
  console.log("Found Branded Restaurants-----------", restaurants);
  console.log("Found Common Foods-----", commonFoods);
  var tableEl2,
    tableHeaderEl2,
    tableBodyEl2,
    tableRowEl2,
    tableColEl2,
    tableImgEl2,
    tableButtonEl2;
  //
  nutritionInformation.empty();
  //
  tableEl2 = $("<table>");
  tableEl2.addClass("table table-hover");
  //
  tableHeaderEl2 = $("<thead>");
  tableRowEl2 = $("<tr>");
  //
  // #
  //
  tableColEl2 = $("<th>");
  tableColEl2.attr("scope", "col");
  tableColEl2.addClass("text-center");
  tableColEl2.text("#");
  tableColEl2.appendTo(tableRowEl2);
  //
  // Icon
  //
  tableColEl2 = $("<th>");
  tableColEl2.attr("scope", "col");
  // tableColEl2.addClass("col-1");
  tableColEl2.text("");
  tableColEl2.appendTo(tableRowEl2);
  //
  // Name
  //
  tableColEl2 = $("<th>");
  tableColEl2.attr("scope", "col");
  // tableColEl2.addClass("col-4");
  tableColEl2.text("Venue Name");
  tableColEl2.appendTo(tableRowEl2);
  //
  // Food type
  //
  tableColEl2 = $("<th>");
  tableColEl2.attr("scope", "col");
  // tableColEl2.addClass("col-2");
  tableColEl2.text("Food Type");
  tableColEl2.appendTo(tableRowEl2);
  //
  // Calories
  //
  tableColEl2 = $("<th>");
  tableColEl2.attr("scope", "col");
  // tableColEl2.addClass("col-2");
  tableColEl2.text("Calories (serving size)");
  tableColEl2.appendTo(tableRowEl2);
  //
  tableRowEl2.appendTo(tableHeaderEl2);
  //
  tableHeaderEl2.appendTo(tableEl2);
  //
  tableBodyEl2 = $("<tbody>");
  //
  for (var i = 0, l = restaurants.length; i < l; i++) {
    //
    tableRowEl2 = $("<tr>");
    //
    tableColEl2 = $("<th>");
    tableColEl2 = $("<td>");
    tableColEl2.attr("scope", "row");
    tableColEl2.addClass("py-4 text-right");
    tableColEl2.text(i + 1);
    tableColEl2.appendTo(tableRowEl2);
    //
    tableColEl2 = $("<th>");
    tableButtonEl2 = $("<button>");
    tableButtonEl2.addClass("btn btn-success nutritionbtn"); //
    tableImgEl2 = $("<img>");
    tableImgEl2.attr("src", commonFoods[i].photoEl);
    tableImgEl2.addClass("bg-success nutritionimg");
    tableImgEl2.appendTo(tableButtonEl2);
    //
    tableButtonEl2.appendTo(tableColEl2);
    tableColEl2.appendTo(tableRowEl2);
    tableColEl2.addClass("py-2");
    //
    tableColEl2 = $("<th>");
    tableColEl2 = $("<td>");
    tableColEl2.addClass("py-4");
    tableColEl2.text(restaurants[i].restaurantName);
    tableColEl2.appendTo(tableRowEl2);
    //
    tableColEl2 = $("<th>");
    tableColEl2 = $("<td>");
    tableColEl2.addClass("py-4");
    tableColEl2.text(restaurants[i].foodName);
    tableColEl2.appendTo(tableRowEl2);
    //
    tableColEl2 = $("<th>");
    tableColEl2 = $("<td>");
    tableColEl2.addClass("py-4");
    tableColEl2.text(
      restaurants[i].foodCalories +
        " Cal. per serving " +
        "(" +
        restaurants[i].servingSize +
        " " +
        restaurants[i].servingUnit +
        ")"
    );
    tableColEl2.appendTo(tableRowEl2);
    //
    tableRowEl2.appendTo(tableBodyEl2);
    //
  }
  //
  tableBodyEl2.appendTo(tableEl2);
  //
  tableEl2.appendTo(nutritionInformation);
  //
}
// Create infoWindow
//
function createMarker(place) {
  //
  if (!place.geometry || !place.geometry.location) return;
  //
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
  });
  //
  google.maps.event.addListener(marker, "click", () => {
    //
    infowindow = new google.maps.InfoWindow({
      content:
        "<img src=" +
        place.icon +
        ">" +
        "<br>" +
        "<b>" +
        place.name +
        ": " +
        "</b>" +
        "<br>" +
        place.vicinity,
    });
    //
    infowindow.open(map, marker);
    //
  });
  //
}
//
// Get delivery information
//
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
      // console.log(data);
      //
      if (data.response.venues.length > 0) {
        //
        // Store city object
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
//
// Render delivery information
//
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
//
// Render venue information
//
function renderVenueInformation() {
  //
  $("#venueName").text($(this).attr("name"));
  $("#venueCategory").text($(this).attr("category"));
  $("#venueAddress").text($(this).attr("address"));
  $("#venueDeliveryYN").text($(this).attr("delivery"));
  $("#venueDeliveryNoContact").text($(this).attr("contact"));
  //
}
//
// Get city venue by selection
//
function getCityVenueBySelection() {
  //
  //console.log($(this));
  $("#showVenueInformation").trigger("click");
  //
}
//
// Event listeners
venuesList.on("click", "button", getCityVenueBySelection);
searchButton.on("click", renderMap);
venuesList.on("click", "button", renderVenueInformation);

// Rock & Roll
//getDeliveryInformation();
//
$("#showVenueInformation").hide();
$("#venuesList").collapse({ show: true });
$("#showVenueList").on("click", function () {
  //
  if ($(this).hasClass("collapsed") || $(this).hasClass("collapsing")) {
    //
    $(this).children().removeClass("fa-chevron-down");
    $(this).children().addClass("fa-chevron-up");
    //
  } else {
    //
    $(this).children().removeClass("fa-chevron-up");
    $(this).children().addClass("fa-chevron-down");
    //
  }
  //
});
//
