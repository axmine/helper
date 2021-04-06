import { getType } from './getType';
export class Storage {
  private type: 'localStorage' | 'sessionStorage';
  private enableStorage: boolean;
  constructor (type: 'localStorage' | 'sessionStorage' = 'localStorage') {
    this.type = type;
    this.enableStorage = window && window[type] ? true : false;
  }

  set (key: string, value: any, expireDays: number = 7): boolean {
    let bool = this.enableStorage;
    if (getType(expireDays) !== 'number') { throw new Error('过期天数必须为数字') }
    if (bool) {
      try {
        const t = expireDays > 0 ? (new Date().getTime()) * 1 + (expireDays * 86400000) : 0;
        const v = JSON.stringify({ v: value, t });
        window[this.type].setItem(key, v);
      } catch {
        bool = false;
        console.error('数据json化失败，请检查待存储数据');
      }
    }
    return bool;
  }

  get (key: string): string {
    let res = '';
    if (this.enableStorage) {
      try {
        const v = window[this.type].getItem(key) || `{"v":"","t":0}`;
        const json = JSON.parse(v);
        const now = new Date().getTime();
        res = json.v
        // 如果当前存在引擎为localStorage，并且当时时间大于过期时间，则移除数据
        if (this.type === 'localStorage' && now > json.t) {
          res = ''
          this.remove(key);
        }
      } catch {
        console.error('数据错误')
      }
    }
    return res;
  }

  remove (key: string): boolean {
    let bool = this.enableStorage;
    if (bool) {
      window[this.type].removeItem(key);
      bool = this.get(key) === '';
    }
    return bool;
  }
}
