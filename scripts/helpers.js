const createElement = (tagName, className, textContent, options = {}) => {
	const element = document.createElement(tagName);

	if (className) {
		element.class = className;
	}

	if (textContent) {
		element.textContent = textContent;
	}

    for (const attr in options) {
        const attrValue = options[attr];
        element.setAttribute(attr, attrValue);
    }

	return element;
};
