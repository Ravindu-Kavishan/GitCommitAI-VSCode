const axios = require("axios");
const vscode = require("vscode");
const sharedContext = require("./sharedContext");

async function generateCommitMessage(gitDiff) {
  const backendUrl = "http://192.168.8.105:8000/generate-commit-message/";
  // const backendUrl = "https://gitcommitai-backend-aafdg3cwdtctc9e6.centralindia-01.azurewebsites.net/generate-commit-message/";

  try {
    const response = await axios.post(backendUrl, {
      diff: gitDiff,
      message_type: sharedContext.commit_type,
      project_name: sharedContext.project,
    });

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
  // const backendUrl = "https://gitcommitai-backend-aafdg3cwdtctc9e6.centralindia-01.azurewebsites.net/generate-commit-suggestions/";
  const backendUrl = "http://192.168.8.105:8000/generate-commit-suggestions/";

  try {
    const response = await axios.post(backendUrl, {
      commit_message: commitmessage,
      project_name: sharedContext.project,
    });

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
  const backendUrl = "http://192.168.8.105:8000/get_projects";
  // const backendUrl = "https://gitcommitai-backend-aafdg3cwdtctc9e6.centralindia-01.azurewebsites.net/get_projects";

  try {
    // Retrieve email from local storage
    const email = sharedContext.email;

    if (!email) {
      vscode.window.showErrorMessage("Please Login First!");
      return null;
    }

    // Send email in the request body
    const response = await axios.post(backendUrl, { email });

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

async function suggestNextWord(gitdiff, currentmessage) {
  const backendUrl = "http://192.168.8.105:8000/nextWord";
  // const backendUrl = "https://gitcommitai-backend-aafdg3cwdtctc9e6.centralindia-01.azurewebsites.net/nextWord";

  try {
    const response = await axios.post(backendUrl, {
      git_diff: gitdiff,
      commit_msg: currentmessage,
    });

    return response.data.next_word;
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

async function saveCommit(git_diff, commit_message) {
  const backendUrl = "http://192.168.8.105:8000/add_project_commit";
  // const backendUrl = "https://gitcommitai-backend-aafdg3cwdtctc9e6.centralindia-01.azurewebsites.net/add_project_commit";

  try {
    if (!sharedContext.email) {
      return;
    } else {
      const response = await axios.post(backendUrl, {
        project_name: sharedContext.project,
        email: sharedContext.email,
        commits: [
          {
            commit_message,
            git_diff,
          },
        ],
      });

      return response.data.message;
    }
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
  suggestNextWord,
  saveCommit,
};
