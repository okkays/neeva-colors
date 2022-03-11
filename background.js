var currentScheme = null;
var tabs = [];

function applyScheme({neevaScheme, tabId}) {
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

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  if (!changes.neevaScheme?.newValue) return;
  for (const tabId of tabs) {
    applyScheme({neevaScheme: changes.neevaScheme.newValue, tabId});
  }
});

chrome.webNavigation.onCommitted.addListener(function(details) {
  chrome.storage.sync.get(['neevaScheme'], ({neevaScheme}) => {
    applyScheme({neevaScheme, tabId: details.tabId});
    tabs.push(details.tabId);
  });
}, {
  url: [{hostContains: 'neeva.com'}],
});
