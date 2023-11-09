import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { useLatest } from './useLatest'

const useDebounce = (cb: (...args: any) => any, ms: number) => {
	const latestCb = useLatest(cb)
	const debouncedFn = useMemo(
		(...args: any) =>
			debounce(() => {
				latestCb.current()
			}, ms),
		[ms, latestCb]
	)

	useEffect(() => () => debouncedFn.cancel(), [debouncedFn])

	return debouncedFn
}

const makeDebounceEffect = (useDebounceHook: any) => {
	return function (cb: any, deps: any[], ms: number) {
		const isInitialRender = useRef(true)
		const cleanUpFn: React.MutableRefObject<undefined | Function> = useRef()
		const debouncedCb = useDebounceHook(() => {
			cleanUpFn.current = cb()
		}, ms)

		useEffect(() => {
			if (isInitialRender.current) {
				isInitialRender.current = false
				return
			}

			debouncedCb()

			return () => {
				if (typeof cleanUpFn.current === 'function') {
					cleanUpFn.current()
					cleanUpFn.current = undefined
				}
			}
		}, [debouncedCb, ...deps])
	}
}

const useDebouceEffect = makeDebounceEffect(useDebounce)

export const UseDebounceExampleComponent: FC = () => {
	const [query, setQuery] = useState('')

	useDebouceEffect(
		() => {
			console.log(`make request with: ${query}`)

			return () => console.log('clean up')
		},
		[query],
		300
	)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setQuery(value)
	}

	return <input value={query} type='text' onChange={handleChange} />
}
