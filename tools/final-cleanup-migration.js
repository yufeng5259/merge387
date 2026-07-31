const fs = require('fs');

function replace(file, before, after) {
  let text = fs.readFileSync(file).toString('latin1');
  if (!text.includes(before)) throw new Error(`Missing cleanup anchor in ${file}`);
  text = text.replace(before, after);
  fs.writeFileSync(file, Buffer.from(text, 'latin1'));
}

replace('assets/Script/window/GameMainWindow.ts',
  'chain.add("NewPlayerPackWindow", () => this.canShowNewPlayerPack())',
  'chain.add("NewPlayerPackWindow", () => this.canAutoOpenNewPlayerPack())');
replace('assets/Script/window/UserInfoModel.ts',
  '        this.setVip();\n    }',
  '        this.setVip();\n        this.refreshLevelUpResourceDisplay();\n    }');

let request = fs.readFileSync('assets/Script/Web/NetRequest.ts', 'utf8');
request = request.replace(/body:JSON\.stringify\(this\.data\),?\s*/g, 'method:this.data.method, ');
fs.writeFileSync('assets/Script/Web/NetRequest.ts', request, 'utf8');
