const vscode = require("vscode");
const { getProjects } = require("../utils/apiUtils");

async function selectRules(webviewView) {
  try {
    const progects = await getProjects();
    webviewView.webview.postMessage({
      command: "retrivedRules",
      message: progects,
    });
    if (progects != null) {
      vscode.window.showInformationMessage("Rules retrived!");
    }
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  if (error.response) {
    vscode.window.showErrorMessage(
      `Backend Error: ${error.response.data.message}`
    );
  } else if (error.request) {
    vscode.window.showErrorMessage(
      "Backend server is not responding. Please check the server status."
    );
  } else {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

module.exports = { selectRules };
