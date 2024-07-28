const mainElement = document.querySelector('main');
const dialogBox = document.querySelector('.dialog');
const addPropertyForm = document.getElementById('add-property-form');
const saveToLocalStorageBtnContainer = document.querySelector('.save-to-local-storage-btn-container');
const saveToLocalStorageButton = document.getElementById('save-to-local-storage');
const modalBg = document.querySelector('.modal-background');
const errorModal = document.querySelector('.error-modal.modal');
const errorModalCloseButton = errorModal.querySelector('.close-modal');
const errorDetailContainer = errorModal.querySelector('.error-detail-container');

const ACE_EDITORS_MAPPING = new Map();
const LOCAL_STORAGE_DATA_KEY = 'local_data_state';
let INITIAL_DATA = {};

const closeDialogBox = () => {
	dialogBox.classList.remove('open');
	addPropertyForm.reset();
};

const handleClickOutside = (event) => {
	if (!dialogBox.contains(event.target) && event.target.className !== 'action-button add') {
		closeDialogBox();
	}
};

const eventListenerForSaveButton = (data) => {
	const { isValid, errors } = isEditorFieldsValid();

	if (!isValid) {
		showErrorModal(errors);
		return;
	}

	updateLocalStorage(LOCAL_STORAGE_DATA_KEY, data);
};

// Event Listeners
errorModalCloseButton.addEventListener('click', onErrorModalClose);
addPropertyForm.addEventListener('reset', closeDialogBox);
document.addEventListener('click', handleClickOutside);

// Initialize application
(async () => {
	try {
		INITIAL_DATA = await evaluateLocalStorage();

		if (INITIAL_DATA !== null) {
			renderDataStructure(INITIAL_DATA);

			saveToLocalStorageButton.addEventListener('click', () => eventListenerForSaveButton(INITIAL_DATA));

			document.addEventListener('DOMContentLoaded', loadAceEditor);
			return;
		} else {
			throw new Error('No data found in local storage');
		}
	} catch (error) {
		saveToLocalStorageButton.style.display = 'none';
		console.error('Initialization error:', error);
		showErrorState();
	}
})();
