let isAceEditorAdded = false;

// cdnPrefix = https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.3/
const aceEditorScripts = ['scripts/aceEditor/ace.js', 'scripts/aceEditor/ext-language_tools.js'];
const aceEditorScriptsLoadedStatus = [false, false];

async function loadScript(src, index) {
	return new Promise((resolve, reject) => {
		if (aceEditorScriptsLoadedStatus[index]) {
			resolve(true);
		}
		const script = document.createElement('script');
		script.src = src;
		script.onload = () => {
			aceEditorScriptsLoadedStatus[index] = true;
			resolve(true);
		};
		script.onerror = () => {
			aceEditorScriptsLoadedStatus[index] = false;
			reject(false);
		};
		document.head.append(script);
	});
}

async function loadAceEditor() {
	// Ace Editor CDN
	if (isAceEditorAdded) {
		return Promise.resolve(true);
	}

	try {
		const scriptLoadPromises = aceEditorScripts.map((script, index) => loadScript(script, index));
		await Promise.allSettled(scriptLoadPromises);
		isAceEditorAdded = true;
		return Promise.resolve(true);
	} catch (e) {
		return Promise.reject(false);
	}
}

async function embedAceEditor(element, dataObject) {
	// Initialize Ace Editor
	const isAceEditorAdded = await loadAceEditor();

	if (!isAceEditorAdded) return;

	const editor = ace.edit(element);

	if (dataObject.type === 'string') {
		editor.session.setMode('ace/mode/text');
	} else if (dataObject.type === 'array') {
		editor.session.setMode('ace/mode/json');
	} else {
		editor.session.setMode('ace/mode/javascript');
	}
	editor.setTheme('ace/theme/dracula');
	// Set the default tab size
	editor.session.setTabSize(2);
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: true,
		enableSnippets: true,
		maxLines: 4,
		minLines: 2,
		highlightActiveLine: true,
		highlightGutterLine: true,
		showLineNumbers: true,
		showGutter: true,
		showPrintMargin: false,
		readOnly: false,
		fontSize: '12px',
		wrap: false,
	});

	editor.session.on('change', function () {
		const content = editor.getValue();
		dataObject.value = [content];
	});
}
