// Constants
const NUT_API_SERVER = "https://api.nutritionix.com";
const NUT_API_END_POINT = "/v2/search/instant";
const credentials = {
  "x-app-id": "bd961765",
  "x-app-key": "d4c8c6000b2d32f39325a13e6b36af32",
};
// Elements
const topDiv = $("#topDiv");
const bottomDiv = $("#bottomDiv");
const inputDiv = $("#inputDiv");
const buttonDiv = $("#results");
const searchButton = $("#searchButton");

$.ajax({
  url: "https://trackapi.nutritionix.com/v2/locations",
  headers: credentials,
  method: "GET",
  contentType: "application/json",
  data: {
    ll: zip[0].lat + "," + zip[0].lon,
    distance: "5km",
    limit: 20,
  },
})
  .then(function (response) {
    var brand_ids = response.locations.map(function (location) {
      return location.brand_id;
    });
​
    console.log(response);
​
    return $.ajax({
      url: "https://trackapi.nutritionix.com/v2/search/instant",
      headers: credentials,
      method: "GET",
      contentType: "application/json",
      data: {
        query: queryInput || "salad",
        branded: true,
        self: false,
        common: true,
        brand_ids: JSON.stringify(brand_ids),
      },
    });
  })
  .then(function (data) {
    console.log(data);
  
    for (var i=0, l = data.branded.length; i < l; i++) {
      brandedObj = {
        restaurantName: "",
        restaurantItemName: "",
        foodName: "",
        foodCalories: "",
        nixItemId: "",
        photoEl: "",
        servingSize: "",
        servingUnit: "",
      };
      brandedObj.restaurantName = data.branded[i].brand_name;
      brandedObj.restaurantItemName = data.branded[i].brand_name_item_name;
      brandedObj.foodName = data.branded[i].food_name;
      brandedObj.foodCalories = data.branded[i].nf_calories;
      brandedObj.nixItemId = data.branded[i].nix_item_id;
      brandedObj.photoEl = data.branded[i].photo.thumb;
      brandedObj.servingSize = data.branded[i].serving_qty;
      brandedObj.servingUnit = data.branded[i].serving_unit;

      renderBrandedNutrition(brandedObj)
    }
    for (var i = 0, l =data.common.length; i < l; i++) {
      commonObj = {
        foodName: "",
        foodCalories: "",
        nixItemId: "",
        photoEl: "",
        servingSize: "",
        servingUnit: "",
      };
      commonObj.foodName = data.common[i].food_name;
      commonObj.foodCalories = data.common[i].nf_calories;
      commonObj.nixItemId = data.common[i].nix_item_id;
      commonObj.photoEl = data.common[i].photo.thumb;
      commonObj.servingSize = data.common[i].serving_qty;
      commonObj.servingUnit = data.common[i].serving_unit;

      renderCommonNutrition(commonObj);
    }
  })
  .catch(function (response) {
    console.error(response);
    $("#Results").html().response;
  });

