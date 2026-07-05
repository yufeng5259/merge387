type LegacyRoot = Record<string, any>;

export type LegacyGlobals = {
    Game: LegacyRoot;
    Meta: LegacyRoot;
    SR: LegacyRoot;
    GameKit: LegacyRoot;
    AppKit: LegacyRoot;
    G: LegacyRoot;
    cce: LegacyRoot;
};

function getRoot(): LegacyRoot {
    return globalThis as unknown as LegacyRoot;
}

function attachAlias(root: LegacyRoot, key: string, value: LegacyRoot): void {
    if (root[key] !== value) {
        root[key] = value;
    }
}

function attachDefault(root: LegacyRoot | undefined, key: string, value: any): void {
    if (root && typeof root[key] === 'undefined') {
        root[key] = value;
    }
}

export function ensureLegacyGlobals(): LegacyGlobals {
    const root = getRoot();
    const windowRoot = root.window as LegacyRoot | undefined;
    const globalRoot = root.global as LegacyRoot | undefined;

    const Game = (root.Game || windowRoot?.Game || globalRoot?.Game || {}) as LegacyRoot;
    const Meta = (root.Meta || windowRoot?.Meta || globalRoot?.Meta || {}) as LegacyRoot;
    const SR = (root.SR || windowRoot?.SR || globalRoot?.SR || {}) as LegacyRoot;
    const GameKit = (root.GameKit || windowRoot?.GameKit || globalRoot?.GameKit || {}) as LegacyRoot;
    const AppKit = (root.AppKit || windowRoot?.AppKit || globalRoot?.AppKit || {}) as LegacyRoot;
    const G = (root.G || windowRoot?.G || globalRoot?.G || {}) as LegacyRoot;
    const cce = (root.cce || windowRoot?.cce || globalRoot?.cce || {}) as LegacyRoot;

    attachAlias(root, 'Game', Game);
    attachAlias(root, 'Meta', Meta);
    attachAlias(root, 'SR', SR);
    attachAlias(root, 'GameKit', GameKit);
    attachAlias(root, 'AppKit', AppKit);
    attachAlias(root, 'G', G);
    attachAlias(root, 'cce', cce);

    if (windowRoot) {
        attachAlias(windowRoot, 'Game', Game);
        attachAlias(windowRoot, 'Meta', Meta);
        attachAlias(windowRoot, 'SR', SR);
        attachAlias(windowRoot, 'GameKit', GameKit);
        attachAlias(windowRoot, 'AppKit', AppKit);
        attachAlias(windowRoot, 'G', G);
        attachAlias(windowRoot, 'cce', cce);
    }

    if (globalRoot) {
        attachAlias(globalRoot, 'Game', Game);
        attachAlias(globalRoot, 'Meta', Meta);
        attachAlias(globalRoot, 'SR', SR);
        attachAlias(globalRoot, 'GameKit', GameKit);
        attachAlias(globalRoot, 'AppKit', AppKit);
        attachAlias(globalRoot, 'G', G);
        attachAlias(globalRoot, 'cce', cce);
    }

    if (!globalRoot) {
        attachAlias(root, 'global', root);
    }

    if (windowRoot && !windowRoot.global) {
        attachAlias(windowRoot, 'global', windowRoot);
    }

    attachDefault(root, 'CLOSE_Card', false);
    attachDefault(windowRoot, 'CLOSE_Card', root.CLOSE_Card);
    attachDefault(globalRoot, 'CLOSE_Card', root.CLOSE_Card);
    attachDefault(root, 'DISABLE_CardFeature', true);
    attachDefault(windowRoot, 'DISABLE_CardFeature', root.DISABLE_CardFeature);
    attachDefault(globalRoot, 'DISABLE_CardFeature', root.DISABLE_CardFeature);

    Game.IsCardFeatureClosed = function() {
        return !!root.DISABLE_CardFeature;
    };

    Game.IsCardWindowName = function(windowName: string) {
        if (!windowName) return false;
        return windowName.indexOf('Card') === 0 ||
            windowName.indexOf('Cards') === 0 ||
            windowName === 'JokerCardWindow' ||
            windowName === 'LimitCardDesWindow';
    };

    return { Game, Meta, SR, GameKit, AppKit, G, cce };
}

const legacyGlobals = ensureLegacyGlobals();

export const Game = legacyGlobals.Game;
export const Meta = legacyGlobals.Meta;
export const SR = legacyGlobals.SR;
export const GameKit = legacyGlobals.GameKit;
export const AppKit = legacyGlobals.AppKit;
export const G = legacyGlobals.G;
export const cce = legacyGlobals.cce;

export default legacyGlobals;
