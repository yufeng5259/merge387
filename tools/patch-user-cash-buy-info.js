const fs = require('fs');
const path = require('path');

const userPath = path.resolve(__dirname, '../assets/Script/game/user/User.ts');
const source = fs.readFileSync(userPath, 'latin1');

if (source.includes('    GetCashBuyInfo()')) {
  console.log('GetCashBuyInfo already present');
  process.exit(0);
}

const marker = /    IsGuest\(\) \{\r?\n        return this\.data\.source\.indexOf\("guest"\) !== -1\r?\n    \}\r?\n/;
const match = source.match(marker);
if (!match) {
  throw new Error('IsGuest marker not found; refusing an unbounded rewrite');
}

const newline = match[0].includes('\r\n') ? '\r\n' : '\n';
const replacement = `${match[0]}${newline}    GetCashBuyInfo() {${newline}        return this.data.cashBuyInfo${newline}    }${newline}`;
fs.writeFileSync(userPath, source.replace(marker, replacement), 'latin1');
console.log('Added User.GetCashBuyInfo');
