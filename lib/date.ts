class Adate {
  /**
   * 通过日期字符串返回时间戳 或 通过时间戳返回日期字符串
   * @param data 时间戳 或 日期字符串
   * @param format 当第一个参数为时间戳时，此参数才具有意义
   * @returns string | number
   */
  format (data: number|string , format: string = 'y-m-d h:i'): unknown {
    switch (typeof data) {
      case 'number':
        return this.sec2date(data, format);
        break;
      case 'string':
        return this.date2sec(data);
        break;
      default:
        throw new Error('参数不合法')
    }
  }

  /**
   * 通过日期返回时间戳
   * @param date 日期
   * @returns 返回时间戳
   */
  private date2sec (date: string): number {
    try {
      const d = new Date(Date.parse(date.replace(/-/g, '/')));
      return Math.floor(d.getTime() / 1000);
    } catch {
      throw new Error('不是有效的日期格式');
    }
  }

  // 当数字不满 2 位时，前导用 0 填充
  private zeroFill (n): string { return n < 10 ? '0' + n : n.toString(); }

  /**
   * 秒时间戳转换为年月日时分秒周
   * @param seconds 秒数
   * @param format 格式化样式 如 y-m-d h:i:s，注W返回汉字， w返回数字，0为周日
   * @returns string 返回格式化后的数据，如 2012-02-24 23:59
   */
  private sec2date (seconds: number , format: string = 'y-m-d h:i'): string {
    const d = new Date(Math.floor(seconds * 1000));
    return format.replace(/\w/g, (w): string => {
      const k = w !== 'w' ? w.toLowerCase() : w;
      const temp = {
        y: d.getFullYear(),
        m: this.zeroFill(d.getMonth() + 1),
        d: this.zeroFill(d.getDate()),
        h: this.zeroFill(d.getHours()),
        i: this.zeroFill(d.getMinutes()),
        s: this.zeroFill(d.getSeconds()),
        w: d.getDay(),
        W: ['天', '一', '二', '三', '四', '五', '六'][d.getDay()]
      };
      return temp[k] || '';
    })
  }
}

export default new Adate()
