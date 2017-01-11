// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("src/browser_action/tracked_products.html") });
});
/*
$.ajax({
  url: "https://script.google.com/macros/s/AKfycbymgNqBL-Fgr0OsLsBLhcSkp-xKx5W-YshVbzLkgX8H9FrKI-w/exec",
  type: "POST",
  contentType: "application/json",//"x-www-form-urlencoded",
  data: {
    a: "1",
    b: 1,
    c: "Fancy title",
    d: "http://www.emag.ro/geanta-laptop-asus-nereus-16-black-90-xb4000ba00010/pd/EPLRNBBBM/",
    e: "https://s0emagst.akamaized.net/products/69/68269/images/img292807_02052013093733_0_150x150_uql6.jpg",
    f: "59.49"
  },
  success: function (response) {
    console.log(response);
  },
  error: function (err) {
    console.log(err)
  }
})

var i = 0;
*/
