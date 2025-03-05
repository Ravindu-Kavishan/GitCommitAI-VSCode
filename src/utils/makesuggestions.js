const { generateCommitSuggestions } = require("./apiUtils");
const vscode = require("vscode");


async function makeSuggestion(commitmessage, webviewView) {
    let suggestion = ["No suggestions available"]; // Default message if empty
    if (commitmessage === "") {
      vscode.window.showInformationMessage("Commit message is empty!");
    } else {
      suggestion = await generateCommitSuggestions(commitmessage);
      vscode.window.showInformationMessage("Suggestion made successfully!");
    }
    webviewView.webview.postMessage({ command: "setSuggestionMessage", message: suggestion });
  }

  
module.exports = {makeSuggestion };

