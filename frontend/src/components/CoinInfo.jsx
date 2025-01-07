import {Flex, Typography} from 'antd'

export default function CoinInfo({coin, widhSymbol}) {
	
	
	return (
		<Flex align="center">
			<img
				src={coin.icon}
				alt={coin.name}
				style={{ width: 40, marginRight: 10 }}
			/>
			<Typography.Title level={2} style={{ margin: 0 }}>
				{coin.name} {widhSymbol && <span>({coin.symbol})</span>}
			</Typography.Title>
		</Flex>
	)
}