export const Row = ({ index, style }) => (
	<div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
		Row {index}
	</div>
)
