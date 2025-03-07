const vscode = require("vscode");
const { autofillCommitMessage } = require("../commands/autofillCommitMessage");
const { commit } = require("./commit");
const {
  singleLineCommitMessage,
} = require("../commands/singleLineCommitMessage");
const {
  multiLineCommitMessage,
} = require("../commands/multiLineCommitMessage");
const { makeSuggestion } = require("./makesuggestions");

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
          commit(message.commitmessage); // Pass commit message to function
          break;
        case "singleLineCommit":
          singleLineCommitMessage();
          break;
        case "multiLineCommit":
          multiLineCommitMessage();
          break;
        case "makesuggestions":
          makeSuggestion(message.commitmessage, webviewView);
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
      <textarea
        id="commitMessage"
        placeholder="Type Commit With Suggestions"
        class="w-full p-1 border border-gray-600 rounded-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-800 text-white resize-none"
        rows="3"
      ></textarea>

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
          <input type="radio" name="option" value="single" class="mr-2" checked />
          <span>Single Line Commit Message</span>
        </div>
        <div class="flex items-center">
          <input type="radio" name="option" value="multi" class="mr-2" />
          <span>Multi Line Commit Message</span>
        </div>
      </div>

      <button
        id="suggestionsBtn"
        class="w-full p-1 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200"
      >
        Generete  suggestions About Commit Message 
      </button>
    </div>
    <div id="suggestionParagraph" class="hidden relative  mt-4 p-4 bg-gray-900 rounded-md space-y-2">
      <button id="closeSuggestions" class="absolute top-0 pr-2 right-0 text-red-500 hover:text-red-700 text-sm font-bold">x</button>
      <!-- Container to append suggestion items -->
      <div id="suggestionContent" class="pt-2"></div>
    </div>


    <script>
        const vscode = acquireVsCodeApi();

        document.getElementById("autofillBtn").addEventListener("click", () => {
            vscode.postMessage({ command: "autofillCommitMessage" });
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

        document.getElementById("commitBtn").addEventListener("click", () => {
            const commitMessage = document.getElementById("commitMessage").value;
            vscode.postMessage({ command: "commit", commitmessage: commitMessage });  // Corrected syntax
            document.getElementById("commitMessage").value = ""; 
        });

        document.getElementById("expandBtn").addEventListener("click", () => {
          const options = document.getElementById("expandOptions");
          options.classList.toggle("hidden");
        });

        document.querySelectorAll("input[name='option']").forEach((radio) => {
          radio.addEventListener("change", (event) => {
            if (event.target.value === "single") {
              vscode.postMessage({ command: "singleLineCommit" });
            } else if (event.target.value === "multi") {
              vscode.postMessage({ command: "multiLineCommit" });
            }
            console.log(event.target.value);
          });
        });

        document.getElementById("suggestionsBtn").addEventListener("click", () => {
          const commit_Message = document.getElementById("commitMessage").value;
          vscode.postMessage({ command: "makesuggestions", commitmessage: commit_Message });
          document.getElementById("suggestionParagraph").classList.remove("hidden");
        });

        window.addEventListener("message", (event) => {
        const message = event.data;
        switch (message.command) {
          case "setSuggestionMessage":
            const suggestionContent = document.getElementById("suggestionContent");
            suggestionContent.innerHTML = ""; // Clear previous content
            message.message.forEach((line, index) => {
              const suggestionDiv = document.createElement("div");
              suggestionDiv.className = "flex items-start space-x-2 p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md";
              
              const numberSpan = document.createElement("span");
              numberSpan.className = "font-bold text-blue-400";
              numberSpan.textContent = \`\${index + 1}.\`;
              
              const textSpan = document.createElement("span");
              textSpan.textContent = line;
              
              suggestionDiv.appendChild(numberSpan);
              suggestionDiv.appendChild(textSpan);
              suggestionContent.appendChild(suggestionDiv);
            });
            break;
          default:
            console.log("Unknown command", message.command);
        }
      });

      document.getElementById("closeSuggestions").addEventListener("click", () => {
        const suggestionParagraph = document.getElementById("suggestionParagraph");
        document.getElementById("suggestionContent").innerHTML = "";
        suggestionParagraph.classList.add("hidden");
      });

    </script>
  </body>
</html>`;
  }
}

module.exports = SmartCommitViewProvider;
