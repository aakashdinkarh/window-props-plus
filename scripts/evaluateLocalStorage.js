const DEFAULT_DATA = {
	type: 'object',
	key: 'window',
	value: [],
};

const executeScriptAsync = ({ tabId, func, args }) => {
	return new Promise((resolve, reject) => {
		chrome.scripting.executeScript(
			{
				target: { tabId },
				func,
				args,
			},
			(results) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve(results);
				}
			}
		);
	});
};

function evalIsDataValid(data) {
	const isDataValid = data && typeof data === 'object' && Object.keys(data).length !== 0;

	const isRootKeyWindow = isDataValid && data.key === 'window' && data.type === 'object';

	return isDataValid && isRootKeyWindow;
}

const handleConfirmation = () => {
	const agree = confirm('Something went wrong with data. Do you want to continue with default data?');
	if (agree) {
		localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(DEFAULT_DATA));
	}
	return agree;
};

const evaluateLocalStorage = async () => {
	try {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

		const results = await executeScriptAsync({
			tabId: tab.id,
			func: (key) => window.localStorage.getItem(key),
			args: [LOCAL_STORAGE_DATA_KEY],
		});

		const localStorageData = results[0].result;

		if (!localStorageData) return DEFAULT_DATA;

		const parsedData = JSON.parse(localStorageData);

		if (evalIsDataValid(parsedData)) return parsedData;
		return handleConfirmation() ? DEFAULT_DATA : null;
	} catch (e) {
		console.error(e);

		if (e.message?.includes('Cannot access')) {
			errorMessage = e.message;
			subErrorMessage = 'Cannot access this website, NOT ALLOWED';
			throw new Error(e.message);
		}

		if (e.message) alert(e.message);

		return handleConfirmation() ? DEFAULT_DATA : null;
	}
};
