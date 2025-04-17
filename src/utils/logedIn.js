const vscode = require("vscode");
const sharedContext = require("./sharedContext"); 

async function logedIn(email) {
  sharedContext.email = email;

}

module.exports = { logedIn };
