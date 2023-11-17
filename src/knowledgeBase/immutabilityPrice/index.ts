function immutableCopyArr<T>(array: T[]) {
	const newArr: T[] = []

	for (let i = 0; i < array.length; i++) {
		newArr[i] = array[i]
	}

	return newArr
}

function immutabelCopyObj<T>(object: Record<string, T>) {
	const newRecord: Record<string, T> = {}

	for (const key in object) {
		newRecord[key] = object[key]
	}

	return newRecord
}

//IRL examples

const filterNumbersNotOptimal = (arr: number[]) => {
	return arr
		.filter(num => num % 2 === 0)
		.map(num => num * 2)
		.filter(num => num >= 1000)
}

const filterNumbersOptimal = (arr: number[]) => {
	const filtereredArr: number[] = []

	arr.forEach(num => {
		if (num % 2 !== 0) return

		const mulipliedNum = num * 2

		if (mulipliedNum >= 1000) {
			filtereredArr.push(mulipliedNum)
		}
	})

	return filtereredArr
}

function updateObjectValueNotOptimal(object: Record<string, number>) {
	return Object.fromEntries(
		Object.entries(object).map(([key, value]) => [key, value * 2])
	)
}

function updateObjectValueOptimal(object: Record<string, number>) {
	const newObj: Record<string, number> = {}

	for (const key in object) {
		newObj[key] = object[key] * 2
	}

	return newObj
}

function twoSum(array: number[], sum: number) {
	const map = new Set()

	for (let i = 0, l = array.length; i < l; i++) {
		if (map.has(sum - array[i])) {
			return true
		}

		map.add(array[i])
	}
}
