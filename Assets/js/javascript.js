// Constants
// Another comment here
const NUT_API_SERVER = "https://api.nutritionix.com";
const NUT_API_END_POINT = "/v1-1/search";
const NUT_API_KEY = "dcb0f2394e224dd571c331c9f7960d2a";
const NUT_API_ID = "3a3f663b";
// Elements
const topDiv = $("#topDiv");
const bottomDiv = $("#bottomDiv");
const inputDiv = $("#inputDiv");
const buttonDiv = $("#results");
const searchButton = $("#searchButton");

// Variables
var currentDay = dayjs().format("(MM/DD/YYYY)");
var searchHistory = {};
var NUMBER_OF_SEARCHES = searchHistory.length;

var storedSearch = JSON.parse(localStorage.getItem("food")) || [];

// Process Search Function
function processSearch(event) {
  //

  //
  var searchText = $("#searchText").val().trim();
  var description = $("#description").val().trim();

  var zipCode = $("#zipcode").val().trim();
  var radius = $("#radius").val().trim();
  //

  var userInput = {
    type: searchText,
    foodDescription: description,
    zipCodeInput: zipCode,
    radiusInput: radius,
  };
  console.log(userInput);
  searchText = $("#searchText").val("");
  description = $("#description").val("");
  zipCode = $("#zipcode").val("");
  radius = $("#radius").val("");
  //
}

// Event Listener
searchButton.on("click", processSearch);
// Adds Buttons to the list
function addSearchHistory(searchCity) {
  //
  if (!(searchHistory.indexOf(searchCity) >= 0)) {
    //
    // Insert it
    storedSearch.unshift(searchCity);
    NUMBER_OF_SEARCHES = searchHistory.length;
    //
    localStorage.setItem("food", JSON.stringify(storedSearch));
  }
  //
}
