(function () {
	const NOT_ALLOWED_PROTOCOLS = ['chrome:', 'file:', 'about:', 'view-source:'];

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.status === 'complete') {
			const isExtAllowed = tab.url && !NOT_ALLOWED_PROTOCOLS.includes(new URL(tab.url).protocol);

			if (isExtAllowed) {
				chrome.action.enable(tabId);
			} else {
				chrome.action.disable(tabId);
			}
		}
	});
})();
