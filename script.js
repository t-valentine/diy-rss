// Hiveworks comic RSS feeds follow a specific format:
// Comic Name - Page # or Title
// As a result, the RSS feed for the comic repeats the comic name multiple times
// This function trims the RSS title for each update so it only displays the Page # or Title.
function editUpdate(update, comicTitle) {
  if (update.includes(comicTitle)) {
    // Checks if update name also includes -, so other RSS Feeds that repeat the comic title won't be edited
    // if you want, you can add else if statements for RSS Feeds you find that repeat names
    if (update.includes("-")) {
      updateArray = update.split(" - ");
      update = updateArray[1];
    }
  }
  return update;
}

// This function converts the JavaScript Date object into a date a user can read
function convertDate(pubDate) {
  let dateString = new Date(pubDate);
  // getMonth starts with 0 and goes to 11, so we have to add 1 to get the right month number
  let month = dateString.getMonth() + 1;
  let day = dateString.getDate();
  let year = dateString.getFullYear().toString();
  // Changes year from 2023 (4 digits) to 23 (2 digits), you can remove if you want the full year
  year = year.substring(2);
  return month + "/" + day + "/" + year;
}

// This function communicates with the RSS feeds to get information about the most
// recent update.
// This is similar to getRSSFeed on background.js, but gets more information
// (gets Comic Name, title of the update, the update link, and the update date)
async function getRSSFeed() {
  // this is an empty array, we'll add our webcomic updates here
  const feedArray = [];

  // Goes through your array of links and gets information from the RSS Feed
  for (const f of feeds) {
    // https://corsproxy.io/ fixes CORS errors
    await fetch("https://corsproxy.io/?" + f)
      // connects to the RSS Feed so we can get information from it
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => {
        // gets the comic's title
        var comicTitle = data.querySelector("title").innerHTML;

        // gets the comic's most recent update (counting in code starts at 0, not 1)
        const updateData = data.querySelectorAll("item")[0];

        // gets the name of the most recent update
        let updateTitle =
          updateData.getElementsByTagName("title")[0].childNodes[0].nodeValue;

        // Checks if update name includes comic title (using the function above)
        updateTitle = editUpdate(updateTitle, comicTitle);

        // gets the update's link
        let updateLink = updateData.querySelector("link").innerHTML;

        // adds all that information into our array of updates named feedArray
        feedArray.push([
          comicTitle,
          updateTitle,
          updateLink,
          // this it the date of the update
          updateData.querySelector("pubDate").innerHTML,
        ]);
        return feedArray;
      });
  }
  // creates the table you see on the extension
  createRSSList(feedArray);
}

// Sorts the array of updates and adds them to the table
function createRSSList(dateArray) {
  // This sorts dateArray by oldest to newest
  // The code for inserting into the table inserts items on top of each other, so
  // the array has to be in "reverse" order for the table to display correctly
  dateArray.sort(function ([a, b, c, d], [w, x, y, z]) {
    let date1 = { toDate: d };
    let date2 = { toDate: z };
    return (
      Math.abs(Date.now() - new Date(date2.toDate)) -
      Math.abs(Date.now() - new Date(date1.toDate))
    );
  });

  // finds the table in the HTML
  var table = document.getElementById("feed");

  // loops through each item in dateArray and adds it to the table
  dateArray.forEach((item) => {
    // since items are added in reverse order, we start with the update link & date
    var row2 = table.insertRow(0);
    var cell3 = row2.insertCell(0);
    var cell2 = row2.insertCell(0);
    cell2.innerHTML = `<a href="${item[2]}" target="_blank">${item[1]}</a>`;
    cell3.innerHTML = convertDate(item[3]);

    // after that, we add the webcomic name
    var row1 = table.insertRow(0);
    var cell1 = row1.insertCell(0);

    // checks if webcomic updated today
    if (convertDate(item[3]) == convertDate(Date.now())) {
      // Adds a star if today is an update day
      cell1.innerHTML = `<span class="update-today">&#9733;</span> ` + item[0];
    } else {
      cell1.innerHTML = item[0];
    }
    cell1.colSpan = "2";
  });
}

getRSSFeed();
