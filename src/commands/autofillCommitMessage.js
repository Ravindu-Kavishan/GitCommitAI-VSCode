const vscode = require("vscode");
const { getGitDiff, stageAllChanges } = require("../utils/gitUtils");
const { generateCommitMessage } = require("../utils/apiUtils");

async function autofillCommitMessage(webviewView) {  // Add webviewView parameter here
  try {
    await stageAllChanges();

    // Get the Git diff of staged changes
    const gitdiff = await getGitDiff();

    if (!gitdiff || gitdiff === "No staged changes found!") {
      vscode.window.showWarningMessage("No staged changes found!");
      return;
    }
    const commitMessage = await generateCommitMessage(gitdiff);
    
    // Show information in VS Code window
    vscode.window.showInformationMessage("Commit message autofilled!");

    webviewView.webview.postMessage({ command: "setCommitMessage", message: commitMessage });
  } catch (error) {
    handleError(error);
  }
}

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
