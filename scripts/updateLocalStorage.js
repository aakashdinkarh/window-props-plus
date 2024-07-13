// Your script logic here
async function updateLocalStorage(dataKey, data) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (dataKey, data) => {
            localStorage.setItem(dataKey, JSON.stringify(data));
        },
        args: [dataKey, data],
    })
}
