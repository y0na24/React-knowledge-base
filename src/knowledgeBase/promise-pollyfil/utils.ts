export const isPromiseLike = (
	value: unknown
): value is PromiseLike<unknown> => {
	return Boolean(
		value &&
			typeof value === 'object' &&
			'then' in value &&
			typeof value.then === 'function'
	)
}

function createAsap() {
	if (typeof MutationObserver === 'function') {
		return function asap(callback: () => void) {
			const observer = new MutationObserver(function () {
				callback()
				observer.disconnect()
			})
			const target = document.createElement('div')
			observer.observe(target, { attributes: true })
			target.setAttribute('data-foo', '')
		}
	} else {
		return function asap(callback: () => void) {
			setTimeout(callback, 0)
		}
	}
}

export const asap = createAsap()
