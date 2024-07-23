let isAceEditorAdded = false;

// cdnPrefix = https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.3/
const aceEditorScripts = ['scripts/aceEditor/ace.js'];
const aceEditorScriptsLoadedStatus = [false];

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

function editorCommonOptions(element) {
	const editor = ace.edit(element);

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

	return editor;
}

async function embedAceEditor({ element, data, propertyPath = '' }) {
	// Initialize Ace Editor
	const isAceEditorAdded = await loadAceEditor();

	if (!isAceEditorAdded) return;

	// avoiding CSP of loading worker via blob
	ace.config.set('loadWorkerFromBlob', false);
	const editor = editorCommonOptions(element);

	editor.session.on('change', function () {
		const content = editor.getValue();
		data.value = [content];
	});

	if (propertyPath) {
		ACE_EDITORS_MAPPING[propertyPath] = editor;
	}

	switch (data.type) {
		case 'string':
			editor.session.setMode('ace/mode/text');
			break;
		case 'array':
			editor.session.setMode('ace/mode/json');
			break;
		case 'function':
			editor.session.setMode('ace/mode/javascript');
			break;
		default:
			break;
	}
}
