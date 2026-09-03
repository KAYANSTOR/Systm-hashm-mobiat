const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

const tableStart = '<div className="table-container"><table className="table-standard">';

const startIndex = code.indexOf(tableStart);
console.log("Start Index:", startIndex);
if (startIndex !== -1) {
    const nextSectionIndex = code.indexOf('{isModalOpen &&');
    console.log("Next section index:", nextSectionIndex);
    
    // Instead of using '</div>\\n      </div>\\n\\n      {isModalOpen &&', let's just find the substring directly using a simpler method.
    // The table block ends exactly before the modal block.
    // Let's substring between tableStart and nextSectionIndex.
    let oldTableSection = code.substring(startIndex, nextSectionIndex);
    
    // Find the last closing div of the table section
    const lastClosingDiv = oldTableSection.lastIndexOf('</div>');
    // We want to replace everything from startIndex up to that last closing div (or just up to nextSectionIndex and add back the necessary divs)
    
    // Let's use regex to replace it
    const regex = /<div className="table-container"><table className="table-standard">[\s\S]*?<\/table>[\s\S]*?<\/div>/;
    if (regex.test(code)) {
        console.log("Regex matched!");
        // We will replace using the regex.
    } else {
        console.log("Regex didn't match");
    }
}
