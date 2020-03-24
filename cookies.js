'use strict';

document.getElementById('websiteUrl').addEventListener('change', function(e){
  chrome.tabs.update({ url: e.target.value });
  sessionStorage.setItem('cookiesWebsiteUrl', e.target.value)
});

document.getElementById('downloadCSV').addEventListener('click', function(){
  const downloadLink = this;
  chrome.cookies.getAll({}, function (cookies) {
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
