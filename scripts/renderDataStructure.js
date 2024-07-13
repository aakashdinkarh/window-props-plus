function showDialog(addActionButton) {
    closeDialogBox();
    const { right, bottom } = addActionButton.getBoundingClientRect();
    dialogBox.style.top = `${bottom + window.scrollY}px`;
    dialogBox.style.left = `${right + window.scrollX}px`;
    dialogBox.show();
    dialogBox.classList.add('open');
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

	// add action button
	const addActionButton = document.createElement('button');
	addActionButton.className = 'action-button add';
	addActionButton.textContent = '+';
    addActionButton.title = 'Add object property';

	addActionButton.onclick = () => {
		if (!data || !data.value || !Array.isArray(data.value)) {
			return;
		}

		if (data.type === 'function') {
			// directly add argument field
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
	
				data.value.push({
					type: propertyType,
					key: propertyName,
					value: [],
				});
				closeDialogBox();
				renderDataStructure();
			}
		}

	};
	actionContainer.appendChild(addActionButton);

	if (parentData != null) {
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

function renderFunctionData(data) {
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
		}
		contentElement.appendChild(typeTextInput);

		const actionContainer = getFuncArgumentActionContainer(data, index);

		containerDiv.append(contentElement, actionContainer);
		return containerDiv;
	})

	const aceEditor = document.createElement('div');
	aceEditor.className = 'ace-editor';
	aceEditor.textContent = functionBody;

	embedAceEditor(aceEditor, data);

	return [...argumentElements, aceEditor];
}

function renderObjectData(data, parentData = null, index = null) {
	const sectionElement = document.createElement('section');

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
        }
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
			const childContent = renderObjectData(childData, data, index);
			sectionElement.append(childContent);
		});
	} else if (data.type === 'function') {
		const childContent = renderFunctionData(data);
		sectionElement.append(...childContent);
	}

	return sectionElement;
}

function renderDataStructure(data = INITIAL_DATA) {
	const mainElement = document.getElementsByTagName('main')[0];

	const dataStructure = renderObjectData(data);

	mainElement.replaceChildren(dataStructure);
}
