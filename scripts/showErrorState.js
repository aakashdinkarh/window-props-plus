import { createElement } from "./helpers.js";
import { mainElement } from "./onPageLoad.js";

// this messaged can be changes from evaluateLocalStorage function
export const errorDetails = {
	errorMessage: 'Seems like there is something wrong with your data saved for last time.',
	subErrorMessage: 'Please refresh and accept the default data from prompt to continue.',
};

export const showErrorState = () => {
	const errorHeadingElement = createElement('h2', 'main-error-heading', 'Something went wrong!');
	const errorElement = createElement('p', 'main-error-message', errorDetails.errorMessage);
	const subErrorElement = createElement('p', 'main-error-message', errorDetails.subErrorMessage);

	mainElement.append(errorHeadingElement, errorElement, subErrorElement);
}
