const vscode = require("vscode");
const { autofillCommitMessage } = require("./commands/autofillCommitMessage");
const { getCommitMessage } = require("./commands/getCommitMessage"); 
const {
  singleLineCommitMessage,
} = require("./commands/singleLineCommitMessage");
const { multiLineCommitMessage } = require("./commands/multiLineCommitMessage");
const { isGitRepository } = require("./utils/isGitRepository");
const SmartCommitViewProvider = require("./utils/smartCommitviweProvider");
const sharedContext = require("./utils/sharedContext");

async function activate(context) {
  console.log('Your extension "Smart Commit" is now active!');

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "SmartCommitView",
      new SmartCommitViewProvider(context.extensionUri)
    )
  );
  

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
    getCommitMessageCommand
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
