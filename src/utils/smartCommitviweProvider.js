const fs = require("fs");
const path = require("path");

class SmartCommitViewProvider {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }

    resolveWebviewView(webviewView) {
        webviewView.webview.options = {
            enableScripts: true,
        };

        webviewView.webview.html = this.getHtmlContent();
    }

    getHtmlContent() {
        const filePath = path.join(__dirname, "panel.html");
        return fs.readFileSync(filePath, "utf8");
    }
}

module.exports = SmartCommitViewProvider;
