console.log("I'm a great developer");

// Get HTML elements
let headlinesPara = document.querySelector("p.allheadlines");


// Assemble the full URL
let url;
const baseURL = "https://newsapi.org/v2/";
const bbcKey = "d37577f515ea4b5f8d4996bf502882ff";
let country = "pl";
url = baseURL + "top-headlines?" + "country=" + country;

// fetch headlines from bbc
fetch(url, {
    headers: {   
      "x-api-key": bbcKey,
    }
  })
  /* .then(function (response) {
    return response.json(); // implicit conversion to Java Script object
  }) */
  .then(response => response.json()) 
  .then(function (json) {
    displayHeadlines(json);
  })
  .catch(function (err) {
    console.log("Fetch problem: " + err.message);
  });;

// display received json
function displayHeadlines(data) {
  //headlinesPara.textContent = jsonObj; // [object Object] 
  //headlinesPara.textContent = JSON.parse(jsonObj); // no display - cant parse [object Object] - can parse only a string

  let jsonstr = JSON.stringify(data); // converts a JavaScript object to a (JSON) string. here: re-converting into JSON
  headlinesPara.textContent = jsonstr;


  // convert to JS obj ?
  // can write json to file, then to localStorage ?
}
