const vscode = require("vscode");
const { autofillCommitMessage } = require("./commands/autofillCommitMessage");
const { getCommitMessage } = require("./commands/getCommitMessage"); // Keep this
const {
  singleLineCommitMessage,
} = require("./commands/singleLineCommitMessage");
const { multiLineCommitMessage } = require("./commands/multiLineCommitMessage");
const {
  createAutofillButton,
  createMenuButton,
  registerMenuCommand,
} = require("./utils/statusBarButton");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Your extension "testone" is now active!');

  // Create the "Autofill Commit" button
  const autofillButton = createAutofillButton();

  // Create the menu button (triple dot icon)
  const menuButton = createMenuButton();

  // Register the menu command
  registerMenuCommand(context);

  // Register the autofill commit message command
  const autofillCommand = vscode.commands.registerCommand(
    "extension.autofillCommitMessage",
    autofillCommitMessage
  );

  // Register the single line commit message command
  const singleLineCommand = vscode.commands.registerCommand(
    "extension.singleLineCommitMessage",
    singleLineCommitMessage
  );

  // Register the multi line commit message command
  const multiLineCommand = vscode.commands.registerCommand(
    "extension.multiLineCommitMessage",
    multiLineCommitMessage
  );

  // Register the get commit message command (keep this)
  const getCommitMessageCommand = vscode.commands.registerCommand(
    "extension.getCommitMessage",
    getCommitMessage
  );

  // Add to subscriptions
  context.subscriptions.push(
    autofillCommand,
    singleLineCommand,
    multiLineCommand,
    getCommitMessageCommand,
    autofillButton,
    menuButton
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
