const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { autofillCommitMessage } = require("../commands/autofillCommitMessage");
const { commit } = require("./commit");
const {
  singleLineCommitMessage,
} = require("../commands/singleLineCommitMessage");
const {
  multiLineCommitMessage,
} = require("../commands/multiLineCommitMessage");
const { makeSuggestion } = require("./makesuggestions");
const {selectRules}=require("./selectRules");
const {selectProject}=require("./selectProject");
const {logedIn}=require("./logedIn");

class SmartCommitViewProvider {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }

  getHtmlContent(filename) {
    const filePath = path.join(__dirname, filename);
    return fs.readFileSync(filePath, "utf8");
  }
  createNewWebviewPanel() {
    const panel = vscode.window.createWebviewPanel(
      "Web view",
      "Smart Commit Web View",
      vscode.ViewColumn.One,
      { enableScripts: true,
        retainContextWhenHidden: true,
        portMapping: [
            { webviewPort: 8000, extensionHostPort: 8000 }
        ]
       }
    );
// 
    const reactDistPath = vscode.Uri.file(
      path.join(__dirname, "window", "dist")
    );
    const reactDistUri = panel.webview.asWebviewUri(reactDistPath);
// 
    const reactIndexPath = path.join(
      __dirname,
      "window",
      "dist",
      "index.html"
    );
    let htmlContent = fs.readFileSync(reactIndexPath, "utf8");
// 
    // 🔹 Replace absolute paths with webview-compatible URIs
    htmlContent = htmlContent.replace(
      /src="\//g,
      `src="${reactDistUri.toString()}/`
    );
    htmlContent = htmlContent.replace(
      /href="\//g,
      `href="${reactDistUri.toString()}/`
    );
// 
    panel.webview.html = htmlContent;
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
        case "selectRules":
          selectRules(webviewView);
          break;
        case "selectProject":
          selectProject(message.selectedProject);
          break;
        case "logedIn":
          logedIn(message.email);
          break;
        case "openNewWindow":
          this.createNewWebviewPanel();
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
    <button
        id="selectRulesBtn"
        class="w-full p-1 mt-4 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200"
      >
        Select Rules set
    </button>
    <div id="projectsDiv" class="hidden relative  mt-4 p-4 bg-gray-900 rounded-md space-y-2">
      <button id="closeProjects" class="absolute top-0 pr-2 right-0 text-red-500 hover:text-red-700 text-sm font-bold">x</button>
      <!-- Container to append suggestion items -->
      <div id="Projectnames" class="pt-2"></div>
    </div>
    <button
      id="signInBtn"
      class="fixed bottom-4 right-4 p-2 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200">
      Sign In
    </button>
    <button
      id="logInBtn"
      class="fixed bottom-4 right-4 p-2 bg-blue-800 text-white rounded-sm hover:bg-blue-600 transition duration-200">
      Log In
    </button>



    <script>
    const vscode = acquireVsCodeApi();

        document.getElementById("autofillBtn").addEventListener("click", () => {
            vscode.postMessage({ command: "autofillCommitMessage" });
        });


        document.getElementById("commitBtn").addEventListener("click", () => {
            const commitMessage = document.getElementById("commitMessage").value;
            vscode.postMessage({ command: "commit", commitmessage: commitMessage }); 
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

        

      document.getElementById("closeSuggestions").addEventListener("click", () => {
        const suggestionParagraph = document.getElementById("suggestionParagraph");
        document.getElementById("suggestionContent").innerHTML = "";
        suggestionParagraph.classList.add("hidden");
      });

      

       document.getElementById("selectRulesBtn").addEventListener("click", () => {
            vscode.postMessage({ command: "selectRules"});  
        });

      document.getElementById("closeProjects").addEventListener("click", () => {
        const projectsDiv = document.getElementById("projectsDiv");
        document.getElementById("Projectnames").innerHTML = "";
        projectsDiv.classList.add("hidden");
      });

      document.getElementById("signInBtn").addEventListener("click", () => {
        vscode.postMessage({ command: "openNewWindow" });
      });

      document.getElementById("logInBtn").addEventListener("click", () => {
        vscode.postMessage({ command: "logedIn",email: "ravindu@uom.com" });
      });


      window.addEventListener("message", (event) => {
        const message = event.data;
        switch (message.command) {
          case "setCommitMessage":
            document.getElementById("commitMessage").value = message.message;
            break;
          case "setSuggestionMessage":
            const suggestionContent = document.getElementById("suggestionContent");
            suggestionContent.innerHTML = "";
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
          case "retrivedRules":
            const Projectnames = document.getElementById("Projectnames");
            const projectsDiv = document.getElementById("projectsDiv");

            Projectnames.innerHTML = "";
            projectsDiv.classList.remove("hidden");

            message.message.forEach((line, index) => {
              const projectItem = document.createElement("div");
              projectItem.className = "flex items-start space-x-2 p-2 mt-2 bg-gray-800 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-700 transition";
              
              const numberSpan = document.createElement("span");
              numberSpan.className = "font-bold text-blue-400";
              numberSpan.textContent = \`\${index + 1}.\`;

              const textSpan = document.createElement("span");
              textSpan.textContent = line;

              projectItem.appendChild(numberSpan);
              projectItem.appendChild(textSpan);
              Projectnames.appendChild(projectItem);

              // 💡 Add click event to send rule name back to extension
              projectItem.addEventListener("click", () => {
                vscode.postMessage({
                  command: "selectProject",
                  selectedProject: line,  // Send the rule name
                });
              });
            });
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
