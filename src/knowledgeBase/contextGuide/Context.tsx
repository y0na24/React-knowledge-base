import { createContext, useContext, useState } from 'react'

interface AppContextData {
	value: string
	setValue: (value: string) => void
}

const AppContext = createContext<AppContextData | null>(null)

const AppProvider = AppContext.Provider

interface AppConsumerProps {
	children: (data: AppContextData) => React.ReactElement
}

const AppConsumer = (props: AppConsumerProps) => {
	const data = useAppContext()

	return props.children(data)
}

const useAppContext = () => {
	const data = useContext(AppContext)

	if (!data) {
		throw new Error('Can not `useAppContext` outside of the `AppProvider`')
	}

	return data
}

const Form = () => {
	return <FormInput />
}

const FormInput = () => {
	const { setValue } = useAppContext()

	return <input type='text' onChange={e => setValue(e.target.value)} />
}

const TextDisplay = () => {
	return (
		<>
			<Text />
			<TextConsumer />
		</>
	)
}

const Text = () => {
	const { value } = useAppContext()

	return <p>{value}</p>
}

const TextConsumer = () => {
	return <AppConsumer>{({ value }) => <p>{value}</p>}</AppConsumer>
}

export const Recommended = () => {
	const [value, setValue] = useState('')

	return (
		<AppProvider value={{ value, setValue }}>
			<Form />
			<TextDisplay />
		</AppProvider>
	)
}
