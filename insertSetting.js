const scheme_titles = {
  'default': 'Default',
  'gruvbox': 'Gruvbox',
};

function insertSchemeSetting({neevaScheme}) {
  console.log(`Adding neeva scheme setting.`);
  var darkModeDiv = getElementByXpath('//[text()="Dark Mode"]');
  darkModeDiv.appendChild(document.createTextNode(`yo: ${neevaScheme}`));
}

function getElementByXpath(path) {
  return document
      .evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      .singleNodeValue;
}

chrome.storage.sync.get(['neevaScheme'], insertSchemeSetting);
