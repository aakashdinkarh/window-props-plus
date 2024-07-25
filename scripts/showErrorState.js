const errorMessage = `Seems like there is something wrong with your data saved for last time.
Please refresh and accept the default data from prompt to continue.`;

function showErrorState() {
	const errorHeadingElement = document.createElement('h2');
	const errorElement = document.createElement('p');

	errorHeadingElement.className = 'main-error-heading';
	errorElement.className = 'main-error-message';

	errorHeadingElement.textContent = 'Something went wrong!';
	errorElement.textContent = errorMessage;

	mainElement.append(errorHeadingElement, errorElement);
}
