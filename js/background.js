const rulesMap = {
  "twitter.com": [
    // https://twitter.com/SCREEN_NAME
    // https://twitter.com/SCREEN_NAME/
    // https://twitter.com/SCREEN_NAME?parameters
    {
      sourcePattern: "^https://twitter.com/([A-Za-z0-9_]+)(/?|\\?.*)$",
      destinationPattern: "https://nitter.net/$1",
    },
    // https://twitter.com/SCREEN_NAME/status/TWEET_ID
    // https://twitter.com/SCREEN_NAME/status/TWEET_ID?parameters
    {
      sourcePattern: "^https://twitter.com/(.+)/status/([0-9]+).*$",
      destinationPattern: "https://nitter.net/$1/status/$2#m"
    },
  ],
  "www.youtube.com": [
    // https://www.youtube.com/watch?v=VIDEO_ID
    {
      sourcePattern: "^https://www.youtube.com/watch\\?v=(.*)$",
      destinationPattern: "https://piped.video/watch?v=$1",
    },
  ],
};

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);
    const hostname = url.hostname;

    if (rulesMap.hasOwnProperty(hostname)) {
      const rules = rulesMap[hostname];
      for (let i = 0; i < rules.length; i++) {
        let regex = new RegExp(rules[i].sourcePattern);
        if (regex.test(details.url)) {
          const url = details.url.replace(regex, rules[i].destinationPattern);
          return { redirectUrl: url };
        }
      }

      return { cancel: false };
    }
  },
  {
    urls: ["<all_urls>"],
  },
  ["blocking"]
);
