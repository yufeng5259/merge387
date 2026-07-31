export interface TownUpgradeTransactionPayload {
    mapID?: number;
    buildID?: number;
}

export interface TownUpgradeTransactionSnapshot extends TownUpgradeTransactionPayload {
    flowId: number;
    p5Eligible: boolean;
}

interface ActiveTownUpgradeTransaction extends TownUpgradeTransactionSnapshot {
    phase: string;
    interactive: boolean;
}

export default class TownUpgradeTransactionState {
    private nextFlowId = 0;
    private active: ActiveTownUpgradeTransaction | null = null;
    private finished: TownUpgradeTransactionSnapshot | null = null;

    start (payload: TownUpgradeTransactionPayload = {}) {
        const flowId = ++this.nextFlowId;
        this.active = { flowId, mapID: payload.mapID, buildID: payload.buildID, phase: 'requesting', interactive: false, p5Eligible: false };
        this.finished = null;
        return flowId;
    }

    isActive (flowId: number) { return this.active?.flowId === flowId; }
    getPhase (flowId: number) { return this.isActive(flowId) ? this.active!.phase : null; }

    advance (flowId: number, expectedPhase: string, nextPhase: string) {
        if (!this.isActive(flowId) || this.active!.phase !== expectedPhase) return false;
        this.active!.phase = nextPhase;
        return true;
    }

    setInteractive (flowId: number, interactive: boolean) {
        if (!this.isActive(flowId)) return false;
        this.active!.interactive = interactive;
        return true;
    }

    isInteractive (flowId: number) { return !!(this.isActive(flowId) && this.active!.interactive); }

    markP5Eligible (flowId: number) {
        if (!this.isActive(flowId)) return false;
        this.active!.p5Eligible = true;
        return true;
    }

    finish (flowId: number) {
        if (!this.isActive(flowId)) return false;
        const active = this.active!;
        this.finished = { flowId: active.flowId, mapID: active.mapID, buildID: active.buildID, p5Eligible: active.p5Eligible };
        this.active = null;
        return true;
    }

    consumeFinished () {
        const finished = this.finished;
        this.finished = null;
        return finished;
    }
}
