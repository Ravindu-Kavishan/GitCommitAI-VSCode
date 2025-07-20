const vscode = require("vscode");
const { stageAllChanges, getGitDiff, commitAllChanges } = require("./gitUtils");
const { saveCommit } = require("./apiUtils");

// async function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

async function commit(commitMessage) {
  try {
    await stageAllChanges(); // Call function correctly
    const gitdiff = await getGitDiff();
    await commitAllChanges(commitMessage); // Pass commit message
    await saveCommit(gitdiff, commitMessage);
    vscode.window.showInformationMessage("Commit successful");
  } catch (error) {
    vscode.window.showErrorMessage(`Commit failed: ${error.message}`);
  }
}

module.exports = { commit };

// debugs are bellow


// const vscode = require("vscode");
// const { stageAllChanges, getGitDiff, commitAllChanges } = require("./gitUtils");
// const { saveCommit } = require("./apiUtils");

// async function delay(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function commit(commitMessage) {
//   try {
//     vscode.window.showInformationMessage("Starting commit process...");

//     vscode.window.showInformationMessage("Staging all changes...");
//     await stageAllChanges();

//     vscode.window.showInformationMessage("Waiting for file system to settle...");
//     await delay(1000);

//     vscode.window.showInformationMessage("Getting Git diff...");
//     const gitdiff = await getGitDiff();
//     console.log("Git Diff Output:", gitdiff);

//     await delay(1000);

//     vscode.window.showInformationMessage("Diff obtained. Committing changes...");
//     await commitAllChanges(commitMessage);

//     vscode.window.showInformationMessage("Saving commit to backend...");
//     await saveCommit(gitdiff, commitMessage);

//     vscode.window.showInformationMessage("✅ Commit successful!");
//   } catch (error) {
//     console.error("Commit failed:", error);
//     vscode.window.showErrorMessage(`❌ Commit failed: ${error}`);
//   }
// }

// module.exports = { commit };
