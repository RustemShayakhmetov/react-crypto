import {useRef, useState} from 'react'
import {
	Button,
	DatePicker,
	Divider,
	Form,
	InputNumber,
	Result,
	Select,
	Space
} from 'antd'
import {useCrypto} from '../context/crypto-context.jsx'
import CoinInfo from './CoinInfo.jsx'

const validateMessages = {
	required: "${label} is required!",
	types:  {
		number: "${label} is valid number!",
	},
	number: {
		range: '${label} must be between ${min} and ${max}',
	}
};

export default function AddAssetsForm({ onClose }) {
	const {crypto, addAsset} = useCrypto()
	const [form] = Form.useForm()
	const [coin, setCoin] = useState(null)
	const [submitted, setSubmitted] = useState(false)
	const assetRef = useRef(null)
	
	if (submitted)  {
		return (
			<Result
				status="success"
				title="New Asset Added"
				subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
				extra={[
					<Button type="primary" key="console" onClick={onClose}>
						Close
					</Button>
				]}
			/>
		)
	}
	if (!coin) {
		return (
			<Select
				style={{width:'100%'}}
				placeholder="Select coin"
				onSelect={(value) => setCoin(crypto.find(coin => coin.id === value))}
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
			/>
		)
	}
	
	const onFinish = (values) => {
		const newAsset = {
			id: coin.id,
			amount: values.amount,
			price: values.price,
			date: values.date?.$d ?? new Date(),
		}
		assetRef.current = newAsset
		setSubmitted(true)
		addAsset(newAsset)
	}
	const handleAmountChange = (value) => {
		const price = form.getFieldValue('price')
		form.setFieldsValue({
			total: +(value * price).toFixed(2)
		})
	}
	
	const handlePriceChange = (value) => {
		const amount = form.getFieldValue('amount')
		form.setFieldsValue({
			total: +(amount * value).toFixed(2)
		})
	}
	
	return (
		<Form form={form}
			name="basic"
			labelCol={{
				span: 4,
			}}
			wrapperCol={{
				span: 10,
			}}
			style={{
				maxWidth: 600,
			}}
			validateMessages={validateMessages}
			initialValues={{
				price: +coin.price.toFixed(2)
			}}
			onFinish={onFinish}
		>
			<CoinInfo coin={coin} widhSymbol={false}/>
			<Divider/>
			
				<Form.Item
					label='Amount'
					name='amount'
					rules={[
						{
							required: true,
							type: 'number',
							min: 0
						},
					]}
				>
					<InputNumber
						onChange={handleAmountChange}
						placeholder='Enter coin amount' style={{width: '100%'}} />
				</Form.Item>
				
				<Form.Item label="Price" name="price">
					<InputNumber
						onChange={handlePriceChange}
            style={{width: '100%'}}
						value={coin.price}
					/>
				</Form.Item>
			
			<Form.Item label="Date & Time" name="Date & Time">
				<DatePicker showTime style={{width: '100%'}}/>
			</Form.Item>
			
			<Form.Item label="Total" name="total">
				<InputNumber disabled style={{width: '100%'}}/>
			</Form.Item>
			
			<Form.Item label={null}>
				<Button type="primary" htmlType="submit">
					Add Asset
				</Button>
			</Form.Item>
		</Form>
	);
}