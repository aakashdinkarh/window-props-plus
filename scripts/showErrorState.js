// this messaged can be changes from evaluateLocalStorage function
let errorMessage = 'Seems like there is something wrong with your data saved for last time.';
let subErrorMessage = 'Please refresh and accept the default data from prompt to continue.'

function showErrorState() {
	const errorHeadingElement = document.createElement('h2');
	const errorElement = document.createElement('p');
	const subErrorElement = document.createElement('p');

	errorHeadingElement.className = 'main-error-heading';
	errorElement.className = 'main-error-message';
	subErrorElement.className = 'main-error-message';

	errorHeadingElement.textContent = 'Something went wrong!';
	errorElement.textContent = errorMessage;
	subErrorElement.textContent = subErrorMessage;

	mainElement.append(errorHeadingElement, errorElement, subErrorElement);
}
