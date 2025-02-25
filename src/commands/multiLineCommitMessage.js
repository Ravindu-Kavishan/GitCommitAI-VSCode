const vscode = require("vscode");
const sharedContext = require("../utils/sharedContext"); // Import the shared context

/**
 * Handles the multi line commit message functionality.
 */
async function multiLineCommitMessage() {
  // Change the commit_type to "Multi Line"
  sharedContext.commit_type = "multiline";
  // Add your logic for multi line commit messages here
  vscode.window.showInformationMessage("Multi Line Commit Message Selected");
}

module.exports = { multiLineCommitMessage };
