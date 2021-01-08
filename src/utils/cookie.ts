enum Type {
  localStorage = 'localStorage',
  sessionStorage = 'sessionStorage',
  cookie = 'cookie'
}
interface Option {
  expireDays?: number,
  type?: Type
}
/**
 * store data
 */
class Cookie {
  private type:Type
  constructor (type: Type = Type.localStorage) {
    this.type = type
  }
  public set( key: string, value: any, expireDays = 7 ): boolean {
    const type = this.type
    return type === 'cookie' ? this.setCookie(key, value, expireDays) : this.setStorage(key, value, expireDays, type)
  }

  public get(key: string): string {
    return this.type === 'cookie' ? this.getCookie(key) : this.getStorage(key, this.type)
  }

  public remove(key: string): boolean {
    return this.type === 'cookie' ? this.removeCookie(key) : this.removeStorage(key, this.type)
  }

  private setStorage(key: string, value: any, expireDays: number = 7, type: Type = Type.localStorage): boolean {
    let bool = window && window[type] ? true : false
    if (bool) {
      try {
        const t = expireDays > 0 ? (new Date().getTime()) * 1 + (expireDays * 86400000) : 0
        const val = JSON.stringify({ v: value, t})
        window[type].setItem(key, val)
        bool = this.getStorage(key) === value
      } catch {
        bool = false
        console.error('数据格式化失败')
      }
    }
    return bool
  }

  private getStorage(key: string, type: Type = Type.localStorage): string {
    let res = ''
    if (window && window[type]) {
      try {
        const v = window[type].getItem(key) || `{"v":"","t":0}`
        const obj = JSON.parse(v)
        const now = new Date().getTime()
        res = obj.v
        if (type === 'localStorage' && obj.t > 0 && now > obj.t) {
          res = ''
          this.removeStorage(key)
        }
      } catch {
        console.error('数据格式错误')
      }
    }
    return res
  }

  private removeStorage(key: string, type: Type = Type.localStorage): boolean {
    let bool = window && window[type] ? true : false
    if (bool) {
      window[type].removeItem(key)
      bool = this.getStorage(key) === ''
    }
    return bool
  }

  private setCookie(key: string, value: any, expireDays: number = 7): boolean {
    let bool = window && window.navigator.cookieEnabled
    // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
    if (bool) {
      const exdate = new Date()
      exdate.setDate(exdate.getDate() + expireDays)
      const expires = expireDays ? `;expires=${exdate.toUTCString()}` : ''
      document.cookie = `${key}=${escape(value)}${expires}`
      bool = this.getCookie(key) === value
    }
    return bool
  }

  private getCookie(key: string): string {
    let bool = window && window.navigator.cookieEnabled
    // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
    let res = ''
    if (bool) {
      if (document.cookie.length > 0) {
        let start = document.cookie.indexOf(key + '=')
        if (start >= 0) {
          start = start + key.length + 1
          let end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          res = unescape(document.cookie.substring(start, end))
        }
      }
    }
    return res
  }

  private removeCookie(key: string): boolean {
    let bool = window && window.navigator.cookieEnabled
    // if (!bool) { throw new Error('当前环境不支持 cookie 或 cookie 未启用') }
    if (bool) {
      bool = this.getCookie(key) ? true : false
      if (bool) { this.setCookie(key, '', -1) }
    }
    return bool
  }
}
export default Cookie
