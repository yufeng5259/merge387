import { v2 } from 'cc';

var FuncTools: any = {}

// transform angle in range (-180, 180]
FuncTools.GetNormalAngles = function(ang) {
    if (typeof ang === "object") return v2(FuncTools.GetNormalAngles(ang.x), FuncTools.GetNormalAngles(ang.y));

    if (typeof ang !== "number") {return 0;}

    if (ang > -180 && ang <= 180) {
        return ang;
    }
    if (ang < -180)
        ang += 360;
    if (ang > 180)
        ang -= 360;

    return FuncTools.GetNormalAngles(ang);
}

//up = 0, (-180, 180]
FuncTools.Vector2ToAngle = function(dx, dy) {
    if (typeof dx === "object") return FuncTools.Vector2ToAngle(dx.x, dx.y);
    
    if (typeof dx !== "number" || typeof dy !== "number") {return 0;}

    if (dx === 0 && dy < 0)
        return 180.0;
    if (dx === 0 && dy > 0)
        return 0;

    return -FuncTools.GetNormalAngles(Math.atan2(dy, dx) * 180.0 / Math.PI - 90.0);
}   

//权重随机
FuncTools.getIndexByWeight = function (weights) {
    let allweight = 0;
    weights.forEach(x => {allweight += x;})

    let _w = 0;
    let re = G.getRandomFloat(0, allweight);
    let _i = 0;

    weights.some(w => {
        if (re < w + _w) {
            return true;
        }
        _w += w;
        _i++;
    })

    return _i;
}
FuncTools.getIdByWeight = function (idws) {
    let ids = []
    let weights = []
    for (let id in idws) {
        ids.push(id)
        weights.push(idws[id])
    }

    let index = FuncTools.getIndexByWeight(weights)

    return ids[index];
}

FuncTools.getRandomCount = function(ids, count) {
    if (ids == null) return []
    if (ids.length < count) return ids

    var data = []
    while (data.length < count) {
        let d = ids[G.getRandomInt(0, ids.length)]
        ids.remove(d)
        data.push(d)
    }

    return data
}

FuncTools.getSeedRandomCount = function(ids, count, seed) {
    if (ids == null) return []
    if (ids.length < count) return ids

    if (seed != null) G.setSeed(seed)
    var data = []
    while (data.length < count) {
        let d = ids[G.getSeededRandomInt(0, ids.length)]
        ids.remove(d)
        data.push(d)
    }

    return data
}

export default FuncTools
