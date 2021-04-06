export function getType (data: any): string {
  const str = Object.prototype.toString.call(data).slice(8, -1);
  return str.toLocaleLowerCase();
}
