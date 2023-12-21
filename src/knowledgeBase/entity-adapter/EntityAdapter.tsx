import { configureStore } from '@reduxjs/toolkit'
import { type FC } from 'react'
import { actions, reducer } from './userSlice'
import { Provider, useDispatch } from 'react-redux'

const store = configureStore({
	reducer: reducer,
})

export const EntityAdapter: FC = () => {
	return (
		<Provider store={store}>
			<UserAdder />
		</Provider>
	)
}

const UserAdder = () => {
	const dispatch = useDispatch()

	const handleFirstClick = () => {
		dispatch(
			actions.addUser({
				userId: '17031762114078',
				name: 'Matvey',
				hobby: 'coding',
			})
		)
	}

	const handleSecondClick = () => {
		dispatch(
			actions.upsertUser({
				userId: '17031762114078',
				hobby: 'coding2',
				name: 'asdfsadf',
			})
		)
	}

	return (
		<>
			<button onClick={handleFirstClick}>First</button>
			<button onClick={handleSecondClick}>Second</button>
		</>
	)
}
