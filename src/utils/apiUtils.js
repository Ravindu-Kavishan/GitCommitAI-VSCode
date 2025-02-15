const axios = require("axios");
const vscode = require("vscode");

/**
 * Generates a commit message using the backend API.
 * @param {string} gitDiff - The Git diff of staged changes.
 * @returns {Promise<string>} - The generated commit message.
 */
async function generateCommitMessage(gitDiff) {
  const config = vscode.workspace.getConfiguration("testone");
  const backendUrl = config.get("backendUrl", "http://localhost:8000");

  const response = await axios.post(`${backendUrl}/generateCommit`, {
    git_diff: gitDiff,
  });

  return response.data.commit_message;
}

module.exports = { generateCommitMessage };