console.log("I'm a great developer");

// Get HTML elements
const headlinesPara = document.querySelector("p.allheadlines");

const main = document.querySelector("main");
let newsItemsArr;



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
    //displayHeadlines(json);
    displayNewsItems(json);
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
}



function displayNewsItems(data) {

  newsItemsArr = data["articles"];

  console.log(newsItemsArr);

  //------------  iterate over fetched JS objects -----------
  for (let i = 0; i < 9; i++) {

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
    let newsSummary = selectTextToDisplay(item.content, item.description);

    //------------ assemble an article -----------

    let article = document.createElement("article");

    // ------------ header -------------
    let header = document.createElement("header");
    let headline = document.createElement("h3");
    let linkToSource = document.createElement("a");
    linkToSource.textContent = title;
    linkToSource.href = url;
    linkToSource.target = "_blank";
    headline.appendChild(linkToSource);
    header.appendChild(headline);

    // ------------ section -------------
    let section = document.createElement("section");
    let descriptionPara = document.createElement("p");
    descriptionPara.textContent = newsSummary;
    let img = document.createElement("img");
    img.src = imageSrc;
    section.appendChild(descriptionPara);
    section.appendChild(img);

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
    article.appendChild(header);
    article.appendChild(section);
    article.appendChild(footer);

  }
}


function selectTextToDisplay(content, description) {

  // select text to display
  const defaultText = "Opis nie jest dostepny. Kliknij, aby dowiedzieć się więcej.";
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
  if (textToDisplay.length > 60) {
    if (!rendersPolishSigns(textToDisplay.substring(0, 60))) {
      textToDisplay = defaultText;
    }
  } else {
    if (!rendersPolishSigns(textToDisplay.substring(0, textToDisplay.length - 1))) {
      textToDisplay = defaultText;
    }
  }

  return textToDisplay;
}
