const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const saveTasks = (tasks) => {

    const numberOfTasks = tasks.length;
    showOutputChannel(tasks, numberOfTasks)

    // Notification body
    const summary = `Detected ${numberOfTasks} task${numberOfTasks > 1 ? 's' : ''}. 📌`;

    vscode.window.showInformationMessage(summary, 'Save', 'Discard')
        .then(selection => {
            if (selection === 'Save') {
                saveTasksToFile(tasks);
            } else if (selection === 'Discard') {
                vscode.window.showInformationMessage('Tasks have not been saved. ❌');
            }
        });
}

const showOutputChannel = (tasks, numberOfTasks) => {
    const outputChannel = vscode.window.createOutputChannel('Task Notification');
    const formattedTasks = tasks.map((task, index) => `${index + 1}. ${task.text} (File: ${path.basename(task.fileName)}, Line: ${task.line})`).join('\n');

    outputChannel.appendLine(`Detected ${numberOfTasks} task${numberOfTasks > 1 ? 's' : ''}:`);
    outputChannel.appendLine("Don't worry about duplicates, these will not be added to the MD file 🤓");
    outputChannel.appendLine(formattedTasks);
    outputChannel.show();
}

const saveTasksToFile = async (tasks) => {
    // Get the path of the current workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    const filePath = path.join(workspaceFolder, 'tasks.md');

    try {
        // Read existing file content if it exists
        let existingContent = '';
        if (fs.existsSync(filePath)) {
            existingContent = fs.readFileSync(filePath, 'utf8');
        }

        // Group tasks by file
        const tasksByFile = tasks.reduce((acc, task) => {
            if (!acc[task.fileName]) {
                acc[task.fileName] = [];
            }
            acc[task.fileName].push(task);
            return acc;
        }, {});

        // Prepare new content
        let content = '# Tasks\n\n';
        for (const [fileName, fileTasks] of Object.entries(tasksByFile)) {
            content += `## ${path.basename(fileName)}\n\n`;
            fileTasks.forEach(task => {
                content += `- [${task.completed ? 'x' : ' '}] ${task.text} (Line ${task.line})\n`;
            });
            content += '\n';
        }

        // Combine new content with existing content
        let updatedContent = existingContent;
        const lines = content.split('\n');
        lines.forEach(line => {
            if (!existingContent.includes(line)) {
                updatedContent += line + '\n';
            }
        });

        fs.writeFileSync(filePath, updatedContent, 'utf8');

        // Open the file in the editor
        const uri = vscode.Uri.file(filePath);
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);

        // Notification
        vscode.window.showInformationMessage(`Tasks have been saved ✅`);
        
    } catch (error) {
        vscode.window.showErrorMessage(`Error saving tasks: ${error.message}`);
    }
}

module.exports = {
    saveTasks
}
