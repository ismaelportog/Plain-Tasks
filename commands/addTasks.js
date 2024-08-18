const vscode = require('vscode');
const { singleLineCommentPatterns } = require('../utils/patterns')
const { saveTasks } = require('./saveTasks')

const addTasks = () => {
    // Check for opened file
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    // Getting text and type
    const document = editor.document;
    const text = document.getText();
    const fileName = document.fileName;

    // Support for one liner comments regex, except html
    const combinedPattern = new RegExp([
        singleLineCommentPatterns.doubleSlash.source,
        singleLineCommentPatterns.numberSign.source,
        singleLineCommentPatterns.hyphens.source
    ].join('|'), 'gm');

    // Remove comments characters and append filename, lineIndex of the comment
    const tasks = [];
    const lines = text.split('\n');

    lines.forEach((line, lineIndex) => {
        let match;
        while ((match = combinedPattern.exec(line)) !== null) {
            const cleanText = line.replace(/^[\s]*[\/\/\#\-\+]+[\s]*/, '').trim();
            tasks.push({ text: cleanText, fileName, line: lineIndex + 1 });
        }
    });

    if (tasks.length > 0) {
        saveTasks(tasks);
    } else {
        vscode.window.showInformationMessage('No tasks detected.');
    }
}



module.exports = {
    addTasks
}
