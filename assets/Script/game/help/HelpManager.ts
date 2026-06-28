import '../../LegacyGlobals';
var HelpManager = {_data:{}}

HelpManager.init = function(data) {
    this._data = {}
    try {
        for(let id in data) {
            let kvp = data[id]
            this._data[kvp.key] = kvp.value
        }
    } catch (e) {
        Logs.Error("HelpManager.init", e.message)
    }
}

HelpManager.GetHelp = function(key) {
    return GameKit.i18n.t("Help_" + key)
}

global.Game.HelpManager = HelpManager