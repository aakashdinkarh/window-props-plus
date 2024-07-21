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
		useWorker: false, // not able to use workers due to CSP of chrome extensions
		loadWorkerFromBlob: false,
	});

	return editor;
}

function editorHandleString(editor) {
	editor.session.setMode('ace/mode/text');
}

function handleJsonParsing(editor){
	const error = parseValueForJSON(editor.getValue());
	editor.getSession().setAnnotations(error);
}
function editorHandleArray(editor) {
	editor.session.setMode('ace/mode/json');

	// initial parsing
	handleJsonParsing(editor)

	editor.session.on('change', function () {
		handleJsonParsing(editor)
	});
}

function getJavaScriptWorker(editor){
	let worker = null;
	if (window.Worker) {
		try {
			worker = new Worker(chrome.runtime.getURL('scripts/aceEditor/parseErrors/js.js'));
	
			worker.onmessage = (e) => {
				try {
					const { event, data: error } = e.data || {};
					if (event === 'annotate' && error) {
						editor.getSession().setAnnotations(error);
					}
				} catch (err) {
					console.error('Error getting or setting syntax errors for the editor', err);
				}
			}
		} catch (err) {
			console.error('Error setting up web worker for ace-editor', err);
		}
	} else {
		console.log('Your browser doesn\'t support web workers.');
	}

	return worker;
}
function editorHandleFunction(editor) {
	editor.session.setMode('ace/mode/javascript');

	const worker = getJavaScriptWorker(editor);

	// initial parsing
	worker && worker.postMessage({ 
		type: 'event',
		event: 'initial',
		editorValue: editor.getValue(),
	})

	editor.session.on('change', function () {
		worker && worker.postMessage({ 
			type: 'event',
			event: 'change',
			editorValue: editor.getValue(),
		})
	});
}

async function embedAceEditor(element, dataObject) {
	// Initialize Ace Editor
	const isAceEditorAdded = await loadAceEditor();

	if (!isAceEditorAdded) return;

	const editor = editorCommonOptions(element);
	editor.session.on('change', function () {
		const content = editor.getValue();
		dataObject.value = [content];
	});

	switch (dataObject.type) {
		case 'string': 
			editorHandleString(editor);
			break;
		case 'array':
			editorHandleArray(editor);
			break;
		case 'function':
			editorHandleFunction(editor);
			break;
		default :
			break;
	}
}
