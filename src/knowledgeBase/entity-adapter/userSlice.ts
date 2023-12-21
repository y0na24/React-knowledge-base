import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

type User = { userId: string; name: string; hobby: string }

const usersAdapter = createEntityAdapter({
	selectId: (user: User) => user.userId,
})

// По умолчанию: { ids: [], entities: {} }
const initialState = usersAdapter.getInitialState({})

const slice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		addUser: usersAdapter.addOne,
		addUsers: usersAdapter.addMany,
		setUser: usersAdapter.setOne,
		upsertUser: usersAdapter.upsertOne,
		// Если нужна дополнительная обработка, то создаем свою функцию
		removeUser: (state, { payload }) => {
			// ...
			// Внутри можно вызвать метод адаптера
			usersAdapter.removeOne(state, payload)
		},
		updateUser: usersAdapter.updateOne,
	},
})

export const { reducer, actions } = slice
