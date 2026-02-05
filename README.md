# Window Props Plus [Chrome Extension]

## Overview

This Chrome extension allows users to add custom properties to the global window object with an intuitive and interactive user interface. It's a powerful tool for web developers and testers who need to manipulate the window object on the fly.

## Features

- Add custom properties of various types (string, number, boolean, array, object, function) to the window object
- Intuitive UI for easy property management
- Syntax highlighting helps identify and reduce errors in property values.
- Updates to the window object upon saving changes and page reload
- Persistent storage of custom properties across page reloads
- Error handling and logging for robustness

## Installation

### For Development

1. Clone this repository or download the source code
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open Chrome and navigate to `chrome://extensions`
5. Enable "Developer mode" in the top right corner
6. Click "Load unpacked" and select the `dist` directory

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Build in watch mode for development |
| `npm run build` | Production build to `dist/` folder |
| `npm run build:zip` | Build and create a zip file for Chrome Web Store upload |
| `npm run clean` | Remove the `dist/` folder |

## Usage
1. Click on the extension icon in your Chrome extension toolbar to open the UI, you will see the following **Initial Default View**.
<img width="517" alt="Screenshot 2025-01-25 at 6 17 07 PM" src="https://github.com/user-attachments/assets/d89ca2b5-6ee7-4304-8fac-208afa928f3c" />

2. Click on the "+" button, next to property name, to add new property or method.
- Select the property type and enter the property name
<img width="517" alt="Screenshot 2025-01-25 at 6 19 02 PM" src="https://github.com/user-attachments/assets/9b101ff3-ea1e-4b53-be3d-9fea8f5937a9" />

3. For each property type (except object), there is a default value provided for convenience, update the value as per your requirement.
<img width="517" alt="Screenshot 2025-01-25 at 6 39 34 PM" src="https://github.com/user-attachments/assets/de2f1c95-0bfb-46a8-9e61-be2db914622d" />

4. The properties added would be available on the window object after saving the changes and reloading the page.
<img width="316" alt="Screenshot 2025-01-25 at 6 42 42 PM" src="https://github.com/user-attachments/assets/7871ccde-73ae-49e8-bc59-a64938a91517" />

## Technical Details

- The extension uses content scripts to inject the custom properties into the page's window object
- Local storage is used to persist the property data between sessions
- The UI is built with vanilla JavaScript for optimal performance
- Ace editor is integrated for editing function and object properties

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
