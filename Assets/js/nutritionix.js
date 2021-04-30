const credentials = {
  "x-app-id": "3a3f663b",
  "x-app-key": "dcb0f2394e224dd571c331c9f7960d2a",
};

var center = {
  lat: 39.099724,
  lng: -94.578331,
};

// Event Listener

// need to create a div with the
// location logo-location name-location distance-location address
$("#searchButton").on("submit", getApi(center));
// // Get API Function
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
