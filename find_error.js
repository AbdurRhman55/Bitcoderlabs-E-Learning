
import fs from 'fs';
const data = JSON.parse(fs.readFileSync('lint_report_2.json', 'utf8'));
const errorFile = data.find(x => x.messages.some(m => m.message && m.message.includes('Parsing')));
if (errorFile) {
    fs.writeFileSync('parsing_error.txt', errorFile.filePath + '\n' + JSON.stringify(errorFile.messages));
} else {
    fs.writeFileSync('parsing_error.txt', 'No parsing error found');
}
