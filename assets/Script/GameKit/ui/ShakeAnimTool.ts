import { Node, Tween, tween, Vec3 } from 'cc';

export const ShakeAnimTool = {
    Shake(node: Node | null | undefined, shakeCount: number): void {
        if (!node || shakeCount <= 0) return;

        Tween.stopAllByTarget(node);

        const originalPos = new Vec3(node.position);
        const shakeDistance = 10;
        const shakeTime = 0.05;
        let shakeTween = tween(node);

        for (let i = 0; i < shakeCount; i++) {
            shakeTween = shakeTween
                .by(shakeTime, { position: new Vec3(-shakeDistance, 0, 0) })
                .by(shakeTime, { position: new Vec3(shakeDistance * 2, 0, 0) })
                .by(shakeTime, { position: new Vec3(-shakeDistance, 0, 0) });
        }

        shakeTween
            .call(() => {
                node.setPosition(originalPos);
            })
            .start();
    },
};

global.GameKit = global.GameKit || {};
global.GameKit.ShakeAnimTool = ShakeAnimTool;

export default ShakeAnimTool;
