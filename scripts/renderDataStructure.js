const propertyPathSeparator = ' > ';

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

function getBoolOption(val, data) {
	const boolOption = createElement(
		'button',
		`custom_ace-editor bool_option ${data.value[0] === val ? 'selected' : ''}`,
		val.toUpperCase(),
		{
			onclick: () => {
				const otherBoolOption = val === 'true' ? boolOption.nextSibling : boolOption.previousSibling;
				boolOption.classList.add('selected');
				otherBoolOption.classList.remove('selected');
				data.value = [val];
			},
		}
	);

	if (val === 'true') boolOption.style.marginRight = '8px';

	return boolOption;
}

const addPropertyFormOnSubmit = (e, data) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const propertyName = formData.get('property-name');
	const propertyType = formData.get('property-type');

	const defaultValue = propertyType in defaultValuesMapping ? [defaultValuesMapping[propertyType]] : [];

	data.value.push({
		type: propertyType,
		key: propertyName,
		value: defaultValue,
	});
	closeDialogBox();
	renderDataStructure();
};

function getRemoveActionButton(data, index) {
	const removeActionButton = createElement('button', 'action-button remove', '-', {
		onclick: () => {
			data.value = data.value.filter((_, i) => i !== index);
			renderDataStructure();
		},
	});
	return removeActionButton;
}

function getAddActionButton(data) {
	const isFunctionDataType = data.type === 'function';

	const addActionButton = createElement('button', `action-button add${isFunctionDataType ? ' function' : ''}`, '+', {
		title: isFunctionDataType ? 'Add new argument' : 'Add object property',
	});
	addActionButton.onclick = () => {
		if (!Array.isArray(data.value)) {
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
			addPropertyForm.onsubmit = (e) => addPropertyFormOnSubmit(e, data);
		}
	};
	return addActionButton;
}

// action buttons container
function getFuncArgumentActionContainer(data, index) {
	const actionContainer = createElement('div', 'action-container');
	const removeActionButton = getRemoveActionButton(data, index);

	actionContainer.appendChild(removeActionButton);

	return actionContainer;
}

// action buttons container
function getActionContainer(data, parentData = null, index = null) {
	const actionContainer = createElement('div', 'action-container');

	const showAddActionButton = ['object', 'function'].includes(data.type);
	const showRemoveActionButton = parentData != null;

	showAddActionButton && actionContainer.appendChild(getAddActionButton(data));
	showRemoveActionButton && actionContainer.appendChild(getRemoveActionButton(parentData, index));

	return actionContainer;
}

function getContainerDiv(
	type,
	{ typeTextVal, isTypeTextReadOnly, typeTextPlaceholder, typeTextOnChange },
	getActionContainerFunc
) {
	const containerDiv = createElement('div', 'container');
	const contentElement = createElement('div', 'content');
	contentElement.appendChild(createElement('span', 'type', type));

	const typeTextInput = createElement('input', null, null, {
		value: typeTextVal || '',
		placeholder: typeTextPlaceholder || '',
		readOnly: isTypeTextReadOnly,
		onchange: typeTextOnChange,
	});
	contentElement.appendChild(typeTextInput);

	const actionContainer = getActionContainerFunc();

	containerDiv.append(contentElement, actionContainer);
	return containerDiv;
}

const renderDataTypeFunctions = {
	array: ({ data, propertyPath }) => {
		const aceEditor = createElement('div', `ace-editor ace_${data.type}-mode`, data.value[0]);
		embedAceEditor({ element: aceEditor, data, propertyPath });
		return aceEditor;
	},
	string: ({ data }) => {
		const aceEditor = createElement('div', `ace-editor ace_${data.type}-mode`, data.value[0]);
		embedAceEditor({ element: aceEditor, data });
		return aceEditor;
	},
	number: ({ data }) => {
		const inputElement = createElement('input', `custom_ace-editor ace_${data.type}-mode`, null, {
			type: 'number',
			value: data.value[0],
			onchange: (e) => {
				data.value = [e.target.value];
			},
			onblur: () => {
				inputElement.value === '' && (inputElement.value = 0);
			},
		});
		return inputElement;
	},
	boolean: ({ data }) => {
		return [getBoolOption('true', data), getBoolOption('false', data)];
	},
	function: ({ data, propertyPath }) => {
		const functionBody = data.value.at(-1);
		const argumentElements = data.value.slice(0, -1).map((arg, index) =>
			getContainerDiv(
				'argument',
				{
					typeTextVal: arg,
					isTypeTextReadOnly: false,
					typeTextPlaceholder: 'arg',
					typeTextOnChange: (e) => {
						data.value[index] = e.target.value;
					},
				},
				() => getFuncArgumentActionContainer(data, index)
			)
		);

		const aceEditor = createElement('div', 'ace-editor', functionBody);
		embedAceEditor({ element: aceEditor, data, propertyPath });

		return [...argumentElements, aceEditor];
	},
};

function renderObjectData({ data, parentData = null, index = null, parentPath = '' }) {
	const sectionElement = createElement('section');
	const propertyPath = parentPath ? `${parentPath}${propertyPathSeparator}${data.key}` : data.key;

	const containerDiv = getContainerDiv(
		data.type,
		{
			typeTextVal: data.key,
			isTypeTextReadOnly: !parentData,
			typeTextPlaceholder: 'property name',
			typeTextOnChange: (e) => {
				data.key = e.target.value;
			},
		},
		() => getActionContainer(data, parentData, index)
	);

	sectionElement.append(containerDiv);

	if (data.type === 'object' && Array.isArray(data.value)) {
		data.value.forEach((childData, index) => {
			const childContent = renderObjectData({
				data: childData,
				parentData: data,
				index,
				parentPath: propertyPath,
			});
			sectionElement.append(childContent);
		});
	} else {
		const childContent = renderDataTypeFunctions[data.type]
			? renderDataTypeFunctions[data.type]({ data, propertyPath })
			: [];
		sectionElement.append(...(Array.isArray(childContent) ? childContent : [childContent]));
	}

	return sectionElement;
}

function renderDataStructure(data = INITIAL_DATA) {
	const dataStructure = renderObjectData({ data });
	mainElement.replaceChildren(dataStructure);
}
