let rules = [];

chrome.webRequest.onBeforeRequest.addListener(
  function (details) { return filterRequest(details); },
  {
    urls: ["<all_urls>"],
  },
  ["blocking"]
);

function load() {
  rules.push({ sourcePattern: "^https://twitter.com/([^/]+)$", destinationPattern: "https://syndication.twitter.com/srv/timeline-profile/screen-name/$1" });
  rules.push({ sourcePattern: "^https://twitter.com/[^/]+/status/([0-9]+).*$", destinationPattern: "https://platform.twitter.com/embed/Tweet.html?id=$1" });
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
