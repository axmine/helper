// import { version } from '../package.json';
export function getType (data: any): string {
	return Object.prototype.toString.call(data).slice(8, -1).toLocaleLowerCase()
}
