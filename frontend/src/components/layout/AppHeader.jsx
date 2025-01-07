import {Button, Drawer, Layout, Modal, Select, Space} from 'antd'
import {useCrypto} from '../../context/crypto-context.jsx'
import {useEffect, useState} from 'react'
import AddAssetsForm from '../AddAssetsForm.jsx'
import CoinInfoModal from '../CoinInfoModal.jsx'

const headerStyle = {
	width: '100%',
	textAlign: 'center',
	height: 60,
	padding: '1rem',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
};

export default function AppHeader() {
	const {crypto} = useCrypto();
	const [select, setSelect] = useState(false);
	const [modal, setModal] = useState(false);
	const [coin, setCoin] = useState(null);
	const [drawer, setDrawer] = useState(false);
	
	const handleChange = (value) => {
		setCoin(crypto.find((c) => c.id === value))
		setModal(true)
	}
	
	useEffect(() => {
		const keypress = event => {
			if (event.key === '/') {
				setSelect((prev => !prev))
			}
		}
		document.addEventListener('keypress', keypress);
		return () => document.removeEventListener('keypress', keypress);
	}, [])
	
	return (
		<Layout.Header style={headerStyle}>
			<Select
				style={{
					width: '250px'
				}}
				open={select}
				value="press / to open"
				onSelect={handleChange}
				onClick={() => setSelect(prev => !prev)}
				options={crypto.map(coin => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon,
				}))}
				optionRender={(option) => (
					<Space>
		       <img style={{width: 20}} src={option.data.icon} alt={option.data.label}/> {option.data.label}
					</Space>
				)}
				onChange={handleChange}
			/>
			<Button type="primary" onClick={() => setDrawer(true)}>Add asset</Button>
			<Modal
				open={modal}
				onCancel={() => setModal(false)}
				footer={null}
			>
				<CoinInfoModal coin={coin}/>
			</Modal>
			<Drawer
				width={600}
				title="Add Asset"
				onClose={() => setDrawer(false)}
				open={drawer}
				destroyOnClose
			>
				<AddAssetsForm onClose={() => setDrawer(false)} />
			</Drawer>
		</Layout.Header>
	);
}