import { useLayoutEffect, useRef } from 'react'

export function useLatest<Value>(value: Value) {
	const valueRef = useRef(value)

  //concurrent
  useLayoutEffect(() => {
    valueRef.current = value
  })

  
  // valueRef.current = value

	return valueRef
}
