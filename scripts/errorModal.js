function isKeyInObject(key, object, type) {
	const isKeyPresent = object && typeof object === 'object' && key in object;
	const isTypeMatch = type ? isKeyPresent && typeof object[key] === type : true;
	return isKeyPresent && isTypeMatch;
}

function isEditorFieldsValid() {
	const errors = {};
	let isValid = true;

	for (const editorKey in ACE_EDITORS_MAPPING) {
		const session =
			isKeyInObject('getSession', ACE_EDITORS_MAPPING[editorKey], 'function') &&
			ACE_EDITORS_MAPPING[editorKey].getSession();

		const errs =
			session &&
			isKeyInObject('getAnnotations', session, 'function') &&
			session.getAnnotations().filter((err) => err.type === 'error');

		if (errs.length) {
			isValid = false;
			errors[editorKey] = errs;
		}
	}

	return { isValid, errors };
}

function onErrorModalClose() {
	errorModal.classList.add('closed');
	modalBg.classList.add('closed');

	errorDetailContainer.replaceChildren(...[]);
}

function showErrorModal(errors = {}) {
	const errorChildren = [];

	for (const editorKey in errors) {
		const errs = errors[editorKey];

		const errorDetail = document.createElement('div');
		errorDetail.className = 'error-detail';

		const editorKeyText = document.createElement('b');
		editorKeyText.innerText = `${editorKey} :`;

		const errMessages = errs.map((err) => {
			const errorText = document.createElement('p');
			errorText.className = 'error-message';
			errorText.innerText = err.text;
			return errorText;
		});

		errorDetail.append(editorKeyText, ...errMessages);
		errorChildren.push(errorDetail);
	}

	errorDetailContainer.replaceChildren(...errorChildren);
	errorModal.classList.remove('closed');
	modalBg.classList.remove('closed');
}
