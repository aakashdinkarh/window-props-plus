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

function showErrorModal(errors = {}) {
	const fragment = document.createDocumentFragment();

	for (const editorKey in errors) {
		const errs = errors[editorKey];

		const errorDetail = createElement('div', 'error-detail');
		const editorKeyText = createElement('b', null, `${editorKey} :`);

		errorDetail.appendChild(editorKeyText);
		errs.forEach((err) => {
			errorDetail.appendChild(createElement('p', 'error-message', err.text));
		});

		fragment.appendChild(errorDetail);
	}

	errorDetailContainer.appendChild(fragment);
	errorModal.classList.remove('closed');
	modalBg.classList.remove('closed');
}
