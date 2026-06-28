/**
 * 与 RichText 一起用来触发文本点击事件。
 * Example:
 * 1. 在本脚本中将 key 设置为 h1，并配置点击事件对象、脚本与方法。
 * 2. RichText 中写入: <on click="handle" param="h1">click me!</on>
 * 3. 目标方法会收到点击事件参数。
 */
import { _decorator, Component, EventHandler } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('RichTextHandleItem')
export class RichTextHandleItem {
    @property
    public key = '';

    @property(EventHandler)
    public handler: EventHandler | null = null;
}

@ccclass('RichTextHandler')
export class RichTextHandler extends Component {
    @property([RichTextHandleItem])
    public handlers: RichTextHandleItem[] = [];

    private inited = false;
    private handlerMap: Record<string, EventHandler> = {};

    start() {
        this.init();
    }

    init() {
        if (this.inited) return;

        this.handlerMap = {};
        this.handlers.forEach(config => {
            if (config && config.key && config.handler) {
                this.handlerMap[config.key] = config.handler;
            }
        });

        this.inited = true;
    }

    handle(event: unknown, key: string) {
        this.init();

        const handler = this.handlerMap[key];
        if (handler) {
            EventHandler.emitEvents([handler], event);
        }
    }
}

export default RichTextHandler;
