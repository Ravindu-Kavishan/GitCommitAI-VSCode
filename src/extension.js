// const vscode = require("vscode");
// const { autofillCommitMessage } = require("./commands/autofillCommitMessage");
// const { getCommitMessage } = require("./commands/getCommitMessage"); // Keep this
// const {
//   singleLineCommitMessage,
// } = require("./commands/singleLineCommitMessage");
// const { multiLineCommitMessage } = require("./commands/multiLineCommitMessage");
// const {
//   createAutofillButton,
//   createMenuButton,
//   registerMenuCommand,
// } = require("./utils/statusBarButton");
// const { isGitRepository } = require("./utils/isGitRepository");

// /**
//  * @param {vscode.ExtensionContext} context
//  */
// async function activate(context) {  // Make activate async
//   console.log('Your extension "testone" is now active!');

//   // Create the "Autofill Commit" button
//   const autofillButton = createAutofillButton();

//   // Create the menu button (triple dot icon)
//   const menuButton = createMenuButton();

//   // Register the menu command
//   registerMenuCommand(context);

//   // Check if the folder is a Git repository
//   try {
//     const isRepo = await isGitRepository(); // Await the result
//     if (isRepo) {
//       autofillButton.show();
//       menuButton.show();
//     } else {
//       autofillButton.hide();
//       menuButton.hide();
//     }
//   } catch (error) {
//     vscode.window.showErrorMessage(`Git Check Error: ${error}`);
//   }

//   // Register the autofill commit message command
//   const autofillCommand = vscode.commands.registerCommand(
//     "extension.autofillCommitMessage",
//     autofillCommitMessage
//   );

//   // Register the single line commit message command
//   const singleLineCommand = vscode.commands.registerCommand(
//     "extension.singleLineCommitMessage",
//     singleLineCommitMessage
//   );

//   // Register the multi line commit message command
//   const multiLineCommand = vscode.commands.registerCommand(
//     "extension.multiLineCommitMessage",
//     multiLineCommitMessage
//   );

//   // Register the get commit message command (keep this)
//   const getCommitMessageCommand = vscode.commands.registerCommand(
//     "extension.getCommitMessage",
//     getCommitMessage
//   );

//   // Add to subscriptions
//   context.subscriptions.push(
//     autofillCommand,
//     singleLineCommand,
//     multiLineCommand,
//     getCommitMessageCommand,
//     autofillButton,
//     menuButton
//   );
// }

// function deactivate() {}

// module.exports = {
//   activate,
//   deactivate,
// };




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
const { isGitRepository } = require("./utils/isGitRepository");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  console.log('Your extension "testone" is now active!');

  // Create the "Autofill Commit" button
  const autofillButton = createAutofillButton();

  // Create the menu button (triple dot icon)
  const menuButton = createMenuButton();

  // Register the menu command
  registerMenuCommand(context);

  // Function to update button visibility
  async function updateButtonVisibility() {
    try {
      const isRepo = await isGitRepository();
      if (isRepo) {
        autofillButton.show();
        menuButton.show();
      } else {
        autofillButton.hide();
        menuButton.hide();
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Git Check Error: ${error}`);
    }
  }

  // Initial check on activation
  await updateButtonVisibility();

  // Listen for changes in the workspace (e.g., when Git is initialized or removed)
  const fileSystemWatcher = vscode.workspace.createFileSystemWatcher("**/.git");
  fileSystemWatcher.onDidCreate(updateButtonVisibility);
  fileSystemWatcher.onDidDelete(updateButtonVisibility);
  fileSystemWatcher.onDidChange(updateButtonVisibility);

  // Add the file watcher to subscriptions to clean up properly
  context.subscriptions.push(fileSystemWatcher);

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
