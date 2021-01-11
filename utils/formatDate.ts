// format date
export function formatDate (sec: number, format:string = 'y-m-d h:i'): string {
	const d = new Date(sec * 1000)
	function expando (n:number): string { return n < 10 ? '0' + n : n.toString() }
	return format.replace(/\w/g, function (word) {
		const w = word.toLowerCase()
		return {
			y: d.getFullYear(),
			m: expando(d.getMonth() + 1),
			d: expando(d.getDate()),
			h: expando(d.getHours()),
			i: expando(d.getMinutes()),
			s: expando(d.getSeconds()),
			w: ['天', '一', '二', '三', '四', '五', '六'][d.getDay()]
		}[w] || ''
	})
}
