# Website Cookie List Generator
This is a basic chrome extension to automatically visit all internal website links (home page links only) and generate a site wide cookie listing in CSV format. The [Google develop guide for extensions](https://developer.chrome.com/extensions/devguide) was used as a reference during development.
***

## Usage
To use the extension, follow these steps:
- Clone this repository to your local environment
- Open the chrome browser and go to: chrome://extensions
- Press the "load unpacked" button and select the folder "website-cookie-list"

The extension should then appear in your browser toolbar, at which point:
- Click on the extension icon
- Enter the URL of the website you want cookies for, press enter
- When all tabs have finished loading, re-click on the extension icon and press "download csv"

## Notes
The extension does depend on the user waiting for all pages to load before downloading the cookie listing so there may be future development to remove that user dependency. This may not be effective for larger sites with hundreds of internal links as the number of open tabs could cause a browser crash.