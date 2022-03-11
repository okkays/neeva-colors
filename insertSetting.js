const SCHEME_TITLES = {
  'default': 'Default',
  'gruvbox': 'Gruvbox',
  'solarish': 'Solarish',
};

function insertSchemeSetting({neevaScheme}) {
  addSettingStyles();
  waitForPreferences(preferencesDiv => {
    preferencesDiv.lastChild.appendChild(buildDropdown({neevaScheme}));
  });
}

function waitForPreferences(callback) {
  setTimeout(() => {
    const preferencesDiv = findPreferences();
    if (!preferencesDiv) {
      waitForPreferences(callback);
      return;
    }
    callback(preferencesDiv);
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
  dropdown.setAttribute('id', 'neeva-colorschemes-ext-chooser-wrapper')

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
    #neeva-colorschemes-ext-chooser-wrapper {
      margin-top: 35px;
    }

    #neeva-colorschemes-ext-chooser-wrapper select {
      float: right;
      padding: 5px;
      margin-top: -8px;
    }
  `;
  document.head.appendChild(style);
}

chrome.storage.sync.get(['neevaScheme'], insertSchemeSetting);
