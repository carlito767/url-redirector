let rules = [];

chrome.webRequest.onBeforeRequest.addListener(
  function (details) { return filterRequest(details); },
  {
    urls: ["<all_urls>"],
  },
  ["blocking"]
);

function load() {
  // https://twitter.com/SCREEN_NAME
  // https://twitter.com/SCREEN_NAME/
  // https://twitter.com/SCREEN_NAME?parameters
  rules.push({ sourcePattern: "^https://twitter.com/([A-Za-z0-9_]+)(/?|\\?.*)$", destinationPattern: "https://tweettunnel.com/$1" });
  // https://twitter.com/SCREEN_NAME/status/TWEET_ID
  // https://twitter.com/SCREEN_NAME/status/TWEET_ID?parameters
  rules.push({ sourcePattern: "^https://twitter.com/.+/status/([0-9]+).*$", destinationPattern: "https://platform.twitter.com/embed/Tweet.html?id=$1" });
}

function filterRequest(details) {
  for (let i = 0; i < rules.length; i++) {
    let regex = new RegExp(rules[i].sourcePattern);
    if (regex.test(details.url)) {
      const url = details.url.replace(regex, rules[i].destinationPattern);
      return { redirectUrl: url };
    }
  }

  return { cancel: false };
}

document.addEventListener('DOMContentLoaded', load);
