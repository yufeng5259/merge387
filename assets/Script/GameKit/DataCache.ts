// 数据缓存

export default class DataCache {
    private static _data: Record<string, any> = {};

    static SetData(key: string, value: any) {
        DataCache._data[key] = value;
    }

    static GetData(key: string) {
        if (DataCache.HasData(key)) {
            return DataCache._data[key];
        }
        return null;
    }

    static HasData(key: string) {
        return Object.prototype.hasOwnProperty.call(DataCache._data, key);
    }

    static RemoveData(key: string) {
        if (DataCache.HasData(key)) {
            DataCache._data[key] = null;
            delete DataCache._data[key];
        }
    }

    static Clear() {
        DataCache._data = {};
    }
}
