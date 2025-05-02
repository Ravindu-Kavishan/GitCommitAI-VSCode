const vscode = require("vscode");
const sharedContext = require("./sharedContext"); 

async function logedIn(email) {
  sharedContext.email = email;
  console.log(sharedContext.email)

}

module.exports = { logedIn };
