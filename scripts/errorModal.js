function isKeyInObject(key, object, type) {
	const isKeyPresent = object && typeof object === 'object' && key in object;
	const isTypeMatch = type ? isKeyPresent && typeof object[key] === type : true;
	return isKeyPresent && isTypeMatch;
}

function isEditorFieldsValid() {
	const errors = {};
	let isValid = true;

	for (const [editorKey, editor] in ACE_EDITORS_MAPPING) {
		const session = isKeyInObject('getSession', editor, 'function') && editor.getSession();

		const errs =
			session &&
			isKeyInObject('getAnnotations', session, 'function') &&
			session.getAnnotations().filter((err) => err.type === 'error');

		if (errs && errs.length) {
			isValid = false;
			errors[editorKey] = errs;
		}
	}

	return { isValid, errors };
}

function onErrorModalClose() {
	errorModal.classList.add('closed');
	modalBg.classList.add('closed');
	errorDetailContainer.innerHTML = '';
}

function createErrorMessage(text) {
	const errorText = document.createElement('p');
	errorText.className = 'error-message';
	errorText.textContent = text;
	return errorText;
}

function showErrorModal(errors = {}) {
	const fragment = document.createDocumentFragment();

	for (const editorKey in errors) {
		const errs = errors[editorKey];

		const errorDetail = document.createElement('div');
		errorDetail.className = 'error-detail';

		const editorKeyText = document.createElement('b');
		editorKeyText.textContent = `${editorKey} :`;

		errorDetail.appendChild(editorKeyText);
		errs.forEach((err) => {
			errorDetail.appendChild(createErrorMessage(err.text));
		});

		fragment.appendChild(errorDetail);
	}

	errorDetailContainer.appendChild(fragment);
	errorModal.classList.remove('closed');
	modalBg.classList.remove('closed');
}
