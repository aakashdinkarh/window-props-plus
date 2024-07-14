const defaultData = {
    type: 'object',
    key: 'window',
    value: []
};

function executeScriptAsync({ tabId, func, args }) {
    return new Promise((resolve, reject) => {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func,
          args,
        },
        (results) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(results);
        }
      );
    });
}

function evalIsDataValid(data) {
    const isDataValid = data && typeof data === 'object' && Object.keys(data).length !== 0;

    const isRootKeyWindow = isDataValid && data.key === 'window' && data.type === 'object';

    return isDataValid && isRootKeyWindow;
}

function handleConfirmation() {
    const agree = confirm('Something went wrong with data, do you want to continue with default data?');

    if (agree) {
        localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(defaultData));
    }
    return agree;
}

async function evaluateLocalStorage() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const results = await executeScriptAsync({
            tabId: tab.id,
            func: (key) => {
                return window.localStorage.getItem(key);
            },
            args: [LOCAL_STORAGE_DATA_KEY]
        });

        const localStorageData = results[0].result;

        if (!localStorageData) return defaultData;

        const parsedData = JSON.parse(localStorageData);
        const isDataValid = evalIsDataValid(parsedData);

        if (isDataValid) return parsedData;

        const agree = handleConfirmation();
        if (agree) return defaultData;

        return null;
    } catch (e) {
        console.error(e);
        if(typeof e.message === 'string' && e.message.includes('Cannot access')) {

          errorMessage = 'Cannot access this website, NOT ALLOWED'
          return null;
        }
        if(e.message) alert(e.message);

        const agree = handleConfirmation();
        if (agree) return defaultData;

        return null
    }
}
