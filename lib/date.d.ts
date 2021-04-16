declare class Adate {
    /**
     * 通过日期字符串返回时间戳 或 通过时间戳返回日期字符串
     * @param data 时间戳 或 日期字符串
     * @param format 当第一个参数为时间戳时，此参数才具有意义
     * @returns string | number
     */
    format(data: number | string, format?: string): unknown;
    /**
     * 通过日期返回时间戳
     * @param date 日期
     * @returns 返回时间戳
     */
    private date2sec;
    private zeroFill;
    /**
     * 秒时间戳转换为年月日时分秒周
     * @param seconds 秒数
     * @param format 格式化样式 如 y-m-d h:i:s，注W返回汉字， w返回数字，0为周日
     * @returns string 返回格式化后的数据，如 2012-02-24 23:59
     */
    private sec2date;
}
declare const _default: Adate;
export default _default;
