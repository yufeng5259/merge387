import { _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('LanguageItem')
export class LanguageItem {
    @property
    public language = '';
    @property
    public labelStr = '';
}

export default LanguageItem;
