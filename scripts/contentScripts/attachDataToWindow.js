(function() {
    const LOCAL_STORAGE_DATA_KEY = 'local_data_state';
    const defaultData = {
        type: 'object',
        key: 'window',
        value: []
    };
    
    function evaluateData(data) {
        if(data.type === 'function') {
            const func = new Function(...data.value);
            return func;
        }
        if(data.type === 'object') {
            const dataToAdd = data.value.reduce((obj, childData) => {
                obj[childData.key] = evaluateData(childData);
                return obj;
            }, {});
            return dataToAdd;
        }
		if (data.type === 'string') {
			return String(data.value[0]);
		}
		if (data.type === 'number') {
			return Number(data.value[0]);
		}
        return undefined;
    }
    
    function evalIsDataValid(data) {
        const isDataValid = data && typeof data === 'object' && Object.keys(data).length !== 0;
    
        const isRootKeyWindow = isDataValid && data.key === 'window' && data.type === 'object';
    
        return isDataValid && isRootKeyWindow;
    }
    
    function getLocalStorageData() {
        try {
            const stringifiedData = window.localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
            if (!stringifiedData) return defaultData;
    
            const parsedData = JSON.parse(stringifiedData);
            const isDataValid = evalIsDataValid(parsedData);
    
            if (isDataValid) return parsedData;
    
            return null;
        } catch (e) {
            console.log('Error getting data from localStorage', e);
            return null
        }
    }
    
    const windowExtensions = evaluateData(getLocalStorageData());
    
    if (windowExtensions && typeof windowExtensions === 'object') {
        for(const key in windowExtensions) {
            window[key] = windowExtensions[key];
        }
    }
})()
