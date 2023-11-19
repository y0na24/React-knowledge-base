import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'


class MiniStore<T> {
	private subscribtions: Set<() => void> = new Set<() => void>()
	private state: T

	constructor(initialState: T) {
		this.state = initialState
	}

	getState = () => {
		return this.state
	}

	update = (partialNewState: Partial<T>) => {
		this.state = { ...this.state, ...partialNewState }

		this.subscribtions.forEach(cb => {
			cb()
		})
	}

	subscribe = (cb: () => void) => {
		this.subscribtions.add(cb)

		return () => {
			this.subscribtions.delete(cb)
		}
	}
}

function createOptimizedContext<T>() {
	const Context = createContext<MiniStore<T> | null>(null)

	const Provider = ({
		initialState,
		children,
	}: {
		initialState: T
		children: ReactNode
	}) => {
		const store = useMemo(() => new MiniStore(initialState), [])

		return <Context.Provider value={store}>{children}</Context.Provider>
	}

	const useStore = () => {
		const store = useContext(Context)

		if (!store) {
			throw new Error('Wrap components in Provider')
		}

		return store
	}

	const useStateSelector = <Result extends any>(
		selector: (state: T) => Result
	) => {
		const store = useStore()
		const [state, setState] = useState(() => selector(store.getState()))
		const stateRef = useRef(state)
		const selectorRef = useRef(selector)

		useLayoutEffect(() => {
			stateRef.current = state
			selectorRef.current = selector
		})

		useEffect(() => {
			return store.subscribe(() => {
				const state = selectorRef.current(store.getState())

				if (stateRef.current === state) return

				setState(state)
			})
		}, [store])

		return state
	}

	const useUpdate = () => {
		const store = useStore()

		return store.update
	}

	return { Provider, useStateSelector, useUpdate }
}

interface AppContextData {
	value: ''
}

export const {
	Provider: AppProvider,
	useStateSelector,
	useUpdate,
} = createOptimizedContext<AppContextData>()
