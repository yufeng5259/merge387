import { _decorator, Component } from 'cc';
import { LanguageItem } from '../i18n/LanguageItem';

const { ccclass, property } = _decorator;

@ccclass('MultiLanguage')
export class MultiLanguage extends Component {
    @property([LanguageItem])
    public supportList: LanguageItem[] = [];
}

export default MultiLanguage;
