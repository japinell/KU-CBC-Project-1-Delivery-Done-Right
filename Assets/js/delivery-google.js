// Constants
const NUMBER_OF_RECORDS = 10;

// Elements
const restaurantList = $("#restaurantList");
const restaurantSelection = $("#restaurantSelection");

// Variables
var city, map, request, service;
var coordinates = {
  lat: 0.0,
  long: 0.0,
};

//
var placesObj = {
  id: "",
  name: "",
  status: "",
  openNow: "",
  rating: "",
  userRatingTotal: "",
  priceLevel: "",
  photos: [],
  types: [],
  //
  // Additional details
  //
  phoneNumber: "",
  address: "",
  googleUrl: "",
  website: "",
  openHours: [],
  reviews: [],
  //
};
var photoObj = {
  url: "",
};
var typeObj = {
  name: "",
};
//
// Additional details
//
var openHourObj = {
  openAt: "",
  closeAt: "",
  text: "",
};
var reviewObj = {
  author: "",
  url: "",
  rating: "",
  when: "",
  text: "",
};
//
var place = {};
var places = [];

// Initialize Google API
function initGoogleAPI() {
  //
  if (navigator.geolocation) {
    //
    navigator.geolocation.getCurrentPosition(function (position) {
      //
      coordinates.lat = position.coords.latitude;
      coordinates.long = position.coords.longitude;
      //
      callNearBySearchAPI();
      //
    });
  } else {
    //
    callNearBySearchAPI();
    //
  }
  //
}

// Call near by search API
function callNearBySearchAPI() {
  //
  city = new google.maps.LatLng(coordinates.lat, coordinates.long);
  map = new google.maps.Map(document.getElementById("map"), {
    center: city,
    zoom: 15,
  });
  //
  request = {
    location: city,
    radius: "5000", // meters
    type: ["restaurant"],
    // openNow: true,
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
  //
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, getGooglePlacesData);
  //
}

// Call get details API
function callGetDetailsAPI2() {
  //
  console.log(places);
  //
  for (var i = 0, l = places.length; i < l; i++) {
    //
    place = places[i];
    //
    setTimeout(function () {
      //
      request = {
        location: city,
        placeId: place.id,
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
      //
      service = new google.maps.places.PlacesService(map);
      service.getDetails(request, function (results, status) {
        //
        getGooglePlacesDetails(results, status);
        //
      });
      //
    }, 1000);
    //
  }
  //
}

// Call get details API
function callGetDetailsAPI(i) {
  //
  request = {
    location: city,
    placeId: places[i].id,
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
  //
  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, function (results, status) {
    //
    getGooglePlacesDetails(results, status, i);
    //
  });
  //
}

//
function getGooglePlacesData(results, status) {
  //
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //
    for (var i = 0, l = results.length; i < l; i++) {
      //
      placesObj = {
        id: "",
        name: "",
        status: "",
        openNow: "",
        rating: "",
        userRatingTotal: "",
        priceLevel: "",
        photos: [],
        types: [],
        phoneNumber: "",
        address: "",
        googleUrl: "",
        website: "",
        openHours: [],
        reviews: [],
      };
      //
      // Place data
      //
      placesObj.id = results[i].place_id;
      placesObj.name = results[i].name;
      placesObj.status = results[i].business_status;
      //   placesObj.openNow = results[i].opening_hours.isOpen;
      placesObj.rating = results[i].rating;
      placesObj.userRatingTotal = results[i].user_ratings_total;
      placesObj.priceLevel = results[i].price_level;
      //
      // Photos
      //
      for (var j = 0, m = results[i].photos.length; j < m; j++) {
        //
        photoObj = {
          url: "",
        };
        //
        photoObj.url = results[i].photos[j].html_attributions[0];
        //
        placesObj.photos.push(photoObj);
        //
      }
      //
      // Types
      //
      for (var k = 0, n = results[i].types.length; k < n; k++) {
        //
        typeObj = {
          name: "",
        };
        //
        typeObj.name = results[i].types[k];
        //
        placesObj.types.push(typeObj);
        //
      }
      //
      places.push(placesObj);
      callGetDetailsAPI(i);
      //
    }
    //
  }
  //
}

// Get places details
function getGooglePlacesDetails(details, status, i) {
  //
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //
    // Get more details
    //
    places[i].phoneNumber = details.formatted_phone_number;
    places[i].address = details.vicinity;
    places[i].googleUrl = details.url;
    places[i].website = details.website;
    //
    // Open hours
    //
    for (var k = 0, n = details.opening_hours.periods.length; k < n; k++) {
      //
      openHourObj = {
        openAt: "",
        closeAt: "",
        text: "",
      };
      //
      if (details.opening_hours.periods[k].hasOwnProperty("hours")) {
        //
        openHourObj.openAt = details.opening_hours.periods[k].open.hours;
        openHourObj.closeAt = details.opening_hours.periods[k].close.hours;
        //
      } else {
        //
        openHourObj.openAt = "N/A";
        openHourObj.closeAt = "N/A";
        //
      }
      //
      openHourObj.text = details.opening_hours.weekday_text[k];
      //
      places[i].openHours.push(openHourObj);
      //
    }
    //
    // Reviews
    //
    for (var k = 0, n = details.reviews.length; k < n; k++) {
      //
      reviewObj = {
        author: "",
        url: "",
        rating: "",
        when: "",
        text: "",
      };
      //
      reviewObj.author = details.reviews[k].author_name;
      reviewObj.url = details.reviews[k].author_url;
      reviewObj.rating = details.reviews[k].rating;
      reviewObj.when = details.reviews[k].relative_time_description;
      reviewObj.text = details.reviews[k].text;
      //
      places[i].reviews.push(reviewObj);
      //
    }
    //
  }
  //
}

// Render Google Places data
function renderGooglePlacesData() {
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
  // Status
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  tableColEl.text("Status");
  tableColEl.appendTo(tableRowEl);
  //
  // Rating
  //
  tableColEl = $("<th>");
  tableColEl.attr("scope", "col");
  tableColEl.text("Rating");
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
  for (var i = 0, l = places.length; i < l; i++) {
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
    tableColEl.text(places[0].name);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(places[i].status);
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    //
    tableButtonEl = $("<button>");
    tableButtonEl.attr("name", places[i].name);
    tableButtonEl.attr("rating", places[i].status);
    //
    if (places[i].types.indexOf("meal_takeaway")) {
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
    tableButtonEl.attr("price-level", places[i].priceLevel);
    //
    tableButtonEl.addClass("btn btn-link text-info");
    tableButtonEl.text(places[i].name);
    tableButtonEl.appendTo(tableColEl);
    //
    tableColEl.appendTo(tableRowEl);
    //
    tableColEl = $("<td>");
    tableColEl.addClass("py-4");
    tableColEl.text(places[i].name);
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

// Get Google Places data
function getGooglePlacesData2(results, status) {
  //
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //
    for (var i = 0, l = results.length; i < l; i++) {
      //
      placesObj = {
        id: "",
        name: "",
        status: "",
        openNow: "",
        rating: "",
        userRatingTotal: "",
        priceLevel: "",
        photos: [],
        types: [],
      };
      //
      // Place data
      //
      placesObj.id = results[i].place_id;
      placesObj.name = results[i].name;
      placesObj.status = results[i].business_status;
      //   placesObj.openNow = results[i].opening_hours.isOpen;
      placesObj.rating = results[i].rating;
      placesObj.userRatingTotal = results[i].user_ratings_total;
      placesObj.priceLevel = results[i].price_level;
      //
      // Photos
      //
      for (var j = 0, m = results[i].photos.length; j < m; j++) {
        //
        photoObj = {
          url: "",
        };
        //
        photoObj.url = results[i].photos[j].html_attributions[0];
        //
        placesObj.photos.push(photoObj);
        //
      }
      //
      // Types
      //
      for (var k = 0, n = results[i].types.length; k < n; k++) {
        //
        typeObj = {
          name: "",
        };
        //
        typeObj.name = results[i].types[k];
        //
        placesObj.types.push(typeObj);
        //
      }
      //
      places.push(placesObj);
      //
    }
    //
    renderGooglePlacesData();
    //
  }
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

// Rock & Roll
initGoogleAPI();

//
restaurantList.on("click", "button", renderRestaurantInformation);
//
