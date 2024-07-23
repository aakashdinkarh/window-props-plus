function showDialog(addActionButton) {
	closeDialogBox();

	const { height: dialogHeight, width: dialogWidth } = dialogBox.getBoundingClientRect();
	const containerHeight = document.body.scrollHeight;
	const containerWidth = document.body.scrollWidth;

	// Calculate position relative to the container[body]
	let { right, bottom } = addActionButton.getBoundingClientRect();
	bottom += document.body.scrollTop;
	right += document.body.scrollLeft;

	// Adjust position if dialog goes out of the right or bottom edge
	if (bottom + dialogHeight > containerHeight) bottom = containerHeight - dialogHeight;
	if (right + dialogWidth > containerWidth) right = containerWidth - dialogWidth;

	dialogBox.style.top = `${bottom}px`;
	dialogBox.style.left = `${right}px`;
	dialogBox.classList.add('open');
}

const defaultValuesMapping = {
	function: `// this is a sample function
const a = 5;
const b = 6;
return a + b;`,
	array: JSON.stringify(['Dinkar', 24, true, { role: 'Frontend Engineer' }]),
	string: 'This is sample string',
	number: '24',
	boolean: 'true',
};

const propertyPathSeparator = ' > ';

function getBoolOption(val, data) {
	const boolOption = document.createElement('button');
	boolOption.className = `custom_ace-editor bool_option ${data.value[0] === val ? 'selected' : ''}`;
	boolOption.innerText = val.toUpperCase();

	if (val === 'true') boolOption.style.marginRight = '8px';

	boolOption.onclick = () => {
		const otherBoolOption = val === 'true' ? boolOption.nextSibling : boolOption.previousSibling;
		boolOption.classList.add('selected');
		otherBoolOption.classList.remove('selected');
		data.value = [val];
	};

	return boolOption;
}

function getFuncArgumentActionContainer(data, index) {
	// action buttons container
	const actionContainer = document.createElement('div');
	actionContainer.className = 'action-container';

	// remove action button
	const removeActionButton = document.createElement('button');
	removeActionButton.className = 'action-button remove';
	removeActionButton.textContent = '-';
	removeActionButton.onclick = () => {
		data.value = data.value.filter((_, i) => i !== index);
		renderDataStructure();
	};
	actionContainer.appendChild(removeActionButton);

	return actionContainer;
}

function getActionContainer(data, parentData = null, index = null) {
	// action buttons container
	const actionContainer = document.createElement('div');
	actionContainer.className = 'action-container';

	const showAddActionButton = !['string', 'number', 'boolean', 'array'].includes(data.type);
	const showRemoveActionButton = parentData != null;
	const isFunctionDataType = data.type === 'function';

	if (showAddActionButton) {
		// add action button
		const addActionButton = document.createElement('button');
		addActionButton.className = `action-button add${isFunctionDataType ? ' function' : ''}`;
		addActionButton.textContent = '+';
		addActionButton.title = isFunctionDataType ? 'Add new argument' : 'Add object property';

		addActionButton.onclick = () => {
			if (!data || !data.value || !Array.isArray(data.value)) {
				return;
			}

			if (isFunctionDataType) {
				// push the new argument in the start
				const functionBody = data.value.pop();
				data.value.push('');
				data.value.push(functionBody);
				renderDataStructure();
			} else {
				// show dialog to choose object or function as new property
				showDialog(addActionButton);
				addPropertyForm.onsubmit = (e) => {
					e.preventDefault();
					const formData = new FormData(e.target);
					const propertyName = formData.get('property-name');
					const propertyType = formData.get('property-type');

					const defaultValue =
						propertyType in defaultValuesMapping ? [defaultValuesMapping[propertyType]] : [];

					data.value.push({
						type: propertyType,
						key: propertyName,
						value: defaultValue,
					});
					closeDialogBox();
					renderDataStructure();
				};
			}
		};
		actionContainer.appendChild(addActionButton);
	}

	if (showRemoveActionButton) {
		// remove action button
		const removeActionButton = document.createElement('button');
		removeActionButton.className = 'action-button remove';
		removeActionButton.textContent = '-';
		removeActionButton.onclick = () => {
			parentData.value = parentData.value.filter((_, i) => i !== index);
			renderDataStructure();
		};
		actionContainer.appendChild(removeActionButton);
	}

	return actionContainer;
}

function renderArrayDataType({ data, propertyPath }) {
	const aceEditor = document.createElement('div');
	aceEditor.className = `ace-editor ace_${data.type}-mode`;
	aceEditor.textContent = data.value[0];

	embedAceEditor(aceEditor, data);
	return aceEditor;
}

function renderStringDataType({ data }) {
	const aceEditor = document.createElement('div');
	aceEditor.className = `ace-editor ace_${data.type}-mode`;
	aceEditor.textContent = data.value[0];

	embedAceEditor(aceEditor, data);
	return aceEditor;
}

function renderNumberDataType({ data }) {
	const inputElement = document.createElement('input');

	inputElement.type = 'number';
	inputElement.value = data.value[0];
	inputElement.className = `custom_ace-editor ace_${data.type}-mode`;
	inputElement.onchange = (e) => {
		data.value = [e.target.value];
	};

	return inputElement;
}

function renderBooleanDataType({ data }) {
	const boolOptionTrue = getBoolOption('true', data);
	const boolOptionFalse = getBoolOption('false', data);

	return [boolOptionTrue, boolOptionFalse];
}

function renderFunctionDataType({ data, propertyPath }) {
	// make a separate function to render function and its arguments and body
	const functionBody = data.value.at(-1);

	const argumentElements = data.value.slice(0, -1).map((arg, index, arr) => {
		const containerDiv = document.createElement('div');
		containerDiv.className = 'container';

		const contentElement = document.createElement('div');
		contentElement.className = 'content';

		const typeText = document.createElement('span');
		typeText.className = 'type';
		typeText.textContent = 'argument';
		contentElement.appendChild(typeText);

		const typeTextInput = document.createElement('input');
		typeTextInput.value = arg || '';
		typeTextInput.placeholder = 'arg';
		typeTextInput.onchange = (e) => {
			data.value[index] = e.target.value;
		};
		contentElement.appendChild(typeTextInput);

		const actionContainer = getFuncArgumentActionContainer(data, index);

		containerDiv.append(contentElement, actionContainer);
		return containerDiv;
	});

	const aceEditor = document.createElement('div');
	aceEditor.className = 'ace-editor';
	aceEditor.textContent = functionBody;

	embedAceEditor(aceEditor, data);

	return [...argumentElements, aceEditor];
}

function renderObjectData({ data, parentData = null, index = null, parentPath = '' }) {
	const sectionElement = document.createElement('section');
	const propertyPath = parentPath ? parentPath + propertyPathSeparator + data.key : data.key;

	const containerDiv = document.createElement('div');
	containerDiv.className = 'container';

	const contentElement = document.createElement('div');
	contentElement.className = 'content';

	if (data.type) {
		const typeText = document.createElement('span');
		typeText.className = 'type';
		typeText.textContent = data.type;
		contentElement.appendChild(typeText);
	}
	if (data.key) {
		const typeTextInput = document.createElement('input');
		typeTextInput.value = data.key;
		typeTextInput.onchange = (e) => {
			data.key = e.target.value;
		};
		if (!parentData) {
			typeTextInput.readOnly = true;
		}
		contentElement.appendChild(typeTextInput);
	}

	const actionContainer = getActionContainer(data, parentData, index);
	containerDiv.append(contentElement, actionContainer);

	sectionElement.append(containerDiv);

	if (data.type === 'object' && data.value && Array.isArray(data.value)) {
		data.value.forEach((childData, index) => {
			const childContent = renderObjectData({
				data: childData,
				parentData: data,
				index,
				parentPath: propertyPath,
			});
			sectionElement.append(childContent);
		});
	} else if (data.type === 'function') {
		const childContent = renderFunctionDataType({ data, propertyPath });
		sectionElement.append(...childContent);
	} else if ('array' === data.type) {
		const childContent = renderArrayDataType({ data, propertyPath });
		sectionElement.append(childContent);
	} else if ('string' === data.type) {
		const childContent = renderStringDataType({ data, propertyPath });
		sectionElement.append(childContent);
	} else if ('number' === data.type) {
		const childContent = renderNumberDataType({ data, propertyPath });
		sectionElement.append(childContent);
	} else if ('boolean' === data.type) {
		const childContent = renderBooleanDataType({ data, propertyPath });
		sectionElement.append(...childContent);
	}

	return sectionElement;
}

function renderDataStructure(data = INITIAL_DATA) {
	const dataStructure = renderObjectData({ data });

	mainElement.replaceChildren(dataStructure);
}
