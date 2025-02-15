const vscode = require("vscode");
const { exec } = require("child_process");

/**
 * Checks if any of the workspace folders is a Git repository.
 * @returns {Promise<boolean>} - True if at least one folder is a Git repository, false otherwise.
 */
function isGitRepository() {
  return new Promise((resolve, reject) => {
    exec(
      "git rev-parse --is-inside-work-tree",
      { cwd: vscode.workspace.rootPath },
      (error, stdout, stderr) => {
        if (error) {
          resolve(false); // Not a Git repository
          return;
        }
        if (stderr) {
          resolve(false); // Not a Git repository
          return;
        }
        resolve(stdout.trim() === "true");
      }
    );
  });
}

module.exports = { isGitRepository };
