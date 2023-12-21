import { useState, type FC, useEffect } from 'react'

const fetchList = () =>
	new Promise(resolve => {
		setTimeout(() => {
			resolve(new Array(5).fill(0).map(({ _, index }) => index))
		}, 1000)
	})

export const Cypress: FC = () => {
	const [state, setState] = useState<number[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const list = (await fetchList()) as number[]
				setState(list)
			} catch (err) {
				console.log(err)
			}
		}

		fetchData()
	}, [])

	return (
		<>
			<h1 data-testid='title'>Cypress</h1>
			{state.length > 0 ? (
				<ul>
					{state.map((item, i) => (
						<li data-testid={`todo-${i}`} key={i}>
							Element {i}
						</li>
					))}
				</ul>
			) : (
				<h1>Loading...</h1>
			)}
		</>
	)
}
