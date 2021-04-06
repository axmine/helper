class Cookie {
  private cookieEnabled: boolean;

  constructor() {
    this.cookieEnabled = window && window.navigator.cookieEnabled
  }

  /**
   * 向cookie存入数据
   * @param key 存储的键名
   * @param value 存储的值
   * @param expireDays 有效期(单位天,默认为7天）
   * @returns boolean，存入成功返回true, 否则false
   */
  set (key: string, value: any, expireDays = 7): boolean {
    let b = this.cookieEnabled;
    if (this.cookieEnabled) {
      const exdate = new Date();
      exdate.setDate(exdate.getDate() + expireDays);
      const expires = expireDays ? `;expires=${exdate.toUTCString()}` : '';
      document.cookie = `${key}=${escape(value)}${expires}`;
      b = this.get(key) === value
    }
    return b;
  }

  /**
   * 从cookie取出数据
   * @param key 存储时的键名
   * @returns string，无相关存储时返回空字串
   */
  get (key: string): string {
    let res = '';
    if (this.cookieEnabled && document.cookie.length > 0) {
      let s = document.cookie.indexOf(key + '=');
      if (s >= 0) {
        s = s + key.length + 1;
        let e = document.cookie.indexOf(';', s);
        if (e === -1) { e = document.cookie.length }
        res = unescape(document.cookie.substring(s, e))
      }
    }
    return res
  }

  /**
   * 删除存储在cookie中的数据
   * @param key 存储时的键名
   * @returns boolean, 成功true, 失败false
   */
  remove (key: string): boolean {
    let b = this.cookieEnabled;
    if (this.cookieEnabled && key) {
      b = this.set(key, '', -100);
    }
    return b;
  }
}
export const cookie = new Cookie()