const vscode = require("vscode");
const sharedContext = require("./sharedContext");
const { selectRules } = require("./selectRules");

async function selectProject(project, webviewView) {
  sharedContext.project = project;
  vscode.window.showInformationMessage(sharedContext.project);
  selectRules(webviewView);
}

module.exports = { selectProject };
