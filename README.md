# Uworld2Anki

Uworld2Anki is a Chrome extension designed to streamline the process of creating high-yield Anki flashcards from UWorld educational objectives. By leveraging OpenAI's ChatGPT API, the extension extracts educational objectives from UWorld pages and converts them into cloze-style Anki cards.

Coming soon: 
- image support & multiple card generation
- table support

## Features

- Extracts educational objectives from UWorld pages.
- Converts objectives into cloze-style Anki cards using the {{c1::...}} format.
- Customizable prompt templates for generating cards.
- Uses a specially fine-tuned model for card generation thats trained on thousands of Anki cards.
- Simple UI for generating and copying cards.

## Installation

1. Download and extract the latest version from the "releases" tab.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the project folder.
5. The extension will now appear in your Chrome extensions list.

## Usage

1. Open a UWorld question page in Chrome.
2. Click the Uworld2Anki extension icon in the toolbar.
3. Click the **Generate Anki Card** button.
4. Copy the generated card text and paste it into your Anki deck.

## Configuration

To configure the extension:

1. Open the extension's **Options** page.
2. Set your OpenAI API key, prompt template, and other settings.
3. Save your changes.

## Files

- `popup.js`: Handles the UI logic for generating and copying cards.
- `background.js`: Manages communication with the OpenAI API.
- `options.js`: Handles saving and loading user settings.
- `manifest.json`: Defines the extension's metadata and permissions.
- `popup.html`: The main UI for the extension.
- `options.html`: The settings page for the extension.

## Requirements

- Valid OpenAI API key.
- UWorld account.
- Chrome browser with extensions enabled.
- Anki with Cloze card type.

## Privacy Policy

Your privacy is important. I do not collect or store any user data. Please review the [Privacy Policy](https://roshanlodha.com/uworld2anki/privacy_policy) for details on how your data is handled.

## License

This project is licensed under the [MIT License](LICENSE.md). See the LICENSE file for details.

## Disclaimer

This extension is not affiliated with UWorld or Anki. Use it responsibly and ensure compliance with UWorld's terms of service. Uworld2Anki was developed and tested using the UWorld Demo. 