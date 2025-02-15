const vscode = require("vscode");

/**
 * Creates and shows the "Autofill Commit" button.
 * @returns {vscode.StatusBarItem} - The created status bar button.
 */
function createAutofillButton() {
  // Create the status bar button
  const button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  // Set button properties
  button.text = "Autofill Commit"; // Add an icon (e.g., checkmark)
  button.tooltip = "Click to autofill the commit message";
  button.command = "extension.autofillCommitMessage"; // Command to autofill

  // Show the button
  button.show();

  return button;
}

/**
 * Creates and shows the menu button (triple dot icon).
 * @returns {vscode.StatusBarItem} - The created status bar button.
 */
function createMenuButton() {
  // Create the status bar button
  const button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99 // Lower priority to place it next to the autofill button
  );

  // Set button properties
  button.text = "$(kebab-vertical)"; // Triple dot icon
  button.tooltip = "Click to open the commit menu";
  button.command = "extension.openCommitMenu"; // Command to open the menu

  // Show the button
  button.show();

  return button;
}

/**
 * Registers the command to open the commit menu.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
function registerMenuCommand(context) {
  // Register the command to open the menu
  const disposable = vscode.commands.registerCommand(
    "extension.openCommitMenu",
    async () => {
      // Show a context menu near the triple dots button
      const selectedOption = await vscode.window.showQuickPick(
        ["Single Line Commit Message", "Multi Line Commit Message"], // Menu items
        {
          placeHolder: "Select commit message type",
          canPickMany: false, // Allow only single selection
        }
      );

      // Handle the selected option
      if (selectedOption === "Single Line Commit Message") {
        vscode.commands.executeCommand("extension.singleLineCommitMessage");
      } else if (selectedOption === "Multi Line Commit Message") {
        vscode.commands.executeCommand("extension.multiLineCommitMessage");
      }
    }
  );

  // Add the command to the extension's subscriptions
  context.subscriptions.push(disposable);
}

module.exports = { createAutofillButton, createMenuButton, registerMenuCommand };




