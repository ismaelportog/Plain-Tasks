const vscode = require('vscode');
const {addTasks} = require('./commands/addTasks')

function activate(context) {
    let disposableAddTasks = vscode.commands.registerCommand('plain-tasks.addTasks', addTasks);

    context.subscriptions.push(disposableAddTasks);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
