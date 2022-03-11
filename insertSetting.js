const SCHEME_TITLES = {
  'default': 'Default',
  'gruvbox': 'Gruvbox',
  'solarish': 'Solarish',
};

const WRAPPER_ID = 'neeva-colorschemes-ext-chooser-wrapper';

function insertSchemeSetting({neevaScheme}) {
  if (document.getElementById(WRAPPER_ID)) return;
  addSettingStyles();
  waitFor(findPreferences, preferencesDiv => {
    preferencesDiv.lastChild.appendChild(buildDropdown({neevaScheme}));
  });
}

function waitFor(predicate, callback) {
  setTimeout(() => {
    const result = predicate();
    if (!result) {
      waitFor(predicate, callback);
      return;
    }
    callback(result);
  }, 250);
}

function findPreferences() {
  return [...document.getElementsByTagName('div')].find(div => {
    return (
        div.className.includes('settings-card') &&
        div.textContent.includes('Search Preferences'));
  });
}

/** Builds a dropdown menu with a 'Default' entry. */
function buildDropdown({neevaScheme}) {
  const dropdown = document.createElement('div');
  const select = document.createElement('select');
  dropdown.setAttribute('id', WRAPPER_ID)

  const options = Object.entries(SCHEME_TITLES).map(([key, title]) => {
    const selected = key === neevaScheme ? 'selected' : '';
    return `<option ${selected} value="${key}">${title}</option>`;
  });
  select.innerHTML = options.join();

  dropdown.innerHTML = `
    <label for="colorschemes">
      Color Scheme:
    </label>
  `;
  dropdown.appendChild(select);

  select.addEventListener('change', event => {
    const neevaScheme = event.target.value;
    chrome.storage.sync.set({neevaScheme});
  });

  return dropdown;
}

function addSettingStyles() {
  const style = document.createElement('style');
  style.innerText = `
    #${WRAPPER_ID} {
      margin-top: 35px;
    }

    #${WRAPPER_ID} select {
      float: right;
      padding: 5px;
      margin-top: -8px;
    }
  `;
  document.head.appendChild(style);
}

function insertIfOnPage() {
  if (!window.location.href.includes('neeva.com/settings')) return;
  insertRegardless();
}

function insertRegardless() {
  chrome.storage.sync.get(['neevaScheme'], insertSchemeSetting);
}

function findSettings() {
  return [...document.getElementsByTagName('div')].find(div => {
    return (
        div.className.includes('menuItem') &&
        div.textContent.includes('Settings'));
  });
}

window.addEventListener('popstate', insertIfOnPage);
window.addEventListener('load', insertIfOnPage);
window.addEventListener('load', () => {
  waitFor(findSettings, settingsButton => {
    settingsButton.addEventListener('click', insertRegardless);
  });
});
