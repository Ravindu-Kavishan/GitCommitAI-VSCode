const vscode = require("vscode");
const { getGitDiff, stageAllChanges } = require("../utils/gitUtils");
const { generateCommitMessage } = require("../utils/apiUtils");
const { delay } = require("../utils/delay");

/**
 * Autofills the commit message in the Source Control input box.
 */
async function autofillCommitMessage() {
  try {
    // Stage all changes using `git add .`
    await stageAllChanges();

    // Get the Git diff of staged changes
    const gitdiff = await getGitDiff();

    if (!gitdiff || gitdiff === "No staged changes found!") {
      vscode.window.showWarningMessage("No staged changes found!");
      return;
    }

    // Generate the commit message using the backend API
    const commitMessage = await generateCommitMessage(gitdiff);

    // Switch to the Source Control view
    await vscode.commands.executeCommand("workbench.view.scm");
    await delay(500);

    // Type the commit message into the Source Control input box
    await vscode.commands.executeCommand("type", { text: commitMessage });

    // Notify the user that the commit message is ready
    vscode.window.showInformationMessage("Commit message autofilled!");
  } catch (error) {
    handleError(error);
  }
}

/**
 * Handles errors and displays appropriate messages to the user.
 * @param {Error} error - The error object.
 */
function handleError(error) {
  if (error.response) {
    vscode.window.showErrorMessage(`Backend Error: ${error.response.data.message}`);
  } else if (error.request) {
    vscode.window.showErrorMessage(
      "Backend server is not responding. Please check the server status."
    );
  } else {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

module.exports = { autofillCommitMessage };