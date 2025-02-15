const vscode = require("vscode");
const { getGitDiff, stageAllChanges } = require("../utils/gitUtils");
const { generateCommitMessage } = require("../utils/apiUtils");

/**
 * Generates a commit message and types it in the terminal.
 */
async function getCommitMessage() {
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

    let terminal = vscode.window.activeTerminal;

    if (!terminal) {
      terminal = vscode.window.createTerminal("Committing Terminal");
      terminal.show();
    }

    terminal.sendText(`git commit -m "${commitMessage}"`, false);

    vscode.window.showInformationMessage(
      'Commit message typed in terminal. Press "Enter" to execute.'
    );
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

module.exports = { getCommitMessage };