import { _decorator, Component, Constructor, Node } from 'cc';

const { ccclass, property, menu } = _decorator;

type ComponentCtor<T extends Component = Component> = Constructor<T> | string;

@ccclass('Item')
export class Item {
    @property
    public key = '';

    @property(Node)
    public node: Node | null = null;
}

@ccclass('ControllerTable')
@menu('GameKit/Editor/ControllerTable')
export class ControllerTable extends Component {
    @property([Node])
    public controllers: Node[] = [];

    @property([Item])
    public keyControllers: Item[] = [];

    public static Item = Item;

    private nodes: Record<string, Node> = {};
    private inited = false;

    public static GetNode(root: Node, name: string): Node | null {
        const table = root.getComponent(ControllerTable);
        return table ? table.getNode(name) : null;
    }

    public static GetComponent<T extends Component>(root: Node, name: string, comp: ComponentCtor<T>): T | null {
        const node = ControllerTable.GetNode(root, name);
        if (!node) {
            return null;
        }

        return typeof comp === 'string'
            ? node.getComponent(comp) as T | null
            : node.getComponent(comp);
    }

    public init(): void {
        if (this.inited) {
            return;
        }

        this.nodes = {};
        this.controllers.forEach((controller) => {
            if (controller) {
                this.nodes[controller.name] = controller;
            }
        });
        this.keyControllers.forEach((controller) => {
            if (controller && controller.key && controller.node) {
                this.nodes[controller.key] = controller.node;
            }
        });

        this.inited = true;
    }

    public getNode(name: string): Node | null {
        this.init();
        return this.nodes[name] || null;
    }
}

if (typeof GameKit !== 'undefined') {
    GameKit.ControllerTable = ControllerTable;
}

export default ControllerTable;
