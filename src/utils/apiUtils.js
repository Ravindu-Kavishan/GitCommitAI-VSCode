const axios = require("axios");
const vscode = require("vscode");
const sharedContext = require("./sharedContext");

async function generateCommitMessage(gitDiff) {
  const backendUrl = "http://127.0.0.1:8000/generate-commit-message/";

  try {
    const response = await axios.post(backendUrl, {
      diff: gitDiff,
      message_type: sharedContext.commit_type,
    });

    // console.log("Response:", response.data);
    return response.data.commit_message;
  } catch (error) {
    console.error("Error response:", error.response?.data);
    vscode.window.showErrorMessage(
      `Backend error: ${error.response?.status} - ${
        error.response?.data?.message || error.message
      }`
    );
    return null;
  }
}

async function generateCommitSuggestions(commitmessage) {
  const backendUrl = "http://127.0.0.1:8000/generate-commit-suggestions/";

  try {
    const response = await axios.post(backendUrl, {
      commit_message: commitmessage,
    });

    // console.log("Response:", response.data);
    return response.data.suggestions;
  } catch (error) {
    console.error("Error response:", error.response?.data);
    vscode.window.showErrorMessage(
      `Backend error: ${error.response?.status} - ${
        error.response?.data?.message || error.message
      }`
    );
    return null;
  }
}

async function getProjects() {
  const backendUrl = "http://127.0.0.1:8000/get_projects";

  try {
    // Retrieve email from local storage
    const email = sharedContext.email;

    if (!email) {
      vscode.window.showErrorMessage("Email not found in local storage.");
      return null;
    }

    // Send email in the request body
    const response = await axios.post(backendUrl, { email });

    // console.log("Response:", response.data);
    return response.data.projects;
  } catch (error) {
    console.error("Error response:", error.response?.data);
    vscode.window.showErrorMessage(
      `Backend error: ${error.response?.status} - ${
        error.response?.data?.message || error.message
      }`
    );
    return null;
  }
}

// /admin/get_projects_and_rules

module.exports = {
  generateCommitMessage,
  generateCommitSuggestions,
  getProjects,
};
