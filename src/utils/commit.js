const vscode = require("vscode");
const { stageAllChanges, getGitDiff, commitAllChanges } = require("./gitUtils");
const { saveCommit } = require("./apiUtils");

async function commit(commitMessage) {
  try {
    await stageAllChanges(); // Call function correctly
    const gitdiff = await getGitDiff();
    await commitAllChanges(commitMessage); // Pass commit message
    await saveCommit(gitdiff, commitMessage);
    vscode.window.showInformationMessage("Commit successful");
  } catch (error) {
    vscode.window.showErrorMessage(`Commit failed: ${error.message}`);
  }
}

module.exports = { commit };
