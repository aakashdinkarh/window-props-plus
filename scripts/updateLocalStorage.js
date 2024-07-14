// Your script logic here
async function updateLocalStorage(dataKey, data) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const results = await executeScriptAsync({
        tabId: tab.id,
        func: (dataKey, data) => {
            try {
                localStorage.setItem(dataKey, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        args: [dataKey, data],
    });

    const isSuccess = results[0].result;

    if(isSuccess) {
        saveToLocalStorageBtnContainer.classList.add('save-success');
        setTimeout(() => {
            saveToLocalStorageBtnContainer.classList.remove('save-success');
        }, 1000)
    } else {
        saveToLocalStorageBtnContainer.classList.add('save-fail');
        setTimeout(() => {
            saveToLocalStorageBtnContainer.classList.remove('save-fail');
        }, 1000)
    }
}
