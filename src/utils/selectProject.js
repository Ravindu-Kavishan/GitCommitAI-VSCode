const vscode = require("vscode");
const sharedContext = require("./sharedContext");

async function selectProject(project) {
    sharedContext.project = project;
   vscode.window.showInformationMessage(sharedContext.project);
  
}



module.exports = { selectProject };
