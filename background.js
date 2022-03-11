function getCss(neevaScheme, {tabId}) {
  return {
    files: [
      'mapper.css',
      `themes/${neevaScheme}.css`,
    ],
    target: {tabId},
  };
}

function applyScheme({oldScheme, newScheme, tabId}) {
  if (oldScheme) {
    oldCss = getCss(oldScheme, {tabId});
    chrome.scripting.removeCSS(oldCss);
  }
  if (!newScheme || newScheme === 'default') return;

  newCss = getCss(newScheme, {tabId});
  chrome.scripting.insertCSS(newCss);
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  if (!changes.neevaScheme?.newValue) return;
  chrome.tabs.query({url: ['*://neeva.com/*']}, (tabs) => {
    for (const tab of tabs) {
      applyScheme({
        oldScheme: changes.neevaScheme.oldValue,
        newScheme: changes.neevaScheme.newValue,
        tabId: tab.id,
      });
    }
  });
});

chrome.webNavigation.onCommitted.addListener(function(details) {
  chrome.storage.sync.get(['neevaScheme'], ({neevaScheme}) => {
    applyScheme({newScheme: neevaScheme, tabId: details.tabId});
  });
}, {
  url: [{hostContains: 'neeva.com'}],
});
