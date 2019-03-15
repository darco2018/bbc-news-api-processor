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

  for (let i = 0; i < 9; i++) {

    let item = newsItemsArr[i];
    //  retriev values from fetched data
    let title = item.title;
    let url = item.url;
    let description = item.description;
    let imageSrc = item.urlToImage;
    let published = item.publishedAt;
    let source = item.source.name;
    let content = item.content;

    /* console.log(title);
    console.log(url);
    console.log(description);
    console.log(imageSrc);
    console.log(published);
    console.log(source); */

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

    // for portals not generating Polish signs properly or
    // not generating description
    if (source.toLowerCase() === "gazeta.pl" ||
      source.toLowerCase() === "interia.pl" ||
      source.toLowerCase() === "") {
      descriptionPara.textContent = content;
      console.log("Source is " + source);
    } else {
      descriptionPara.textContent = description;
    }

    let img = document.createElement("img");
    img.src = imageSrc;
    section.appendChild(descriptionPara);
    section.appendChild(img);

    // ------------ footer -------------
    let footer = document.createElement("footer");
    let time = document.createElement("time");
    time.dateTime = published;
    time.textContent = published;
    let sourceSpan = document.createElement("span");
    sourceSpan.textContent = source;
    footer.appendChild(time);
    footer.appendChild(sourceSpan);

    let line = document.createElement("hr");

    //------------- assemble article components -------------
    main.appendChild(article);
    article.appendChild(header);
    article.appendChild(section);
    article.appendChild(footer);
    main.appendChild(line);

  }
}


