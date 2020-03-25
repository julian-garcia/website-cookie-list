'use strict';

document.getElementById('websiteUrl').addEventListener('change', function(e){
  chrome.tabs.update({ url: e.target.value });
  sessionStorage.setItem('cookiesWebsiteUrl', e.target.value)
});

// Retrieve all cookies, including: name/value pair, domain, path, maxage etc. 
document.getElementById('downloadCSV').addEventListener('click', function(){
  chrome.cookies.getAll({}, function (cookies) {
    // Not all cookies have the same number of properties, so we need to ensure
    // that all properties of all cookies to avoid staggered spreadsheet listing
    let globalCookieObject = {};
    cookies.forEach(function(cookie) {
      Object.keys(cookie).forEach(function(item) {
        globalCookieObject[item] = null;
      })
    });
  
    let csvContent = "data:text/csv;charset=utf-8," + Object.keys(globalCookieObject).sort().join(',') + "\r\n";
  
    cookies.forEach(function(cookie) {
      let row = '';
      Object.keys(globalCookieObject).sort().forEach(function(item) {
        let cookieItem = cookie[item] ? cookie[item] : '';
        row += '"' + cookieItem + '",'
      });
      csvContent += row.substr(0,row.length-1) + "\r\n";
    });

    var encodedUri = encodeURI(csvContent.replace(/#/g, '%23'));
    window.open(encodedUri);
  });
});

// Listen for all tab updates, extract any internal links from the page 
// and visit those links, each in their own tab
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.executeScript(null,   
      {code:`
        let internalLinks = [];
        document.querySelectorAll('a').forEach(function(link) {
          if (link.href.includes('${sessionStorage.getItem('cookiesWebsiteUrl')}')) {
            internalLinks.push(link.href);
          }
        });
        let sortedLinks = [...new Set(internalLinks.sort())];
        sortedLinks.forEach(function(link) {
          window.open(link, target='_blank');
        });
      `});
  }
});
