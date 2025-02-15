const vscode = require("vscode");
const { exec } = require("child_process");

/**
 * Stages all changes using `git add .`.
 * @returns {Promise<void>}
 */
function stageAllChanges() {
  return new Promise((resolve, reject) => {
    exec(
      "git add .",
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
        resolve();
      }
    );
  });
}

/**
 * Gets the Git diff of staged changes.
 * @returns {Promise<string>} - The Git diff or an error message.
 */
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

module.exports = { stageAllChanges, getGitDiff };