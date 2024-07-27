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
			}
		}
	);

	if (val === 'true') boolOption.style.marginRight = '8px';

	return boolOption;
}

function getFuncArgumentActionContainer(data, index) {
	// action buttons container
	const actionContainer = createElement('div', 'action-container');

	// remove action button
	const removeActionButton = createElement('button', 'action-button remove', '-', {
		onclick: () => {
			data.value = data.value.filter((_, i) => i !== index);
			renderDataStructure();
		}
	});
	actionContainer.appendChild(removeActionButton);

	return actionContainer;
}

function getActionContainer(data, parentData = null, index = null) {
	// action buttons container
	const actionContainer = createElement('div', 'action-container');

	const showAddActionButton = !['string', 'number', 'boolean', 'array'].includes(data.type);
	const showRemoveActionButton = parentData != null;
	const isFunctionDataType = data.type === 'function';

	if (showAddActionButton) {
		// add action button
		const addActionButton = createElement(
			'button',
			`action-button add${isFunctionDataType ? ' function' : ''}`,
			'+',
			{
				title: isFunctionDataType ? 'Add new argument' : 'Add object property',
			}
		);
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
		const removeActionButton = createElement('button', 'action-button remove', '-', {
			onclick: () => {
				parentData.value = parentData.value.filter((_, i) => i !== index);
				renderDataStructure();
			}
		});
		actionContainer.appendChild(removeActionButton);
	}

	return actionContainer;
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
		});
		inputElement.onchange = (e) => {
			data.value = [e.target.value];
		};
		return inputElement;
	},
	boolean: ({ data }) => {
		return [getBoolOption('true', data), getBoolOption('false', data)];
	},
	function: ({ data, propertyPath }) => {
		const functionBody = data.value.at(-1);
		const argumentElements = data.value.slice(0, -1).map((arg, index) => {
			const containerDiv = createElement('div', 'container');

			const contentElement = createElement('div', 'content');

			const typeText = createElement('span', 'type', 'argument');
			contentElement.appendChild(typeText);

			const typeTextInput = createElement('input', null, null, {
				value: arg || '',
				placeholder: 'arg',
			});
			typeTextInput.onchange = (e) => {
				data.value[index] = e.target.value;
			};
			contentElement.appendChild(typeTextInput);

			const actionContainer = getFuncArgumentActionContainer(data, index);

			containerDiv.append(contentElement, actionContainer);
			return containerDiv;
		});

		const aceEditor = createElement('div', 'ace-editor', functionBody);

		embedAceEditor({ element: aceEditor, data, propertyPath });

		return [...argumentElements, aceEditor];
	},
};

function renderObjectData({ data, parentData = null, index = null, parentPath = '' }) {
	const sectionElement = createElement('section');
	const propertyPath = parentPath ? `${parentPath}${propertyPathSeparator}${data.key}` : data.key;

	const containerDiv = createElement('div', 'container');

	const contentElement = createElement('div', 'content');

	if (data.type) {
		contentElement.appendChild(createElement('span', 'type', data.type));
	}
	if (data.key) {
		const typeTextInput = createElement('input', null, null, {
			value: data.key,
			readonly: !parentData,
		});
		typeTextInput.onchange = (e) => {
			data.key = e.target.value;
		};
		contentElement.appendChild(typeTextInput);
	}

	const actionContainer = getActionContainer(data, parentData, index);
	containerDiv.append(contentElement, actionContainer);

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
