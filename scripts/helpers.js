const createElement = (tagName, className, textContent, options = {}) => {
	const element = document.createElement(tagName);

	const { readOnly, ...restOptions } = options;

	if (className) {
		element.className = className;
	}

	if (textContent) {
		element.textContent = textContent;
	}

	if (readOnly) {
		element.readOnly = true;
	}

	for (const attr in restOptions) {
		const attrValue = restOptions[attr];

		if (typeof attrValue === 'string') {
			// used for attributes whose value are string
			element.setAttribute(attr, restOptions[attr]);
		} else {
			element[attr] = restOptions[attr];
		}
	}

	return element;
};
