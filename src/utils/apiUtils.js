const axios = require("axios");
const vscode = require("vscode");
const sharedContext = require("./sharedContext");

async function generateCommitMessage(gitDiff) {
  const backendUrl = "https://gitcommitai-backend-6.onrender.com/generate-commit-message/";


  try {
    const response = await axios.post(backendUrl, {
      diff: gitDiff,
      message_type: sharedContext.commit_type,
    });

    console.log("Response:", response.data);
    return response.data.commit_message;
  } catch (error) {
    console.error("Error response:", error.response?.data);
    vscode.window.showErrorMessage(
      `Backend error: ${error.response?.status} - ${error.response?.data?.message || error.message}`
    );
    return null;
  }
}

module.exports = { generateCommitMessage };
