// Nutritionix API
const NUT_API_SERVER = "https://api.nutritionix.com";
const NUT_API_END_POINT = "/v1-1/search";
const NUT_API_KEY = "dcb0f2394e224dd571c331c9f7960d2a";
const NUT_API_ID = "3a3f663b";

// Open Weather Map API
const OWEATHER_API_SERVER = "https://api.openweathermap.org";
const OWEATHER_API_WEATHER = "/data/2.5/weather";
const OWEATHER_API_ZIP = "/geo/1.0/zip";
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

//
// Make the constants available throughout all the scripts
//
$("body").data("NUT_API_SERVER", NUT_API_SERVER);
$("body").data("NUT_API_END_POINT", NUT_API_END_POINT);
$("body").data("NUT_API_KEY", NUT_API_KEY);
$("body").data("NUT_API_ID", NUT_API_ID);
//
$("body").data("OWEATHER_API_SERVER", OWEATHER_API_SERVER);
$("body").data("OWEATHER_API_WEATHER", OWEATHER_API_WEATHER);
$("body").data("OWEATHER_API_ZIP", OWEATHER_API_ZIP);
$("body").data("OWEATHER_API_KEY", OWEATHER_API_KEY);
//
$("body").data("FOURSQUARE_API_SERVER", FOURSQUARE_API_SERVER);
$("body").data("FOURSQUARE_SEARCH_API", FOURSQUARE_SEARCH_API);
$("body").data("FOURSQUARE_CLIENT_ID", FOURSQUARE_CLIENT_ID);
$("body").data("FOURSQUARE_CLIENT_SECRET", FOURSQUARE_CLIENT_SECRET);
//
$("body").data("YELP_API_SERVER", YELP_API_SERVER);
$("body").data("YELP_SEARCH_API", YELP_SEARCH_API);
$("body").data("YELP_API_KEY", YELP_API_KEY);
//
