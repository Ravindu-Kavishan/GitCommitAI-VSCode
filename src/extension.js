const vscode = require("vscode");
const { autofillCommitMessage } = require("./commands/autofillCommitMessage");
const { getCommitMessage } = require("./commands/getCommitMessage");
const { createStatusBarButton } = require("./utils/statusBarButton");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Your extension "testone" is now active!');

  // Create a Status Bar button
  const button = createStatusBarButton(
    "extension.autofillCommitMessage", // Command
    "Autofill Commit", // Text
    "Click to autofill the commit message" // Tooltip
  );

  // Register commands
  const autofillCommand = vscode.commands.registerCommand(
    "extension.autofillCommitMessage",
    autofillCommitMessage
  );

  const manualCommand = vscode.commands.registerCommand(
    "extension.getCommitMessage",
    getCommitMessage
  );

  // Add to subscriptions
  context.subscriptions.push(autofillCommand, manualCommand, button);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};