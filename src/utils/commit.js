const vscode = require("vscode");
const { stageAllChanges, commitAllChanges } = require("./gitUtils");

async function commit(commitMessage) {
    try {
        await stageAllChanges(); // Call function correctly
        await commitAllChanges(commitMessage); // Pass commit message
        vscode.window.showInformationMessage("Commit successful");
    } catch (error) {
        vscode.window.showErrorMessage(`Commit failed: ${error.message}`);
    }
}

module.exports = { commit };
