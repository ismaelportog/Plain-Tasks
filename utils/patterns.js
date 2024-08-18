const singleLineCommentPatterns = {
    doubleSlash: /\/\/\+\s.*$/gm,  // Comments like <//+>
    numberSign: /#\+\s.*$/gm,      // Comments like <#+>
    hyphens: /--\+\s.*$/gm,        // Comments like <--+>
};

const blockCommentPatterns = {
    javascript: /\/\*\+\s[\s\S]*?\*\/|<!--\+\s[\s\S]*?-->/g,
    html: /<!--\+\s[\s\S]*?-->/g,  
};

module.exports = {
    singleLineCommentPatterns,
    blockCommentPatterns
};
