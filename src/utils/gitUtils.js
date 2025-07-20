const vscode = require("vscode");
const { exec } = require("child_process");

/**
 * Stages all changes using `git add .`.
 * @returns {Promise<void>}
 */


// debugs are bellow


function stageAllChanges() {
  return new Promise((resolve, reject) => {
    exec(
      "git add .",
      { cwd: vscode.workspace.rootPath },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Git Add Error:", error.message);
          vscode.window.showErrorMessage(`Git Add Error: ${error.message}`);
          reject(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.warn("Git Add Warning:", stderr);
          vscode.window.showWarningMessage(`Git Add Warning: ${stderr}`);
          // Continue anyway
        }
        vscode.window.showInformationMessage("✅ All changes staged.");
        resolve();
      }
    );
  });
}






/**
 * Gets the Git diff of staged changes.
 * @returns {Promise<string>} - The Git diff or an error message.
 */
// function getGitDiff() {
//   return new Promise((resolve, reject) => {
//     exec(
//       "git diff --cached",
//       { cwd: vscode.workspace.rootPath },
//       (error, stdout, stderr) => {
//         if (error) {
//           reject(`Error: ${error.message}`);
//           return;
//         }
//         if (stderr) {
//           reject(`stderr: ${stderr}`);
//           return;
//         }
//         resolve(stdout.trim() || "No staged changes found!");
//       }
//     );
//   });
// }

// debugs are bellow

function getGitDiff() {
  return new Promise((resolve, reject) => {
    exec(
      "git diff --cached",
      { cwd: vscode.workspace.rootPath },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Git Diff Error:", error.message);
          vscode.window.showErrorMessage(`Git Diff Error: ${error.message}`);
          reject(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.warn("Git Diff Warning:", stderr);
          vscode.window.showWarningMessage(`Git Diff Warning: ${stderr}`);
          // Don't reject here
        }

        const output = stdout.trim();
        const result = output || "⚠️ No staged changes found!";
        console.log("Git Diff Result:", result);
        resolve(result);
      }
    );
  });
}





// function commitAllChanges(message) {
//   return new Promise((resolve, reject) => {
//     exec(
//       `git commit -m "${message}"`, // Corrected to use backticks and proper string interpolation
//       { cwd: vscode.workspace.rootPath }, // Ensure that the cwd (current working directory) is set correctly
//       (error, stdout, stderr) => {
//         if (error) {
//           reject(`Error: ${error.message}`);
//           return;
//         }
//         if (stderr) {
//           reject(`stderr: ${stderr}`);
//           return;
//         }
//         resolve(stdout); // Return stdout or anything you want to indicate success
//       }
//     );
//   });
// }

// debugs are bellow


function commitAllChanges(message) {
  return new Promise((resolve, reject) => {
    exec(
      `git commit -m "${message}"`,
      { cwd: vscode.workspace.rootPath },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Git Commit Error:", error.message);
          vscode.window.showErrorMessage(`Git Commit Error: ${error.message}`);
          reject(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.warn("Git Commit Warning:", stderr);
          vscode.window.showWarningMessage(`Git Commit Warning: ${stderr}`);
        }
        vscode.window.showInformationMessage("✅ Commit created successfully.");
        console.log("Git Commit Output:", stdout);
        resolve(stdout);
      }
    );
  });
}


module.exports = { stageAllChanges, getGitDiff, commitAllChanges };
