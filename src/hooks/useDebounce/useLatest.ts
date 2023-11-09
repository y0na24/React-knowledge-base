import { useLayoutEffect, useRef } from 'react'

export const useLatest = (value: any) => {
  const latestCb = useRef(value)

  useLayoutEffect(() => {
    latestCb.current = value
  }, [value])

  return latestCb
}
