import '../../../LegacyGlobals';

class SignMeta {
    static Types: any
    static GetCurrentMapId: any
    static GetByTypeDay: any
    static GetById: any

    _data: any
    reward: any

    constructor() { }

    static MakeEntity(data) {
        const meta = new SignMeta()
        meta.UpdateData(data)
        return meta
    }

    UpdateData(data) {
        this._data = {}
        for (const key in data) {
            this._data[key] = data[key]
        }
    }

    Data() {
        return this._data
    }

    Id() {
        return this._data.id
    }

    Type() {
        return this._data.type
    }

    Day() {
        return this._data.day
    }

    MapMin() {
        return this._data.mapMin
    }

    MapMax() {
        return this._data.mapMax
    }

    Reward(curmapLv?) {
        if (!this.reward) {
            this.reward = Game.Content.FromStrings(this._data.reward)
            this.reward = Game.Content.Merge(this.reward)
        }
        return this.reward
    }
}

SignMeta.Types = {
    Week: 1,
    Month: 2,
}

SignMeta.GetCurrentMapId = () => {
    try {
        if (typeof Game !== 'undefined' && Game.SUserVillage && Game.SUserVillage.MapId) {
            const mapId = Number(Game.SUserVillage.MapId())
            if (Number.isFinite(mapId) && mapId > 0) return mapId
        }
    } catch (e) {}
    return 0
}

SignMeta.GetByTypeDay = (type, day, mapId?) => {
    let currentMapId = Number(mapId)
    if (!Number.isFinite(currentMapId) || currentMapId <= 0) currentMapId = SignMeta.GetCurrentMapId()

    let firstMatch = null
    let firstRangedMatch = null
    let lastBelowRange = null
    const obj = Meta.MetaManager.GetMetas(Meta.MetaType.Sign)
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const element = obj[key]
            if (element.Type() == type && element.Day() == day) {
                if (!firstMatch) firstMatch = element

                let min = Number(element.MapMin ? element.MapMin() : element.Data().mapMin)
                let max = Number(element.MapMax ? element.MapMax() : element.Data().mapMax)
                const hasRange = Number.isFinite(min) || Number.isFinite(max)
                if (!hasRange) continue

                if (!Number.isFinite(min)) min = 1
                if (!Number.isFinite(max)) max = Number.MAX_SAFE_INTEGER
                if (!firstRangedMatch) firstRangedMatch = element

                if (currentMapId > 0 && currentMapId >= min && currentMapId <= max) {
                    return element
                }
                if (currentMapId > 0 && currentMapId >= min) {
                    lastBelowRange = element
                }
            }
        }
    }
    return lastBelowRange || firstRangedMatch || firstMatch
}

SignMeta.GetById = id => {
    return Meta.MetaManager.GetMeta(Meta.MetaType.Sign, id)
}

global.Meta.SignMeta = SignMeta
