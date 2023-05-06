# DIY RSS Feed Reader

This is a heavily commented, beginner friendly RSS Feed Reader Extension- made for [Webcomic Day 2023](https://webcomicday.com/). A website explaining the project can be found [here](https://diyrss.neocities.org/).

## About the Extension

Editing the `feeds` array in either `firefox.js` or `chrome.js` (depending on your browser) allows you to add webcomic's (or other website's) RSS feeds so you can follow them. Clicking on the extension displays a list of RSS Feeds you're following, and when they last updated with a link to view that update.

The extension has a badge that will appear if an RSS feed you follow updated today.

## Extension Guide

People more familiar with coding can probably skip this section and refer to the comments in the code itself. If you're less familiar with code, feel free to refer to this explanation of each file.

### Structure of Files

img

- icon48.png

background.js

LICENSE

manifest.json

README.md

rss.html

script.js

style.css

### What Each File Does

- The `img` folder has the icon that appears in your browser, the icon itself is called `icon48.png` and comes from [Icons8](https://icons8.com/icon/68819/edit-image) (which is a great resource, if you want a different icon). The icon itself is 48 x 48 pixels. Technically, it's good practice to have multiple sizes of your icon, but since this is just something we're doing for fun, it's only got one size.
- `mozilla.js` and `chrome.js` runs in the background and creates a badge if a comic updates today. This is where you'll add the RSS Feed links of comics you want to follow, and also where you can change the color of the badge if you want. Depending on the browser you use, you will have to switch the file on `manifest.json` and `rss.html`. Chrome users will see 2 errors when loading the extension, they don't impact the extension's usability.
- `LICENSE` this is a Software License and tells people what they're allowed to do with this code- which is anything! I don't care, do whatever you want with this. If having extra files around will confuse you, delete it.
- `manifest.json` tells your browser about the extension, and tells the extension how to behave on the browser. There's no comments in this file, you would _only_ need to edit the file if you changed the icon file name from `icon48.png`. (Unless you're doing something crazy with my code, this explanation is for new coders after all.)
- `README.md` is what you're reading right now. Feel free to delete if you don't need the guide.
- `rss.html` is the structure of the popup for the extension. There's also not much here for you to edit, unless you want to add a title that will appear at the beginning of your list. There's some comments explaining how to do that in the file. You'll notice it's a pretty empty file- that's because the information from the RSS feed to obtained and added by `script.js`.
- `script.js` is the JavaScript file that communicates with the RSS feed to populate information in the popup. Unless you want to dramatically change the format of the extension, I would recommend you leave this one alone too.
- `style.css` is what styles your popup- this is where you get to change the color, the font, the size of the font, et cetera. I've left comments outlining what everything does. Don't be afraid to experiment!
