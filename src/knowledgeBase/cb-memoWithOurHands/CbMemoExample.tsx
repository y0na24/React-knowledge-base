import { useReducer, useRef, useState, memo } from 'react'

const SubComponent = memo(({ onClick }: { onClick: any }) => {
	console.log('====update sub component======')
	return <div onClick={onClick}>test</div>
})

function areDepsEqual(prevDeps: any, currentDeps: any) {
	if (prevDeps.length !== currentDeps.length) return false

	for (let i = 0; i < prevDeps.length; i++) {
		if (!Object.is(prevDeps[i], currentDeps[i])) {
			return false
		}
	}

	return true
}

function useMemo(getResult: any, deps: any) {
	const prevResult = useRef(null)
	const prevDeps = useRef(null)

	if (prevDeps.current && areDepsEqual(prevDeps.current, deps)) {
		return prevResult.current
	}

	const result = getResult()

	prevDeps.current = deps
	prevResult.current = result

	return result
}

function useCallback(cb: any, deps: any) {
	return useMemo(() => cb, [...deps])
}

export const CbMemoExample = () => {
	const [count, setCount] = useState(1)
	const [, forceUpdate] = useReducer(v => v + 1, 0)

	const doubleCount = useMemo(() => {
		return count * 2
	}, [count])

	console.log('======')

	const onClick = useCallback(() => {
		console.log(doubleCount)
	}, [doubleCount])

	return (
		<div>
			<div>{count}</div>
			<button onClick={forceUpdate}>Update</button>
			<button onClick={() => setCount(c => c + 1)}>Inc</button>

			<SubComponent onClick={onClick} />
		</div>
	)
}
