const vscode = require("vscode");
const { autofillCommitMessage } = require("../commands/autofillCommitMessage");
const { commit } = require("./commit");

class SmartCommitViewProvider {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }

  resolveWebviewView(webviewView, context, token) {
    // Create the webview panel with 'enableScripts' set to true
    const panel = webviewView.webview;

    // Allow scripts in the webview
    panel.options = { enableScripts: true };

    // Set the HTML content of the webview
    panel.html = this.getWebviewContent();

    // Listen for messages from the webview
    panel.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "autofillCommitMessage":
          autofillCommitMessage(webviewView);
          break;
        case "commit":
          commit(message.commitmessage);  // Pass commit message to function
          break;
        default:
          console.log("Unknown command", message.command);
      }
    });
  }

  getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-4 bg-black text-white">
    <div class="flex flex-col space-y-4">
      <input
        id="commitMessage"
        type="text"
        placeholder="Type Commit With Suggestions"
        class="w-full p-1 border border-gray-600 rounded-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white"
      />
      <button
        id="commitBtn"
        class="w-full p-1 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200"
      >
        Commit
      </button>
      <div class="flex">
        <button
          id="autofillBtn"
          class="w-full p-1 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200"
        >
          Autofill Commit
        </button>
        <button
          id="expandBtn"
          class="p-1 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200 border-l-2 border-black"
        >
          v
        </button>
      </div>

      <div
        id="expandOptions"
        class="hidden mt-4 w-full flex flex-col items-center space-y-4"
      >
        <div class="flex items-center">
          <input type="radio" name="option" value="single" class="mr-2" />
          <span>Single Line Commit Message</span>
        </div>
        <div class="flex items-center">
          <input type="radio" name="option" value="multi" class="mr-2" />
          <span>Multi Line Commit Message</span>
        </div>
      </div>

      <button
        id="addrulesBtn"
        class="w-full p-1 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200"
      >
        Add Rules
      </button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        document.getElementById("autofillBtn").addEventListener("click", () => {
            vscode.postMessage({ command: "autofillCommitMessage" });
        });

        document.getElementById("commitBtn").addEventListener("click", () => {
            const commitMessage = document.getElementById("commitMessage").value;
            vscode.postMessage({ command: "commit", commitmessage: commitMessage });  // Corrected syntax
            document.getElementById("commitMessage").value = ""; 
        });

        document.getElementById("expandBtn").addEventListener("click", () => {
          const options = document.getElementById("expandOptions");
          options.classList.toggle("hidden");
        });

        document.getElementById("addrulesBtn").addEventListener("click", () => {
          document.getElementById("commitMessage").value = "good";
        });

        window.addEventListener("message", (event) => {
          const message = event.data;
          switch (message.command) {
            case "setCommitMessage":
              document.getElementById("commitMessage").value = message.message;
              break;
            default:
              console.log("Unknown command", message.command);
          }
        });
    </script>
  </body>
</html>`;
  }
}

module.exports = SmartCommitViewProvider;
