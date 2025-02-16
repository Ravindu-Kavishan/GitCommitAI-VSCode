# TestOne

TestOne is a VS Code extension that automatically generates commit messages based on Git diffs.

## Features

- **Single-line commit message generation**: Generates concise commit messages from Git diffs.
- **Multi-line commit message generation**: Creates detailed commit messages with multiple lines, including the context of changes.
- **Autofill commit messages**: Automatically fills the commit message in the Source Control input box.
- **Customizable backend URL**: Configure your backend URL for commit message generation.


> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

- **VS Code**: Version 1.60 or later.
- **Backend server**: Ensure the backend server is running and accessible to generate commit messages. You can configure the server URL in the settings.

## Extension Settings

This extension contributes the following settings:

- `testone.backendUrl`: The URL of the backend server for generating commit messages (default: `https://your-backend-url.com`).
  
## Known Issues

- None at the moment.

## Release Notes

### 1.0.0

- Initial release of TestOne extension.
  
### 1.0.1

- Fixed minor bugs with message formatting.

### 1.1.0

- Added support for multi-line commit messages.
- Improved commit message autofill functionality.

---

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
