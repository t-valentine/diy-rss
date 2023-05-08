// All you REALLY need to do is enter the RSS Feed URLs of comics you like below
// Feel free to delete what's there.... Or keep them!
var feeds = [
	"https://feeds.acast.com/public/shows/re-dracula",
	"https://feeds.acast.com/public/shows/630eb132f6525300127fd951",
	"http://www.fairmeadowcomic.com/comic/rss",
	"https://lunarblight.com/comic/rss",
	"https://kingsofsorts.com/feed/",
	"https://www.phantomarine.com/comic/rss",
	"https://www.kochab-comic.com/comic/rss",
];

// BEWARE
// Below this line is the code for setting the extension badge when a comic has updated
// Editing this code can break that badge, everything is still commented with explanations tho
// If you want to edit the Badge's color, check out the last couple lines in this file

const dateArray = [];

// This function communicates with the RSS feeds to get information about the most
// recent update.
// This is similar to getRSSFeed on background.js, but gets less information
// (gets Comic Name and the update date)
function getRSSFeed() {
	// the "Promise" just asks the program to wait until it talks to all RSS feeds
	return new Promise(async (resolve) => {
		for (const f of feeds) {
			// https://corsproxy.io/ fixes CORS errors
			await fetch("https://corsproxy.io/?" + f)
				// connects to the RSS Feed so we can get information from it
				.then((response) => response.text())
				.then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
				.then((data) => {
					// gets the most recent update (counting in code starts at 0, not 1)
					const updateData = data.querySelectorAll("item")[0];

					// puts each recent update in our dateArray
					dateArray.push([
						// the comic's title
						data.querySelector("title").innerHTML,
						// the comic's update date
						updateData.querySelector("pubDate").innerHTML,
					]);
					return dateArray;
				});
			// sends our dateArray to the checkDates function
			checkDates(dateArray);
		}
	});
}

total = 1;

// this Function checks each update date to see if one of them updated today
function checkDates(feedArray) {
	let updateflag = false;
	feedArray.forEach((item) => {
		let updateDate = item[1];
		updateDate = new Date(updateDate);
		let today = new Date();
		// the badge will only show up IF there's text in the badge
		// so instead of needing an else statement, we can just only set the badge's
		// text IF there was a comic updated today
		if (today.toDateString() === updateDate.toDateString()) {
			browser.browserAction.setBadgeText({ text: "!" });
			// if there's an update, marks the flag as true
			updateflag = true;
		}
	});
	// if there's no updates, this will still be false and the badge will be cleared
	if (!updateflag) {
		browser.browserAction.setBadgeText({ text: "!" });
	}
}
// this function waits to see if a comic was updated today
async function getBadgeText() {
	await getRSSFeed();
}

// runs the "getBadgeText" function when you install the app
getBadgeText();

// tells the browser to check for updates every hour
// if you'd like your extension to check in less or more time, feel free to fiddle with the minutes
// setting it to run every minute or something ridiculous like that COULD slow down your browser
browser.alarms.onAlarm.addListener(getBadgeText);
browser.alarms.create("getBadgeText", { periodInMinutes: 60 });

// the color of the badge text, can be an accepted color word or HEX code
browser.browserAction.setBadgeTextColor({ color: "white" });
// the background color of the badge
browser.browserAction.setBadgeBackgroundColor({ color: "#ff8d23" });
