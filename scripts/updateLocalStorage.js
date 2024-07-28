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
		const results = await executeScriptAsync({
			tabId: tab.id,
			func: updateLocalStorageInTab,
			args: [dataKey, data],
		});

		const isSuccess = results[0].result;
		indicateUserAboutSaveStatus(isSuccess);
	} catch (error) {
		console.error('Error executing script:', error);
		indicateUserAboutSaveStatus(false);
	}
};
