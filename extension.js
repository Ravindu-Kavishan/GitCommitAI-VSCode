const vscode = require("vscode");
const axios = require("axios");
const { exec } = require("child_process");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Your extension "testone" is now active!');

  function getGitDiff() {
    return new Promise((resolve, reject) => {
      exec(
        "git diff --cached",
        { cwd: vscode.workspace.rootPath },
        (error, stdout, stderr) => {
          if (error) {
            reject(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            reject(`stderr: ${stderr}`);
            return;
          }
          resolve(stdout.trim() || "No staged changes found!");
        }
      );
    });
  }

  const disposable = vscode.commands.registerCommand(
    "testone.getCommitMessage",
    async () => {
      try {
        // Get Git diff
        const gitdiff = await getGitDiff();

        if (!gitdiff || gitdiff === "No staged changes found!") {
          vscode.window.showWarningMessage("No staged changes found!");
          return;
        }

        // Send diff to backend
        const response = await axios.post(
          "http://localhost:8000/generateCommit",
          {
            git_diff: gitdiff,
          }
        );

        const commitmassege = response.data.commit_message; 

        let terminal = vscode.window.activeTerminal;

        if (!terminal) {
          terminal = vscode.window.createTerminal("Committing Terminal");
          terminal.show();
        }

        terminal.sendText(`git commit -m "${commitmassege}"`, false);

        vscode.window.showInformationMessage(
          'Commit message typed in terminal. Press "Enter" to execute.'
        );
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
