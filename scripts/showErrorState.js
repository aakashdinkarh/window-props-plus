// this messaged can be changes from evaluateLocalStorage function
let errorMessage = 'Seems like there is something wrong with your data saved for last time.';
let subErrorMessage = 'Please refresh and accept the default data from prompt to continue.'

function showErrorState() {
	const errorHeadingElement = createElement('h2', 'main-error-heading', 'Something went wrong!');
	const errorElement = createElement('p', 'main-error-message', errorMessage);
	const subErrorElement = createElement('p', 'main-error-message', subErrorMessage);

	mainElement.append(errorHeadingElement, errorElement, subErrorElement);
}
