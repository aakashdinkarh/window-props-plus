# Custom Properties to Window Chrome Extension

## Overview

This Chrome extension allows users to add custom properties to the global window object with an intuitive and interactive user interface. It's a powerful tool for web developers and testers who need to manipulate the window object on the fly.

## Features

- Add custom properties of various types (string, number, boolean, array, object, function) to the window object
- Intuitive UI for easy property management
- Updates to the window object upon saving changes and page reload
- Persistent storage of custom properties across page reloads
- Error handling and logging for robustness

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

1. Click on the extension icon in your Chrome toolbar to open the UI
2. Use the "+" button to add new properties
3. Select the property type and enter the property name
4. For complex types like objects and functions, use the provided editor to define the structure or code
5. Use the action buttons to edit, remove, or add child properties as needed
6. Your custom properties will be available on the window object after saving changes and reloading the page

## Technical Details

- The extension uses content scripts to inject the custom properties into the page's window object
- Local storage is used to persist the property data between sessions
- The UI is built with vanilla JavaScript for optimal performance
- Ace editor is integrated for editing function and object properties

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
