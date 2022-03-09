chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({neevaScheme: 'gruvbox'});
});

var currentScheme = null;

function applyScheme({neevaScheme, tabId}) {
  console.log(`Applying neeva scheme: ${neevaScheme} to tab ${tabId}`);
  if (currentScheme) chrome.scripting.removeCSS(currentScheme);
  if (!neevaScheme || neevaScheme === 'default') {
    return;
  };

  currentScheme = {
    files: [
      'mapper.css',
      `themes/${neevaScheme}.css`,
    ],
    target: {tabId},
  };
  chrome.scripting.insertCSS(currentScheme);
}

chrome.webNavigation.onCompleted.addListener(function(details) {
  chrome.storage.sync.get(
      ['neevaScheme'],
      ({neevaScheme}) => applyScheme({neevaScheme, tabId: details.tabId}));
}, {
  url: [{hostContains: 'neeva.com'}],
});
