// const vscode = require("vscode");

// /**
//  * Creates and shows the "Autofill Commit" button.
//  * @returns {vscode.StatusBarItem} - The created status bar button.
//  */
// function createAutofillButton() {
//   // Create the status bar button
//   const button = vscode.window.createStatusBarItem(
//     vscode.StatusBarAlignment.Left,
//     100
//   );

//   // Set button properties
//   button.text = "Autofill Commit"; // Add an icon (e.g., checkmark)
//   button.tooltip = "Click to autofill the commit message";
//   button.command = "extension.autofillCommitMessage"; // Command to autofill

//   // Show the button
//   button.show();

//   return button;
// }

// /**
//  * Creates and shows the menu button (triple dot icon).
//  * @returns {vscode.StatusBarItem} - The created status bar button.
//  */
// function createMenuButton() {
//   // Create the status bar button
//   const button = vscode.window.createStatusBarItem(
//     vscode.StatusBarAlignment.Left,
//     99 // Lower priority to place it next to the autofill button
//   );

//   // Set button properties
//   button.text = "$(kebab-vertical)"; // Triple dot icon
//   button.tooltip = "Click to open the commit menu";
//   button.command = "extension.openCommitMenu"; // Command to open the menu

//   // Show the button
//   button.show();

//   return button;
// }

// /**
//  * Registers the command to open the commit menu.
//  * @param {vscode.ExtensionContext} context - The extension context.
//  */
// function registerMenuCommand(context) {
//   // Register the command to open the menu
//   const disposable = vscode.commands.registerCommand(
//     "extension.openCommitMenu",
//     async () => {
//       // Show a context menu near the triple dots button
//       const selectedOption = await vscode.window.showQuickPick(
//         ["Single Line Commit Message", "Multi Line Commit Message"], // Menu items
//         {
//           placeHolder: "Select commit message type",
//           canPickMany: false, // Allow only single selection
//         }
//       );

//       // Handle the selected option
//       if (selectedOption === "Single Line Commit Message") {
//         vscode.commands.executeCommand("extension.singleLineCommitMessage");
//       } else if (selectedOption === "Multi Line Commit Message") {
//         vscode.commands.executeCommand("extension.multiLineCommitMessage");
//       }
//     }
//   );

//   // Add the command to the extension's subscriptions
//   context.subscriptions.push(disposable);
// }

// module.exports = { createAutofillButton, createMenuButton, registerMenuCommand };




const vscode = require("vscode");
const sharedContext = require("../utils/sharedContext");

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
 // Import shared context

 function registerMenuCommand(context) {
  const disposable = vscode.commands.registerCommand("extension.openCommitMenu", async () => {
    // Define available options with icons to simulate radio button behavior
    const options = [
      {
        label: "Single Line Commit Message",
        value: "singleline",
        picked: sharedContext.commit_type === "singleline", // Set checked if selected
        description: sharedContext.commit_type === "singleline" ? "$(check)" : "$(circle-filled)", // Use radio button icons
      },
      {
        label: "Multi Line Commit Message",
        value: "multiline",
        picked: sharedContext.commit_type === "multiline", // Set checked if selected
        description: sharedContext.commit_type === "multiline" ? "$(check)" : "$(circle-filled)", // Use radio button icons
      },
    ];

    // Show the QuickPick menu with radio buttons and proper selection
    const selectedOption = await vscode.window.showQuickPick(options, {
      placeHolder: "Select commit message type",
      canPickMany: false,
      matchOnDetail: true,
      matchOnDescription: true,
    });

    // If the user picked an option, update the commit_type and run the corresponding command
    if (selectedOption) {
      sharedContext.commit_type = selectedOption.value; // Store selected commit type

      vscode.commands.executeCommand(
        selectedOption.value === "singleline"
          ? "extension.singleLineCommitMessage"
          : "extension.multiLineCommitMessage"
      );
    }
  });

  context.subscriptions.push(disposable);
}

module.exports = { createAutofillButton, createMenuButton, registerMenuCommand };




