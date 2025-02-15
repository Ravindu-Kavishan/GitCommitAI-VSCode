const axios = require("axios");
const vscode = require("vscode");
const sharedContext = require("./sharedContext");



async function generateCommitMessage(gitDiff) {
  const config = vscode.workspace.getConfiguration("testone");
  const backendUrl = config.get("backendUrl", "http://localhost:8000");

  const response = await axios.post(`${backendUrl}/generateCommit`, {
    git_diff: gitDiff,
    commit_type:sharedContext.commit_type,
  });

  return response.data.commit_message;
}

module.exports = { generateCommitMessage };