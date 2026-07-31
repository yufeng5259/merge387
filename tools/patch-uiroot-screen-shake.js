const fs = require('fs');

const file = 'assets/Script/UIRoot.ts';
let text = fs.readFileSync(file, 'latin1');
const importBefore = "import { _decorator, Camera, Canvas, Component, Node, Prefab, Rect, UITransform, instantiate, isValid, js, view } from 'cc';";
const importAfter = "import { _decorator, Camera, Canvas, Component, Node, Prefab, Rect, UITransform, Vec3, instantiate, isValid, js, tween, view } from 'cc';";
const methodBefore = `    ScreenShake() {\n    }`;
const methodAfter = `    ScreenShake() {
        const target = GamePlay.instance?.node as Node | undefined;
        if (!target) return;
        const origin = target.position.clone();
        const duration = 0.03;
        const distance = 6;
        const offsets = [
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
            [distance, -distance], [-distance, -distance], [-distance, distance], [distance, distance],
        ];
        let sequence = tween(target);
        offsets.forEach(([x, y]) => {
            sequence = sequence.by(duration, { position: new Vec3(x, y, 0) });
        });
        sequence.call(() => target.setPosition(origin)).start();
    }`;

if (!text.includes(importBefore) || !text.includes(methodBefore)) throw new Error('UIRoot patch anchors missing');
text = text.replace(importBefore, importAfter).replace(methodBefore, methodAfter);
fs.writeFileSync(file, text, 'latin1');
console.log('Patched UIRoot.ScreenShake.');
