declare class Cookie {
    private cookieEnabled;
    constructor();
    /**
     * 向cookie存入数据
     * @param key 存储的键名
     * @param value 存储的值
     * @param expireDays 有效期(单位天,默认为7天）
     * @returns boolean，存入成功返回true, 否则false
     */
    set(key: string, value: any, expireDays?: number): boolean;
    /**
     * 从cookie取出数据
     * @param key 存储时的键名
     * @returns string，无相关存储时返回空字串
     */
    get(key: string): string;
    /**
     * 删除存储在cookie中的数据
     * @param key 存储时的键名
     * @returns boolean, 成功true, 失败false
     */
    remove(key: string): boolean;
}
export declare const cookie: Cookie;
export {};
