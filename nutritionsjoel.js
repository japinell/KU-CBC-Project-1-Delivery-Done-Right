// Constants
const NUT_API_SERVER = "https://api.nutritionix.com";
const NUT_API_END_POINT = "/v2/search/instant";
const CREDENTIALS = {
  "x-app-id": "bd961765",
  "x-app-key": "d4c8c6000b2d32f39325a13e6b36af32",
  "x-remote-user-id": 0,
};
// Elements
const topDiv = $("#topDiv");
const bottomDiv = $("#bottomDiv");
const inputDiv = $("#inputDiv");
const buttonDiv = $("#results");
const searchButton = $("#searchButton");

var searchInput = $(searchButton).data;

for (i = 0; i < localStorage.length; i++);
var foodQuery = localStorage.getItem(i);

if ((searchInput = "")) {
  console.log(searchInput);
} else {
  fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${food_name}`, {
    headers: {
      "x-app-id": "bd961765",
      "x-app-key": "d4c8c6000b2d32f39325a13e6b36af32",
    },
    method: "GET",
  }).then(function (response) {
    var food = response.data.foods[0];
    if (food) {
      food.display_name = $filter("ucwords")(food.metadata.original_input || food.food_name);
      food.append(bottomDiv);
    }
    return food;
  });
}
/*(function () {
  "use strict";

  config.$inject = ["$stateProvider", "baseUrl", "locales"];
  angular.module("food", ["ja.qr", "foods.locale", "localization"]).config(config);

  function config($stateProvider, baseUrl, locales) {
    $stateProvider.state("site.food", {
      url:
        "/{locale:" +
        locales
          .map(function (l) {
            return l.url;
          })
          .join("|") +
        "}/food/{raw:raw}/:natural_query/:serving",
      params: {
        raw: { value: null, squash: true },
        locale: { value: null, squash: true },
        serving: { value: null, squash: true },
      },
      metaTags: {
        title: "Calories in {{item.display_name}}",
        description:
          "Calories, fat, protein, and carbohydrate values for for {{item.display_name}} and other related foods.",
        properties: {},
      },
      templateUrl: baseUrl + "/nix_app/food/food.html",
      controller: "foodCtrl as vm",
      resolve: {
        diets: [
          "claimsPromise",
          function diets(claimsPromise) {
            return claimsPromise;
          },
        ],
        taxonomy: [
          "taxonomyPromise",
          function taxonomy(taxonomyPromise) {
            return taxonomyPromise;
          },
        ],
        item: [
          "nixTrackApiClient",
          "$stateParams",
          "$filter",
          "$rootScope",
          "GroceryFactory",
          function item(nixTrackApiClient, $stateParams, $filter, $rootScope, GroceryFactory) {
            if (!$stateParams.natural_query) {
              return null;
            }
            var query = $stateParams.natural_query;
            if ($stateParams.serving) {
              var serving = $stateParams.serving
                .split("-")
                .filter(function (word) {
                  return word.length === 1 || query.indexOf(word) === -1;
                })
                .join("-");
              query = serving + " " + query;
            }

            return nixTrackApiClient.natural
              .nutrients({
                query: query.replace(/-/g, " "),
                include_subrecipe: true,
                use_raw_foods: !!$stateParams.raw,
                line_delimited: true,
                locale: _.get(
                  _.find(locales, { label: ($stateParams.locale || "").toUpperCase() }),
                  "lc"
                ),
                claims: true,
                taxonomy: true,
              })
              .then(function (response) {
                var food = response.data.foods[0];
                if (food) {
                  food.display_name = $filter("ucwords")(
                    food.metadata.original_input || food.food_name
                  );

                  if (food.sub_recipe) {
                    var subRecipeWeight = food.sub_recipe.reduce(function (total, subFood) {
                      return total + subFood.serving_weight;
                    }, 0);
                    var factor = food.serving_weight_grams / subRecipeWeight;

                    food.sub_recipe.forEach(function (subFood) {
                      subFood.calories = subFood.calories * factor;
                      subFood.serving_weight = subFood.serving_weight * factor;
                      subFood.serving_qty = subFood.serving_qty * factor;
                    });
                  }

                  return food;
                }
              })
              .then(function (food) {
                if (food.source === 1) {
                  return GroceryFactory.getTagData(food.tags.tag_id)
                    .then(function (tagData) {
                      food.photo.thumb = tagData.tag_image;
                      food.photo.attribution_url = tagData.tag_image_attribution_url;
                      food.photo.user_name = tagData.tag_image_creative_commons_user_name;
                      food.photo.license_type = tagData.tag_image_license_type;
                    })
                    .then(function () {
                      return food;
                    })
                    ["catch"](function () {
                      return food;
                    });
                }

                return food;
              })
              .then(function (food) {
                if (!food.photo.license_type) {
                  food.photo = {
                    thumb: $rootScope.images.apple.grey,
                    highres: $rootScope.images.apple.grey,
                  };
                }

                return food;
              })
              ["catch"](function () {
                return null;
              });
          },
        ],
        publicLists: [
          "item",
          "nixTrackApiClient",
          function publicLists(item, nixTrackApiClient) {
            return (
              item &&
              nixTrackApiClient("/search/public_lists", {
                params: {
                  food: item.food_name,
                  limit: 4,
                },
              })
                .then(function (response) {
                  return response.data.lists;
                })
                ["catch"](function () {
                  return null;
                })
            );
          },
        ],
      },
      onEnter: [
        "$anchorScroll",
        function onEnter($anchorScroll) {
          $anchorScroll();
        },
      ],
      data: {
        cssClass: "bottomDiv",
      },
    });
  }
})();
("use strict"); */
