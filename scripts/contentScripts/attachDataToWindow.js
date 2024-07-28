(function () {
	const PROPERTY_PATH_SEPARATOR = ' > ';
	const LOCAL_STORAGE_DATA_KEY = 'local_data_state';
	const DEFAULT_DATA = {
		type: 'object',
		key: 'window',
		value: [],
	};

	function handleException(type, propertyPath, fn) {
		try {
			return fn();
		} catch (err) {
			console.error(`Error parsing ${type} at ${propertyPath}: ${err.message}`);
			return undefined;
		}
	}

	const evaluators = {
		object: (data, propertyPath) =>
			data.value.reduce((obj, childData) => {
				obj[childData.key] = evaluateData(childData, propertyPath);
				return obj;
			}, {}),
		function: (data, propertyPath) => handleException(data.type, propertyPath, () => new Function(...data.value)),
		string: (data, propertyPath) => handleException(data.type, propertyPath, () => String(data.value[0])),
		number: (data, propertyPath) => handleException(data.type, propertyPath, () => Number(data.value[0])),
		boolean: (data, propertyPath) => handleException(data.type, propertyPath, () => JSON.parse(data.value[0])),
		array: (data, propertyPath) => handleException(data.type, propertyPath, () => JSON.parse(data.value[0])),
	};

	function evaluateData(data, parentPath = '') {
		const propertyPath = parentPath ? `${parentPath}${PROPERTY_PATH_SEPARATOR}${data.key}` : data.key;

		return evaluators[data.type] ? evaluators[data.type](data, propertyPath) : undefined;
	}

	function isRootWindowObjectValid(data) {
		return (
			data &&
			typeof data === 'object' &&
			Object.keys(data).length !== 0 &&
			data.key === 'window' &&
			data.type === 'object'
		);
	}

	function getLocalStorageData() {
		try {
			const stringifiedData = window.localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
			if (!stringifiedData) return DEFAULT_DATA;

			const parsedData = JSON.parse(stringifiedData);
			return isRootWindowObjectValid(parsedData) ? parsedData : null;
		} catch (e) {
			console.error('Error getting data from localStorage', e);
			return null;
		}
	}

	const windowExtensions = evaluateData(getLocalStorageData());

	if (windowExtensions && typeof windowExtensions === 'object') {
		Object.assign(window, windowExtensions);
	}
})();
