const vscode = require("vscode");
const { getGitDiff, stageAllChanges } = require("./gitUtils");
const { suggestNextWord} = require("./apiUtils");

async function getNextWord(webviewView,currentmessage) {  // Add webviewView parameter here
  try {
    await stageAllChanges();

    // Get the Git diff of staged changes
    const gitdiff = await getGitDiff();

    if (!gitdiff || gitdiff === "No staged changes found!") {
      vscode.window.showWarningMessage("No staged changes found!");
      return;
    }
    const word = await suggestNextWord(gitdiff,currentmessage);
    
    

    webviewView.webview.postMessage({ command: "gotnextWord", next_word:word,value:currentmessage });
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  if (error.response) {
    vscode.window.showErrorMessage(`Backend Error: ${error.response.data.message}`);
  } else if (error.request) {
    vscode.window.showErrorMessage(
      "Backend server is not responding. Please check the server status."
    );
  } else {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

module.exports = { getNextWord};
