// cdnPrefix = https://cdnjs.cloudflare.com/ajax/libs/ace/1.35.3/
const ACE_EDITOR_SCRIPTS = ['scripts/aceEditor/ace.js'];
const ACE_EDITOR_SCRIPTS_LOADED_STATUS = new Array(ACE_EDITOR_SCRIPTS.length).fill(false);

let isAceEditorAdded = false;

// Use an efficient way to load scripts
function loadScript(src, index) {
	return new Promise((resolve, reject) => {
		if (ACE_EDITOR_SCRIPTS_LOADED_STATUS[index]) {
			resolve(true);
			return;
		}

		const script = document.createElement('script');
		script.src = src;
		script.async = true;

		script.onload = () => {
			ACE_EDITOR_SCRIPTS_LOADED_STATUS[index] = true;
			resolve(true);
		};

		script.onerror = () => {
			ACE_EDITOR_SCRIPTS_LOADED_STATUS[index] = false;
			reject(new Error(`Failed to load script: ${src}`));
		};

		document.head.appendChild(script);
	});
}

// Use Promise.all for parallel script loading
async function loadAceEditor() {
	if (isAceEditorAdded) {
		return true;
	}

	try {
		await Promise.all(ACE_EDITOR_SCRIPTS.map((script, index) => loadScript(script, index)));
		isAceEditorAdded = true;
		ace.config.set('loadWorkerFromBlob', false);
		return true;
	} catch (error) {
		console.error('Failed to load Ace Editor:', error);
		return false;
	}
}

// Memoize common editor options
const memoizedEditorOptions = (() => {
	const options = {
		theme: 'ace/theme/dracula',
		tabSize: 2,
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
	};
	return (element) => {
		const editor = ace.edit(element);
		editor.setOptions(options);
		return editor;
	};
})();

// Use a map for editor modes
const EDITOR_MODES = new Map([
	['string', 'text'],
	['array', 'json'],
	['function', 'javascript'],
]);

async function embedAceEditor({ element, data, propertyPath = '' }) {
	if (!(await loadAceEditor())) return;

	const editor = memoizedEditorOptions(element);

	if (propertyPath) {
		ACE_EDITORS_MAPPING.set(propertyPath, editor);
	}

	editor.session.on('change', () => {
		data.value = [editor.getValue()];
	});

	const mode = EDITOR_MODES.get(data.type) || 'text';
	editor.session.setMode(`ace/mode/${mode}`);
}
