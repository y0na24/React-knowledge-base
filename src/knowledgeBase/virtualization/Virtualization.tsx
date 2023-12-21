import { FixedSizeList as List } from 'react-window'
import { Row } from './Row'
import AutoSizer from 'react-virtualized-auto-sizer'

export const Virtualization = () => (
	<AutoSizer>
		{({ height, width }) => (
			<List
				className='List'
				height={height}
				itemCount={1000}
				itemSize={35}
				width={width}
			>
				{Row}
			</List>
		)}
	</AutoSizer>
)
