const vscode = require("vscode");
const sharedContext = require("../utils/sharedContext");

/**
 * Handles the single line commit message functionality.
 */
async function singleLineCommitMessage() {
  sharedContext.commit_type = "Single Line";
  vscode.window.showInformationMessage("Single Line Commit Message Selected");
}

module.exports = { singleLineCommitMessage };
