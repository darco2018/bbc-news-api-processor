console.log("I'm a great developer");

/* --------- non-html vars -------------- */
const baseURL = "https://newsapi.org/v2/";
const bbcKey = "d37577f515ea4b5f8d4996bf502882ff";
const headlinesEndpoint = "top-headlines?";
const defaultCountry = "pl";
const defaultCategory = "general";
/* /* ------------------------------------------------------------------- */



/* --------- html vars -------------- */
const html = document.querySelector("html");
const main = document.querySelector("main");

// the form
const theForm = document.querySelector("#user-choices-form");
const countryInputs = theForm.querySelectorAll("input[name='country[]'");
const categoryInputs = theForm.querySelectorAll("input[name='category'");
/* ------------------------------------------------------------------- */


/* --------- init -------------- */
fetchBbcHeadlines();
/* ------------------------------------------------------------------- */

/* --------- event handlers-------------- */

theForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let chosenCountry = theForm.querySelector("input[name='country[]']:checked");
  let chosenCategory = theForm.querySelector("input[name='category']:checked");

  fetchBbcHeadlines(chosenCountry.value, chosenCategory.value);
});


/* --------- main functions-------------- */

function fetchBbcHeadlines(userCountryChoice, userCategoryChoice) {

  let requestUrl = buildRequestUrl(
    baseURL,
    headlinesEndpoint,
    createCountryQuery(userCountryChoice),
    createCategoryQuery(userCategoryChoice)
  );

  setMainPanelLanguage(userCategoryChoice);

  fetch(requestUrl, {
      headers: {
        "x-api-key": bbcKey,
      }
    })
    .then(response => response.json())
    .then(function (json) {
      //displayHeadlines(json);
      displayNewsItems(json);
    })
    .catch(function (err) {
      console.log("Fetch problem: " + err.message);
    });;

}


function displayNewsItems(data) {

  while (main.firstChild && main.removeChild(main.firstChild));

  newsItemsArr = data["articles"];

  console.log(newsItemsArr);

  //------------  iterate over fetched JS objects -----------
  for (let i = 0; i < 12; i++) {

    let item = newsItemsArr[i];
    if (!item) {
      alert("Error: unable to fetch data. Please try again later.");
      break;
    }


    //------------ select relevant items to display -----------
    let url;
    let title;

    if (!item.url || !item.title) {
      continue;
    } else {
      url = item.url;
      title = item.title;
    }

    let imageSrc = item.urlToImage ? item.urlToImage : "img/default_article_photo.jpg";
    let published = item.publishedAt ? item.publishedAt : "";
    let source = item.source.name ? item.source.name : "";
    let newsSummary = selectTextToDisplay(item.content, item.description, item.title, true);

    //------------ assemble an article -----------
    let linkToSource = document.createElement("a");
    linkToSource.href = url;
    linkToSource.target = "_blank";

    let article = document.createElement("article");
    article.appendChild(linkToSource);
    // ------------ header -------------
    let header = document.createElement("header");
    let headline = document.createElement("h3");
    headline.textContent = title;
    header.appendChild(headline);
    let img = document.createElement("img");
    img.src = imageSrc;

    // ------------ section -------------
    let section = document.createElement("section");
    let descriptionPara = document.createElement("p");
    descriptionPara.innerHTML = newsSummary;
    section.appendChild(descriptionPara);

    // ------------ footer -------------
    let footer = document.createElement("footer");
    let footerPara = document.createElement("p");
    let time = document.createElement("time");
    time.dateTime = published;
    time.textContent = published;
    let sourceSpan = document.createElement("span");
    sourceSpan.textContent = source;
    footerPara.appendChild(time);
    footerPara.appendChild(sourceSpan);
    footer.appendChild(footerPara);

    //------------- append article components -------------
    main.appendChild(article);
    linkToSource.appendChild(header);
    linkToSource.appendChild(img);
    linkToSource.appendChild(section);
    linkToSource.appendChild(footer);

  }
}

/* ------------------------------------------------------------------- */




/* --------- helper functions-------------- */

function createCountryQuery(countryCode) {
  // there's no option for 'all countries' in bbc api, 
  return "country=" + (countryCode ? (countryCode === "world" ? "" : countryCode) : defaultCountry);
}

function createCategoryQuery(categoryCode) {
  return "category=" + (categoryCode ? categoryCode : defaultCategory);
}

// country=us&category=&apiKey  ok
// country=&category=health  ok
// country=&category=  not ok
// bbc api doesn't allow no-paramter query, and there's no option for country='all countries', 
// so setting a category=general  satisfies the requirement for a single mandatory parameter
function buildRequestUrl(base, headlines, countryQuery, categoryQuery) {
  return base + headlines + countryQuery + "&" + categoryQuery;
}

function setMainPanelLanguage(countryCode) {

  countryCode = countryCode ? countryCode : defaultCountry;
  let language;

  switch (countryCode) {
    case "pl":
      language = "pl";
      break;
    case "de":
      language = "de";
      break;
    case "gb":
    case "us":
    default:
      language = "en";
      break;
  }

  main.setAttribute("lang", language);
}

/* ------------------------------------------------------------------- */




















function selectTextToDisplay(content, description, title, preferDescriptionToDisplay) {

  if (preferDescriptionToDisplay) {
    let temp = content;
    content = description;
    description = temp;
  }

  // select text to display
  const defaultText = "Kliknij, aby dowiedzieć się więcej.";
  let textToDisplay = defaultText; // set early 


  if (content) { // not null/empty/undefined
    textToDisplay = content;
  } else if (description) {
    textToDisplay = description;
  }

  let maxAllowedChars = 260;
  if (textToDisplay.length > maxAllowedChars) {
    textToDisplay = textToDisplay.substring(0, maxAllowedChars);
  }

  // handle portals not generating Polish signs properly
  function rendersPolishSigns(text) {
    var replacementChar = 65533;
    return text.indexOf(String.fromCharCode(replacementChar)) === -1 ? true : false;
  }

  // reset if Polish chars not handled properly
  var sampleLimit = 100;
  if (textToDisplay.length > sampleLimit) {
    if (!rendersPolishSigns(textToDisplay.substring(0, sampleLimit))) {
      textToDisplay = defaultText;
    }
  } else {
    if (!rendersPolishSigns(textToDisplay.substring(0, textToDisplay.length - 1))) {
      textToDisplay = defaultText;
    }
  }

  return textToDisplay.length > 59 ? textToDisplay : title;
}


// TODO remove when finished

// display received json

// Get HTML elements
const headlinesPara = document.querySelector("p.allheadlines");

function displayHeadlines(data) {
  //headlinesPara.textContent = jsonObj; // [object Object] 
  //headlinesPara.textContent = JSON.parse(jsonObj); // no display - cant parse [object Object] - can parse only a string

  let jsonstr = JSON.stringify(data); // converts a JavaScript object to a (JSON) string. here: re-converting into JSON
  headlinesPara.textContent = jsonstr;
}


/* .then(function (response) {
    return response.json(); // implicit conversion to Java Script object
  }) 
  the same as:
  .then(response => response.json())

  */
