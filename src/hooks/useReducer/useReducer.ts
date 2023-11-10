import { useState } from 'react'

export const useReducer = (reducer: any, initialState: any) => {
	const [state, setState] = useState(initialState)

	const dispatch = (action: any) => {
		const nextState = reducer(state, action)
		setState(nextState)
	}

	return [state, dispatch]
}
