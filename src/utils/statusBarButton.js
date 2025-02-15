const vscode = require("vscode");

/**
 * Creates and shows a status bar button.
 * @param {string} command - The command to execute when the button is clicked.
 * @param {string} text - The text to display on the button.
 * @param {string} tooltip - The tooltip to show when hovering over the button.
 * @returns {vscode.StatusBarItem} - The created status bar button.
 */
function createStatusBarButton(command, text, tooltip) {
  // Create the status bar button
  const button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  // Set button properties
  button.text = text;
  button.tooltip = tooltip;
  button.command = command;

  // Show the button
  button.show();

  return button;
}

module.exports = { createStatusBarButton };