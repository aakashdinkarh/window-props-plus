function showErrorState(){
	const mainElement = document.getElementsByTagName('main')[0];

    let errorMessage = 'Seems like there is something wrong with your data saved for last time.';
    errorMessage += '\n Please refresh and accept the default data from prompt to continue.'

    const errorHeadingElement = document.createElement('h2');
    const errorElement = document.createElement('p');

    errorHeadingElement.className = 'error-heading';
    errorElement.className = 'error-message';

    errorHeadingElement.textContent = 'Something went wrong!';
    errorElement.textContent = errorMessage;

    mainElement.append(errorHeadingElement, errorElement);
}