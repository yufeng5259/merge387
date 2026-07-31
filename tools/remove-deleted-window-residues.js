const fs = require('fs');

function patchLatin1(file, replacements) {
  let text = fs.readFileSync(file, 'latin1');
  for (const [pattern, after] of replacements) {
    if (!pattern.test(text)) throw new Error(`Expected residue missing in ${file}`);
    text = text.replace(pattern, after);
  }
  fs.writeFileSync(file, text, 'latin1');
}

patchLatin1('assets/Script/window/GameMainWindow.ts', [
  [/        chain\.add\("SuperShieldOpenWindow", \(\) => \{[\s\S]*?        \}\)\*\//, `        */`],
  [/\r?\n\r?\n        \/\/UIRoot\.instance\.openChildWindow\("InviteAndShareWindow"\)/, ''],
]);

patchLatin1('assets/Script/window/Menu/MenuWindow.ts', [
  [/\r?\n        \/\/ this\.event_back\(null, \(\) => \{ UIRoot\.instance\.openChildWindow\("InviteAndShareWindow"\) \}, C\.IN_ANIMATION_TIME \* 1000\)\r?\n        \/\/ AppKit\.LogEventWrap\.logEvent\("menu_InviteAndShareWindow"\)/, ''],
]);

console.log('Removed deleted-window dynamic path residues.');
