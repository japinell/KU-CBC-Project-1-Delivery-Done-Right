//
var postalCode = {
  zip: "",
  name: "",
  lat: "",
  lng: "",
  country: "",
};

// Get location by postal code
function getLocationByPostalCode(postal) {
  //
  var apiURL =
    $("body").data("OWEATHER_API_SERVER") + $("body").data("OWEATHER_API_ZIP");
  apiURL = apiURL + "?zip=" + postal;
  apiURL = apiURL + "&appid=" + $("body").data("OWEATHER_API_KEY");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiURL, false);
  xhr.send();
  return JSON.parse(xhr.response);
  //
}

export { getLocationByPostalCode };
