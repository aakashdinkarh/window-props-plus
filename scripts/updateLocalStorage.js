import { executeScriptAsync } from "./evaluateLocalStorage.js";
import { saveToLocalStorageBtnContainer } from "./onPageLoad.js";

const updateLocalStorageInTab = (dataKey, data) => {
	try {
		localStorage.setItem(dataKey, JSON.stringify(data));
		return true;
	} catch (error) {
		console.error('Error updating localStorage:', error);
		return false;
	}
};

const indicateUserAboutSaveStatus = (isSuccess) => {
	const className = isSuccess ? 'save-success' : 'save-fail';
	saveToLocalStorageBtnContainer.classList.add(className);
	setTimeout(() => {
		saveToLocalStorageBtnContainer.classList.remove(className);
	}, 1000);
};

export const updateLocalStorage = async (dataKey, data) => {
	try {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

		// First, save to localStorage
		const saveResults = await executeScriptAsync({
			tabId: tab.id,
			func: updateLocalStorageInTab,
			args: [dataKey, data],
		});

		const isSaveSuccess = saveResults[0].result;

		if (isSaveSuccess) {
			// Re-run the existing content script to apply properties to window
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['scripts/contentScripts/attachDataToWindow.js'],
				world: 'MAIN',
			});
		}

		indicateUserAboutSaveStatus(isSaveSuccess);
	} catch (error) {
		console.error('Error executing script:', error);
		indicateUserAboutSaveStatus(false);
	}
};
