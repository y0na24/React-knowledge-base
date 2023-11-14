import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

function DynamicContent() {
	return <div style={{ width: 300, height: 300, background: 'lightgrey' }}>{Math.random()}</div>
}

const dangerousHTML = `
  <div>
    <h1>Title of the page</h1>
    <p>Some content on the page</p>
    <div data-element="dynamic-content"></div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, perspiciatis!</p>
    <div data-element="dynamic-content"></div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium qui modi, rem distinctio sunt debitis tempora iusto! Eos perspiciatis hic magni tempore officia, numquam repudiandae quae ad reprehenderit error. Velit blanditiis voluptatum, impedit inventore commodi natus explicabo nemo reprehenderit voluptas quisquam alias, cum tenetur! Cum eveniet neque quidem minima provident?</p>
  </div>
`

export function SetReactComps() {
	const [value, setValue] = useState('')
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const contentElement = contentRef.current

		if (!contentElement) return

		const dynamicContentElements = contentElement.querySelectorAll(
			'[data-element="dynamic-content"]'
		)

		const unmountFns: (() => void)[] = []

		dynamicContentElements.forEach(element => {
			const rootElement = ReactDOM.createRoot(element)
			rootElement.render(<DynamicContent />)
			unmountFns.push(() => {
				rootElement.unmount()
			})
		})

		return () => {
			unmountFns.forEach(fn => fn())
		}
	}, [])

	return (
		<div>
			<input type='text' value={value} onChange={e => setValue(e.target.value)} />

			<div>{value}</div>

			<div ref={contentRef} dangerouslySetInnerHTML={{ __html: dangerousHTML }} />
		</div>
	)
}
