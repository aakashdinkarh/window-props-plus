const mainElement = document.getElementsByTagName('main')[0];
const dialogBox = document.getElementsByClassName('dialog')[0];
const addPropertyForm = document.getElementById('add-property-form');
const saveToLocalStorageBtnContainer = document.getElementsByClassName('save-to-local-storage-btn-container')[0];
const saveToLocalStorageButton = document.getElementById('save-to-local-storage');

const LOCAL_STORAGE_DATA_KEY = 'local_data_state';
let INITIAL_DATA = {}

function closeDialogBox() {
    dialogBox.classList.remove('open');
    addPropertyForm.reset();
}
function cancelForm() {
    closeDialogBox();
}
addPropertyForm.addEventListener('reset', cancelForm);

function handleClickOutside(event) {
    if (!dialogBox.contains(event.target) && event.target.className !== 'action-button add') {
        closeDialogBox();
    }
}
document.addEventListener('click', handleClickOutside);

(async function(){
    INITIAL_DATA = await evaluateLocalStorage();
    
    if(INITIAL_DATA !== null) {
        renderDataStructure(INITIAL_DATA);
        function eventListenerForSaveButton (data) {
            updateLocalStorage(LOCAL_STORAGE_DATA_KEY, data);
        }
        
        saveToLocalStorageButton.addEventListener('click', () => eventListenerForSaveButton(INITIAL_DATA))
        
        document.addEventListener('DOMContentLoaded', function () {
            loadAceEditor();
        });
    } else {
        saveToLocalStorageButton.style.display = 'none';
        showErrorState();
    }
})();

