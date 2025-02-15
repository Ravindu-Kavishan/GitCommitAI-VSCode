const vscode = require("vscode"); // Import the VS Code API for extension development
const axios = require("axios"); // Import Axios for making HTTP requests
const { exec } = require("child_process"); // Import exec to run shell commands

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Your extension "testone" is now active!'); // Log when the extension is activated

  // Function to get the staged Git diff (changes ready to be committed)
  function getGitDiff() {
    return new Promise((resolve, reject) => {
      exec(
        "git diff --cached", // Get the staged changes (not just unstaged changes)
        { cwd: vscode.workspace.rootPath }, // Execute the command in the workspace root
        (error, stdout, stderr) => {
          if (error) {
            reject(`Error: ${error.message}`); // Handle command execution errors
            return;
          }
          if (stderr) {
            reject(`stderr: ${stderr}`); // Handle standard error messages
            return;
          }
          resolve(stdout.trim() || "No staged changes found!"); // Return diff output or notify if no staged changes exist
        }
      );
    });
  }

  // Register a new command "extension.getCommitMessage" that users can trigger
  const disposable = vscode.commands.registerCommand(
    "extension.getCommitMessage",
    async () => {
      try {
        // Get the Git diff of staged changes
        const gitdiff = await getGitDiff();

        if (!gitdiff || gitdiff === "No staged changes found!") {
          vscode.window.showWarningMessage("No staged changes found!"); // Show warning if no staged changes exist
          return;
        }

        // Send the Git diff to the backend server for generating a commit message
        const response = await axios.post(
          "http://localhost:8000/generateCommit", // Backend API URL
          {
            git_diff: gitdiff, // Send the diff as a request payload
          }
        );

        const commitmassege = response.data.commit_message; // Extract generated commit message from the response

        let terminal = vscode.window.activeTerminal; // Get the currently active terminal

        if (!terminal) {
          terminal = vscode.window.createTerminal("Committing Terminal"); // Create a new terminal if none exists
          terminal.show(); // Show the terminal
        }

        terminal.sendText(`git commit -m "${commitmassege}"`, false); // Send the commit command to the terminal

        // Notify the user that the commit message is ready in the terminal
        vscode.window.showInformationMessage(
          'Commit message typed in terminal. Press "Enter" to execute.'
        );
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`); // Show an error message if something goes wrong
      }
    }
  );

  context.subscriptions.push(disposable); // Add the command to the extension's subscriptions
}

// Deactivation function (not used but required by VS Code extensions)
function deactivate() {}

module.exports = {
  activate, // Export the activate function
  deactivate, // Export the deactivate function
};
