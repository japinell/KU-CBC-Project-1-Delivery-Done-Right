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
function processSearch() {
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

// Test comment from Rigo
// Test Comment
// Test Comment 2
// Test Comment by Joel
// Another comment by Rigo
