const vscode = require("vscode");


async function selectRules() {
  vscode.window.showInformationMessage("Single Line Commit Message Selected");
}

module.exports = { selectRules };
