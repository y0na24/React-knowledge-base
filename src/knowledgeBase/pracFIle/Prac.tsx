import { memo, useReducer } from 'react'

export const Prac = () => {
	const [, forceUpdate] = useReducer(x => x + 1, 0)

	return (
		<>
			<Child logFn={() => {}} />
			<button onClick={forceUpdate}>Click</button>
		</>
	)
}

const Child = memo(({ logFn }: { logFn: () => void }) => {
	logFn()

	return <h1>Child</h1>
})
